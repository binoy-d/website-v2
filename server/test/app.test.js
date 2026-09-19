import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db.js";
import { createRateLimiter } from "../src/rateLimit.js";

const quietLogger = { info() {}, warn() {}, error() {} };

function start(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () =>
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` })
    );
  });
}
const stop = (server) => new Promise((resolve) => server.close(resolve));

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { res, data: await res.json().catch(() => null) };
}

test("api", async (t) => {
  const db = openDatabase({ file: ":memory:" });
  const sent = [];
  const mailer = { sendContactNotification: async (m) => void sent.push(m) };
  const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
  const app = createApp({ db, mailer, adminToken: "secret", contactLimiter: limiter, logger: quietLogger, version: "test" });
  const { server, url } = await start(app);
  t.after(async () => {
    await stop(server);
    limiter.stop();
    db.close();
  });

  await t.test("health reports ok", async () => {
    const res = await fetch(`${url}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.version, "test");
  });

  await t.test("rejects invalid submissions", async () => {
    limiter.reset();
    let r = await postJson(`${url}/api/contact`, { name: "", email: "x", message: "" });
    assert.equal(r.res.status, 400);
    assert.ok(r.data.details.length >= 3);

    r = await postJson(`${url}/api/contact`, { name: "A", email: "not-an-email", message: "hi" });
    assert.equal(r.res.status, 400);
    assert.match(r.data.details[0], /valid email/);

    r = await postJson(`${url}/api/contact`, "{not json");
    assert.equal(r.res.status, 400);

    assert.equal(db.countMessages(), 0);
  });

  await t.test("honeypot silently drops bots", async () => {
    limiter.reset();
    const r = await postJson(`${url}/api/contact`, {
      name: "Bot", email: "bot@example.com", message: "buy now", website: "http://spam.example",
    });
    assert.equal(r.res.status, 202);
    assert.equal(db.countMessages(), 0);
    assert.equal(sent.length, 0);
  });

  await t.test("stores a valid submission and notifies", async () => {
    limiter.reset();
    const r = await postJson(`${url}/api/contact`, { name: "  Ada Lovelace ", email: "ada@example.com", message: "Hello there" });
    assert.equal(r.res.status, 201);
    assert.equal(r.data.ok, true);
    assert.equal(typeof r.data.id, "number");

    assert.equal(db.countMessages(), 1);
    const [m] = db.listMessages(10);
    assert.equal(m.name, "Ada Lovelace");
    assert.equal(m.email, "ada@example.com");
    assert.equal(m.message, "Hello there");
    assert.ok(m.created_at);

    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(sent.length, 1);
    assert.equal(sent[0].id, r.data.id);
  });

  await t.test("admin endpoint requires the bearer token", async () => {
    let res = await fetch(`${url}/api/admin/messages`);
    assert.equal(res.status, 401);
    res = await fetch(`${url}/api/admin/messages`, { headers: { authorization: "Bearer nope" } });
    assert.equal(res.status, 401);

    res = await fetch(`${url}/api/admin/messages?limit=1`, { headers: { authorization: "Bearer secret" } });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.total, 1);
    assert.equal(data.messages.length, 1);
    assert.equal(data.messages[0].email, "ada@example.com");
  });

  await t.test("rate limits contact submissions", async () => {
    limiter.reset();
    const body = { name: "A", email: "a@example.com", message: "m" };
    for (let i = 0; i < 3; i++) {
      const r = await postJson(`${url}/api/contact`, body);
      assert.equal(r.res.status, 201);
    }
    const r = await postJson(`${url}/api/contact`, body);
    assert.equal(r.res.status, 429);
    assert.ok(r.res.headers.get("retry-after"));
  });

  await t.test("unknown api routes return json 404", async () => {
    const res = await fetch(`${url}/api/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error, "Not found");
  });
});

test("admin endpoint is hidden when no token is configured", async (t) => {
  const db = openDatabase({ file: ":memory:" });
  const app = createApp({ db, logger: quietLogger });
  const { server, url } = await start(app);
  t.after(async () => {
    await stop(server);
    db.close();
  });
  const res = await fetch(`${url}/api/admin/messages`, { headers: { authorization: "Bearer anything" } });
  assert.equal(res.status, 404);
});
