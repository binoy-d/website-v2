import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'
import Particles from 'react-particles-js'
import Fade from 'react-reveal/Fade'
import { Media } from 'react-breakpoints'
import { Link } from 'react-scroll'
function LandingParticles() {
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
            <Media>
                {({ breakpoints, currentBreakpoint }) =>
                    breakpoints[currentBreakpoint] > breakpoints.desktop ? (
                        <LandingParticles />
                    ) : (
                            <>
                            </>
                        )
                }
            </Media>



            <header className="landing-stuff text-center">
                <Container>
                    <Fade top>
                        <Link className="nav-link" to="about" spy={true} smooth={true} duration={500}>

                            <h1 id="name-header" >Daniel Binoy</h1>
                        </Link>

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
