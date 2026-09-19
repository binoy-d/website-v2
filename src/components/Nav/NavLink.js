import React from 'react';
import './NavLink.css';
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink, useLocation } from 'react-router-dom'

/**
 * Nav link that either scrolls to a section on the home page (`destination`)
 * or navigates to another route (`to`). Section links still work from other
 * routes: they navigate to /#section and HomePage scrolls there on arrival.
 */
function NavLink({text, destination, to}) {
    const location = useLocation();

    if (to) {
        return <RouterLink className="nav-link" to={to}>{text}</RouterLink>;
    }
    if (location.pathname !== '/') {
        return <RouterLink className="nav-link" to={`/#${destination}`}>{text}</RouterLink>;
    }
    return (
        <ScrollLink className="nav-link" to={destination} spy={true} smooth={true} duration={500}>{text}</ScrollLink>
    );
}


export default NavLink;
