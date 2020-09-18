import React from 'react';
import './AboutSection.css';
import Image from 'react-bootstrap/Image'
import ProfileImg from '../img/daniel-profile.jpg'
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import Fade from 'react-reveal/Fade'
function AboutSection() {
    const description = 'Hi! I\'m Daniel Binoy.I\'m a computer science student at the Donald Bren '+
                         'School of Information and  Computer Sciences at University of California, Irvine.'+
                         'At my core, I am a creator. Whether its developing applications, filming and editing'+
                         'videos, or designing art, I\'m always making something.Connect with me to make something great, together!';


    return (
        <section id="about">
            <Container className="h-100 text-center">
                <Fade bottom cascade>
                    <Image className="masthead-profile" src={ProfileImg} roundedCircle />
                    <SectionHeader text="About me" />
                    <p className="description-para">{description}</p>
                </Fade>

            </Container>
        </section>
    );
}

export default AboutSection;
