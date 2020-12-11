import React from 'react';
import './App.css';
import SiteNav from './components/SiteNav'
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactButtons from './components/ContactButtons'
import AboutSection from './components/AboutSection';
import LandingSection from './components/LandingSection'
import ProjectSection from './components/ProjectSection'
import ReactBreakpoints from 'react-breakpoints'
import SkillsSection from './components/SkillsSection'
import Footer from './components/Footer'



function App() {

  const breakpoints = {
    mobile: 320,
    mobileLandscape: 480,
    tablet: 768,
    tabletLandscape: 1024,
    desktop: 1200,
    desktopLarge: 1500,
    desktopWide: 1920,
  }

  return (
    <>
      <div id="app-root">
          <ReactBreakpoints breakpoints={breakpoints}>
            <SiteNav />
            <ContactButtons />
            <LandingSection />
            <AboutSection />
            <SkillsSection />
            <ProjectSection />
            
            <Footer />
          </ReactBreakpoints>
      </div>
    </>

  );
}

export default App;


