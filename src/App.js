import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import SiteNav from './components/SiteNav'
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutSection from './components/AboutSection';
import LandingSection from './components/LandingSection'
import ProjectSection from './components/ProjectSection'
function App() {
  return (
    <>
    <SiteNav></SiteNav>
    <Container>
      <LandingSection />
      <AboutSection />
      <ProjectSection />
    </Container>
    </>

  );
}

export default App;
