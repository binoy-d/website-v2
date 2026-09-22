import React, { useState } from "react";
import "./ProjectCard.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Fade from "react-reveal/Fade";
import { Media } from "react-breakpoints";
import SmartLink from "../SmartLink";

function ProjectTags({ languages }) {
  return (
    <div className="project-tags">
      {languages.map((lang) => (
        <Badge key={lang} className="proj-tag" variant="info">
          {lang}
        </Badge>
      ))}
    </div>
  );
}

/** Bullet points + tags, shared by both card layouts. */
function ProjectBullets({ proj }) {
  return (
    <ul className="project-bullets">
      {proj.description.map((line, index) => (
        <li key={index} className="project-description-text">
          {line}
        </li>
      ))}
      <li>
        <ProjectTags languages={proj.languages} />
      </li>
    </ul>
  );
}

/** Long description, links and screenshot as a dialog. */
function ProjectModal({ proj, show, onClose }) {
  return (
    <Modal className="project-modal" show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{proj.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="project-modal-description">{proj.longDescription}</p>
        <div className="project-modal-actions">
          <Button as={SmartLink} href={proj.link} variant="outline-accent">
            View Project
          </Button>
          {proj.codeLink && proj.codeLink !== proj.link ? (
            <Button as={SmartLink} href={proj.codeLink} variant="outline-accent">
              View Code
            </Button>
          ) : null}
        </div>
        <ProjectTags languages={proj.languages} />
        <Image className="project-modal-image" src={proj.image} alt={`${proj.title} preview`} />
      </Modal.Body>
    </Modal>
  );
}

/** Screenshot button that opens the project's dialog. */
function ProjectImage({ proj }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        type="button"
        className="project-image-button"
        onClick={() => setShow(true)}
        aria-haspopup="dialog"
        aria-label={`Open details for ${proj.title}`}
      >
        <Image className="project-image" src={proj.image} alt={`${proj.title} preview`} loading="lazy" />
      </button>
      <ProjectModal proj={proj} show={show} onClose={() => setShow(false)} />
    </>
  );
}

/** Two-column layout for featured projects on wide screens; `reverse` puts the image first. */
function FeaturedProjectCard({ proj, reverse }) {
  return (
    <Fade left={!reverse} right={reverse}>
      <Row className={reverse ? "flex-row-reverse" : ""}>
        <Col className="description-col">
          <div className="project-description">
            <h2 className="proj-title">{proj.title}</h2>
            <ProjectBullets proj={proj} />
          </div>
        </Col>
        <Col className="text-center">
          <ProjectImage proj={proj} />
        </Col>
      </Row>
    </Fade>
  );
}

function CompactProjectCard({ proj }) {
  return (
    <Fade bottom>
      <div className="project-card-compact">
        <h2 className="proj-title-compact">{proj.title}</h2>
        <ProjectImage proj={proj} />
        <div className="project-description-compact">
          <ProjectBullets proj={proj} />
        </div>
      </div>
    </Fade>
  );
}

const compactCard = (proj) => (
  <Col className="project-card-col" xl={4} lg={6} md={6} sm={6}>
    <CompactProjectCard proj={proj} />
  </Col>
);

function ProjectCard({ proj, side }) {
  if (!proj.featured) return compactCard(proj);
  return (
    <Media>
      {({ breakpoints, currentBreakpoint }) =>
        breakpoints[currentBreakpoint] > breakpoints.tabletLandscape ? (
          <Col className="project-card-col" xs={12}>
            <FeaturedProjectCard proj={proj} reverse={side === 1} />
          </Col>
        ) : (
          compactCard(proj)
        )
      }
    </Media>
  );
}

export default ProjectCard;
