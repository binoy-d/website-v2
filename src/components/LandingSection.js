import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'
import Particles from 'react-particles-js'
import Fade from 'react-reveal/Fade'


function LandingParticles(){
    return (
        <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 100
                        },
                        "size": {
                            "value": 3
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "repulse"
                            }
                        }
                    }
                }} />
    );
}



function LandingSection() {
    return (
        <section id="home">
            <LandingParticles />
            

            <header className="landing-stuff text-center">
                <Container>
                    <Fade top>
                        <h1 id="name-header" >Daniel Binoy</h1>
                    </Fade>
                    <Fade bottom>
                        <h2 id="landing-tagline">Student developer</h2>
                    </Fade>

                </Container>
            </header>

        </section>
    );
}

export default LandingSection;
