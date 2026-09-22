import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { ContentError, SECTIONS, createContentService } from "../src/content.js";
import { createApp } from "../src/app.js";

const quietLogger = { info() {}, warn() {}, error() {} };
const realContentDir = new URL("../content/", import.meta.url);

const start = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });

const fixtures = {
  profile: {
    name: "Test Person", greeting: "Hi!", image: "me.jpg", email: "t@example.com", description: "About me.",
    info: { Name: ["Test", "Person"], Status: "testing" }, taglines: ["one", "two"],
  },
  projects: {
    items: [
      { id: "a", title: "A", description: ["x"], languages: ["JS"], link: "/highlights", codeLink: "https://example.com/a", image: "a.png", featured: false, longDescription: "long a" },
      { id: "b", title: "B", description: ["y"], languages: [], link: "https://example.com/b", image: "https://cdn.example.com/b.png", longDescription: "long b" },
    ],
  },
  experience: {
    careerHighlights: [{ metric: "1x", label: "did a thing" }],
    items: [{ period: "2020", company: "Co", role: "Dev", impact: "Shipped", details: ["a", "b"] }],
  },
  skills: { groups: [{ title: "Languages", items: ["JS"] }] },
};

/** Writes the fixture content (optionally patched) into a fresh temp dir and returns its path. */
async function fixtureDir(t, patch = {}) {
  const dir = await mkdtemp(path.join(tmpdir(), "content-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await mkdir(path.join(dir, "images"));
  await writeFile(path.join(dir, "images", "me.jpg"), "jpeg-bytes");
  await writeFile(path.join(dir, "images", "a.png"), "png-bytes");
  for (const section of SECTIONS) {
    const data = section in patch ? patch[section] : fixtures[section];
    await writeFile(path.join(dir, `${section}.json`), typeof data === "string" ? data : JSON.stringify(data));
  }
  return dir;
}

test("content service", async (t) => {
  await t.test("loads every section and rewrites image file names to versioned urls", async () => {
    const dir = await fixtureDir(t);
    const service = createContentService({ dir, logger: quietLogger });
    const all = await service.all();
    assert.deepEqual(Object.keys(all).sort(), [...SECTIONS].sort());

    assert.match(all.profile.image, /^\/api\/content\/images\/me\.jpg\?v=[0-9a-f]{10}$/);
    assert.match(all.projects.items[0].image, /^\/api\/content\/images\/a\.png\?v=[0-9a-f]{10}$/);
    assert.equal(all.projects.items[1].image, "https://cdn.example.com/b.png", "absolute urls are left alone");
    assert.equal(all.projects.items[0].link, "/highlights");
    assert.deepEqual(all.skills.groups[0].items, ["JS"]);
    assert.equal(all.experience.items[0].company, "Co");

    assert.deepEqual(await service.get("skills"), all.skills);
    await assert.rejects(() => service.get("nope"), (err) => err instanceof ContentError && err.status === 404);
  });

  await t.test("the image version changes with the file contents", async () => {
    const dir = await fixtureDir(t);
    const service = createContentService({ dir, cacheTtlMs: 0, logger: quietLogger });
    const before = (await service.get("profile")).image;
    await writeFile(path.join(dir, "images", "me.jpg"), "different-bytes");
    // mtime granularity can be coarse; make sure the stat-based shortcut sees a change.
    const later = Date.now() / 1000 + 5;
    const { utimes } = await import("node:fs/promises");
    await utimes(path.join(dir, "images", "me.jpg"), later, later);
    const after = (await service.get("profile")).image;
    assert.notEqual(before, after);
  });

  await t.test("caches with a ttl and serves the previous version if a reload fails", async () => {
    const dir = await fixtureDir(t);
    let clock = 1_000;
    const service = createContentService({ dir, cacheTtlMs: 100, now: () => clock, logger: quietLogger });
    assert.equal((await service.get("profile")).greeting, "Hi!");

    await writeFile(path.join(dir, "profile.json"), JSON.stringify({ ...fixtures.profile, greeting: "Hello!" }));
    assert.equal((await service.get("profile")).greeting, "Hi!", "still cached");
    clock += 101;
    assert.equal((await service.get("profile")).greeting, "Hello!", "reloaded after the ttl");

    await writeFile(path.join(dir, "profile.json"), "{ not json");
    clock += 101;
    assert.equal((await service.get("profile")).greeting, "Hello!", "broken edit keeps the last good version");
  });

  await t.test("rejects invalid content with a message that names the problem", async () => {
    const cases = [
      [{ profile: "{ nope" }, /profile\.json is not valid JSON/],
      [{ projects: { items: [{ ...fixtures.projects.items[0], image: "missing.png" }] } }, /projects\.items\[0\]\.image refers to a missing file/],
      [{ projects: { items: [fixtures.projects.items[0], fixtures.projects.items[0]] } }, /items\[1\]\.id is duplicated/],
      [{ projects: { items: [{ ...fixtures.projects.items[0], description: [] }] } }, /description must have at least 1/],
      [{ experience: { careerHighlights: [], items: [] } }, /experience\.items must have at least 1/],
      [{ experience: { careerHighlights: [], items: [{ period: "x", company: "y" }] } }, /items\[0\]\.role must be a non-empty string/],
      [{ skills: { groups: [{ title: "T", items: [1] }] } }, /skills\.groups\[0\]\.items\[0\] must be a string/],
      [{ profile: { ...fixtures.profile, taglines: [] } }, /taglines must have at least 1/],
      [{ profile: [] }, /profile must be a JSON object/],
    ];
    for (const [patch, expected] of cases) {
      const dir = await fixtureDir(t, patch);
      const service = createContentService({ dir, logger: quietLogger });
      await assert.rejects(() => service.all(), expected);
    }
  });
});

test("the shipped content in server/content is valid", async () => {
  const service = createContentService({ dir: realContentDir, logger: quietLogger });
  const all = await service.all();
  assert.ok(all.projects.items.length >= 10);
  assert.ok(all.projects.items.some((p) => p.link === "/highlights"), "the highlights feature is listed as a project");
  assert.ok(all.experience.items.length >= 5);
  assert.ok(all.skills.groups.length === 4);
  for (const project of all.projects.items) {
    assert.match(project.image, /^\/api\/content\/images\/[^?]+\?v=[0-9a-f]{10}$/, `${project.id} image`);
  }
  for (const group of all.skills.groups) {
    assert.equal(new Set(group.items).size, group.items.length, `${group.title} has duplicate skills`);
  }
});

test("content routes", async (t) => {
  await t.test("503 when not configured", async () => {
    const { server, url } = await start(createApp({ logger: quietLogger }));
    try {
      for (const p of ["/api/content", "/api/content/projects"]) {
        const res = await fetch(`${url}${p}`);
        assert.equal(res.status, 503, p);
        assert.match((await res.json()).error, /not configured/);
      }
      assert.equal((await fetch(`${url}/api/content/images/a.png`)).status, 404);
    } finally {
      server.close();
    }
  });

  await t.test("serves sections, images with long cache headers, and json 404s", async () => {
    const dir = await fixtureDir(t);
    const content = createContentService({ dir, logger: quietLogger });
    const { server, url } = await start(createApp({ content, logger: quietLogger }));
    try {
      let res = await fetch(`${url}/api/content`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("cache-control"), "public, max-age=300");
      const all = await res.json();
      assert.deepEqual(Object.keys(all).sort(), [...SECTIONS].sort());

      res = await fetch(`${url}/api/content/experience`);
      assert.equal(res.status, 200);
      assert.equal((await res.json()).items[0].company, "Co");

      res = await fetch(`${url}/api/content/nope`);
      assert.equal(res.status, 404);
      assert.match((await res.json()).error, /Unknown content section/);

      res = await fetch(`${url}${all.projects.items[0].image}`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type"), "image/png");
      assert.match(res.headers.get("cache-control"), /max-age=2592000/);
      assert.match(res.headers.get("cache-control"), /immutable/);
      assert.equal(await res.text(), "png-bytes");

      res = await fetch(`${url}/api/content/images/missing.png`);
      assert.equal(res.status, 404);
      assert.equal((await res.json()).error, "Not found");

      res = await fetch(`${url}/api/health`);
      assert.equal((await res.json()).content, true);
    } finally {
      server.close();
    }
  });

  await t.test("500 with a friendly message when the content is broken", async () => {
    const dir = await fixtureDir(t, { skills: "{ broken" });
    const content = createContentService({ dir, logger: quietLogger });
    const { server, url } = await start(createApp({ content, logger: quietLogger }));
    try {
      const res = await fetch(`${url}/api/content`);
      assert.equal(res.status, 500);
      assert.match((await res.json()).error, /Couldn't load the site content/);
    } finally {
      server.close();
    }
  });
});
