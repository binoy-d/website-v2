import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'
import Particles from 'react-particles-js'
import Fade from 'react-reveal/Fade'
import { Media } from 'react-breakpoints'
import { Link } from 'react-scroll'
import {toggleNightMode, getTagline} from './data.js'
function LandingParticles() {
    return (
        <>
        <Particles
            params={{
                "particles": {
                    "number": {
                        "value": 100
                    },
                    "size": {
                        "value": 3
                    },
                    "color": {
                        "value": "#C52233"
                    },

                    "links": {
                        "color": {
                            "value": "#C52233"
                        },
                    },

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
            </>
    );
}






class  LandingSection extends React.Component {
    dark = ()=>{
        toggleNightMode();
        this.forceUpdate();
    }
    render(){
        return (
            <section id="home">
                <Media>
                    {({ breakpoints, currentBreakpoint }) =>
                        breakpoints[currentBreakpoint] > breakpoints.tablet ? (
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
                            <h1 id="landing-name" onClick={this.dark} id="name-header" >Daniel Binoy</h1>
                            <Link className="nav-link" to="about" spy={true} smooth={true} duration={500}>
                                
                            </Link>
                            

                        </Fade>
                        <Fade bottom>
                            <h2 id="landing-tagline">{getTagline()}</h2>
                        </Fade>

                    </Container>
                </header>

            </section>
        );
    }
}

export default LandingSection;
