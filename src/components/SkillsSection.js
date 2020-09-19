import React from 'react';
import './SkillsSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'


function SkillsTable() {
    const main_langs = [
        'Python',
        'C++',
        'Java',
        'React',
    ]
    const other_skills = [
        'JavaScript',
        'NodeJS',
        'Processing',
        'p5.js',
        'Bootstrap',
        'Selenium',
        'Git/Github',
        'MongoDB',
        'GTest',
        'Linux',
        'Unix',
        'Arduino',
        'Express',
        'Photoshop',
        'Premiere Pro',
        'Unity3D'
    ];
    return (
        <Container>
            <div className="main-skill-wrapper">
                <Row>

                    {main_langs.map((skill, index) =>
                        <Col lg={3} sm={4} xs={6}>
                            <div className="main-skill">{skill}</div>
                        </Col>
                    )}

                </Row>
            </div>

            <Row>
                {other_skills.map((skill, index) =>
                    <Col lg={3} sm={4} xs={6}>
                        <div className="other-skill">{skill}</div>
                    </Col>
                )}
            </Row>
        </Container>
    );


}





function SkillsSection() {
    return (
        <section id="skills">
            <Container className="text-center">
                <div className="skills-stuff">
                    <Fade top>
                        <SectionHeader text="Skills" />
                    </Fade>
                    <Fade bottom>
                        <SkillsTable />
                        <div className="btn btn-outline-light projects-button">
                            <NavLink destination="projects" text="Projects"></NavLink>
                        </div>
                    </Fade>
                </div>

            </Container>
        </section>
    );
}

export default SkillsSection;
