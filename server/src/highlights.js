/**
 * Serves random highlights (and their book covers) from a `source` such as the BookOrbit
 * client, with small in-memory caches so the library isn't hit on every page view.
 *
 * `source.listHighlights()` must resolve to an array of normalized highlights:
 *   { id, text, note, location, createdAt, book: { id, title, author, coverUrl } }
 * `source.fetchCover(bookId)` (optional) resolves to { buffer, contentType } or null.
 */
export function createHighlightsService({
  source,
  cacheTtlMs = 10 * 60 * 1000,
  coverTtlMs = 24 * 60 * 60 * 1000,
  maxCovers = 200,
  logger = console,
  now = Date.now,
  random = Math.random,
}) {
  if (!source || typeof source.listHighlights !== "function") {
    throw new Error("createHighlightsService requires a source with listHighlights()");
  }

  let cache = { items: [], fetchedAt: 0 };
  let inflight = null;
  const covers = new Map(); // bookId -> { value, fetchedAt }

  async function allHighlights() {
    const fresh = cache.items.length > 0 && now() - cache.fetchedAt < cacheTtlMs;
    if (fresh) return cache.items;

    if (!inflight) {
      inflight = source
        .listHighlights()
        .then((items) => {
          cache = { items: Array.isArray(items) ? items : [], fetchedAt: now() };
          return cache.items;
        })
        .catch((err) => {
          if (cache.items.length > 0) {
            logger.warn("highlights: refresh failed, serving cached items:", err.message);
            return cache.items;
          }
          throw err;
        })
        .finally(() => {
          inflight = null;
        });
    }
    return inflight;
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  return {
    async getRandom(count) {
      const items = await allHighlights();
      return shuffle(items).slice(0, Math.max(0, count));
    },

    /**
     * Cover for a book that appears in the highlights (anything else is treated as not found,
     * so this can't be used to enumerate the library). Returns { buffer, contentType } or null.
     */
    async getCover(bookId) {
      if (typeof source.fetchCover !== "function") return null;
      const items = await allHighlights();
      if (!items.some((h) => h.book?.id === bookId)) return null;

      const cached = covers.get(bookId);
      if (cached && now() - cached.fetchedAt < coverTtlMs) return cached.value;

      const value = await source.fetchCover(bookId);
      if (covers.size >= maxCovers) covers.delete(covers.keys().next().value);
      covers.set(bookId, { value, fetchedAt: now() });
      return value;
    },

    invalidate() {
      cache = { items: [], fetchedAt: 0 };
      covers.clear();
    },
  };
}
