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
    this.groupRef = React.createRef();
    this.danielRef = React.createRef();
    this.binoyRef = React.createRef();
    this.coRef = React.createRef();
  }

  /**
   * The title lays out as "Daniel Binoy.co" the whole time; only opacity/transform change.
   * To keep the *visible* part centered in both states, shift the heading by half the width
   * of whichever span is currently invisible: "Daniel" at first, ".co" after the reveal.
   * offsetLeft/offsetWidth are layout values, so the spans' transforms don't skew them.
   */
  measureTitle = () => {
    const group = this.groupRef.current;
    const daniel = this.danielRef.current;
    const binoy = this.binoyRef.current;
    const co = this.coRef.current;
    if (!group || !daniel || !binoy || !co) return;
    const danielWidth = binoy.offsetLeft - daniel.offsetLeft; // includes Daniel's margin
    const coWidth = co.offsetWidth;
    group.style.setProperty("--shift-initial", `${-danielWidth / 2}px`);
    group.style.setProperty("--shift-reveal", `${coWidth / 2}px`);
  };

  componentDidMount() {
    this.measureTitle();
    window.addEventListener("resize", this.measureTitle);

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
    window.removeEventListener("resize", this.measureTitle);
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
          <div className="landing-title-group" ref={this.groupRef}>
            <h1
              className={`noselect name-header-animated ${this.state.animationPhase}`}
              id="name-header"
              onClick={this.dark}
              title="Click me ;)"
            >
              <span className="name-daniel" ref={this.danielRef}>Daniel</span>
              <span className="name-binoy" ref={this.binoyRef}>Binoy</span>
              <span className="name-co" ref={this.coRef}>.co</span>
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
