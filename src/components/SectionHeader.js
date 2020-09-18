import React from 'react';
import './SectionHeader.css';
import Fade from 'react-reveal/Fade'
function SectionHeader({text}) {
    return (
        <Fade bottom>
            <h1 className = "section-header">{text}</h1>
        </Fade>
    );
}

export default SectionHeader;
