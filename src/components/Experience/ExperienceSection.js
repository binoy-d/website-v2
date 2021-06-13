import React from "react";
import "./ExperienceSection.css";
import Fade from "react-reveal/Fade"
import NavLink from "../Nav/NavLink"
import { Chrono } from "react-chrono";
import SectionHeader from "../SectionHeader";
import { experience, experience_theme } from "../data.js";
import { Media } from 'react-breakpoints'

function ExperienceTimelineMobile(){
    return (
        <div className="experience-timeline-wrapper-mobile">
        <Chrono
          items={experience}
          theme={experience_theme}
          mode="VERTICAL"
          hideControls
        ></Chrono>
      </div>
    );
}

function ExperienceTimelineDesktop(){
    return (
        <div className="experience-timeline-wrapper">
        <Chrono
          items={experience}
          theme={experience_theme}
          mode="VERTICAL_ALTERNATING"
          scrollable={{ scrollbar: true }}
          hideControls
        ></Chrono>
      </div>
    );
}


function ExperienceSection() {
  return (
    <section id="experience">
      <SectionHeader text="Experience" />
        <Media>
            {
                ({breakpoints, currentBreakpoint}) =>
                breakpoints[currentBreakpoint] < breakpoints.tabletLandscape?
                (
                    <ExperienceTimelineMobile />
                ):
                (
                    <ExperienceTimelineDesktop />
                )
            }
        </Media>
      
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
