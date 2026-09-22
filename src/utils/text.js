const PREVIEW_CHARS = 220;
const TITLE_MAX = 44;

/** Cut a long passage at a word boundary. Returns { short, truncated }. */
export function shorten(text, max = PREVIEW_CHARS) {
  if (!text || text.length <= max) return { short: text || "", truncated: false };
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const short = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "");
  return { short: `${short}…`, truncated: true };
}

/**
 * Card-sized book title: drop subtitles, series/edition tags, then cap the length.
 * "How to Change Your Mind: What the New Science of…" -> "How to Change Your Mind"
 * "Death's End (The Three-Body Problem Series Book 3)" -> "Death's End"
 */
export function shortTitle(title, max = TITLE_MAX) {
  const full = (title || "").trim();
  if (!full) return "Untitled";
  let t = full
    .replace(/\s*\([^()]*\b(?:book|series|edition|vol\.?|volume|novel|trilogy|collection)\b[^()]*\)\s*$/i, "")
    .replace(/\s*[:–—]\s+.*$/, "")
    .replace(/,\s*\d+(?:st|nd|rd|th)\s+edition.*$/i, "")
    .replace(/[\s,]+(?:\S+\s+)?edition\s*$/i, "")
    .trim();
  if (!t) t = full;
  if (t.length > max) {
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    t = `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:]+$/, "")}…`;
  }
  return t;
}

/** "Sep 2026" (short) or "September 3, 2026" (long); null for missing/invalid dates. */
export function formatDate(value, style = "short") {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return style === "long"
    ? d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}
