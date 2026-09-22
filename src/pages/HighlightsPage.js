import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./HighlightsPage.css";
import { useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import SectionHeader from "../components/SectionHeader";
import { SkeletonBlock, SkeletonLines } from "../components/Skeleton";
import { fetchJson } from "../api/client";
import useApi from "../api/useApi";
import { formatDate, shorten, shortTitle } from "../utils/text";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const ORIGIN_LABELS = { web: "BookOrbit reader", kobo: "Kobo", koreader: "KOReader" };

const newSeed = () => Math.random().toString(36).slice(2, 10);
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps search terms in <mark>. */
function Highlighted({ text, tokens }) {
  if (!text || !tokens.length) return text || null;
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  // With a capturing group, split() puts the matches at the odd indexes.
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

/** Cover thumbnail that disappears instead of showing a broken image when the book has none. */
function Cover({ src, className = "highlight-cover" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img className={className} src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

function HighlightCard({ highlight, tokens, onOpen }) {
  const { text, book = {}, location, createdAt } = highlight;
  const { short, truncated } = shorten(text);
  const shortDate = formatDate(createdAt, "short");

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="highlight-card"
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={onOpen}
      onKeyDown={onKeyDown}
    >
      <blockquote className="highlight-text">
        <Highlighted text={short} tokens={tokens} />
      </blockquote>

      <footer className="highlight-meta">
        <Cover src={book.coverUrl} />
        <div className="highlight-book">
          <span className="highlight-title" title={book.title || undefined}>
            <Highlighted text={shortTitle(book.title)} tokens={tokens} />
          </span>
          {book.author && (
            <span className="highlight-author">
              <Highlighted text={book.author} tokens={tokens} />
            </span>
          )}
          {(location || shortDate) && (
            <span className="highlight-where">{[location, shortDate].filter(Boolean).join(" · ")}</span>
          )}
        </div>
        <span className="highlight-more" aria-hidden="true">
          {truncated ? "Read more" : "Details"}
        </span>
      </footer>
    </article>
  );
}

/** Full passage + details, as a dialog over the page. */
function HighlightModal({ highlight, tokens, onClose, onFilterBook }) {
  const h = highlight || {};
  const book = h.book || {};
  const longDate = formatDate(h.createdAt, "long");
  const source = h.origin ? ORIGIN_LABELS[h.origin] || h.origin : null;
  const details = [
    ["Where", h.location],
    ["Highlighted", longDate],
    ["Source", source],
  ].filter(([, value]) => value);

  return (
    <Modal
      show={Boolean(highlight)}
      onHide={onClose}
      centered
      size="lg"
      dialogClassName="highlight-modal"
      aria-labelledby="highlight-modal-title"
    >
      {highlight && (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="highlight-modal-title" className="highlight-modal-book">
              <Cover src={book.coverUrl} className="highlight-cover highlight-modal-cover" />
              <div className="highlight-book">
                <span className="highlight-title">{book.title || "Untitled"}</span>
                {book.author && <span className="highlight-author">{book.author}</span>}
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <blockquote className="highlight-text highlight-modal-text">
              <Highlighted text={h.text} tokens={tokens} />
            </blockquote>
            {h.note && (
              <p className="highlight-note">
                <Highlighted text={h.note} tokens={tokens} />
              </p>
            )}
            {details.length > 0 && (
              <dl className="highlight-details">
                {details.map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            )}
          </Modal.Body>

          <Modal.Footer>
            {book.id && (
              <button type="button" className="btn btn-outline-accent" onClick={() => onFilterBook(book.id)}>
                More from this book
              </button>
            )}
            <button type="button" className="btn btn-accent" onClick={onClose}>
              Close
            </button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

function SkeletonCard() {
  return (
    <div className="highlight-card highlight-skeleton" aria-hidden="true">
      <SkeletonLines count={3} />
      <SkeletonBlock />
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
  const [status, setStatus] = useState("loading"); // loading | more | ready | error
  const [error, setError] = useState("");
  const [active, setActive] = useState(null); // highlight shown in the modal
  const requestId = useRef(0);

  // The book filter list; an unavailable library just leaves the dropdown with "All books".
  const booksRequest = useApi("/api/highlights/books");
  const books = useMemo(
    () => (booksRequest.data && Array.isArray(booksRequest.data.books) ? booksRequest.data.books : []),
    [booksRequest.data]
  );

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
        const data = await fetchJson(`/api/highlights?${params}`);
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
    setActive(null);
    fetchPage({ offset: 0, append: false });
  }, [fetchPage]);

  const shuffle = () => setSeed(newSeed());
  const clearFilters = () => updateParams({ q: "", book: "" });
  const filterBook = (id) => {
    setActive(null);
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
        (selectedBook ? ` in ${shortTitle(selectedBook.title)}` : "") +
        (q ? ` matching “${q}”` : "") +
        ".";
  }

  return (
    <section id="highlights" className="highlights-page">
      <Container className="highlights-container">
        <SectionHeader id="highlights-header" text="Highlights" />
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
          <button type="button" className="btn btn-accent" onClick={shuffle} disabled={loading}>
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
            <button type="button" className="link-button" onClick={clearFilters}>
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
            items.map((highlight) => (
              <Col key={highlight.id} md={6} lg={4} className="highlight-col">
                <HighlightCard highlight={highlight} tokens={tokens} onOpen={() => setActive(highlight)} />
              </Col>
            ))}
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
              className="btn btn-outline-accent"
              onClick={() => fetchPage({ offset: items.length, append: true })}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading…" : `Show more (${total - items.length} left)`}
            </button>
          </div>
        )}
      </Container>

      <HighlightModal highlight={active} tokens={tokens} onClose={() => setActive(null)} onFilterBook={filterBook} />
    </section>
  );
}

export default HighlightsPage;
