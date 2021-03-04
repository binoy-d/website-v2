import React from 'react';
import './ExperienceSection.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Chrono } from "react-chrono";
import {experience, experience_theme} from "../data.js"


function ExperienceSection() {
    

    return (
    <section id="experience">
        <div class = "experience-timeline-wrapper">
            <Chrono
                items = {experience}
                theme = {experience_theme}
                mode="VERTICAL_ALTERNATING"
                scrollable={{scrollbar: true}}
                hideControls
            >
            </Chrono>
        </div>
    </section>
  );
}

export default ExperienceSection;