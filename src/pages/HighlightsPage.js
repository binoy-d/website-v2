import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./HighlightsPage.css";
import { useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import SectionHeader from "../components/SectionHeader";

const PAGE_SIZE = 12;
const PREVIEW_CHARS = 220;
const SEARCH_DEBOUNCE_MS = 300;
const ORIGIN_LABELS = { web: "BookOrbit reader", kobo: "Kobo", koreader: "KOReader" };

const newSeed = () => Math.random().toString(36).slice(2, 10);

/** Cut long passages at a word boundary for the collapsed card. */
function shorten(text, max = PREVIEW_CHARS) {
  if (!text || text.length <= max) return { short: text || "", truncated: false };
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const short = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "");
  return { short: `${short}…`, truncated: true };
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps search terms in <mark>. */
function Highlighted({ text, tokens }) {
  if (!text || !tokens.length) return text || null;
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  // With a capturing group, split() puts the matches at the odd indexes.
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

function formatDate(value, style) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return style === "long"
    ? d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

/** Cover thumbnail that disappears instead of showing a broken image when the book has none. */
function Cover({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img className="highlight-cover" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

function HighlightCard({ highlight, tokens, expanded, onToggle, onFilterBook }) {
  const { text, note, book = {}, location, createdAt, origin } = highlight;
  const { short, truncated } = shorten(text);
  const shownText = expanded ? text : short;
  const shortDate = formatDate(createdAt, "short");
  const longDate = formatDate(createdAt, "long");
  const source = origin ? ORIGIN_LABELS[origin] || origin : null;

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      className={`highlight-card${expanded ? " expanded" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      <blockquote className="highlight-text">
        <Highlighted text={shownText} tokens={tokens} />
      </blockquote>

      {expanded && note && (
        <p className="highlight-note">
          <Highlighted text={note} tokens={tokens} />
        </p>
      )}

      {expanded && (
        <dl className="highlight-details">
          {location && (
            <>
              <dt>Where</dt>
              <dd>{location}</dd>
            </>
          )}
          {longDate && (
            <>
              <dt>Highlighted</dt>
              <dd>{longDate}</dd>
            </>
          )}
          {source && (
            <>
              <dt>Source</dt>
              <dd>{source}</dd>
            </>
          )}
        </dl>
      )}

      <footer className="highlight-meta">
        <Cover src={book.coverUrl} />
        <div className="highlight-book">
          <span className="highlight-title">
            <Highlighted text={book.title || "Untitled"} tokens={tokens} />
          </span>
          {book.author && (
            <span className="highlight-author">
              <Highlighted text={book.author} tokens={tokens} />
            </span>
          )}
          {!expanded && (location || shortDate) && (
            <span className="highlight-where">{[location, shortDate].filter(Boolean).join(" · ")}</span>
          )}
        </div>
        <span className="highlight-more" aria-hidden="true">
          {expanded ? "Show less" : truncated ? "Read more" : "Details"}
        </span>
      </footer>

      {expanded && book.id && (
        <div className="highlight-actions">
          <button
            type="button"
            className="btn highlight-filter-btn"
            onClick={(event) => {
              event.stopPropagation();
              onFilterBook(book.id);
            }}
          >
            More from this book
          </button>
        </div>
      )}
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="highlight-card highlight-skeleton" aria-hidden="true">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-meta" />
    </div>
  );
}

function HighlightsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const bookId = searchParams.get("book") || "";

  const [input, setInput] = useState(q);
  const [seed, setSeed] = useState(newSeed);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | more | ready | error
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const requestId = useRef(0);

  const tokens = useMemo(() => q.toLowerCase().split(/\s+/).filter(Boolean), [q]);

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Keep the input in sync with the URL (back/forward, "More from this book", clear).
  useEffect(() => {
    setInput(q);
  }, [q]);

  // Debounce typing into the URL param that drives fetching.
  useEffect(() => {
    if (input === q) return undefined;
    const timer = setTimeout(() => updateParams({ q: input.trim() }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input, q, updateParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("/api/highlights/books")
      .then((res) => (res.ok ? res.json() : { books: [] }))
      .then((data) => setBooks(Array.isArray(data.books) ? data.books : []))
      .catch(() => setBooks([]));
  }, []);

  const fetchPage = useCallback(
    async ({ offset, append }) => {
      const id = ++requestId.current;
      setStatus(append ? "more" : "loading");
      setError("");
      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset), seed });
        if (q) params.set("q", q);
        if (bookId) params.set("book", bookId);
        const response = await fetch(`/api/highlights?${params}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
        if (id !== requestId.current) return; // a newer request superseded this one
        const page = Array.isArray(data.items) ? data.items : [];
        setItems((prev) => (append ? [...prev, ...page] : page));
        setTotal(Number.isFinite(data.total) ? data.total : page.length);
        setStatus("ready");
      } catch (err) {
        if (id !== requestId.current) return;
        setStatus("error");
        setError(err.message || "Couldn't load highlights right now.");
      }
    },
    [q, bookId, seed]
  );

  useEffect(() => {
    setExpandedId(null);
    fetchPage({ offset: 0, append: false });
  }, [fetchPage]);

  const shuffle = () => setSeed(newSeed());
  const clearFilters = () => updateParams({ q: "", book: "" });
  const filterBook = (id) => {
    updateParams({ book: id, q: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loading = status === "loading";
  const loadingMore = status === "more";
  const filtered = Boolean(q || bookId);
  const selectedBook = books.find((b) => b.id === bookId);
  const totalAll = books.reduce((n, b) => n + b.count, 0);

  let summary = "";
  if (status === "ready") {
    const noun = total === 1 ? "highlight" : "highlights";
    if (!filtered) summary = `${total} ${noun} across ${books.length} books, in random order.`;
    else
      summary =
        `${total} ${noun}` +
        (selectedBook ? ` in ${selectedBook.title || "this book"}` : "") +
        (q ? ` matching “${q}”` : "") +
        ".";
  }

  return (
    <section id="highlights" className="highlights-page">
      <Container className="highlights-container">
        <Fade top>
          <SectionHeader id="highlights-header" text="Highlights" />
        </Fade>
        <p className="highlights-intro">
          Passages I've highlighted while reading, pulled live from my BookOrbit library. Search by
          words, pick a book, or shuffle for a fresh set. Click a card to read the whole passage.
        </p>

        <form className="highlights-toolbar" onSubmit={(event) => event.preventDefault()} role="search">
          <input
            type="search"
            className="form-control highlights-input"
            placeholder="Search words…"
            aria-label="Search highlights"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <select
            className="form-control highlights-select"
            aria-label="Filter by book"
            value={bookId}
            onChange={(event) => updateParams({ book: event.target.value })}
          >
            <option value="">All books{totalAll ? ` (${totalAll})` : ""}</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title || "Untitled"}
                {b.author ? ` — ${b.author}` : ""} ({b.count})
              </option>
            ))}
          </select>
          <button type="button" className="btn highlights-shuffle" onClick={shuffle} disabled={loading}>
            {loading ? "Shuffling…" : "Shuffle"}
          </button>
        </form>

        <div className="highlights-summary" aria-live="polite">
          {status === "error" ? (
            <span className="highlights-error" role="alert">
              {error}
            </span>
          ) : (
            <span>{summary}</span>
          )}
          {filtered && (
            <button type="button" className="highlights-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <Row className="highlights-grid">
          {loading &&
            Array.from({ length: 6 }, (_, i) => (
              <Col key={`skeleton-${i}`} md={6} lg={4} className="highlight-col">
                <SkeletonCard />
              </Col>
            ))}
          {!loading &&
            items.map((highlight) => {
              const expanded = expandedId === highlight.id;
              return (
                <Col
                  key={highlight.id}
                  md={expanded ? 12 : 6}
                  lg={expanded ? 12 : 4}
                  className="highlight-col"
                >
                  <HighlightCard
                    highlight={highlight}
                    tokens={tokens}
                    expanded={expanded}
                    onToggle={() => setExpandedId(expanded ? null : highlight.id)}
                    onFilterBook={filterBook}
                  />
                </Col>
              );
            })}
        </Row>

        {status === "ready" && items.length === 0 && (
          <p className="highlights-message">
            {filtered ? "No highlights match those filters." : "No highlights yet. Check back after I've done some reading."}
          </p>
        )}

        {(status === "ready" || loadingMore) && items.length < total && (
          <div className="highlights-actions">
            <button
              type="button"
              className="btn highlights-more-btn"
              onClick={() => fetchPage({ offset: items.length, append: true })}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading…" : `Show more (${total - items.length} left)`}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default HighlightsPage;
