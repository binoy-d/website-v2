import React from "react";
import "./AboutSection.css";
import Image from "react-bootstrap/Image"
import ProfileImg from "../img/daniel-profile.jpg"
import Container from "react-bootstrap/Container"
import SectionHeader from "./SectionHeader"
import Fade from "react-reveal/Fade"
import NavLink from "./NavLink"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

function CodeWindow() {
    const sendEmail = () => {
        window.open("mailto:dbinoy15@gmail.com");
    }
    const info = {
        "Name": ["'Daniel'", "'Binoy'"],
        "Location": ["'San Jose CA'", "'Irvine CA'"],
        "Education": ["'University of California Irvine'", "'2022'"],
        "Major": "Computer Science",
        "Hobbies": ["'Coding'", "'Video Editing'", "'Longboarding'", "'Art'"],
        "Status": "Looking for software engineering internships",
        "Email": ["'dbinoy15@gmail.com'", "'dbinoy@uci.edu'"]
    }
    let output = [];
    for (var key in info) {
        output.push(
            <>
                <span className='code-line'>
                    <span className='code-key'>>binoy.{key} </span>
                    <span>
                        {(!Array.isArray(info[key]) ?
                            <span>'{info[key]}'</span> :
                            <span>
                                <span>[ </span>
                                {info[key].join(", ")}
                                <span> ]</span>
                            </span>)}
                    </span>

                </span>
                <br />
            </>
        );
    }

    return (
        <div onClick={sendEmail} className='code-window-wrapper'>
            <div className='code-window-top'>
                <p>click_to_contact.exe</p>
            </div>
            <div className='code-window-content'>
                <span className='code-command typewriter'>>import daniel-binoy as binoy</span>
                <br />
                {output.map((item, index) =>
                    item
                )}
            </div>
        </div>
    );
}







function AboutSection() {
    const description = "I'm a computer science student at " +
        "University of California, Irvine. I love designing and coding beautiful, " +
        "functional applications and interfaces that have a real impact on users. Whether " +
        "its writing code, filming videos, or creating art, I'm always making something. Connect with me " +
        "to make something great, together!";


    return (
        <section id='about'>
            <Container className='h-100 w-100 text-center'>
                <div className='about-stuff'>
                    <Row >
                        <Col>
                            <Fade top>
                                <Image className='masthead-profile' src={ProfileImg} roundedCircle />
                            </Fade>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Fade top>
                                <SectionHeader id="about-header" text='About me' />
                            </Fade>
                        </Col>
                    </Row>
                    <Fade bottom>
                        <Row>

                            <Col lg={6} md={12} className="d-flex justify-content-center">
                                <Container>
                                <Row>
                                    <Col>
                                        <h2 id="hello" >Hi, I'm Daniel!</h2>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className='about-me-paragraph'>{description}</p>
                                    </Col>
                                </Row>
                                </Container>
                            </Col>

                            <Col lg={6} md={12}>
                                <CodeWindow />
                            </Col>
                        </Row>
                    </Fade>
                    <Row>
                        <Col>
                            <Fade bottom big>

                                <div className='skills-btn'>
                                    <NavLink className='btn btn-outline-light skills-btn' destination='skills' text='Skills'></NavLink>
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
