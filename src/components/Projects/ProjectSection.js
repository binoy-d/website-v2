import React from "react";
import "./ProjectSection.css";
import Container from "react-bootstrap/Container";
import SectionHeader from "../SectionHeader";
import ProjectCard from "./ProjectCard";
import Row from "react-bootstrap/Row";
import { projects } from "../data.js";

function ProjectSection() {
  return (
    <section id="projects">
      <div className="projects-stuff">
        <SectionHeader text="Projects" />
        <Container>
          <Row>
            {projects.map((proj, index) => (
              <ProjectCard key={proj.title} proj={proj} side={index % 2} />
            ))}
          </Row>
        </Container>
      </div>
    </section>
  );
}

export default ProjectSection;
