import React from 'react';
import './AboutSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
function AboutSection() {
    return (
        <section id ="about">
            <Container className = "h-100">
                <SectionHeader  text="About me"/>
            </Container>
        </section>
    );
}

export default AboutSection;
