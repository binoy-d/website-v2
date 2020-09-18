import React from 'react';
import './SiteNav.css';
import Navbar from 'react-bootstrap/Navbar'
import NavLink from './NavLink';
import Fade from 'react-reveal/Fade'



function SiteNav() {
    return (
        <Fade top>

        
        <Navbar collapseOnSelect expand="lg" className="site-nav" variant="dark">
            <Navbar.Brand href="#home"><NavLink text="Binoy" destination="home"></NavLink></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <NavLink text="About" destination="about"></NavLink>
                <NavLink text="Projects" destination="projects"></NavLink>
                <Navbar.Text><a href="https://binoy.co/files/resume.pdf" className = "btn btn-outline-light">Resume</a></Navbar.Text>
            </Navbar.Collapse>

        </Navbar>
        </Fade>

    );
}

export default SiteNav;
