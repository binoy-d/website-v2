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
                <Container className ="w-50">
                    <Row>
                        <Col>
                            <h2 className="skill-card-title" onClick={handleShow}>
                                {title}
                            </h2>
                        </Col>
                    </Row>
                    <Row>

                        {shown_languages.map((item, index) =>
                            <Col>
                                <div className="main-skill-item">
                                    <p >{item}</p>
                                </div>
                            </Col>

                        )}
                    </Row>
                    <Row>
                        <Col>
                            <div className="more-btn">
                                <a onClick={handleShow}>More</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>


            <Modal className="skill-modal" show={show} onHide={handleClose}>
                <Modal.Title>
                    <h2>
                        {title}
                    </h2>
                </Modal.Title>
                <Modal.Body>
                    <p className="short-skill-list">
                        <Container >
                            <Row>
                                {items.map((item, index) =>
                                    <Col lg={3} md={4} xs={6}>
                                        <p className="skill-item">
                                            {item}
                                        </p>
                                    </Col>
                                )}

                            </Row>
                        </Container>
                    </p>
                </Modal.Body>
                <Button className="exit-button" onClick={handleClose}>Exit</Button>
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
                'CLIs',
                'MongoDB']
        },
        {
            title: 'Other',
            items: [
                'Linux',
                'Agile',
                'Arduino',
                'Photoshop',
                'Windows',
                'macOS',
                'Premiere Pro',
                'Illustrator',
                'After Effects',
                '3D Printing',
                'Sketchup(CAD)',
                'MS Office',
                'G Suite',
                'Audacity']
        }

    ]
    return (

        <>

            {skills_sections.map((sec, index) =>

                <SkillCard title={sec.title} items={sec.items} />

            )}


        </>
    );


}





function SkillsSection() {
    return (
        
        <section id="skills">
            <div id="about-skills-separator">
        </div>
            <Container className="w-100">
                
                <div className="skills-stuff">
                
                    <Fade top>
                        <SectionHeader text="Skills" />
                    </Fade>


                    <SkillsWrapper />

                    <Fade bottom big>
                        <div className="projects-button">
                            <NavLink className="btn btn-outline-light projects-button" destination="projects" text="Projects"></NavLink>
                        </div>
                    </Fade>
                </div>

            </Container>
        </section>
    );
}

export default SkillsSection;
