import React, { useState } from 'react';
import './SkillsSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from '../SectionHeader'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { skills } from '../data'
import Fade from 'react-reveal'
import NavLink from '../Nav/NavLink'
class SkillsIconBackground extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
    document.getElementById("skills-wrapper").style.setProperty("--x", -this.state.x + "px");
    document.getElementById("skills-wrapper").style.setProperty("--y", -this.state.y + "px")
  }

  render() {
    return (
      <div id="skills-wrapper" onMouseMove={this._onMouseMove.bind(this)}  >
        <div className="skills-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}


function SkillsList({ title, icon, skillList }) {
  return (
    <Col lg={3} className="skill-list">
      <Row className="justify-content-center">
        <h2 className="skill-header">
          {title}
        </h2>
      </Row>
      {skillList.map(
        (value, index) =>
          <Row className="justify-content-center">
            <p className="skill-item">{value}</p>
          </Row>
      )}
    </Col>
  );
}


function SkillsContent() {
  return (
    <div className="fill-width skills-content-wrapper">

      <Container className="fill-width">
        <div className="skills-window">
          <Row className = "text-center">
            <div className="skills-title">
              <SectionHeader text="Skills" />
            </div>
          </Row>
          <Row>

            {skills.map((value, index) =>
              <SkillsList title={value.title} skillList={value.items.slice(0, 10)} />
            )}

          </Row>
          <Row>
            <Fade bottom big>
              <div className='projects-btn'>
                <NavLink className='btn btn-outline-light skills-btn' destination='projects' text='Projects'></NavLink>
              </div>
            </Fade>
          </Row>
        </div>

      </Container>

    </div>
  );
}


function SkillsSection() {
  return (
    <section id="skills">

      <SkillsIconBackground>
        <SkillsContent />
      </SkillsIconBackground>

    </section>
  );
}

export default SkillsSection;