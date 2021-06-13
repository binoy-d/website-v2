import React from "react";
import "./AboutSection.css";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import SectionHeader from "../SectionHeader";
import Fade from "react-reveal/Fade";
import NavLink from "../Nav/NavLink";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { info, description, profile } from "../data.js";

function CodeLine({info}) {
  return (
    <>
      {Object.keys(info).map((key, index) => (
        <div key={"code-line-"+key}>
          <span className="code-line">
            <span className="code-key">>binoy.{key} </span>
            <span>
              {!Array.isArray(info[key]) ? (
                <span>{info[key]}</span>
              ) : (
                <span>
                  <span>[ </span>
                  {info[key].join(", ")}
                  <span> ]</span>
                </span>
              )}
            </span>
          </span>
          <br />
        </div>
      ))}
    </>
  );
}

function CodeWindow() {
  const sendEmail = () => {
    window.open("mailto:dbinoy15@gmail.com");
  };
  return (
    <div onClick={sendEmail} className="code-window-wrapper">
      <div className="code-window-top">
        <p>click_to_contact.exe</p>
        <span className = "code-window-dot">  </span>
        <span className = "code-window-dot">  </span>
        <span className = "code-window-dot">  </span>
      </div>
      <div className="code-window-content">
        <span className="code-command typewriter">
          >import daniel-binoy as binoy
        </span>
        <br />
        <CodeLine info={info}/>
      </div>
    </div>
  );
}

class ProfileImage extends React.Component {
  constructor() {
    super();
    this.src = profile;
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
        className="masthead-profile"
        src={this.src}
        roundedCircle
      />
    );
  }
}

function AboutSection() {
  return (
    <section id="about">
      <div className="about-stuff">
        <Container className="about-container text-center">
          <Row>
            <Col>
              <ProfileImage />
            </Col>
          </Row>
          <Row>
            <Col>
              <Fade top>
                <SectionHeader
                  id="about-header"
                  className="color-text"
                  text="About me"
                />
              </Fade>
            </Col>
          </Row>
          <Fade bottom>
            <Row className="about-row">
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex justify-content-center"
              >
                <Container>
                  <Row>
                    <Col>
                      <h2 id="hello">Hi, I'm Daniel!</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className="about-me-paragraph">{description}</p>
                    </Col>
                  </Row>
                </Container>
              </Col>

              <Col lg={6} md={6} sm={12} className="code-window-col">
                <CodeWindow />
              </Col>
            </Row>
          </Fade>
          <Row>
            <Col>
              <Fade bottom big>
                <div className="skills-btn experience-btn">
                  <NavLink
                    className="btn btn-outline-light"
                    destination="experience"
                    text="Experience"
                  ></NavLink>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}

export default AboutSection;
