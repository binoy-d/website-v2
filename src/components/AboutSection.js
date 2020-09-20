import React from 'react';
import './AboutSection.css';
import Image from 'react-bootstrap/Image'
import ProfileImg from '../img/daniel-profile.jpg'
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function CodeWindow({ info }) {
    return (
        <div className="code-window-wrapper">

        </div>
    );
}







function AboutSection() {
    const description = 'Hi! I\'m Daniel! I\'m a computer science student at the Donald Bren ' +
        'School of Information and  Computer Sciences at University of California, Irvine.' +
        ' At my core, I am a creator. Whether its developing applications, filming and editing' +
        ' videos, or designing art, I\'m always making something. Connect with me ' +
        'to make something great, together!';


    return (
        <section id="about">
            <Container className="h-100 w-100 text-center">
                <div className="about-stuff">
                    <Row >
                        <Col>
                        <Fade top>
                            <Image className="masthead-profile" src={ProfileImg} roundedCircle />
                        </Fade>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                        <Fade top>
                            <SectionHeader text="About me" />
                        </Fade>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <p className="about-me-paragraph">{description}</p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <Fade bottom>
                            
                            <div className="skills-btn">
                                <NavLink className="btn btn-outline-light skills-btn" destination="skills" text="Skills"></NavLink>
                            </div>
                        </Fade>
                        </Col>
                    </Row>
                </div>

            </Container>
        </section>
    );
}

export default AboutSection;
