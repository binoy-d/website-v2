import React from 'react'
import './LandingSection.css';
import Container from 'react-bootstrap/Container'
import Particles from 'react-particles-js'
import Fade from 'react-reveal/Fade'
import { Media } from 'react-breakpoints'
import { Link } from 'react-scroll'
import { toggleNightMode, getTagline } from '../data.js'
function LandingParticles() {
    return (
        <>
            <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 50
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






class LandingSection extends React.Component {
    dark = () => {
        toggleNightMode();
        this.forceUpdate();
    }
    render() {
        return (
            <section id="home">
                            <LandingParticles />
                        




                <div className="landing-stuff text-center disable-dbl-tap-zoom">

                    <Fade top>
                        <h1 className = "noselect" id="landing-name" onClick={this.dark} id="name-header" >Daniel Binoy</h1>
                        <Link className="nav-link" to="about" spy={true} smooth={true} duration={500} />
                    </Fade>

                    <Fade bottom>
                        <h2 className = "noselect" id="landing-tagline">{getTagline()}</h2>
                    </Fade>

                </div>

            </section>
        );
    }
}

export default LandingSection;
