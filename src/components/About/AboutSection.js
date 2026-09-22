import React from "react";
import "./AboutSection.css";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import SectionHeader from "../SectionHeader";
import SectionLink from "../SectionLink";
import SectionState from "../SectionState";
import { useSection } from "../../content/ContentContext";

function CodeLine({ info }) {
  return Object.entries(info).map(([key, value]) => (
    <div key={`code-line-${key}`}>
      <span className="code-line">
        <span className="code-key">>binoy.{key} </span>
        <span>{Array.isArray(value) ? `[ ${value.join(", ")} ]` : value}</span>
      </span>
      <br />
    </div>
  ));
}

function CodeWindow({ info, email }) {
  return (
    <button
      type="button"
      onClick={() => window.open(`mailto:${email}`)}
      className="code-window-wrapper code-window-button"
      aria-label="Send email to Daniel"
    >
      <div className="code-window-top">
        <p>Click to Contact</p>
        <span className="code-window-dot"> </span>
        <span className="code-window-dot"> </span>
        <span className="code-window-dot"> </span>
      </div>
      <div className="code-window-content">
        <span className="code-command typewriter">>import daniel-binoy as binoy</span>
        <br />
        <CodeLine info={info} />
      </div>
    </button>
  );
}

function AboutSection() {
  const { status, error, reload, data: profile } = useSection("profile");

  return (
    <section id="about">
      <div className="about-stuff">
        <Container className="about-container text-center">
          <SectionState status={status} error={error} onRetry={reload} label="the about section" lines={5}>
            {() => (
              <>
                <Row>
                  <Col>
                    <Image
                      id="about-img"
                      className="masthead-profile"
                      src={profile.image}
                      alt={`${profile.name} profile`}
                      loading="lazy"
                      roundedCircle
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <SectionHeader id="about-header" text="About me" />
                  </Col>
                </Row>
                <Fade bottom>
                  <Row className="about-row">
                    <Col lg={6} md={6} sm={12} className="d-flex justify-content-center">
                      <Container>
                        <Row>
                          <Col>
                            <h2 id="hello">{profile.greeting}</h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p className="about-me-paragraph">{profile.description}</p>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="code-window-col">
                      <CodeWindow info={profile.info} email={profile.email} />
                    </Col>
                  </Row>
                </Fade>
              </>
            )}
          </SectionState>
          <SectionLink destination="experience" text="Experience" />
        </Container>
      </div>
    </section>
  );
}

export default AboutSection;
