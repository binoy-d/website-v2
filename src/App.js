import React from 'react';
import './App.css';
import SiteNav from './components/SiteNav'
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutSection from './components/AboutSection';
import LandingSection from './components/LandingSection'
import ProjectSection from './components/ProjectSection'
function App() {
  return (
    <>
    <SiteNav></SiteNav>
      <LandingSection />
      <AboutSection />
      <ProjectSection />
    </>

  );
}

export default App;
