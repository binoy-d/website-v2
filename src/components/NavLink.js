import React from 'react';
import './NavLink.css';
import { Link} from 'react-scroll'

function NavLink({text, destination}) {
    return (
        <Link className="nav-link" to={destination} spy={true} smooth={true} duration={500}>{text}</Link>
    );
}


export default NavLink;


