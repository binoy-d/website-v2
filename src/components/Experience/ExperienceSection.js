import React, { useEffect, useRef, useState } from "react";
import "./ExperienceSection.css";
import Fade from "react-reveal/Fade"
import NavLink from "../Nav/NavLink"
import SectionHeader from "../SectionHeader";
import { experience } from "../data.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
      { threshold: 0.2 },
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
        <p className="experience-item-date">{item.title}</p>
        <h3 className="experience-item-company">{item.cardTitle}</h3>
        <p className="experience-item-role">{item.cardSubtitle}</p>
        {item.impact ? <p className="experience-item-impact">{item.impact}</p> : null}
        {item.cardDetailedText.length > 0 ? (
          <div className="experience-item-details">
            <p className="experience-item-details-label">{expanded ? "Hide details" : "See details"}</p>
            {expanded ? (
            <ul className="experience-item-highlights experience-item-highlights-extra">
              {item.cardDetailedText.map((line, index) => (
                <li key={`${item.cardTitle}-${item.cardSubtitle}-extra-${index}`}>{line}</li>
              ))}
            </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}


function ExperienceSection() {
  const featuredExperience = experience.slice(0, FEATURED_COUNT);
  const olderExperience = experience.slice(FEATURED_COUNT);
  const highlights = [
    { metric: "84%", label: "Backend speedup in time-series processing" },
    { metric: "BEACON", label: "Delivered major frontend and UX improvements in production" },
    { metric: "94%", label: "Raised legacy service test coverage from 0% to 94%" },
    { metric: "AI", label: "Designed and rolled out practical AI workflows for engineering teams" },
    { metric: "Agents", label: "Strong operator of AI agents for technical and support workflows" },
    { metric: "Enablement", label: "Frequently staffed to help teams improve delivery with AI" },
    { metric: "Demos", label: "Ran internal presentations and live demos to drive AI adoption" },
    { metric: "Support", label: "Built multiple internal tools that reduced support time and cost" },
    { metric: "Monitoring", label: "Deployed data-integrity monitoring across critical pipelines" },
    { metric: "Scale", label: "Stabilized legacy services and removed recurring failure points" },
    { metric: "Ownership", label: "Drove roadmap-critical fixes with product and customer stakeholders" },
  ];
  const loopingHighlights = [...highlights, ...highlights];

  return (
    <section id="experience">
      <Container className="experience-container">
        <SectionHeader text="Experience" />
        <Fade bottom>
          <div className="experience-highlights-banner" aria-label="Key career highlights">
            <div className="experience-highlights-track">
              {loopingHighlights.map((item, index) => (
                <div className="experience-highlight-card" key={`${item.metric}-${index}`}>
                  <span className="experience-highlight-metric">{item.metric}</span>
                  <span className="experience-highlight-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Fade>
        <Row>
          <Col>
            <Fade bottom>
              <div className="experience-list">
                {featuredExperience.map((item, index) => (
                  <ExperienceItem key={`${item.cardTitle}-${item.cardSubtitle}-${index}`} item={item} index={index} />
                ))}
              </div>
            </Fade>
            {olderExperience.length > 0 ? (
              <Fade bottom>
                <details className="older-experience">
                  <summary>Show earlier experience</summary>
                  <div className="experience-list older-experience-list">
                    {olderExperience.map((item, index) => (
                      <ExperienceItem
                        key={`${item.cardTitle}-${item.cardSubtitle}-older-${index}`}
                        item={item}
                        index={FEATURED_COUNT + index}
                      />
                    ))}
                  </div>
                </details>
              </Fade>
            ) : null}
          </Col>
        </Row>
      </Container>

      <Fade bottom>
        <div className="skills-btn text-center">
          <NavLink
            className="btn btn-outline-light skills-btn"
            destination="skills"
            text="Skills"
          ></NavLink>
        </div>
      </Fade>
    </section>
  );
}

export default ExperienceSection;
