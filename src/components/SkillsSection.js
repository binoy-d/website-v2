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
import { skills } from './data'


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
        <h2 className = "skill-header">
          {title}
        </h2>
      </Row>
      {skillList.map(
        (value, index) =>
          <Row className="justify-content-center">
            <p className = "skill-item">{value}</p>
          </Row>
      )}
    </Col>
  );
}


function SkillsContent() {
  return (
    <div className="fill-width skills-content-wrapper">
      <div className = "skills-title">
        <SectionHeader text="Skills" />
      </div>
      <Container className="fill-width">
      <div className="skills-window">
        <Row>
          
            {skills.map((value, index) =>
              <SkillsList title={value.title} skillList={value.items.slice(0, 10)} />
            )}
          
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