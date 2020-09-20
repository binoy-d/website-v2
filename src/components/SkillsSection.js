import React, { useState } from 'react';
import './SkillsSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function SkillCard({ title, items }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let shown_languages = []
    for (let index = 0; index < 4; index++) {
        shown_languages.push(items[index]);
    }

    return (

        <>
            <div className='skill-card'>
                <h2 className="skill-card-title" onClick={handleShow}>
                    {title}
                </h2>
                <p className="short-skill-list">
                    {shown_languages.map((item, index) =>
                        <span className="main-skill-item">{item}</span>
                    )}
                </p>
            </div>
            <Modal className = "skill-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This is a test
                </Modal.Body>
                <Modal.Footer>
                
                </Modal.Footer>
            </Modal>
        </>
    );
}


function SkillsWrapper() {
    const skills_sections = [
        {
            title: 'Languages',
            items: [
                'Python',
                'C++',
                'Java',
                'Javascript',
                'Processing',
                'C#',
                'p5.js',]
        },
        {
            title: 'Frameworks',
            items: [
                'ReactJS',
                'Bootstrap',
                'NodeJS',
                'jQuery',
                'p5.js',
                'GTest',
                'Beautiful Soup',
                'Express.js',
                'SemanticUI']
        },
        {
            title: 'Tools',
            items: [
                'Git/Github',
                'Selenium',
                'Heroku',
                'NPM',
                'VirtualBox',
                'VMWare Workstation',
                'Express.js',
                'ffmpeg',
                'Github',
                'MongoDB']
        },
        {
            title: 'Other',
            items: [
                'Linux',
                'Agile',
                'Windows',
                'macOS',
                'Photoshop',
                'Premiere Pro',
                'Illustrator',
                'After Effects',
                'Javascript',
                '3D Printing',
                'Sketchup(CAD)',
                'Arduino',
                'MS Office',
                'G Suite',
                'Audacity']
        }

    ]
    return (

        <Container>
            <Row>
                {skills_sections.map((sec, index) =>
                    <Col lg={12}>
                        <SkillCard title={sec.title} items={sec.items} />
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
                        <SkillsWrapper />
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
