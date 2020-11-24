import React from "react";
import "./AboutSection.css";
import Image from "react-bootstrap/Image"
import ProfileImg from "../img/daniel-profile.jpg"
import ProfileImgAlt1 from "../img/daniel-profile-alt-1.png"
import Container from "react-bootstrap/Container"
import SectionHeader from "./SectionHeader"
import Fade from "react-reveal/Fade"
import NavLink from "./NavLink"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import {info, description} from './data.js'
function CodeWindow() {
    const sendEmail = () => {
        window.open("mailto:dbinoy15@gmail.com");
    }
    
    let output = [];
    for (var key in info) {
        output.push(
            <>
                <span className='code-line'>
                    <span className='code-key'>>binoy.{key} </span>
                    <span>
                        {(!Array.isArray(info[key]) ?
                            <span>{info[key]}</span> :
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

class ProfileImage extends React.Component {
    constructor() {
        super();
        this.src = ProfileImg;
        this.state = { alt: false };
    }
    handleHoverOn() {
        //this.setState({ alt: true });
        console.log("enter");
    }

    handleHoverOff() {
        this.setState({ alt: false });
        console.log("exit");
    }

    render() {
        return (
            <Image
                id="about-img"
                className='masthead-profile'
                src={ ProfileImg}
                roundedCircle />
        );
    }
}






function AboutSection() {
    return (
        <section id='about'>
            <Container className='h-100 w-100 text-center'>
                <div className='about-stuff'>
                    <Row >
                        <Col>
                            
                                <ProfileImage  />
                            
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
