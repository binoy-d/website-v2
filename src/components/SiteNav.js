import React from 'react';
import './SiteNav.css';
import Navbar from 'react-bootstrap/Navbar'
import NavLink from './NavLink';
import Fade from 'react-reveal/Fade'



function SiteNav() {
    return (
        <Fade top>
            <Navbar collapseOnSelect expand="lg" className="site-nav" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <NavLink text="About" destination="about"></NavLink>
                    <NavLink text="Skills" destination="skills"></NavLink>
                    <NavLink text="Projects" destination="projects"></NavLink>
                    <Navbar.Text><a href="https://docs.google.com/viewer?url=https://docs.google.com/document/d/16Wg_20VOGJKFWW39OyZLx-RnD5bGEbWOpJPwh8O4wZo/export?format=pdf" className="btn btn-outline-light resume-btn">Resume</a></Navbar.Text>
                </Navbar.Collapse>

            </Navbar>
        </Fade>

    );
}

export default SiteNav;
