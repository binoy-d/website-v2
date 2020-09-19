import React from 'react';
import './ProjectSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import ProjectCard from './ProjectCard'
import {BubblifyImg,
    PuzzleGameImg,
    BubblesTogetherImg,
    ColorGameImg,
    TodoListImg,
    WebsiteImg} from '../img'

function ProjectSection() {
    const projects = [
        {
          title: 'This Website!',
          description: ['Responsive personal portfolio website', 
                        'Features smooth animations encouraging interaction',
                        'Currently under development ;)'],
          languages: ['ReactJS', 'Bootstrap', 'HTML', 'CSS', 'JavaScript'],
          link: "https://bubbles-together.herokuapp.com/",
          img: WebsiteImg
        },
        {
          title: 'Bubbles, Together',
          description: ['Website allowing users to concurrently draw with bubbles',
                        'Particle effects and graphics done with p5.js',
                        'Backend written in NodeJS using SocketIO, hosted on Heroku'],
          languages: ['p5.js', 'Node', 'JavaScript', 'SocketIO', 'Heroku'],
          link: "https://bubbles-together.herokuapp.com/",
          img: BubblesTogetherImg
        },
        {
          title: 'Color Game',
          description: ['Color guessing game to help developers and designers',
                        'Given an rgb value, players guess which color is represented',
                        'Bootstrap for responsive layout, with smooth fades in CSS'],
          languages: ['Bootstrap', 'CSS', 'JavaScript'],
          link: "https://binoy-d.github.io/color-game/",
          img: ColorGameImg
        },
        {
          title: 'Puzzle Game',
          description: ['Turn based game where moving one character moves the other as well',
                        'Written purely with Java and standard libraries',
                        'Reads custom map files as matrix of tiles'],
          languages: ['Java', 'Graphics2D'],
          link: "https://github.com/binoy-d/2p1p-puzzle-game",
          img: PuzzleGameImg
        },
        {
          title: 'Bubblify',
          description: ['Recreates any online image out of bubbles',
                        'Visualization done with p5.js',
                        'Bubblified images can be downloaded'],
          languages: ['p5.js', 'HTML', 'CSS', 'JavaScript'],
          link: "https://www.binoy.co/pages/bubblify.html",
          img: BubblifyImg
        },
        {
          title: 'To Do List',
          description: ['To Do List app with simple and clean interfacve',
                        'Easily add to-do items, cross off, delete, and create multiple lists',
                        'Bootstrap for layout, JavaScript with jQuery for handling data'],
          languages: ['jQuery', 'JavaScript', 'Bootstrap', 'CSS', 'HTML'],
          link: "https://binoy-d.github.io/to-do-app/",
          img: TodoListImg
        }
      ]

    return (
        <section id ="projects">
          <div class="projects-stuff">
          <SectionHeader  text="Projects"/>
            <Container>
                
                {projects.map((proj, index)=>
                    <ProjectCard proj={proj} side={index%2}/>
                )}

            </Container>
            </div>
        </section>
    );
}

export default ProjectSection;
