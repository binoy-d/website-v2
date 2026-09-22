import React, { useEffect, useRef, useState } from "react";
import "./ExperienceSection.css";
import Fade from "react-reveal/Fade";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SectionHeader from "../SectionHeader";
import SectionLink from "../SectionLink";
import SectionState from "../SectionState";
import { useSection } from "../../content/ContentContext";

const FEATURED_COUNT = 4;

function ExperienceItem({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    if (!itemRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleExpanded = () => setExpanded((prev) => !prev);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <article
      ref={itemRef}
      className={`experience-item ${visible ? "is-visible" : ""}`}
      style={{ "--experience-delay": `${index * 45}ms` }}
    >
      <div className="experience-item-timeline">
        <span className="experience-item-dot" aria-hidden="true" />
      </div>
      <div
        className="experience-item-card"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
      >
        <p className="experience-item-date">{item.period}</p>
        <h3 className="experience-item-company">{item.company}</h3>
        <p className="experience-item-role">{item.role}</p>
        {item.impact ? <p className="experience-item-impact">{item.impact}</p> : null}
        {item.details.length > 0 ? (
          <div className="experience-item-details">
            <p className="experience-item-details-label">{expanded ? "Hide details" : "See details"}</p>
            {expanded ? (
              <ul className="experience-item-highlights experience-item-highlights-extra">
                {item.details.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** Auto-scrolling strip of career highlights; the list is doubled so the loop is seamless. */
function CareerHighlights({ items }) {
  if (!items.length) return null;
  return (
    <Fade bottom>
      <div className="experience-highlights-banner" aria-label="Key career highlights">
        <div className="experience-highlights-track">
          {[...items, ...items].map((item, index) => (
            <div className="experience-highlight-card" key={`${item.metric}-${index}`}>
              <span className="experience-highlight-metric">{item.metric}</span>
              <span className="experience-highlight-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Fade>
  );
}

function ExperienceList({ items, offset = 0, className = "" }) {
  return (
    <div className={`experience-list ${className}`.trim()}>
      {items.map((item, index) => (
        <ExperienceItem key={`${item.company}-${item.role}-${item.period}`} item={item} index={offset + index} />
      ))}
    </div>
  );
}

function ExperienceSection() {
  const { status, error, reload, data } = useSection("experience");

  return (
    <section id="experience">
      <Container className="experience-container">
        <SectionHeader text="Experience" />
        <SectionState status={status} error={error} onRetry={reload} label="my experience" lines={6}>
          {() => {
            const featured = data.items.slice(0, FEATURED_COUNT);
            const older = data.items.slice(FEATURED_COUNT);
            return (
              <>
                <CareerHighlights items={data.careerHighlights} />
                <Row>
                  <Col>
                    <Fade bottom>
                      <ExperienceList items={featured} />
                    </Fade>
                    {older.length > 0 ? (
                      <Fade bottom>
                        <details className="older-experience">
                          <summary>Show earlier experience</summary>
                          <ExperienceList items={older} offset={FEATURED_COUNT} className="older-experience-list" />
                        </details>
                      </Fade>
                    ) : null}
                  </Col>
                </Row>
              </>
            );
          }}
        </SectionState>
      </Container>
      <SectionLink destination="skills" text="Skills" />
    </section>
  );
}

export default ExperienceSection;
