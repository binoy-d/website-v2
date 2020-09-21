import React from 'react';
import './SiteNav.css';
import Navbar from 'react-bootstrap/Navbar'
import NavLink from './NavLink';
import Fade from 'react-reveal/Fade'



function SiteNav() {
    return (
        <Fade top>
            <Navbar collapseOnSelect className="justify-content-end site-nav" expand="lg" variant="dark">
                <Navbar.Toggle className="justify-content-end" id="site-nav-toggle" aria-controls="responsive-navbar-nav" >
                    <svg viewBox="0 0 100 80" width="20" height="20">
                        <rect x="0" width="100" height="10" rx="4"></rect>
                        <rect x="0" y="30" width="100" height="10" rx="4"></rect>
                        <rect x="0" y="60" width="100" height="10" rx="4"></rect>
                    </svg>
                </Navbar.Toggle>

                <Navbar.Collapse className="justify-content-end">
                    <NavLink text="About" destination="about"></NavLink>
                    <NavLink text="Skills" destination="skills"></NavLink>
                    <NavLink text="Projects" destination="projects"></NavLink>
                    <Navbar.Text id="resume-btn-id"><a href={process.env.PUBLIC_URL+'/files/resume.pdf'} className="btn btn-outline-light resume-btn">Resume</a></Navbar.Text>
                </Navbar.Collapse>

            </Navbar>
        </Fade>

    );
}

export default SiteNav;
