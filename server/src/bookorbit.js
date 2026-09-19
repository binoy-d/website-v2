/**
 * Minimal BookOrbit API client (https://github.com/bookorbit/bookorbit), used as the
 * highlights source. BookOrbit has no API keys: it issues short-lived JWTs from either
 * a username/password login or a reusable "magic link" token, so this client logs in
 * lazily, caches the JWT, and re-logs-in once on a 401.
 *
 * Returns null when BOOKORBIT_URL is not configured (highlights disabled).
 */
const TOKEN_TTL_MS = 13 * 60 * 1000; // BookOrbit access tokens last 15 minutes by default
const PAGE_SIZE = 100; // BookOrbit's maximum
const MAX_PAGES = 50; // safety cap: 5,000 highlights

export function createBookorbitClient(
  env = process.env,
  { fetchImpl = globalThis.fetch, logger = console, now = Date.now, requestTimeoutMs = 15_000 } = {}
) {
  const baseUrl = (env.BOOKORBIT_URL || "").trim().replace(/\/+$/, "");
  if (!baseUrl) return null;

  const magicToken = (env.BOOKORBIT_MAGIC_TOKEN || "").trim();
  const username = (env.BOOKORBIT_USERNAME || "").trim();
  const password = env.BOOKORBIT_PASSWORD || "";
  if (!magicToken && !(username && password)) {
    logger.warn(
      "bookorbit: BOOKORBIT_URL is set but no credentials were given " +
        "(set BOOKORBIT_MAGIC_TOKEN, or BOOKORBIT_USERNAME and BOOKORBIT_PASSWORD); highlights disabled"
    );
    return null;
  }

  let accessToken = null;
  let tokenExpiresAt = 0;
  let loginInflight = null;

  async function postJson(path, body) {
    const res = await fetchImpl(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    return res;
  }

  async function login() {
    const res = magicToken
      ? await postJson("/api/v1/auth/magic-links/login", { token: magicToken })
      : await postJson("/api/v1/auth/login", { username, password });
    if (!res.ok) {
      throw new Error(`BookOrbit login failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data || typeof data.accessToken !== "string" || !data.accessToken) {
      throw new Error("BookOrbit login response did not include an accessToken");
    }
    accessToken = data.accessToken;
    tokenExpiresAt = now() + TOKEN_TTL_MS;
    return accessToken;
  }

  async function getToken(force = false) {
    if (!force && accessToken && now() < tokenExpiresAt) return accessToken;
    if (!loginInflight) {
      loginInflight = login().finally(() => {
        loginInflight = null;
      });
    }
    return loginInflight;
  }

  async function authedGet(path, { retryOn401 = true, accept = "application/json" } = {}) {
    const token = await getToken();
    const res = await fetchImpl(`${baseUrl}${path}`, {
      headers: { authorization: `Bearer ${token}`, accept },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (res.status === 401 && retryOn401) {
      accessToken = null;
      await getToken(true);
      return authedGet(path, { retryOn401: false, accept });
    }
    return res;
  }

  function normalize(item) {
    const text = typeof item.text === "string" ? item.text.trim() : "";
    const note = typeof item.note === "string" && item.note.trim() ? item.note.trim() : null;
    const location =
      (typeof item.chapterTitle === "string" && item.chapterTitle.trim()) ||
      (item.pageno != null && item.pageno !== "" ? `p. ${item.pageno}` : null);
    const bookId = item.bookId != null ? String(item.bookId) : null;
    return {
      id: item.id,
      text,
      note,
      location: location || null,
      createdAt: item.highlightedAt || item.createdAt || null,
      book: {
        id: bookId,
        title: item.bookTitle || null,
        author: item.author || null,
        coverUrl: bookId ? `/api/highlights/cover/${encodeURIComponent(bookId)}` : null,
      },
    };
  }

  return {
    baseUrl,

    /** All active highlights, normalized. Pages through the annotations hub. */
    async listHighlights() {
      const items = [];
      let total = Infinity;
      for (let page = 1; page <= MAX_PAGES && items.length < total; page++) {
        const query = new URLSearchParams({
          page: String(page),
          pageSize: String(PAGE_SIZE),
          status: "active",
          sortBy: "createdAt",
          sortDir: "desc",
        });
        const res = await authedGet(`/api/v1/annotations?${query}`);
        if (!res.ok) throw new Error(`BookOrbit returned ${res.status} for annotations page ${page}`);
        const data = await res.json();
        const batch = Array.isArray(data?.items) ? data.items : [];
        total = Number.isFinite(data?.total) ? data.total : items.length + batch.length;
        items.push(...batch.map(normalize));
        if (batch.length === 0) break;
      }
      return items.filter((h) => h.text);
    },

    /** Book thumbnail as { buffer, contentType }, or null when BookOrbit has none. */
    async fetchCover(bookId) {
      const res = await authedGet(`/api/v1/books/${encodeURIComponent(bookId)}/thumbnail`, { accept: "image/*" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`BookOrbit returned ${res.status} for the cover of book ${bookId}`);
      return {
        buffer: Buffer.from(await res.arrayBuffer()),
        contentType: res.headers.get("content-type") || "image/jpeg",
      };
    },

    /** Unauthenticated health probe. */
    async health() {
      const res = await fetchImpl(`${baseUrl}/api/v1/health`, { signal: AbortSignal.timeout(5_000) });
      return res.ok;
    },
  };
}
