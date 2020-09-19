import React from 'react';
import './ProjectCard.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Fade from 'react-reveal/Fade';
import Badge from 'react-bootstrap/Badge'
import { Media } from 'react-breakpoints'


function ProjectLanguageTags({ languages }) {
    return (
        <span className="project-tags">
            {languages.map((lang, index) =>
                <Badge className="proj-tag" variant="info">{lang}</Badge>
            )}
        </span>
    );
}

function ProjectDescription({ proj, side }) {
    return (
        <div className={"desc-" + (side === 0 ? "left" : "right")}>
            <h2 className={"proj-title-" + (side === 0 ? "left" : "right")}>{proj.title}</h2>
            <div className="project-description">
                <ul className={side === 0 ? "project-description-left" : "project-description-right"}>
                    {proj.description.map((line, index) =>
                        <li className="project-description-text">
                            {line}
                        </li>
                    )}
                    <li>
                        <ProjectLanguageTags languages={proj.languages} />
                    </li>
                </ul>
            </div>
        </div>
    );
}


function ProjectImage({ proj }) {
    return (
        <a href={proj.link}>
            <Image className="project-image" src={proj.img}></Image>
        </a>
    );
}


function ProjectCardLeftDesktop({ proj }) {
    return (
        <Fade left>
            <Row>
                <Col className="description-col">
                    <ProjectDescription className="desc-left" proj={proj} side={0} />
                </Col>
                <Col className="text-center ">
                    <ProjectImage proj={proj} />
                </Col>
            </Row>
        </Fade>
    );
}



function ProjectCardRightDesktop({ proj }) {
    return (
        <Fade right>
            <Row>
                <Col className="text-center">
                    <ProjectImage proj={proj} />
                </Col>
                <Col className="description-col">
                    <ProjectDescription className="desc-right" proj={proj} side={1} />
                </Col>
            </Row>
        </Fade>
    );
}

function ProjectCardMobile({proj}){
    return (
        <div className = "project-card-mobile">
            <h2 className = "proj-title-mobile">{proj.title}</h2>
            <a href={proj.link}><Image className="project-image" src={proj.img}></Image></a>
            <div>
            <div className="project-description-mobile">
                <ul>
                    {proj.description.map((line, index) =>
                        <li className="project-description-text">
                            {line}
                        </li>
                    )}
                    <li>
                        <ProjectLanguageTags languages={proj.languages} />
                    </li>
                </ul>
            </div>
            </div>
        </div>
    );
}


function ProjectCard({ proj, side }) {
    return (
        <Container className="project-card w-100">
            <Media>
                {({ breakpoints, currentBreakpoint }) =>
                    breakpoints[currentBreakpoint] > breakpoints.desktop ? (
                        (side === 0 ?
                            <ProjectCardLeftDesktop proj={proj} /> :
                            <ProjectCardRightDesktop proj={proj} />)
                    ) : (
                            <ProjectCardMobile proj={proj} />
                        )
                }
            </Media>




            
        </Container>
    );
}







export default ProjectCard;
