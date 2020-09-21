import React from "react";
import "./Footer.css";

import Container from "react-bootstrap/Container"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"


function Footer() {

    return (
        <section id='footer'>
            <Container className = "w-100">
                <Row className = "w-100">
                    <Col>
                        <p id = "footer-text">Made with ♥ by Daniel Binoy, 2020</p>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Footer;
