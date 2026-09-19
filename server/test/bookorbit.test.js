import { test } from "node:test";
import assert from "node:assert/strict";
import { createBookorbitClient } from "../src/bookorbit.js";

const quietLogger = { info() {}, warn() {}, error() {} };

// Tiny fake of the BookOrbit API: records calls, serves 2 pages of annotations, expires tokens on demand.
function fakeBookorbit({ pageSize = 100, total = 150, expireAfterLogins = Infinity } = {}) {
  const calls = [];
  let logins = 0;
  const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  const items = Array.from({ length: total }, (_, i) => ({
    id: `a${i}`, bookId: `b${i % 3}`, text: i === 0 ? "   " : `Text ${i}`, note: i % 2 ? " keep this " : "",
    chapterTitle: i % 5 ? `Chapter ${i}` : "", pageno: i % 5 ? null : 42, highlightedAt: "2026-01-02T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", bookTitle: `Book ${i % 3}`, author: "Someone",
  }));

  const fetchImpl = async (url, init = {}) => {
    const u = new URL(url);
    const auth = init.headers?.authorization;
    calls.push({ path: u.pathname + u.search, method: init.method || "GET", auth, body: init.body ? JSON.parse(init.body) : null });

    if (u.pathname === "/api/v1/auth/login" || u.pathname === "/api/v1/auth/magic-links/login") {
      logins++;
      return json(200, { accessToken: `tok${logins}`, user: { id: 1 } });
    }
    if (u.pathname === "/api/v1/health") return json(200, { status: "ok" });
    const validToken = `tok${logins}`;
    if (auth !== `Bearer ${validToken}` || logins > expireAfterLogins) return json(401, { statusCode: 401, message: "Unauthorized" });

    if (u.pathname === "/api/v1/annotations") {
      const page = Number(u.searchParams.get("page"));
      const size = Number(u.searchParams.get("pageSize"));
      assert.equal(size, pageSize);
      return json(200, { items: items.slice((page - 1) * size, page * size), total, page, pageSize: size, stats: {} });
    }
    if (/^\/api\/v1\/books\/b1\/thumbnail$/.test(u.pathname)) {
      return new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { "content-type": "image/jpeg" } });
    }
    if (/^\/api\/v1\/books\/[^/]+\/thumbnail$/.test(u.pathname)) return new Response(null, { status: 404 });
    if (u.pathname === "/api/v1/health") return json(200, { status: "ok" });
    return json(404, { statusCode: 404 });
  };
  return { fetchImpl, calls, get logins() { return logins; } };
}

test("bookorbit client", async (t) => {
  await t.test("is disabled without a url or without credentials", () => {
    assert.equal(createBookorbitClient({}, { logger: quietLogger }), null);
    assert.equal(createBookorbitClient({ BOOKORBIT_URL: "http://x" }, { logger: quietLogger }), null);
    assert.ok(createBookorbitClient({ BOOKORBIT_URL: "http://x/", BOOKORBIT_MAGIC_TOKEN: "m" }, { logger: quietLogger }));
  });

  await t.test("logs in with username/password, pages through all highlights and normalizes them", async () => {
    const fake = fakeBookorbit({ total: 150 });
    const client = createBookorbitClient(
      { BOOKORBIT_URL: "http://bookorbit.test/", BOOKORBIT_USERNAME: "daniel", BOOKORBIT_PASSWORD: "pw" },
      { fetchImpl: fake.fetchImpl, logger: quietLogger }
    );
    assert.equal(client.baseUrl, "http://bookorbit.test");

    const items = await client.listHighlights();
    assert.equal(fake.logins, 1);
    assert.deepEqual(fake.calls[0], { path: "/api/v1/auth/login", method: "POST", auth: undefined, body: { username: "daniel", password: "pw" } });
    assert.equal(fake.calls.filter((c) => c.path.startsWith("/api/v1/annotations")).length, 2);
    assert.match(fake.calls[1].path, /page=1&pageSize=100&status=active&sortBy=createdAt&sortDir=desc/);

    assert.equal(items.length, 149); // blank text dropped
    const first = items[0];
    assert.deepEqual(first, {
      id: "a1", text: "Text 1", note: "keep this", location: "Chapter 1", createdAt: "2026-01-02T00:00:00Z",
      book: { id: "b1", title: "Book 1", author: "Someone", coverUrl: "/api/highlights/cover/b1" },
    });
    assert.equal(items.find((h) => h.id === "a5").location, "p. 42");
    assert.equal(items.find((h) => h.id === "a2").note, null);
  });

  await t.test("uses the magic-link login when a token is configured and reuses the jwt", async () => {
    const fake = fakeBookorbit({ total: 5 });
    const client = createBookorbitClient(
      { BOOKORBIT_URL: "http://bookorbit.test", BOOKORBIT_MAGIC_TOKEN: "magic" },
      { fetchImpl: fake.fetchImpl, logger: quietLogger }
    );
    await client.listHighlights();
    await client.listHighlights();
    assert.equal(fake.logins, 1);
    assert.deepEqual(fake.calls[0].body, { token: "magic" });
    assert.equal(fake.calls[0].path, "/api/v1/auth/magic-links/login");
  });

  await t.test("re-logs in once on 401 and after the token ttl", async () => {
    const fake = fakeBookorbit({ total: 5 });
    let clock = 0;
    const client = createBookorbitClient(
      { BOOKORBIT_URL: "http://bookorbit.test", BOOKORBIT_MAGIC_TOKEN: "magic" },
      { fetchImpl: fake.fetchImpl, logger: quietLogger, now: () => clock }
    );
    await client.listHighlights();
    assert.equal(fake.logins, 1);

    // Simulate the server invalidating the token: the fake only accepts the latest token, so
    // force a mismatch by logging in behind the client's back.
    await fake.fetchImpl("http://bookorbit.test/api/v1/auth/login", { method: "POST", body: "{}" });
    assert.equal(fake.logins, 2);
    await client.listHighlights(); // gets 401 with tok1, re-logs-in -> tok3
    assert.equal(fake.logins, 3);

    clock = 14 * 60 * 1000; // past the 13 minute ttl
    await client.listHighlights();
    assert.equal(fake.logins, 4);
  });

  await t.test("fetches covers and maps 404 to null", async () => {
    const fake = fakeBookorbit({ total: 5 });
    const client = createBookorbitClient(
      { BOOKORBIT_URL: "http://bookorbit.test", BOOKORBIT_MAGIC_TOKEN: "magic" },
      { fetchImpl: fake.fetchImpl, logger: quietLogger }
    );
    const cover = await client.fetchCover("b1");
    assert.equal(cover.contentType, "image/jpeg");
    assert.deepEqual([...cover.buffer], [1, 2, 3]);
    assert.equal(await client.fetchCover("nope"), null);
    assert.equal(await client.health(), true);
  });
});
