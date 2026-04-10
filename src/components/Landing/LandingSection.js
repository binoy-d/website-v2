import React, { Suspense } from "react";
import "./LandingSection.css";
import { Link } from "react-scroll";
import { toggleNightMode, getTagline } from "../data.js";

const Particles = React.lazy(() => import("react-particles-js"));

function LandingParticles() {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isSmallScreen ? 20 : 50;

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
}

class LandingSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { animationPhase: "initial", showMeta: false, showParticles: false };
  }

  componentDidMount() {
    this.particleTimer = setTimeout(() => {
      this.setState({ showParticles: true });
    }, 350);

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
    if (this.particleTimer) clearTimeout(this.particleTimer);
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
        {this.state.showParticles ? <LandingParticles /> : null}

        <div className="landing-stuff text-center disable-dbl-tap-zoom">
          <div className="landing-title-group">
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

            {this.state.showMeta ? (
              <h2 className="noselect landing-meta landing-meta-visible" id="landing-tagline">
                {getTagline()}
              </h2>
            ) : null}
          </div>

          {this.state.showMeta ? (
            <div className="down-arrow landing-meta landing-meta-visible">
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
          ) : null}
        </div>
      </section>
    );
  }
}

export default LandingSection;
