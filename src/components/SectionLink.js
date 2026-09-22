import React from "react";
import "./SectionLink.css";
import Fade from "react-reveal/Fade";
import NavLink from "./Nav/NavLink";

/**
 * The "next section" button at the bottom of a home page section (Experience, Skills,
 * Projects). One component, one size at every breakpoint.
 */
export default function SectionLink({ text, destination, to }) {
  return (
    <Fade bottom>
      <div className="section-link">
        <NavLink className="btn btn-outline-accent section-link-btn" text={text} destination={destination} to={to} spy={false} />
      </div>
    </Fade>
  );
}
