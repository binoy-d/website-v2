import React from 'react';
import './SectionHeader.css';
function SectionHeader({text}) {
    return (
        <h1 className = "section-header">{text}</h1>
    );
}

export default SectionHeader;
