import { readFileSync } from "node:fs";
import { createApp } from "./app.js";
import { createBookorbitClient } from "./bookorbit.js";
import { createHighlightsService } from "./highlights.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";

const bookorbit = createBookorbitClient(process.env);
const highlights = bookorbit ? createHighlightsService({ source: bookorbit }) : null;

const app = createApp({ highlights, version: pkg.version });

const server = app.listen(PORT, HOST, () => {
  console.log(
    `api v${pkg.version} listening on http://${HOST}:${PORT} ` +
      `(highlights: ${bookorbit ? bookorbit.baseUrl : "disabled"})`
  );
});

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
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
