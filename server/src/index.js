import path from "node:path";
import { readFileSync } from "node:fs";
import { createApp } from "./app.js";
import { openDatabase } from "./db.js";
import { createMailer } from "./mailer.js";
import { createRateLimiter } from "./rateLimit.js";
import { createBookorbitClient } from "./bookorbit.js";
import { createHighlightsService } from "./highlights.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = process.env.DATA_DIR || path.resolve("data");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

const db = openDatabase({ file: path.join(DATA_DIR, "app.db") });
const mailer = createMailer(process.env);
const bookorbit = createBookorbitClient(process.env);
const highlights = bookorbit ? createHighlightsService({ source: bookorbit }) : null;
const contactLimiter = createRateLimiter({
  windowMs: Number(process.env.CONTACT_RATE_WINDOW_MS || 60 * 60 * 1000),
  max: Number(process.env.CONTACT_RATE_MAX || 5),
  message: "Too many messages from this address. Please try again later.",
});

const app = createApp({ db, mailer, adminToken: ADMIN_TOKEN, contactLimiter, highlights, version: pkg.version });

const server = app.listen(PORT, HOST, () => {
  console.log(
    `api v${pkg.version} listening on http://${HOST}:${PORT} ` +
      `(data: ${DATA_DIR}, email: ${mailer ? "enabled" : "disabled"}, admin: ${ADMIN_TOKEN ? "enabled" : "disabled"}, ` +
      `highlights: ${bookorbit ? bookorbit.baseUrl : "disabled"})`
  );
});

if (mailer) {
  mailer
    .verify()
    .then(() => console.log("smtp: connection verified"))
    .catch((err) => console.warn("smtp: verification failed (notifications may not send):", err.message));
}

if (highlights) {
  // Warm the cache so the first visit to /highlights is fast; failures are logged, not fatal.
  highlights
    .getRandom(1)
    .then(() => console.log("highlights: cache warmed from BookOrbit"))
    .catch((err) => console.warn("highlights: initial load from BookOrbit failed:", err.message));
}

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    contactLimiter.stop();
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
