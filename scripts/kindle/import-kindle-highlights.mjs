#!/usr/bin/env node
/**
 * Import Kindle highlights (scraped from read.amazon.com/notebook, see scrape-kindle-notebook.js)
 * into a self-hosted BookOrbit instance.
 *
 * BookOrbit has no highlight import and every annotation must belong to a book, so for each Kindle
 * book this creates a small EPUB that contains the highlights themselves (title/author/ASIN in the
 * OPF), uploads it to a library, and then creates one annotation per highlight whose CFI points at
 * that highlight's own paragraph. Kindle page/location go into the annotation's chapter label.
 *
 * Usage:
 *   node scripts/kindle/import-kindle-highlights.mjs --input scripts/kindle/data/kindle-highlights.json \
 *        --env-file ~/.bookorbit-import.env [--library <name|id>] [--dry-run] [--only <ASIN>]
 *
 * Env (from --env-file or the environment): BOOKORBIT_URL, and either BOOKORBIT_MAGIC_TOKEN or
 * BOOKORBIT_USERNAME + BOOKORBIT_PASSWORD.
 *
 * Re-runnable: progress is recorded in --state (default next to the input) and existing
 * annotations with identical text are skipped, so a crashed run can simply be restarted.
 * Node 22+ only, no dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// ---------- CLI ----------
const args = process.argv.slice(2);
const opt = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const inputPath = path.resolve(opt("input", "scripts/kindle/data/kindle-highlights.json"));
const statePath = path.resolve(opt("state", path.join(path.dirname(inputPath), "import-state.json")));
const epubDir = path.resolve(opt("epub-dir", path.join(path.dirname(inputPath), "epubs")));
const envFile = opt("env-file");
const libraryArg = opt("library");
const dryRun = flag("dry-run");
const onlyAsin = opt("only"); // import a single book, for testing
const delayMs = Number(opt("delay", "40"));

if (envFile) {
  const file = envFile.replace(/^~(?=$|\/)/, process.env.HOME || "");
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
const BASE = (process.env.BOOKORBIT_URL || "").replace(/\/+$/, "");
if (!BASE) fail("BOOKORBIT_URL is not set");

// ---------- helpers ----------
function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Characters that are not allowed in XML 1.0 (keep tab, newline, carriage return).
const XML_INVALID = new RegExp("[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f]", "g");
const xmlEscape = (s) =>
  String(s ?? "")
    .replace(XML_INVALID, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "book";

function splitAuthors(author) {
  return String(author || "")
    .split(/\s*(?:,|;|\band\b|&)\s*/i)
    .map((a) => a.trim())
    .filter(Boolean);
}

function locationLabel(h) {
  const parts = [];
  if (h.page) parts.push(`Page ${h.page}`);
  if (h.location != null) parts.push(`Location ${h.location}`);
  return parts.length ? `Kindle · ${parts.join(" · ")}` : "Kindle";
}

// ---------- minimal ZIP (store only) + EPUB ----------
const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function dosDateTime(d = new Date()) {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}
function zipStore(entries) {
  const { time, date } = dosDateTime();
  const parts = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // utf-8 names
    local.writeUInt16LE(0, 8); // store
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    parts.push(local, nameBuf, data);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(time, 12);
    cd.writeUInt16LE(date, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += local.length + nameBuf.length + data.length;
  }
  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...parts, cdBuf, eocd]);
}

// Children of <section id="highlights"> before the first highlight block: <h1>, <p class="intro">.
const LEAD_CHILDREN = 2;
/** CFI (epub.js-style range) for highlight i (1-based): its block's first <p> text node. */
export function highlightCfi(i, textLength) {
  const blockIndex = 2 * (LEAD_CHILDREN + i);
  return `epubcfi(/6/2!/4/2[highlights]/${blockIndex}[h${i}]/2,/1:0,/1:${textLength})`;
}

/** Amazon serves covers at any size via the `._SYnnn` modifier; the notebook gives us the 160px one. */
function coverUrl(book, height = 600) {
  if (!book.cover) return null;
  return book.cover.replace(/\._[A-Z0-9_,]+_?\.(jpe?g|png)$/i, `._SY${height}_.$1`);
}

/** Download (and cache) the book's Amazon cover; null when unavailable. */
async function fetchCover(book, cacheDir) {
  const url = coverUrl(book);
  if (!url) return null;
  fs.mkdirSync(cacheDir, { recursive: true });
  const cached = path.join(cacheDir, `${book.asin}.jpg`);
  if (fs.existsSync(cached)) return fs.readFileSync(cached);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok || !/image\/jpe?g/i.test(res.headers.get("content-type") || "")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return null;
    fs.writeFileSync(cached, buf);
    return buf;
  } catch {
    return null;
  }
}

export function buildEpub(book, exportedAt, cover = null) {
  const title = book.title || book.asin;
  const authors = splitAuthors(book.author);
  const highlights = book.highlights;
  const uuid = randomUUID();
  const modified = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" xmlns:opf="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:${uuid}</dc:identifier>
    <dc:identifier opf:scheme="AMAZON">${xmlEscape(book.asin)}</dc:identifier>
    <dc:title>${xmlEscape(title)}</dc:title>
${authors.map((a) => `    <dc:creator>${xmlEscape(a)}</dc:creator>`).join("\n")}
    <dc:language>en</dc:language>
    <dc:source>https://read.amazon.com/notebook?asin=${xmlEscape(book.asin)}</dc:source>
    <dc:description>${xmlEscape(`${highlights.length} Kindle highlights imported from read.amazon.com/notebook (exported ${exportedAt}).`)}</dc:description>
    <meta property="dcterms:modified">${modified}</meta>
${cover ? '    <meta name="cover" content="cover-image"/>\n' : ""}  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="doc" href="content.xhtml" media-type="application/xhtml+xml"/>
${cover ? '    <item id="cover-image" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>\n' : ""}  </manifest>
  <spine>
    <itemref idref="doc"/>
  </spine>
</package>
`;

  const nav = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>Contents</title></head>
<body>
<nav epub:type="toc" id="toc"><h1>Contents</h1><ol><li><a href="content.xhtml#highlights">${xmlEscape(title)}: Kindle highlights</a></li></ol></nav>
</body>
</html>
`;

  const blocks = highlights
    .map(
      (h, idx) =>
        `<section class="hl" id="h${idx + 1}"><p>${xmlEscape(h.text)}</p><p class="meta">${xmlEscape(
          locationLabel(h) + (h.note ? ` · Note: ${h.note}` : "")
        )}</p></section>`
    )
    .join("\n");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
<meta charset="utf-8"/>
<title>${xmlEscape(title)}: Kindle highlights</title>
<style>
body { font-family: Georgia, serif; line-height: 1.5; margin: 1em; }
h1 { font-size: 1.4em; }
.intro { color: #666; font-size: 0.9em; }
.hl { margin: 1.25em 0; padding-left: 0.75em; border-left: 3px solid #f2c94c; }
.hl p { margin: 0 0 0.25em; }
.meta { color: #888; font-size: 0.8em; }
</style>
</head>
<body>
<section id="highlights" epub:type="bodymatter">
<h1>${xmlEscape(title)}</h1>
<p class="intro">${xmlEscape(
    `${highlights.length} Kindle highlights by ${authors.join(", ") || "unknown author"}, imported from read.amazon.com/notebook. This file exists so the highlights have a home in BookOrbit; it is not the book.`
  )}</p>
${blocks}
</section>
</body>
</html>
`;

  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
`;

  return zipStore([
    { name: "mimetype", data: Buffer.from("application/epub+zip") }, // must be first and stored
    { name: "META-INF/container.xml", data: Buffer.from(container) },
    { name: "OEBPS/content.opf", data: Buffer.from(opf) },
    { name: "OEBPS/nav.xhtml", data: Buffer.from(nav) },
    { name: "OEBPS/content.xhtml", data: Buffer.from(content) },
    ...(cover ? [{ name: "OEBPS/cover.jpg", data: cover }] : []),
  ]);
}

// ---------- BookOrbit client ----------
let token = null;
function loginRequest(magic) {
  return magic
    ? fetch(`${BASE}/api/v1/auth/magic-links/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: magic }),
      })
    : fetch(`${BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: process.env.BOOKORBIT_USERNAME, password: process.env.BOOKORBIT_PASSWORD }),
      });
}
async function login() {
  let res;
  try {
    res = await loginRequest(process.env.BOOKORBIT_MAGIC_TOKEN);
  } catch (err) {
    fail(`could not reach BookOrbit at ${BASE}: ${err.cause?.code || err.message}`);
  }
  if (!res.ok) fail(`BookOrbit login failed (${res.status}); check the credentials in ${envFile || "the environment"}`);
  const data = await res.json();
  token = data.accessToken;
  return data.user;
}
async function api(method, p, { json, form, retry = true } = {}) {
  const headers = { authorization: `Bearer ${token}`, accept: "application/json" };
  let body;
  if (json !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) body = form;
  const res = await fetch(`${BASE}${p}`, { method, headers, body });
  if (res.status === 401 && retry) {
    await login();
    return api(method, p, { json, form, retry: false });
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 300) };
  }
  return { ok: res.ok, status: res.status, data };
}

// ---------- main ----------
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
let books = input.books.filter((b) => b.highlights?.length);
if (onlyAsin) books = books.filter((b) => b.asin === onlyAsin);
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : { books: {}, annotations: {} };
const saveState = () => fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
fs.mkdirSync(epubDir, { recursive: true });

const totalHighlights = books.reduce((n, b) => n + b.highlights.length, 0);
console.log(`${dryRun ? "[dry-run] " : ""}${books.length} books, ${totalHighlights} highlights from ${path.relative(process.cwd(), inputPath)}`);

// Always build the EPUBs locally (useful to inspect in dry runs), with the Amazon cover embedded.
const coverDir = path.join(path.dirname(inputPath), "covers");
let withCover = 0;
for (const book of books) {
  const cover = await fetchCover(book, coverDir);
  if (cover) withCover++;
  const file = path.join(epubDir, `kindle-${book.asin}-${slug(book.title)}.epub`);
  fs.writeFileSync(file, buildEpub(book, input.exportedAt, cover));
  book._epub = file;
}
console.log(`built ${books.length} EPUBs in ${path.relative(process.cwd(), epubDir)} (${withCover} with covers)`);

/** Give the book a cover in BookOrbit if it has none yet (BookOrbit fetches it from Amazon itself). */
async function ensureCover(bookId, book) {
  const url = coverUrl(book);
  if (!url) return;
  const thumb = await api("GET", `/api/v1/books/${bookId}/thumbnail`);
  if (thumb.ok) return;
  const res = await api("POST", `/api/v1/books/${bookId}/cover/from-url`, { json: { url } });
  if (!res.ok) console.warn(`  (cover for book #${bookId} could not be set: ${res.status} ${JSON.stringify(res.data).slice(0, 120)})`);
}

const user = await login();
console.log(`logged in to ${BASE} as ${user?.username ?? user?.id ?? "?"}`);

const libRes = await api("GET", "/api/v1/libraries");
if (!libRes.ok) fail(`could not list libraries (${libRes.status}): ${JSON.stringify(libRes.data)}`);
const libraries = Array.isArray(libRes.data) ? libRes.data : libRes.data?.libraries ?? libRes.data?.items ?? [];
let library = null;
if (libraryArg) library = libraries.find((l) => String(l.id) === libraryArg || l.name?.toLowerCase() === libraryArg.toLowerCase());
else if (libraries.length === 1) library = libraries[0];
if (!library) {
  console.error("libraries:", libraries.map((l) => `${l.id}: ${l.name}`).join(", ") || "(none)");
  fail(libraryArg ? `library "${libraryArg}" not found` : "several libraries exist; pick one with --library <name|id>");
}
console.log(`target library: ${library.id} (${library.name})`);

if (dryRun) {
  for (const book of books) console.log(`  would upload ${path.basename(book._epub)} and create ${book.highlights.length} annotations`);
  console.log("dry run complete; nothing was sent.");
  process.exit(0);
}

const summary = { booksCreated: 0, booksReused: 0, created: 0, skipped: 0, failed: [] };

for (const book of books) {
  const label = `${book.title.slice(0, 50)} (${book.asin})`;
  let bookId = state.books[book.asin]?.bookId;

  if (bookId) {
    summary.booksReused++;
  } else {
    const form = new FormData();
    form.append("file", new Blob([fs.readFileSync(book._epub)], { type: "application/epub+zip" }), path.basename(book._epub));
    const up = await api("POST", `/api/v1/libraries/${library.id}/upload`, { form });
    if (!up.ok || up.data?.bookId == null) {
      console.error(`FAILED upload for ${label}: ${up.status} ${JSON.stringify(up.data)}`);
      summary.failed.push({ asin: book.asin, step: "upload", status: up.status, error: up.data });
      continue;
    }
    bookId = up.data.bookId;
    state.books[book.asin] = { bookId, title: book.title, uploadedAt: new Date().toISOString() };
    saveState();
    summary.booksCreated++;

    // Pin the basics right away (the OPF is also parsed asynchronously by BookOrbit).
    const meta = await api("PATCH", `/api/v1/books/${bookId}/metadata`, {
      json: { title: book.title, authors: splitAuthors(book.author), amazonId: book.asin },
    });
    if (!meta.ok) console.warn(`  (metadata patch for ${label} returned ${meta.status}; BookOrbit will use the OPF instead)`);
  }
  await ensureCover(bookId, book);

  // Skip anything already present (state file, or identical text already on the book).
  const existing = await api("GET", `/api/v1/books/${bookId}/annotations`);
  const existingList = Array.isArray(existing.data) ? existing.data : existing.data?.items ?? existing.data?.annotations ?? [];
  const existingTexts = new Set(existingList.map((a) => a.text));

  let created = 0;
  let skipped = 0;
  for (let i = 0; i < book.highlights.length; i++) {
    const h = book.highlights[i];
    const key = `${book.asin}:${h.id}`;
    if (state.annotations[key] || existingTexts.has(h.text)) {
      skipped++;
      continue;
    }
    const res = await api("POST", `/api/v1/books/${bookId}/annotations`, {
      json: {
        cfi: highlightCfi(i + 1, h.text.length),
        text: h.text,
        color: h.color || "yellow",
        style: "highlight",
        note: h.note || null,
        chapterTitle: locationLabel(h),
      },
    });
    if (res.ok && res.data?.id != null) {
      state.annotations[key] = res.data.id;
      created++;
      if (created % 25 === 0) saveState();
    } else {
      summary.failed.push({ asin: book.asin, step: "annotation", id: h.id, status: res.status, error: res.data });
    }
    if (delayMs) await sleep(delayMs);
  }
  saveState();
  summary.created += created;
  summary.skipped += skipped;
  console.log(`OK ${label}: book #${bookId}, ${created} created, ${skipped} skipped`);
}

console.log(
  `\ndone: ${summary.booksCreated} books uploaded, ${summary.booksReused} reused, ` +
    `${summary.created} annotations created, ${summary.skipped} skipped, ${summary.failed.length} failed`
);
if (summary.failed.length) {
  console.error(JSON.stringify(summary.failed.slice(0, 10), null, 2));
  process.exit(1);
}
