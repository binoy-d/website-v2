import React from "react";
import "./Footer.css";

import Container from "react-bootstrap/Container"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NavLink from './NavLink'

function Footer() {

    return (
        <section id='footer'>
            <Container className = "w-100">
                <Row>
                    <Col>
                        <p id = "footer-text">Made with ♥ by Daniel Binoy, 2020</p>
                        <div id="back"><NavLink text="Back to top" destination = "home" /></div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Footer;
