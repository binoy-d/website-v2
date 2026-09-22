import React from "react";
import "./ProjectSection.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SectionHeader from "../SectionHeader";
import SectionState from "../SectionState";
import ProjectCard from "./ProjectCard";
import { useSection } from "../../content/ContentContext";

function ProjectSection() {
  const { status, error, reload, data } = useSection("projects");

  return (
    <section id="projects">
      <div className="projects-stuff">
        <SectionHeader text="Projects" />
        <Container>
          <SectionState status={status} error={error} onRetry={reload} label="my projects" lines={6}>
            {() => (
              <Row>
                {data.items.map((proj, index) => (
                  <ProjectCard key={proj.id} proj={proj} side={index % 2} />
                ))}
              </Row>
            )}
          </SectionState>
        </Container>
      </div>
    </section>
  );
}

export default ProjectSection;
