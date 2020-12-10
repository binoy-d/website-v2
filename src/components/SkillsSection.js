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
    render() {
      return (
        <div>
            
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