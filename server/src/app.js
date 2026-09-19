import express from "express";

/**
 * Builds the Express app. Dependencies are injected so it can be tested in isolation.
 *   highlights: service from createHighlightsService() (null => highlights endpoints answer 503)
 */
export function createApp({ highlights = null, logger = console, version = "dev" } = {}) {
  const app = express();
  app.disable("x-powered-by");
  // We sit behind nginx (and Cloudflare); trust X-Forwarded-* so req.ip is the real client.
  app.set("trust proxy", true);

  app.get("/api/health", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      status: "ok",
      version,
      uptime: Math.round(process.uptime()),
      highlights: Boolean(highlights),
      timestamp: new Date().toISOString(),
    });
  });

  // ---- highlights (BookOrbit) ----
  const intParam = (value, { min, max, fallback }) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
  };
  const strParam = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

  const withHighlights = (handler) => async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!highlights) return res.status(503).json({ error: "Highlights are not configured yet." });
    try {
      await handler(req, res);
    } catch (err) {
      logger.error("highlights: request failed:", err);
      res.status(502).json({ error: "Couldn't reach the highlights library right now." });
    }
  };

  // Search / filter / page. Same seed => same order, so paging is stable until the client reshuffles.
  app.get(
    "/api/highlights",
    withHighlights(async (req, res) => {
      const result = await highlights.query({
        q: strParam(req.query.q, 200),
        bookId: strParam(req.query.book, 100) || null,
        limit: intParam(req.query.limit, { min: 1, max: 50, fallback: 12 }),
        offset: intParam(req.query.offset, { min: 0, max: 100_000, fallback: 0 }),
        seed: strParam(req.query.seed, 64),
      });
      res.json(result);
    })
  );

  app.get(
    "/api/highlights/books",
    withHighlights(async (req, res) => {
      res.json({ books: await highlights.books() });
    })
  );

  app.get(
    "/api/highlights/random",
    withHighlights(async (req, res) => {
      const count = intParam(req.query.count, { min: 1, max: 24, fallback: 6 });
      res.json({ highlights: await highlights.getRandom(count) });
    })
  );

  app.get("/api/highlights/cover/:bookId", async (req, res) => {
    if (!highlights) return res.status(404).end();
    try {
      const cover = await highlights.getCover(String(req.params.bookId));
      if (!cover) return res.status(404).end();
      res.set("Content-Type", cover.contentType);
      res.set("Cache-Control", "public, max-age=86400");
      res.send(cover.buffer);
    } catch (err) {
      logger.error(`highlights: cover ${req.params.bookId} failed:`, err);
      res.status(502).end();
    }
  });

  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
