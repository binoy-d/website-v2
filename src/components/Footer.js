import React from "react";
import "./Footer.css";
import { Link} from 'react-scroll'


import Container from "react-bootstrap/Container"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

function Footer() {

    return (
        <section id='footer'>
            <Container className = "w-100">
                <Row>
                    <Col>
                        <p id = "footer-text">Made with ♥ by Daniel Binoy, 2020</p>
                        
                    </Col>
                </Row>
                <Row>
                <Link id="back" className = "back-link" to="home" spy={true} smooth={true} offset={-700} duration={1000}>Back to top</Link>
                </Row>
            </Container>
        </section>
    );
}

export default Footer;
