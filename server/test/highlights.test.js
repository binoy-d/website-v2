import { test } from "node:test";
import assert from "node:assert/strict";
import { createHighlightsService } from "../src/highlights.js";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db.js";

const quietLogger = { info() {}, warn() {}, error() {} };
const sample = (n) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1, text: `Highlight ${i + 1}`, note: null, location: null, createdAt: null,
    book: { title: `Book ${i + 1}`, author: "Author", coverUrl: null },
  }));

test("highlights service", async (t) => {
  await t.test("returns the requested number of distinct items", async () => {
    const service = createHighlightsService({ source: { listHighlights: async () => sample(10) } });
    const items = await service.getRandom(4);
    assert.equal(items.length, 4);
    assert.equal(new Set(items.map((h) => h.id)).size, 4);
  });

  await t.test("caps at the available items and shuffles", async () => {
    let seed = 0.99; // deterministic "random": always picks the last index -> identity permutation... then reverse
    const service = createHighlightsService({ source: { listHighlights: async () => sample(3) }, random: () => seed });
    assert.equal((await service.getRandom(10)).length, 3);
    seed = 0; // always picks index 0 -> rotates the array
    const rotated = await service.getRandom(3);
    assert.deepEqual(rotated.map((h) => h.id), [2, 3, 1]);
  });

  await t.test("caches the source and refreshes after the ttl", async () => {
    let calls = 0;
    let clock = 1_000;
    const service = createHighlightsService({
      source: { listHighlights: async () => { calls++; return sample(5); } },
      cacheTtlMs: 100, now: () => clock,
    });
    await service.getRandom(2);
    await service.getRandom(2);
    assert.equal(calls, 1);
    clock += 101;
    await service.getRandom(2);
    assert.equal(calls, 2);
  });

  await t.test("serves stale items when a refresh fails, throws when nothing is cached", async () => {
    let fail = false;
    let clock = 0;
    const service = createHighlightsService({
      source: { listHighlights: async () => { if (fail) throw new Error("down"); return sample(2); } },
      cacheTtlMs: 10, now: () => clock, logger: quietLogger,
    });
    await service.getRandom(1);
    fail = true;
    clock = 50;
    assert.equal((await service.getRandom(1)).length, 1);

    const empty = createHighlightsService({ source: { listHighlights: async () => { throw new Error("down"); } }, logger: quietLogger });
    await assert.rejects(() => empty.getRandom(1), /down/);
  });
});

test("GET /api/highlights/random", async (t) => {
  const start = (app) => new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });

  await t.test("503 when not configured", async () => {
    const db = openDatabase({ file: ":memory:" });
    const { server, url } = await start(createApp({ db, logger: quietLogger }));
    try {
      const res = await fetch(`${url}/api/highlights/random`);
      assert.equal(res.status, 503);
      assert.match((await res.json()).error, /not configured/);
    } finally {
      server.close();
      db.close();
    }
  });

  await t.test("returns highlights and clamps count", async () => {
    const db = openDatabase({ file: ":memory:" });
    const highlights = createHighlightsService({ source: { listHighlights: async () => sample(30) } });
    const { server, url } = await start(createApp({ db, highlights, logger: quietLogger }));
    try {
      let res = await fetch(`${url}/api/highlights/random`);
      assert.equal(res.status, 200);
      assert.equal((await res.json()).highlights.length, 6);

      res = await fetch(`${url}/api/highlights/random?count=999`);
      assert.equal((await res.json()).highlights.length, 24);

      res = await fetch(`${url}/api/highlights/random?count=abc`);
      assert.equal((await res.json()).highlights.length, 6);
    } finally {
      server.close();
      db.close();
    }
  });

  await t.test("502 when the source is down", async () => {
    const db = openDatabase({ file: ":memory:" });
    const highlights = createHighlightsService({ source: { listHighlights: async () => { throw new Error("nope"); } }, logger: quietLogger });
    const { server, url } = await start(createApp({ db, highlights, logger: quietLogger }));
    try {
      const res = await fetch(`${url}/api/highlights/random`);
      assert.equal(res.status, 502);
    } finally {
      server.close();
      db.close();
    }
  });
});

test("GET /api/highlights/cover/:bookId", async (t) => {
  const start = (app) => new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
  const db = openDatabase({ file: ":memory:" });
  let coverFetches = 0;
  const source = {
    listHighlights: async () => [{ id: 1, text: "t", note: null, location: null, createdAt: null, book: { id: "b1", title: "B", author: "A", coverUrl: "/api/highlights/cover/b1" } }],
    fetchCover: async (id) => { coverFetches++; return id === "b1" ? { buffer: Buffer.from("img"), contentType: "image/png" } : null; },
  };
  const highlights = createHighlightsService({ source });
  const { server, url } = await start(createApp({ db, highlights, logger: quietLogger }));
  t.after(() => { server.close(); db.close(); });

  let res = await fetch(`${url}/api/highlights/cover/b1`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "image/png");
  assert.equal(await res.text(), "img");

  await fetch(`${url}/api/highlights/cover/b1`);
  assert.equal(coverFetches, 1, "covers are cached");

  res = await fetch(`${url}/api/highlights/cover/unknown-book`);
  assert.equal(res.status, 404);
  assert.equal(coverFetches, 1, "unknown books are never requested upstream");
});
