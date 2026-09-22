import React, { useEffect, useRef, useState } from "react";
import "./SkillsSection.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import SectionHeader from "../SectionHeader";
import SectionLink from "../SectionLink";
import SectionState from "../SectionState";
import { useSection } from "../../content/ContentContext";

/** Parallax-scrolls the tiled icon background as the page scrolls. */
function SkillsIconBackground({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      wrapper.style.setProperty("--x", `${-200 * (height ? scrolled / height : 0)}em`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="skills-wrapper" ref={wrapperRef}>
      <div className="skills-content">{children}</div>
    </div>
  );
}

function SkillGroupCard({ group, onSelect }) {
  return (
    <Col lg={3} xs={6} className="skill-list" onClick={onSelect}>
      <Row className="text-center">
        <Col>
          <div className="skill-count">
            <CountUp end={group.items.length} redraw={true}>
              {({ countUpRef, start }) => (
                <VisibilitySensor onChange={start} delayedCall>
                  <span ref={countUpRef} />
                </VisibilitySensor>
              )}
            </CountUp>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <h2 className="skill-header">{group.title}</h2>
      </Row>
    </Col>
  );
}

function SkillsContent() {
  const { status, error, reload, data } = useSection("skills");
  const [selectedTitle, setSelectedTitle] = useState(null);
  const groups = data ? data.groups : [];
  const selected = groups.find((g) => g.title === selectedTitle) || null;

  return (
    <div className="fill-width skills-content-wrapper">
      <Container className="fill-width">
        <div className="skills-window">
          <Row className="text-center">
            <div className="skills-title">
              <SectionHeader text={selected ? selected.title : "Skills"} />
            </div>
          </Row>
          <SectionState status={status} error={error} onRetry={reload} label="my skills" lines={3}>
            {() =>
              selected ? (
                <Row>
                  {selected.items.map((skill) => (
                    <Col key={skill} xs={6} sm={4} md={3} className="text-center">
                      <div className="skill-item">{skill}</div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Row>
                  {groups.map((group) => (
                    <SkillGroupCard key={group.title} group={group} onSelect={() => setSelectedTitle(group.title)} />
                  ))}
                </Row>
              )
            }
          </SectionState>
          {selected ? (
            <div className="skills-back">
              <button type="button" className="skills-back-button" onClick={() => setSelectedTitle(null)} aria-label="Back to all skill groups">
                <IoArrowBackCircleOutline className="skills-back-arrow" />
              </button>
            </div>
          ) : (
            <SectionLink destination="projects" text="Projects" />
          )}
        </div>
      </Container>
    </div>
  );
}

function SkillsSection() {
  return (
    <section id="skills">
      <SkillsIconBackground>
        <SkillsContent />
      </SkillsIconBackground>
    </section>
  );
}

export default SkillsSection;
