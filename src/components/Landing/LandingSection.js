import React from "react";
import "./LandingSection.css";
import Particles from "react-particles-js";
import Fade from "react-reveal/Fade";
import { Link } from "react-scroll";
import { toggleNightMode, getTagline } from "../data.js";
function LandingParticles() {
  return (
    <>
      <Particles
        params={{
          particles: {
            number: {
              value: 50,
            },
            size: {
              value: 3,
            },
            color: {
              value: "#C52233",
            },

            links: {
              color: {
                value: "#C52233",
              },
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
        }}
      />
    </>
  );
}

class LandingSection extends React.Component {
  dark = () => {
    toggleNightMode();
    this.forceUpdate();
  };
  render() {
    return (
      <section id="home">
        <LandingParticles />

        <div className="landing-stuff text-center disable-dbl-tap-zoom">
          <Fade top>
            <h1 className="noselect" id="name-header" onClick={this.dark}>
              Daniel Binoy
            </h1>
          </Fade>

          <Fade>
            <h2 className="noselect" id="landing-tagline">
              {getTagline()}
            </h2>
          </Fade>

          <Fade bottom>
            <div className="down-arrow">
              <Link
                className="nav-link"
                to="about"
                spy={true}
                smooth={true}
                duration={500}
              >
                <i className="arrow arrow-down bounce"></i>
              </Link>
              
            </div>
          </Fade>
        </div>
      </section>
    );
  }
}

export default LandingSection;
