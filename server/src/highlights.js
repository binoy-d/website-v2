/**
 * Serves highlights (and their book covers) from a `source` such as the BookOrbit client,
 * with small in-memory caches so the library isn't hit on every page view.
 *
 * `source.listHighlights()` must resolve to an array of normalized highlights:
 *   { id, text, note, location, createdAt, origin, book: { id, title, author, coverUrl } }
 * `source.fetchCover(bookId)` (optional) resolves to { buffer, contentType } or null.
 *
 * Queries are answered from the cached list: filtering by words and/or book, then a
 * seeded shuffle that is round-robined across books, so the first results always come
 * from different books when possible and paging with the same seed stays consistent.
 */

// --- small deterministic PRNG so a seed gives a stable order across pages ---
function hashSeed(seed) {
  let h = 2166136261 >>> 0; // FNV-1a
  for (const ch of String(seed)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith(items, rand) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Round-robin the (already shuffled) items across books: A B C A B C A A ... */
export function interleaveByBook(items) {
  const groups = new Map();
  const order = [];
  for (const item of items) {
    const key = item.book?.id ?? `__nobook_${item.id}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(item);
  }
  const out = [];
  let i = 0;
  while (out.length < items.length) {
    const group = groups.get(order[i % order.length]);
    if (group.length) out.push(group.shift());
    i++;
  }
  return out;
}

export const normalizeText = (value) =>
  (value == null ? "" : String(value))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const tokenize = (query) => normalizeText(query).split(" ").filter(Boolean);

function haystack(h) {
  return normalizeText([h.text, h.note, h.location, h.book?.title, h.book?.author].filter(Boolean).join(" \n "));
}

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
  let searchIndex = new Map(); // highlight -> normalized haystack
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
          searchIndex = new Map(cache.items.map((h) => [h, haystack(h)]));
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

  const textOf = (h) => searchIndex.get(h) ?? haystack(h);

  return {
    /**
     * Filter + seeded random order, round-robined across books.
     * Returns { total, offset, limit, seed, items }.
     */
    async query({ q = "", bookId = null, limit = 12, offset = 0, seed = "" } = {}) {
      const all = await allHighlights();
      const tokens = tokenize(q);
      const matched = all.filter(
        (h) =>
          (!bookId || h.book?.id === bookId) &&
          (tokens.length === 0 || tokens.every((t) => textOf(h).includes(t)))
      );
      const effectiveSeed = String(seed || "");
      const rand = mulberry32(hashSeed(effectiveSeed || "default"));
      const ordered = interleaveByBook(shuffleWith(matched, rand));
      const safeOffset = Math.max(0, offset);
      const safeLimit = Math.max(0, limit);
      return {
        total: ordered.length,
        offset: safeOffset,
        limit: safeLimit,
        seed: effectiveSeed,
        items: ordered.slice(safeOffset, safeOffset + safeLimit),
      };
    },

    /** Convenience: `count` random highlights with a fresh seed each call. */
    async getRandom(count) {
      const { items } = await this.query({ limit: count, seed: String(random()) });
      return items;
    },

    /** Books that have highlights, with counts, sorted by title. */
    async books() {
      const all = await allHighlights();
      const byId = new Map();
      for (const h of all) {
        const id = h.book?.id;
        if (!id) continue;
        const entry = byId.get(id) || {
          id,
          title: h.book.title || null,
          author: h.book.author || null,
          coverUrl: h.book.coverUrl || null,
          count: 0,
        };
        entry.count++;
        byId.set(id, entry);
      }
      return [...byId.values()].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
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
      searchIndex = new Map();
      covers.clear();
    },
  };
}
