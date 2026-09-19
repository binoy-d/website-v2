import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import LandingSection from "../components/Landing/LandingSection";
import AboutSection from "../components/About/AboutSection";
import ExperienceSection from "../components/Experience/ExperienceSection";
import SkillsSection from "../components/Skills/SkillsSection";
import ProjectSection from "../components/Projects/ProjectSection";

function HomePage() {
  const { hash } = useLocation();

  // Support links like /#projects (used by the nav when coming from another page).
  useEffect(() => {
    if (!hash) return undefined;
    const target = hash.slice(1);
    const timer = setTimeout(() => {
      scroller.scrollTo(target, { smooth: true, duration: 500 });
    }, 400);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <LandingSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectSection />
    </>
  );
}

export default HomePage;
