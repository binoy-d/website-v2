import React from "react";
import "./Footer.css";
import { Link } from 'react-scroll'
import { useLocation } from 'react-router-dom'


import Container from "react-bootstrap/Container"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

function BackToTop() {
    const location = useLocation();
    if (location.pathname === '/') {
        return (
            <Link id="back" className="back-link" to="home" spy={true} smooth={true} offset={-700} duration={1000}>Back to top</Link>
        );
    }
    return (
        <button
            type="button"
            id="back"
            className="back-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            Back to top
        </button>
    );
}

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <section id='footer'>
            <Container className = "w-100">
                <Row>
                    <Col>
                        <p id = "footer-text">Made with ♥ by Daniel Binoy, {currentYear}</p>
                    </Col>
                </Row>
                <Row>
                <BackToTop />
                </Row>
            </Container>
        </section>
    );
}

export default Footer;
