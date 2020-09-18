import React from 'react';
import './ProjectSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import ProjectCard from './ProjectCard'
import {BubblifyImg,
    PuzzleGameImg,
    BubblesTogetherImg,
    ColorGameImg,
    TodoListImg} from '../img'

function ProjectSection() {
    const projects = [
        {
          title: 'Bubbles, Together',
          description: ['this is a very cool project I made', 'I sure loved making this project', '10/10 would make again'],
          languages: ['HTML', 'CSS', 'React', 'JavaScript'],
          link: "https://binoy.co",
          img: BubblesTogetherImg
        },
        {
          title: 'Color Game',
          description: ['this is a very cool project I made', 'I sure loved making this project', '10/10 would make again'],
          languages: ['HTML', 'CSS', 'React', 'JavaScript'],
          link: "https://binoy.co",
          img: ColorGameImg
        },
        {
          title: 'To Do List',
          description: ['this is a very cool project I made', 'I sure loved making this project', '10/10 would make again'],
          languages: ['HTML', 'CSS', 'React', 'JavaScript'],
          link: "https://binoy.co",
          img: TodoListImg
        },
        {
          title: 'Puzzle Game',
          description: ['this is a very cool project I made', 'I sure loved making this project', '10/10 would make again'],
          languages: ['HTML', 'CSS', 'React', 'JavaScript'],
          link: "https://binoy.co",
          img: PuzzleGameImg
        },
        {
          title: 'Bubblify',
          description: ['this is a very cool project I made', 'I sure loved making this project', '10/10 would make again'],
          languages: ['HTML', 'CSS', 'React', 'JavaScript'],
          link: "https://binoy.co",
          img: BubblifyImg
        }
      ]

    return (
        <section id ="projects">
            <Container className = "h-100">
                <SectionHeader  text="Projects"/>

                {projects.map((proj, index)=>
                    <ProjectCard proj={proj} side={index%2}/>
                )}

            </Container>
        </section>
    );
}

export default ProjectSection;
