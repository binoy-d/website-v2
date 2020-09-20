import React from 'react';
import './SkillsSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'


function SkillsTable() {

    const skills_sections = [
        {
            title: 'Languages',
            items:[ 'Python',
                    'C++',
                    'Java',
                    'Javascript',
                    'Processing',
                    'C#']
        },
        {
            title: 'Libraries/Frameworks',
            items:[ 'ReactJS',
                    'Bootstrap',
                    'Selenium',
                    'NodeJS',
                    'jQuery',
                    'p5.js',
                    'GTest',
                    'Express.js',
                    'SemanticUI']
        },
        {
            title: 'Tools',
            items:[ 'Git/Github',
                    'NPM',
                    'Selenium',
                    'NodeJS',
                    'p5.js',
                    'Heroku',
                    'VirtualBox',
                    'VMWare Workstation',
                    'Express.js',
                    'ffmpeg',
                    'Github',
                    'MongoDB']
        },
        {
            title: 'Operating Systems',
            items:[ 'Linux',
                    'Windows',
                    'macOS',
                    'Unix']
        },
        {
            title: 'Other',
            items:[ 'Agile',
                    'Photoshop',
                    'Premiere Pro',
                    'Illustrator',
                    'After Effects',
                    'Javascript',
                    '3D Printing',
                    'Sketchup(CAD)',
                    'Arduino',
                    
                    'After Effects',
                    'Javascript',
                    'Processing']
        }

    ]
    return (
        <Container>
            
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
                        <SkillsTable />
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
