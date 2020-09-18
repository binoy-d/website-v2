import React from 'react';
import './ProjectCard.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

function ProjectDescription({ description, side }) {
    return (
        <ul className={side === 0 ? "project-description-left" : "project-description-right"}>
            {description.map((line, index) =>
                <li className="project-description-text">
                    {line}
                </li>
            )}
        </ul>
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
                <Row>
                    <Col><ProjectDescription description={proj.description} side={side} /></Col>
                    <Col className = "text-center"><ProjectImage img={proj.img} /></Col>
                </Row>
            ) :
                (
                    <Row>
                        <Col className = "text-center"><ProjectImage img={proj.img} /></Col>
                        <Col><ProjectDescription description={proj.description} side={side} /></Col>
                    </Row>
                )


            }


        </Container>
    );
}

export default ProjectCard;
