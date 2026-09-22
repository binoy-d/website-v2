/**
 * Serves the site's editable content (profile, projects, experience, skills) from JSON files in
 * a content directory, plus the images they reference from `<dir>/images`.
 *
 * Each `<section>.json` is read, validated and cached. Any `"image": "<file>"` value that names a
 * file in the images directory is rewritten to a URL under `imageUrlBase` with a content-hash
 * query string, so images can be cached for a long time and still update when the file changes.
 *
 * `cacheTtlMs` controls how long a loaded section is reused: Infinity in production (the files
 * ship inside the image, a deploy restarts the process), 0 in development so edits show up on
 * the next request without a restart.
 */
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SECTIONS = ["profile", "projects", "experience", "skills"];

export class ContentError extends Error {
  constructor(message, { status = 500, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "ContentError";
    this.status = status;
  }
}

const invalid = (where, what) => new ContentError(`content: ${where} ${what}`);

function requireString(obj, key, where) {
  if (typeof obj?.[key] !== "string" || !obj[key].trim()) throw invalid(`${where}.${key}`, "must be a non-empty string");
}

function requireArray(obj, key, where, { minLength = 0 } = {}) {
  if (!Array.isArray(obj?.[key])) throw invalid(`${where}.${key}`, "must be an array");
  if (obj[key].length < minLength) throw invalid(`${where}.${key}`, `must have at least ${minLength} item(s)`);
}

function requireStringArray(obj, key, where, options) {
  requireArray(obj, key, where, options);
  obj[key].forEach((v, i) => {
    if (typeof v !== "string") throw invalid(`${where}.${key}[${i}]`, "must be a string");
  });
}

function requireUniqueIds(items, where) {
  const seen = new Set();
  items.forEach((item, i) => {
    requireString(item, "id", `${where}[${i}]`);
    if (seen.has(item.id)) throw invalid(`${where}[${i}].id`, `is duplicated ("${item.id}")`);
    seen.add(item.id);
  });
}

const validators = {
  profile(p, where) {
    requireString(p, "name", where);
    requireString(p, "greeting", where);
    requireString(p, "image", where);
    requireString(p, "email", where);
    requireString(p, "description", where);
    if (!p.info || typeof p.info !== "object" || Array.isArray(p.info)) throw invalid(`${where}.info`, "must be an object");
    requireStringArray(p, "taglines", where, { minLength: 1 });
  },
  projects(p, where) {
    requireArray(p, "items", where);
    requireUniqueIds(p.items, `${where}.items`);
    p.items.forEach((item, i) => {
      const at = `${where}.items[${i}]`;
      requireString(item, "title", at);
      requireStringArray(item, "description", at, { minLength: 1 });
      requireStringArray(item, "languages", at);
      requireString(item, "link", at);
      requireString(item, "image", at);
      requireString(item, "longDescription", at);
    });
  },
  experience(e, where) {
    requireArray(e, "careerHighlights", where);
    e.careerHighlights.forEach((h, i) => {
      requireString(h, "metric", `${where}.careerHighlights[${i}]`);
      requireString(h, "label", `${where}.careerHighlights[${i}]`);
    });
    requireArray(e, "items", where, { minLength: 1 });
    e.items.forEach((item, i) => {
      const at = `${where}.items[${i}]`;
      requireString(item, "period", at);
      requireString(item, "company", at);
      requireString(item, "role", at);
      requireStringArray(item, "details", at);
    });
  },
  skills(s, where) {
    requireArray(s, "groups", where, { minLength: 1 });
    s.groups.forEach((group, i) => {
      requireString(group, "title", `${where}.groups[${i}]`);
      requireStringArray(group, "items", `${where}.groups[${i}]`, { minLength: 1 });
    });
  },
};

const isUrl = (value) => /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(value);

export function createContentService({
  dir,
  imageUrlBase = "/api/content/images",
  cacheTtlMs = Infinity,
  now = Date.now,
  logger = console,
} = {}) {
  if (!dir) throw new Error("createContentService requires the content directory");
  const root = dir instanceof URL ? fileURLToPath(dir) : String(dir);
  const imagesDir = path.join(root, "images");

  let cache = null; // { data, loadedAt }
  let inflight = null;
  const imageHashes = new Map(); // file name -> { size, mtimeMs, hash }

  /** Short content hash per image file; re-hashed only when size/mtime changed. */
  async function imageVersions() {
    let names = [];
    try {
      names = (await readdir(imagesDir)).filter((n) => !n.startsWith("."));
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
    const versions = new Map();
    await Promise.all(
      names.map(async (name) => {
        const file = path.join(imagesDir, name);
        const info = await stat(file);
        if (!info.isFile()) return;
        const known = imageHashes.get(name);
        if (known && known.size === info.size && known.mtimeMs === info.mtimeMs) {
          versions.set(name, known.hash);
          return;
        }
        const hash = createHash("sha1").update(await readFile(file)).digest("hex").slice(0, 10);
        imageHashes.set(name, { size: info.size, mtimeMs: info.mtimeMs, hash });
        versions.set(name, hash);
      })
    );
    return versions;
  }

  /** Deep-copy `value`, turning every `image: "<file>"` into a versioned URL. */
  function resolveImages(value, versions, where) {
    if (Array.isArray(value)) return value.map((v, i) => resolveImages(v, versions, `${where}[${i}]`));
    if (!value || typeof value !== "object") return value;
    const out = {};
    for (const [key, v] of Object.entries(value)) {
      if (key === "image" && typeof v === "string" && !isUrl(v)) {
        const version = versions.get(v);
        if (!version) throw invalid(`${where}.image`, `refers to a missing file "${v}" (expected in ${imagesDir})`);
        out[key] = `${imageUrlBase}/${encodeURIComponent(v)}?v=${version}`;
      } else {
        out[key] = resolveImages(v, versions, `${where}.${key}`);
      }
    }
    return out;
  }

  async function loadSection(section, versions) {
    const file = path.join(root, `${section}.json`);
    let raw;
    try {
      raw = await readFile(file, "utf8");
    } catch (err) {
      throw new ContentError(`content: cannot read ${file}: ${err.message}`, { cause: err });
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new ContentError(`content: ${section}.json is not valid JSON: ${err.message}`, { cause: err });
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw invalid(section, "must be a JSON object");
    validators[section](parsed, section);
    return resolveImages(parsed, versions, section);
  }

  async function load() {
    const versions = await imageVersions();
    const entries = await Promise.all(SECTIONS.map(async (s) => [s, await loadSection(s, versions)]));
    return Object.fromEntries(entries);
  }

  async function all() {
    if (cache && now() - cache.loadedAt < cacheTtlMs) return cache.data;
    if (!inflight) {
      inflight = load()
        .then((data) => {
          cache = { data, loadedAt: now() };
          return data;
        })
        .catch((err) => {
          if (cache) {
            logger.warn("content: reload failed, serving the previous version:", err.message);
            return cache.data;
          }
          throw err;
        })
        .finally(() => {
          inflight = null;
        });
    }
    return inflight;
  }

  return {
    dir: root,
    imagesDir,
    sections: SECTIONS,

    /** Every section: { profile, projects, experience, skills }. */
    all,

    /** One section, or a 404 ContentError for an unknown name. */
    async get(section) {
      if (!SECTIONS.includes(section)) {
        throw new ContentError(`Unknown content section "${section}"`, { status: 404 });
      }
      return (await all())[section];
    },

    invalidate() {
      cache = null;
    },
  };
}
