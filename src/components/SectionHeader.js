import React from 'react';
import './SectionHeader.css';
import Fade from 'react-reveal/Fade'

function SectionHeader({ id, text, className = "" }) {
    return (
        <Fade bottom>
            <h1 id={id} className={`noselect section-header ${className}`.trim()}>{text}</h1>
        </Fade>
    );
}

export default SectionHeader;
