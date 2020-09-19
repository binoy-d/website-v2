import React from 'react';
import './AboutSection.css';
import Image from 'react-bootstrap/Image'
import ProfileImg from '../img/daniel-profile.jpg'
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'

function AboutSection() {
    const description = 'Hi! I\'m Daniel! I\'m a computer science student at the Donald Bren ' +
        'School of Information and  Computer Sciences at University of California, Irvine.' +
        ' At my core, I am a creator. Whether its developing applications, filming and editing' +
        ' videos, or designing art, I\'m always making something. Connect with me ' +
        'to make something great, together!';


    return (
        <section id="about">
            <Container className="h-100 text-center">

                <div className = "about-stuff">
                    <Fade top>
                        <Image className="masthead-profile" src={ProfileImg} roundedCircle />
                        <SectionHeader text="About me" />

                    </Fade>
                    <Fade bottom>
                        <p className="description-para">{description}</p>
                        <div className="btn btn-outline-light projects-button">
                            <NavLink destination="projects" text="Projects"></NavLink>
                        </div>
                    </Fade>
                </div>

            </Container>
        </section>
    );
}

export default AboutSection;
