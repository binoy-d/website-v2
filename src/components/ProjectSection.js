import React from 'react';
import './ProjectSection.css';
import Container from 'react-bootstrap/Container'
import SectionHeader from './SectionHeader'
import ProjectCard from './ProjectCard'
import Row from 'react-bootstrap/Row'


import {BubblifyImg,
    PuzzleGameImg,
    BubblesTogetherImg,
    ColorGameImg,
    TodoListImg,
    WebsiteImg,
    DebugDuckImg,
    PongImg,
    GameOfLifeImg} from '../img'

function ProjectSection() {
    const projects = [
        {
          title: 'This Website!',
          description: ['Mobile-friendly responsive personal portfolio website', 
                        'Smooth animations encourage interaction',
                        'Night mode button offers two aesthetic color modes',
                        'Currently under development ;)'],
          languages: ['ReactJS', 'Bootstrap', 'HTML', 'CSS', 'JavaScript'],
          link: "https://binoy.co/",
          img: WebsiteImg,
          featured: true,
          codeLink: "https://github.com/binoy-d/portfolio-website"
        },
        {
          title: 'Bubbles, Together',
          description: ['Website allowing users to concurrently draw with bubbles',
                        'Particle effects and graphics done with p5.js',
                        'Backend written in NodeJS using SocketIO, hosted on Heroku'],
          languages: ['p5.js', 'Node', 'JavaScript', 'SocketIO', 'Heroku'],
          link: "https://bubbles-together.herokuapp.com/",
          img: BubblesTogetherImg,
          featured: true,
          codeLink: "https://github.com/binoy-d/particle-draw2"
        },
        {
          title: 'Puzzle Game',
          description: ['Turn based puzzle game with retro aesthetic',
                        'Written purely with Java and standard libraries',
                        'Reads custom map files as matrix of tiles'],
          languages: ['Java', 'Graphics2D'],
          link: "https://github.com/binoy-d/2p1p-puzzle-game",
          img: PuzzleGameImg,
          featured: true,
          codeLink: "https://github.com/binoy-d/2p1p-puzzle-game"
        },
        {
          title: 'Debug Duck',
          description: ['Story based TDS video game written in 48 hours for GGJ 2020',
                        'Play as the duck from "rubber duck debugging"',
                        'My role: Programming in c# and creating assets'],
          languages: ['Java', 'Graphics2D'],
          link: "https://globalgamejam.org/2020/games/debug-duck-2",
          img: DebugDuckImg,
          featured: true,
          codeLink: "https://github.com/binoy-d/debug-duck"
        },
        {
          title: 'Game of Life',
          description: ['Minimalist clone of Conway\'s Game of life',
                        'Features play, pause, toggle cell state, and randomize',
                        'Done as a project to begin learning C#'],
          languages: ['C#', '.NET'],
          link: "https://github.com/binoy-d/Game-Of-Life",
          img: GameOfLifeImg,
          featured: false,
          codeLink: "https://github.com/binoy-d/Game-Of-Life"
        },
        {
          title: 'Color Game',
          description: [
                        'Guess which color is represented from rgb value',
                        'Bootstrap for responsive layout, with smooth fades in CSS'],
          languages: ['Bootstrap', 'CSS', 'JavaScript'],
          link: "https://binoy-d.github.io/color-game/",
          img: ColorGameImg,
          featured: false,
          codeLink: "https://github.com/binoy-d/color-game"
        },
        
        {
          title: 'Bubblify',
          description: ['Recreates any online image out of bubbles',
                        'Visualization done with p5.js',
                        'Bubblified images can be downloaded'],
          languages: ['p5.js', 'HTML', 'CSS', 'JavaScript'],
          link: "https://www.binoy.co/pages/bubblify.html",
          img: BubblifyImg,
          featured: false,
          codeLink: "https://www.binoy.co/pages/bubblify.html"
        },
        {
          title: 'To Do List',
          description: ['To Do List app with clean interface',
                        'Add, delete, mark as done, add new list'],
          languages: ['jQuery', 'JavaScript', 'Bootstrap', 'CSS'],
          link: "https://binoy-d.github.io/to-do-app/",
          img: TodoListImg,
          featured: false,
          codeLink: "https://github.com/binoy-d/to-do-app"
        },
        {
          title: 'Pong',
          description: ['The classic game of pong',
                        'Smooth movement and responsive controls'],
          languages: ['Processing'],
          link: "https://github.com/binoy-d/pong",
          img: PongImg,
          featured: false,
          codeLink: "https://github.com/binoy-d/pong"
        }
      ]

    return (
        <section id ="projects">
          <div class="projects-stuff">
          <SectionHeader  text="Projects"/>
            <Container>
                <Row>
                  
                {projects.map((proj, index)=>
               
                    <ProjectCard proj={proj} side={index%2}/>
                    
                )}
                
                </Row>
            </Container>
            </div>
        </section>
    );
}

export default ProjectSection;
