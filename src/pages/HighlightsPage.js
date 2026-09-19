import React, { useCallback, useEffect, useState } from "react";
import "./HighlightsPage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import SectionHeader from "../components/SectionHeader";

const COUNT = 6;

/** Cover thumbnail that disappears instead of showing a broken image when the book has none. */
function Cover({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      className="highlight-cover"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function HighlightCard({ highlight }) {
  const { text, note, book = {}, location, createdAt } = highlight;
  const when = createdAt ? new Date(createdAt) : null;
  const dateLabel =
    when && !Number.isNaN(when.getTime())
      ? when.toLocaleDateString(undefined, { year: "numeric", month: "short" })
      : null;

  return (
    <article className="highlight-card">
      <blockquote className="highlight-text">{text}</blockquote>
      {note && <p className="highlight-note">{note}</p>}
      <footer className="highlight-meta">
        <Cover src={book.coverUrl} />
        <div className="highlight-book">
          <span className="highlight-title">{book.title || "Untitled"}</span>
          {book.author && <span className="highlight-author">{book.author}</span>}
          {(location || dateLabel) && (
            <span className="highlight-where">
              {[location, dateLabel].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      </footer>
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
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch(`/api/highlights/random?count=${COUNT}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't load highlights right now.");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [load]);

  const loading = status === "loading";

  return (
    <section id="highlights" className="highlights-page">
      <Container className="highlights-container">
        <Fade top>
          <SectionHeader id="highlights-header" text="Highlights" />
        </Fade>
        <p className="highlights-intro">
          A few random passages I've highlighted while reading, pulled live from my BookOrbit library.
          Hit shuffle for a fresh set.
        </p>
        <div className="highlights-actions">
          <button type="button" className="btn highlights-shuffle" onClick={load} disabled={loading}>
            {loading ? "Shuffling…" : "Shuffle"}
          </button>
        </div>

        {status === "error" && (
          <p className="highlights-message" role="alert">
            {error}
          </p>
        )}

        <Row className="highlights-grid">
          {loading &&
            Array.from({ length: COUNT }, (_, i) => (
              <Col key={`skeleton-${i}`} md={6} lg={4} className="highlight-col">
                <SkeletonCard />
              </Col>
            ))}
          {!loading &&
            highlights.map((highlight, index) => (
              <Col key={highlight.id ?? index} md={6} lg={4} className="highlight-col">
                <HighlightCard highlight={highlight} />
              </Col>
            ))}
        </Row>

        {status === "ready" && highlights.length === 0 && (
          <p className="highlights-message">No highlights yet. Check back after I've done some reading.</p>
        )}
      </Container>
    </section>
  );
}

export default HighlightsPage;
