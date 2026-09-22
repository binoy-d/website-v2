import express from "express";

const CONTENT_CACHE = "public, max-age=300";

/**
 * Builds the Express app. Dependencies are injected so it can be tested in isolation.
 *   highlights: service from createHighlightsService() (null => highlights endpoints answer 503)
 *   content:    service from createContentService()    (null => content endpoints answer 503)
 */
export function createApp({ highlights = null, content = null, logger = console, version = "dev" } = {}) {
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
      content: Boolean(content),
      timestamp: new Date().toISOString(),
    });
  });

  const intParam = (value, { min, max, fallback }) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
  };
  const strParam = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

  /**
   * Wraps a handler that depends on an optional service: 503 while it is not configured,
   * `failure` (status + message) when it throws. Errors carrying their own `status` (e.g. a
   * 404 for an unknown section) are passed through with their message.
   */
  const withService = (service, { name, unavailable, failure }) => (handler) => async (req, res) => {
    if (!service) {
      res.set("Cache-Control", "no-store");
      return res.status(503).json({ error: unavailable });
    }
    try {
      await handler(req, res);
    } catch (err) {
      if (err?.status >= 400 && err.status < 500) return res.status(err.status).json({ error: err.message });
      logger.error(`${name}: request failed:`, err);
      res.status(failure.status).json({ error: failure.message });
    }
  };

  // ---- site content (server/content/*.json + images) ----
  const withContent = withService(content, {
    name: "content",
    unavailable: "Site content is not configured yet.",
    failure: { status: 500, message: "Couldn't load the site content right now." },
  });

  if (content) {
    // Image URLs carry a content hash (?v=...), so they can be cached for a long time.
    app.use(
      "/api/content/images",
      express.static(content.imagesDir, { index: false, dotfiles: "ignore", maxAge: "30d", immutable: true })
    );
  }

  app.get(
    "/api/content",
    withContent(async (req, res) => {
      res.set("Cache-Control", CONTENT_CACHE);
      res.json(await content.all());
    })
  );

  app.get(
    "/api/content/:section",
    withContent(async (req, res) => {
      const data = await content.get(String(req.params.section));
      res.set("Cache-Control", CONTENT_CACHE);
      res.json(data);
    })
  );

  // ---- highlights (BookOrbit) ----
  const withHighlights = withService(highlights, {
    name: "highlights",
    unavailable: "Highlights are not configured yet.",
    failure: { status: 502, message: "Couldn't reach the highlights library right now." },
  });

  // Search / filter / page. Same seed => same order, so paging is stable until the client reshuffles.
  app.get(
    "/api/highlights",
    withHighlights(async (req, res) => {
      res.set("Cache-Control", "no-store");
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
      res.set("Cache-Control", "no-store");
      res.json({ books: await highlights.books() });
    })
  );

  app.get(
    "/api/highlights/random",
    withHighlights(async (req, res) => {
      res.set("Cache-Control", "no-store");
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
