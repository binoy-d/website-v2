import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import ProfileImg from '../img/daniel-profile.jpg'
function LandingSection() {
    return (
        <section id="home">
            <header className="text-center">
                <Container>
                    <Image className = "masthead-profile" src={ProfileImg} roundedCircle/>
                    <h1 id = "name-header" >Daniel Binoy</h1>
                </Container>
            </header>

        </section>
    );
}

export default LandingSection;
