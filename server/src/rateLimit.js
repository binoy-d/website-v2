/**
 * Minimal in-memory sliding-window rate limiter (per client IP by default).
 * Good enough for a single-instance personal site; no external deps.
 */
export function createRateLimiter({
  windowMs = 60_000,
  max = 10,
  keyFn = (req) => req.ip || "unknown",
  message = "Too many requests. Please try again later.",
} = {}) {
  const hits = new Map();

  const sweeper = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, times] of hits) {
      const kept = times.filter((t) => t > cutoff);
      if (kept.length) hits.set(key, kept);
      else hits.delete(key);
    }
  }, windowMs);
  sweeper.unref?.();

  function middleware(req, res, next) {
    const now = Date.now();
    const key = keyFn(req);
    const recent = (hits.get(key) || []).filter((t) => t > now - windowMs);

    if (recent.length >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({ error: message });
    }

    recent.push(now);
    hits.set(key, recent);
    next();
  }

  middleware.reset = () => hits.clear();
  middleware.stop = () => clearInterval(sweeper);
  return middleware;
}
