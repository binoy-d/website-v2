import React from 'react';
import './NavBar.css';
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'




function NavBar() {
    return ( 
        <Fade top>
            <div className = "navbar-collapse">
                <div className = "navbar-large">
                    <div className = "nav-large-item"><NavLink text="About" destination="about" /></div>
                    <div className = "nav-large-item"><NavLink text="Skills" destination="skills" /></div>
                    <div className = "nav-large-item"><NavLink text="Projects" destination="projects" /></div>
                </div>
            </div>
        </Fade>

    );
}

export default NavBar;
