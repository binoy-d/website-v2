import { createHash, timingSafeEqual } from "node:crypto";
import express from "express";

export const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value) => (typeof value === "string" ? value.trim() : "");

export function validateContact(body) {
  const errors = [];
  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name) errors.push("Please enter your name.");
  else if (name.length > LIMITS.name) errors.push(`Name must be ${LIMITS.name} characters or fewer.`);

  if (!email) errors.push("Please enter your email.");
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.push("Please enter a valid email address.");

  if (!message) errors.push("Please enter a message.");
  else if (message.length > LIMITS.message) errors.push(`Message must be ${LIMITS.message} characters or fewer.`);

  return { errors, values: { name, email, message } };
}

// Constant-time comparison that tolerates different lengths.
function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

const noopLimiter = (req, res, next) => next();

/**
 * Builds the Express app. All I/O dependencies are injected so it can be tested in isolation.
 */
export function createApp({
  db,
  mailer = null,
  adminToken = "",
  contactLimiter = noopLimiter,
  highlights = null,
  logger = console,
  version = "dev",
}) {
  if (!db) throw new Error("createApp requires a db");

  const app = express();
  app.disable("x-powered-by");
  // We sit behind nginx (and possibly Cloudflare); trust X-Forwarded-* so req.ip is the real client.
  app.set("trust proxy", true);
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      status: "ok",
      version,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/contact", contactLimiter, (req, res) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    // Honeypot: the "website" field is hidden from humans; bots tend to fill it.
    if (text(body.website)) {
      logger.warn(`contact: honeypot triggered from ${req.ip}`);
      return res.status(202).json({ ok: true });
    }

    const { errors, values } = validateContact(body);
    if (errors.length) {
      return res.status(400).json({ error: "Invalid submission", details: errors });
    }

    const record = {
      ...values,
      ip: req.ip ?? null,
      userAgent: (req.get("user-agent") || "").slice(0, 300) || null,
    };
    const id = db.insertMessage(record);
    logger.info(`contact: stored message #${id} from ${values.email}`);

    if (mailer) {
      // Fire-and-forget: the message is already persisted, email is a best-effort notification.
      mailer
        .sendContactNotification({ id, ...record })
        .catch((err) => logger.error(`contact: email notification failed for #${id}:`, err));
    }

    res.status(201).json({ ok: true, id });
  });

  app.get("/api/highlights/random", async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!highlights) {
      return res.status(503).json({ error: "Highlights are not configured yet." });
    }
    const requested = Number.parseInt(req.query.count, 10);
    const count = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), 24) : 6;
    try {
      const items = await highlights.getRandom(count);
      res.json({ highlights: items });
    } catch (err) {
      logger.error("highlights: failed to load:", err);
      res.status(502).json({ error: "Couldn't reach the highlights library right now." });
    }
  });

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

  const requireAdmin = (req, res, next) => {
    if (!adminToken) return res.status(404).json({ error: "Not found" });
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token || !safeEqual(token, adminToken)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  app.get("/api/admin/messages", requireAdmin, (req, res) => {
    const requested = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), 500) : 50;
    res.set("Cache-Control", "no-store");
    res.json({ total: db.countMessages(), messages: db.listMessages(limit) });
  });

  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err?.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });
    if (err?.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
