import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

const quietLogger = { info() {}, warn() {}, error() {} };

function start(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () =>
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` })
    );
  });
}

test("api basics", async (t) => {
  const { server, url } = await start(createApp({ logger: quietLogger, version: "test" }));
  t.after(() => server.close());

  await t.test("health reports ok and whether highlights are configured", async () => {
    const res = await fetch(`${url}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.version, "test");
    assert.equal(data.highlights, false);
  });

  await t.test("unknown api routes return json 404", async () => {
    const res = await fetch(`${url}/api/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error, "Not found");
    assert.equal(res.headers.get("x-powered-by"), null);
  });
});
