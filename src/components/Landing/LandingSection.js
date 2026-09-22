import React, { Suspense } from "react";
import "./LandingSection.css";
import { Link } from "react-scroll";
import { toggleTheme } from "../../theme";
import { useSection } from "../../content/ContentContext";

const Particles = React.lazy(() => import("react-particles-js"));
const DEFAULT_TAGLINES = ["software engineer"];

function LandingParticles() {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isSmallScreen ? 20 : 50;

  return (
    <Suspense fallback={null}>
      <Particles
        params={{
          particles: {
            number: { value: particleCount },
            size: { value: isSmallScreen ? 2 : 3 },
            color: { value: "#C52233" },
            links: { color: { value: "#C52233" } },
          },
          interactivity: {
            events: {
              onhover: { enable: !isSmallScreen, mode: "repulse" },
            },
          },
        }}
      />
    </Suspense>
  );
}

/** Animated "Daniel Binoy.co" title; clicking it flips the theme and cycles the tagline. */
class LandingHero extends React.Component {
  constructor(props) {
    super(props);
    this.state = { animationPhase: "initial", showMeta: false, showParticles: false, taglineIndex: 0 };
    this.groupRef = React.createRef();
    this.danielRef = React.createRef();
    this.binoyRef = React.createRef();
    this.coRef = React.createRef();
    this.timers = [];
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

    const schedule = (ms, patch) => this.timers.push(setTimeout(() => this.setState(patch), ms));
    schedule(350, { showParticles: true });
    schedule(1200, { animationPhase: "co-out" });
    schedule(1640, { animationPhase: "reveal" });
    schedule(2160, { showMeta: true });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.measureTitle);
    this.timers.forEach(clearTimeout);
  }

  onTitleClick = () => {
    toggleTheme();
    this.setState((prev) => ({ taglineIndex: prev.taglineIndex + 1 }));
  };

  render() {
    const { taglines } = this.props;
    const { animationPhase, showMeta, showParticles, taglineIndex } = this.state;
    const tagline = taglines[taglineIndex % taglines.length];

    return (
      <section id="home">
        {showParticles ? <LandingParticles /> : null}

        <div className="landing-stuff text-center disable-dbl-tap-zoom">
          <div className="landing-title-group" ref={this.groupRef}>
            <h1
              className={`noselect name-header-animated ${animationPhase}`}
              id="name-header"
              onClick={this.onTitleClick}
              title="Click me ;)"
            >
              <span className="name-daniel" ref={this.danielRef}>Daniel</span>
              <span className="name-binoy" ref={this.binoyRef}>Binoy</span>
              <span className="name-co" ref={this.coRef}>.co</span>
            </h1>

            {showMeta ? (
              <h2 className="noselect landing-meta landing-meta-visible" id="landing-tagline">
                {tagline}
              </h2>
            ) : null}
          </div>

          {showMeta ? (
            <div className="down-arrow landing-meta landing-meta-visible">
              <Link className="nav-link" to="about" spy={true} smooth={true} duration={500}>
                <i className="arrow arrow-down bounce"></i>
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
}

function LandingSection() {
  const { data: profile } = useSection("profile");
  const taglines = profile && profile.taglines && profile.taglines.length ? profile.taglines : DEFAULT_TAGLINES;
  return <LandingHero taglines={taglines} />;
}

export default LandingSection;
