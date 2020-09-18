import React from 'react';
import './ProjectCard.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Fade from 'react-reveal/Fade';

function ProjectDescription({ description, side }) {
    return (
        <div className="project-description">
            <ul className={side === 0 ? "project-description-left" : "project-description-right"}>
                {description.map((line, index) =>
                    <li className="project-description-text">
                        {line}
                    </li>
                )}
            </ul>
        </div>
    );
}


function ProjectImage({ img, side }) {
    return (
        <Image className="project-image" src={img}></Image>
    );
}

function ProjectCard({ proj, side }) {
    return (



        <Container className="project-card w-100">
            {side === 0 ? (
                <Fade left>
                    <Row>
                        <Col className="description-col"><ProjectDescription description={proj.description} side={side} /></Col>
                        <Col className="text-center "><ProjectImage img={proj.img} /></Col>
                    </Row>
                </Fade>

            ) :
                (
                    <Fade right>
                        <Row>
                            <Col className="text-center"><ProjectImage img={proj.img} /></Col>
                            <Col className="description-col"><ProjectDescription description={proj.description} side={side} /></Col>
                        </Row>
                    </Fade>
                )


            }


        </Container>
    );
}

export default ProjectCard;
