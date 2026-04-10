import React from "react";
import "./LandingSection.css";
import Particles from "react-particles-js";
import Fade from "react-reveal/Fade";
import { Link } from "react-scroll";
import { toggleNightMode, getTagline } from "../data.js";
function LandingParticles() {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isSmallScreen ? 20 : 50;

  return (
    <>
      <Particles
        params={{
          particles: {
            number: {
              value: particleCount,
            },
            size: {
              value: isSmallScreen ? 2 : 3,
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
                enable: !isSmallScreen,
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
  constructor(props) {
    super(props);
    this.state = { animationPhase: "initial", showMeta: false };
  }

  componentDidMount() {
    this.coOutTimer = setTimeout(() => {
      this.setState({ animationPhase: "co-out" });
    }, 1200);

    this.nameRevealTimer = setTimeout(() => {
      this.setState({ animationPhase: "reveal" });
    }, 1640);

    this.metaRevealTimer = setTimeout(() => {
      this.setState({ showMeta: true });
    }, 2160);
  }

  componentWillUnmount() {
    if (this.coOutTimer) clearTimeout(this.coOutTimer);
    if (this.nameRevealTimer) clearTimeout(this.nameRevealTimer);
    if (this.metaRevealTimer) clearTimeout(this.metaRevealTimer);
  }

  dark = () => {
    toggleNightMode();
    this.forceUpdate();
  };
  render() {
    return (
      <section id="home">
        <LandingParticles />

        <div className="landing-stuff text-center disable-dbl-tap-zoom">
          <div className="landing-title-group">
            <Fade top>
              <h1
                className={`noselect name-header-animated ${this.state.animationPhase}`}
                id="name-header"
                onClick={this.dark}
                title="Click me ;)"
              >
                <span className="name-daniel">Daniel</span>
                <span className="name-binoy">Binoy</span>
                <span className="name-co">.co</span>
              </h1>
            </Fade>

            {this.state.showMeta ? (
              <Fade>
                <h2 className="noselect" id="landing-tagline">
                  {getTagline()}
                </h2>
              </Fade>
            ) : null}
          </div>

          {this.state.showMeta ? (
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
          ) : null}
        </div>
      </section>
    );
  }
}

export default LandingSection;
