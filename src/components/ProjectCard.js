import React from 'react';
import './ProjectCard.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Fade from 'react-reveal/Fade';
import Badge from 'react-bootstrap/Badge'


function ProjectLanguageTags({ languages }) {
    return (
        <span className="project-tags">
            {languages.map((lang, index) =>
                <Badge className="proj-tag" variant="info">{lang}</Badge>
            )}
        </span>
    );
}

function ProjectDescription({ title, languages, description, side }) {
    return (
        <div className={"desc-" + (side === 0 ? "left" : "right")}>
            <h2 className={"proj-title-" + (side === 0 ? "left" : "right")}>{title}</h2>
            <div className="project-description">
                <ul className={side === 0 ? "project-description-left" : "project-description-right"}>
                    {description.map((line, index) =>
                        <li className="project-description-text">
                            {line}
                        </li>
                    )}
                    <li>
                        <ProjectLanguageTags languages={languages} />
                    </li>
                </ul>
            </div>
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
                        <Col className="description-col">
                            <ProjectDescription className="desc-left" languages={proj.languages} description={proj.description} side={side} title={proj.title} />
                        </Col>
                        <Col className="text-center ">
                            <ProjectImage img={proj.img} />
                        </Col>
                    </Row>
                </Fade>

            ) :
                (
                    <Fade right>
                        <Row>
                            <Col className="text-center">
                                <ProjectImage img={proj.img} />
                            </Col>
                            <Col className="description-col">
                                <ProjectDescription className="desc-right" languages={proj.languages} description={proj.description} side={side} title={proj.title} />
                            </Col>
                        </Row>
                    </Fade>
                )

            }


        </Container>
    );
}

export default ProjectCard;
