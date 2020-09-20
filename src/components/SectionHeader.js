import React from 'react';
import './SectionHeader.css';
import Fade from 'react-reveal/Fade'
function SectionHeader({id="dw-bout-it",text}) {
    return (
        <Fade bottom>
            <h1 id={id} className = "section-header">{text}</h1>
        </Fade>
    );
}

export default SectionHeader;
