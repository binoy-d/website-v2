import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'

import Fade from 'react-reveal/Fade'
function LandingSection() {
    return (
        <section id="home">
            <header className="text-center">
                <Container>
                    <Fade bottom>
                        <h1 id = "name-header" >Daniel Binoy</h1>
                        <h2 id="landing-tagline">Student developer</h2>
                    </Fade>
                    
                </Container>
            </header>

        </section>
    );
}

export default LandingSection;
