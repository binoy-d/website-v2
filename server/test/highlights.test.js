import { test } from "node:test";
import assert from "node:assert/strict";
import { createHighlightsService, interleaveByBook, tokenize } from "../src/highlights.js";
import { createApp } from "../src/app.js";

const quietLogger = { info() {}, warn() {}, error() {} };
const sample = (n, books = 3) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1, text: `Highlight ${i + 1}`, note: null, location: null, createdAt: null, origin: null,
    book: { id: `b${(i % books) + 1}`, title: `Book ${(i % books) + 1}`, author: "Author", coverUrl: null },
  }));

const start = (app) => new Promise((resolve) => {
  const server = app.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
});

test("interleaveByBook round-robins across books", () => {
  const items = [
    { id: 1, book: { id: "a" } }, { id: 2, book: { id: "a" } }, { id: 3, book: { id: "a" } },
    { id: 4, book: { id: "b" } }, { id: 5, book: { id: "c" } }, { id: 6, book: { id: "b" } },
  ];
  assert.deepEqual(interleaveByBook(items).map((h) => h.id), [1, 4, 5, 2, 6, 3]);
  assert.deepEqual(interleaveByBook([]), []);
});

test("tokenize normalizes case, accents and whitespace", () => {
  assert.deepEqual(tokenize("  Fear   is the MIND-killer  "), ["fear", "is", "the", "mind-killer"]);
  assert.deepEqual(tokenize("Café"), ["cafe"]);
  assert.deepEqual(tokenize(""), []);
});

test("highlights service", async (t) => {
  await t.test("getRandom returns the requested number of distinct items", async () => {
    const service = createHighlightsService({ source: { listHighlights: async () => sample(10) } });
    const items = await service.getRandom(4);
    assert.equal(items.length, 4);
    assert.equal(new Set(items.map((h) => h.id)).size, 4);
    assert.equal((await service.getRandom(50)).length, 10);
  });

  await t.test("query: first results come from different books when possible", async () => {
    const service = createHighlightsService({ source: { listHighlights: async () => sample(30, 5) } });
    for (const seed of ["a", "b", "c", "xyz"]) {
      const { items } = await service.query({ limit: 5, seed });
      assert.equal(new Set(items.map((h) => h.book.id)).size, 5, `seed ${seed}`);
    }
  });

  await t.test("query: same seed gives a stable order across pages, new seed reshuffles", async () => {
    const service = createHighlightsService({ source: { listHighlights: async () => sample(40, 4) } });
    const full = (await service.query({ limit: 100, seed: "stable" })).items.map((h) => h.id);
    const paged = [];
    for (let offset = 0; offset < 40; offset += 12) {
      const page = await service.query({ limit: 12, offset, seed: "stable" });
      assert.equal(page.total, 40);
      paged.push(...page.items.map((h) => h.id));
    }
    assert.deepEqual(paged, full);
    assert.equal(new Set(full).size, 40);

    const other = (await service.query({ limit: 100, seed: "different" })).items.map((h) => h.id);
    assert.notDeepEqual(other, full);
    assert.deepEqual([...other].sort((a, b) => a - b), [...full].sort((a, b) => a - b));
  });

  await t.test("query: filters by words (all tokens, any field) and by book", async () => {
    const items = sample(6, 2);
    items[0].text = "I must not fear. Fear is the mind-killer.";
    items[0].note = "the litany";
    items[1].text = "Deep in the human unconscious is a pervasive need";
    items[2].book = { id: "b9", title: "Café Stories", author: "Ada Lovelace", coverUrl: null };
    items[2].text = "Something else entirely";
    const service = createHighlightsService({ source: { listHighlights: async () => items } });

    let r = await service.query({ q: "FEAR" });
    assert.deepEqual(r.items.map((h) => h.id), [1]);

    r = await service.query({ q: "fear litany" }); // both tokens, across text + note
    assert.deepEqual(r.items.map((h) => h.id), [1]);

    r = await service.query({ q: "fear pervasive" }); // tokens must all match the same highlight
    assert.equal(r.total, 0);

    r = await service.query({ q: "lovelace" }); // author matches
    assert.deepEqual(r.items.map((h) => h.id), [3]);

    r = await service.query({ q: "cafe" }); // accent-insensitive title match
    assert.deepEqual(r.items.map((h) => h.id), [3]);

    r = await service.query({ bookId: "b2" });
    assert.equal(r.total, 3);
    assert.ok(r.items.every((h) => h.book.id === "b2"));

    r = await service.query({ bookId: "b2", q: "human" });
    assert.deepEqual(r.items.map((h) => h.id), [2]);

    r = await service.query({ limit: 2, offset: 100, seed: "s" });
    assert.equal(r.total, 6);
    assert.equal(r.items.length, 0);
  });

  await t.test("books() aggregates counts sorted by title", async () => {
    const items = sample(7, 3);
    items[6].book = { id: "b0", title: "Aardvark Tales", author: null, coverUrl: "/api/highlights/cover/b0" };
    const service = createHighlightsService({ source: { listHighlights: async () => items } });
    const books = await service.books();
    assert.deepEqual(books.map((b) => [b.id, b.count]), [["b0", 1], ["b1", 2], ["b2", 2], ["b3", 2]]);
    assert.equal(books[0].coverUrl, "/api/highlights/cover/b0");
    assert.equal(books[1].author, "Author");
  });

  await t.test("caches the source and refreshes after the ttl", async () => {
    let calls = 0;
    let clock = 1_000;
    const service = createHighlightsService({
      source: { listHighlights: async () => { calls++; return sample(5); } },
      cacheTtlMs: 100, now: () => clock,
    });
    await service.query({ q: "highlight" });
    await service.books();
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

test("highlights routes", async (t) => {
  await t.test("503 when not configured", async () => {
    const { server, url } = await start(createApp({ logger: quietLogger }));
    try {
      for (const path of ["/api/highlights", "/api/highlights/books", "/api/highlights/random"]) {
        const res = await fetch(`${url}${path}`);
        assert.equal(res.status, 503, path);
        assert.match((await res.json()).error, /not configured/);
      }
    } finally {
      server.close();
    }
  });

  await t.test("GET /api/highlights validates params and returns pages", async () => {
    const items = sample(30, 3);
    items[4].text = "a very specific phrase";
    const highlights = createHighlightsService({ source: { listHighlights: async () => items } });
    const { server, url } = await start(createApp({ highlights, logger: quietLogger }));
    try {
      let res = await fetch(`${url}/api/highlights`);
      assert.equal(res.status, 200);
      let data = await res.json();
      assert.equal(data.total, 30);
      assert.equal(data.items.length, 12);
      assert.equal(data.offset, 0);

      res = await fetch(`${url}/api/highlights?limit=999&offset=-5&seed=${"x".repeat(100)}`);
      data = await res.json();
      assert.equal(data.items.length, 30);
      assert.equal(data.limit, 50);
      assert.equal(data.offset, 0);
      assert.equal(data.seed.length, 64);

      res = await fetch(`${url}/api/highlights?q=specific%20PHRASE`);
      data = await res.json();
      assert.deepEqual(data.items.map((h) => h.id), [5]);

      res = await fetch(`${url}/api/highlights?book=b2&limit=3&seed=k`);
      data = await res.json();
      assert.equal(data.total, 10);
      assert.ok(data.items.every((h) => h.book.id === "b2"));

      res = await fetch(`${url}/api/highlights/books`);
      data = await res.json();
      assert.deepEqual(data.books.map((b) => b.count), [10, 10, 10]);

      res = await fetch(`${url}/api/highlights/random?count=999`);
      assert.equal((await res.json()).highlights.length, 24);
    } finally {
      server.close();
    }
  });

  await t.test("502 when the source is down", async () => {
    const highlights = createHighlightsService({ source: { listHighlights: async () => { throw new Error("nope"); } }, logger: quietLogger });
    const { server, url } = await start(createApp({ highlights, logger: quietLogger }));
    try {
      const res = await fetch(`${url}/api/highlights`);
      assert.equal(res.status, 502);
    } finally {
      server.close();
    }
  });
});

test("GET /api/highlights/cover/:bookId", async (t) => {
  let coverFetches = 0;
  const source = {
    listHighlights: async () => [{ id: 1, text: "t", note: null, location: null, createdAt: null, book: { id: "b1", title: "B", author: "A", coverUrl: "/api/highlights/cover/b1" } }],
    fetchCover: async (id) => { coverFetches++; return id === "b1" ? { buffer: Buffer.from("img"), contentType: "image/png" } : null; },
  };
  const highlights = createHighlightsService({ source });
  const { server, url } = await start(createApp({ highlights, logger: quietLogger }));
  t.after(() => server.close());

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
