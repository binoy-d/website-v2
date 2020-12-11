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
import {skills} from './data'


class SkillsIconBackground extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { x: 0, y: 0 };
      }
    
      _onMouseMove(e) {
        this.setState({ x: e.screenX, y: e.screenY });
        console.log(this.state.x);
        document.getElementById("skills-pattern-wrapper").style.setProperty("--x", -this.state.x+"px");
        document.getElementById("skills-pattern-wrapper").style.setProperty("--y", -this.state.y+"px")
      }

    render() {
        const { x, y } = this.state;
      return (
        <div onMouseMove={this._onMouseMove.bind(this)} id = "skills-pattern-wrapper">

        </div>
      );
    }
  }


function SkillsSection() {
    return (
        <section id="skills">
            <SkillsIconBackground />
            <Container className="">    
                <div className="skills-stuff">
                    <Fade top>
                        <SectionHeader text="Skills" />
                    </Fade>                
                </div>
            </Container>
        </section>
    );
}

export default SkillsSection;