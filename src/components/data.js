import {
    BubblifyImg,
    PuzzleGameImg,
    BubblesTogetherImg,
    ColorGameImg,
    TodoListImg,
    WebsiteImg,
    DebugDuckImg,
    PongImg,
    FractalTreeImg,
    GameOfLifeImg,
    SpiralOrbitImg,
    DanielProfileImg,
    TankmaniaImg,
} from "../img";

export const profile = DanielProfileImg;

export const projects = [{
        title: "This Website!",
        description: [
            "Responsive personal portfolio website",
            "Smooth animations encourage interaction",
            "Dark mode button and many hidden easter eggs",
        ],
        languages: ["ReactJS", "Bootstrap", "HTML", "CSS", "JavaScript"],
        link: "https://github.com/binoy-d/portfolio-website",
        img: WebsiteImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/portfolio-website",
        longDescription: "This is the second version of my personal portfolio website. " +
            "The previous version of this website was done working off of" +
            " a bootstrap template, with major customizations done down the line." +
            " It was a great learning experience for me, but after some time " +
            "I felt unsatisfied with it. I decided to do a complete overhaul " +
            "of the site, both visually and behind the scenes.\n I started by listing " +
            'every issue I had with version 1. These included being too "bootstrappy", ' +
            "lacking a single cohesive color scheme, irrelevant pages, bloat, and parts " +
            " breaking on mobile. From there, I started learning React following a course " +
            "on LinkedIn Learning. Using what I learned, I started building and rebuilding" +
            " the website. I iterated through many different layouts, color schemes, and " +
            "component tree structures until I arrived at this one. I used libraries such" +
            " as react-reveal react-particles-js, and more to achieve many of the effects. " +
            "Overall, this has been a great learning experience for me, and I will continue" +
            " to update it. ",
    },
    {
        title: "Generative Spiral Art",
        description: [
            "3d generative art made of beziers",
            "Viewers can interact with an orbiting spiral visual",
            "Implemented with p5.js webGL",
        ],
        languages: ["p5.js", "WEBGL", "JavaScript", "HTML", "CSS"],
        link: "https://binoy-d.github.io/spiral-orbit/",
        img: SpiralOrbitImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/spiral-orbit",
        longDescription: "This is the product of a late night coding session with some buddies. " +
            "I started out wanting to make some sort of simple music visualizer that works " +
            "using perlin noise. However, as we added more and more to the visual, it ended up " +
            "resulting in a wild visual experience. Adding mouse and keyboard interaction made it even more" +
            " interesting. By using WASD to move around, QE to zoom in and out, and ZX to increase and " +
            "decrease number of strands, the user can create complex visuals. Some of my favorites include " +
            "shapes that act like a jellyfish, mushroom, and even one that looked like an iris. " +
            "This was my first time working with webgl in p5.js.",
    },
    {
        title: "Bubbles, Together",
        description: [
            "Users draw together live, with bubbles",
            "Particle effects and graphics done with p5.js",
            "Capable of handling many concurrent users",
        ],
        languages: ["p5.js", "Node", "JavaScript", "SocketIO", "Heroku"],
        link: "https://bubbles-together.herokuapp.com/",
        img: BubblesTogetherImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/particle-draw2",
        longDescription: "I have always loved simple, beautiful particle effects." +
            "Any user that visits this website can generate randomly colored" +
            " bubbles by clicking and dragging their mouse around the screen. " +
            "All users who are on the site at the same time can also see eachother's" +
            " bubbles. This makes for a fun, interactive shared experience for " +
            " users as they play around drawing shapes and often writing things in bubbles" +
            " The front end as well as all particle effects are done using p5.js, a port" +
            " of Processing to JavaScript. The backend is a NodeJS server using SocketIO" +
            " to communicate. Interestingly, the only data I send back and forth is " +
            "the mouse positions. The bubble creation is handled on the front end " +
            "for speed purposes. This means that though each client gets roughly the same" +
            "view, there will be slight differences as each client generates their own" +
            "version of the current state.",
    },
    {
        title: "Puzzle Game",
        description: [
            "Turn based puzzle game with retro aesthetic",
            "Written purely with Java and standard libraries",
            "Reads custom map files as matrix of tiles",
        ],
        languages: ["Java", "Graphics2D"],
        link: "https://github.com/binoy-d/2p1p-puzzle-game",
        img: PuzzleGameImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/2p1p-puzzle-game",
        longDescription: "A puzzle game I made as a sophomore. The player uses the arrow keys to " +
            "move two characters at once. Avoid lava and moving enemies to get to the" +
            " green goals. Have fun trying to find the fastest solution for each level!" +
            'This was one of the first "complete" games I had written, and has a soft spot' +
            " in my heart. I'm especially proud of this because its a genuinly fun game to play" +
            " and often players find themselves hooked after the first few levels." +
            " One day, I might recreate this in C# or some other language with more levels.",
    },
    {
        title: "Debug Duck",
        description: [
            "Story based TDS video game written in 48 hours for GGJ 2020",
            'Play as the duck from "rubber duck debugging"',
            "My role: Programming in c# and creating assets",
        ],
        languages: ["C#", "Unity3D", "Piskelapp"],
        link: "https://globalgamejam.org/2020/games/debug-duck-2",
        img: DebugDuckImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/debug-duck",
        longDescription: "This was my first time going to a game jam, and I went with my friend Evan Cheng" +
            "(https://frolicks.itch.io/) From there, we met a few more people and formed a team." +
            'My role was both in programming and creating assets. The 2020 theme was "repair", and we brainstormed many ideas before settling on the ' +
            'concept of fixing code. Often times, programmers do what is called "rubber duck debugging"' +
            " in which one explains their problems to a rubber duck to help think through it. " +
            " In the game, you play as the rubber duck, solving your programmer's bugs." +
            " As you fix more bugs, the game fixes itself by changing its own mechanics. " +
            "As the programmer relies more and more on your fixing, he begins bringing up" +
            " problems in his personal life as well, and it becomes your job to solve those" +
            " as well by changing negative thoughts into healthy ones. The game can be described" +
            " as a TDS interactive fiction experience.",
    },
    {
        title: "Tankmania",
        description: [
            "Tank war simulator project",
            "User can pick number of teams and tanks per team",
            "3-stage AI that patrols, chases, and shoots",
        ],
        languages: ["C#", "Unity3D"],
        link: "https://binoy-d.github.io/tankmania/",
        img: TankmaniaImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/tankmania",
        longDescription: "A tank war simulator project I made for ICS161: Game Engine Lab",
    },
    {
        title: "Game of Life",
        description: [
            "Minimalist clone of Conway's Game of life",
            "Play, pause, toggle cell state, and randomize",
            "Done as a project to begin learning C#",
        ],
        languages: ["C#", ".NET"],
        link: "https://github.com/binoy-d/Game-Of-Life",
        img: GameOfLifeImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/Game-Of-Life",
        longDescription: "this is a test",
    },
    {
        title: "Fractal Tree",
        description: [
            "Demonstrates recursion by drawing a fractal tree",
            "Users change starting node position, length, and angle of branches",
        ],
        languages: ["p5.js", "JavaScript", "HTML", "CSS"],
        link: "https://binoy-d.github.io/fractal-tree",
        img: FractalTreeImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/fractal-tree",
        longDescription: "this is a test",
    },
    {
        title: "Color Game",
        description: [
            "Guess which color is represented from rgb value",
            "Bootstrap for responsive layout, with smooth fades in CSS",
        ],
        languages: ["Bootstrap", "CSS", "JavaScript"],
        link: "https://binoy-d.github.io/color-game/",
        img: ColorGameImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/color-game",
        longDescription: "this is a test",
    },

    {
        title: "Bubblify",
        description: [
            "Recreates any online image out of bubbles",
            "Visualization done with p5.js",
            "Bubblified images can be downloaded",
        ],
        languages: ["p5.js", "HTML", "CSS", "JavaScript"],
        link: "https://binoy-d.github.io/bubblify",
        img: BubblifyImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/bubblify",
        longDescription: "this is a test",
    },
    {
        title: "To Do List",
        description: [
            "To Do List app with clean interface",
            "Add, delete, mark as done, add new list",
        ],
        languages: ["jQuery", "JavaScript", "Bootstrap", "CSS"],
        link: "https://binoy-d.github.io/to-do-app/",
        img: TodoListImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/to-do-app",
        longDescription: "this is a test",
    },
    {
        title: "Pong",
        description: [
            "The classic game of pong",
            "Smooth movement and responsive controls",
        ],
        languages: ["Processing"],
        link: "https://github.com/binoy-d/pong",
        img: PongImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/pong",
        longDescription: "this is a test",
    },
];

export const info = {
    Name: ["Daniel", "Binoy"],
    Location: ["San Jose CA", "Irvine CA"],
    Education: ["UC Irvine", "2021"],
    Major: "Computer Science",
    Status: "Open to full stack web dev work",
    Email: "dbinoy15@gmail.com",
    Interests: ["Chess", "Film", "Longboarding"],
};

export const description =
    "I'm a computer science student at " +
    "University of California, Irvine. I love designing and coding beautiful, " +
    "functional applications and interfaces that have a real impact on users. Whether " +
    "its writing code, filming videos, or creating art, I'm always making something. Connect with me " +
    "to make something great, together!";

export var nightMode = false;

var tagline = "software engineer";
var taglineList = [
    "software engineer",
    "dark mode lover",
    "cs instructor",
    "chess player",
    "web dev intern",
    "longboarder",
    "software engineer intern",
    "filmmaker",
    "graphic designer",
    "proud anteater",
    "proudly made on earth",
    "based on a true story",
    "six seasons and a movie!",
    "click, rinse, repeat!",
    "2, electric boogaloo",
    "this time, its personal",
    "check out my pixels",
    "no refunds",
    "consider scrolling down",
    "s'all good, man",
    "yeah science!",
    "cool. cool cool cool",
    "you really made it this far",
    "I'm proud of you",
    "no, really",
    "good job",
    "keep it up",
    "now please hire me ty",
    "binoy#4941",
    "stop clicking!",
    "expect the unexpected",
    "the darkest timeline",
    ".com was taken",
    "youtu.be/dQw4w9WgXcQ",
    "more coming soon",
    "ok back to the top",
];

var tagIndex = 0;
export const toggleNightMode = () => {
    
    nightMode = !nightMode;
    tagIndex++;
    if (tagIndex >= taglineList.length) {
        tagIndex = 0;
    }
    updateNightMode();
    tagline = taglineList[tagIndex];
};

export const updateNightMode = () =>{
    let root = document.documentElement;
    if (nightMode) {
        root.style.setProperty("--main-bg-color", "#080705");
        root.style.setProperty("--main-text-color", "#e9e9e9");
        root.style.setProperty("--secondary-bg-color", "#111111");
    } else {
        root.style.setProperty("--main-bg-color", "#EFF1F3");
        root.style.setProperty("--main-text-color", "#080705");
        root.style.setProperty("--secondary-bg-color", "#ebebeb");
    }
}

export const getTagline = () => {
    return tagline;
};

export const skills = [{
        title: "Languages",
        items: [
            "Python",
            "C++",
            "Java",
            "Javascript",
            "HTML",
            "CSS",
            "SQL",
            "Processing",
            "C#",
            "p5.js",
            "NodeJS",
        ],
    },
    {
        title: "Frameworks",
        items: [
            "ReactJS",
            "Bootstrap",
            "jQuery",
            "p5.js",
            "GTest",
            "Beautiful Soup",
            "Express.js",
            "SemanticUI",
            "Express.js",
            "Selenium",
        ],
    },
    {
        title: "Tools",
        items: [
            "Git/Github",
            "NPM",
            "Postman",
            "AWS",
            "GCP",
            "Numpy",
            "Heroku",
            "CLIs",
            "MongoDB",
            "VirtualBox",
            "ffmpeg",
            "NLTK",
        ],
    },
    {
        title: "Other",
        items: [
            "Linux/Unix",
            "Figma",
            "Arduino",
            "Photoshop",
            "Premiere Pro",
            "Illustrator",
            "After Effects",
            "3D Printing",
            "Agile",
            "CAD",
            "MS Office",
            "G Suite",
            "Audacity",
        ],
    },
];

export const experience = [
    {
        title: "Feb 2022 - Present",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer",
        cardDetailedText: [
            "Will be working on data exchange platform and frontend React",
            "Just started here!",
        ]
    },
    {
        title: "Jan 2021 - Sep 2021",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer Intern",
        cardDetailedText: [
            "Producing clean, efficient code based on user stories and integrated software components",
            "Authoring automated unit, integration, and system tests",
            "Troubleshooting and debugging existing Python and React code base"
        ]
    },
    {
        title: "Nov 2020 - Present",
        cardTitle: "UCI ICS Student Council",
        cardSubtitle: "Projects Committee Member",
        cardDetailedText: [
            "Working to develop online solutions tailored to aid UCI students",
            "Rebuilding and redesigning zotistics website from ground up in React",
        ]
    },
    {
        title: "Sep 2020 - Dec 2020",
        cardTitle: "Curicular",
        cardSubtitle: "Web Develepor / UI Design Intern",
        cardDetailedText: [
            "Managed website interface, pitching and implementing ideas to better design, code, and modify the site",
            "Created visually appealing site features for user-friendly design and clear navigation",
            "Streamlined website structure and page layouts, resulting in 4x faster load times"
        ]
    },
    {
        title: "Apr 2020 - Jan 2022",
        cardTitle: "KTBYTE",
        cardSubtitle: "Computer Science Instructor",
        cardDetailedText: [
            "Taught computer science concepts at various levels in Processing and Java to over 60 pre-college students",
            "Communicated with operations staff on optimizing problem sets to emphasize learning and retention",
            "Developed automatically graded curricula and problem sets"
        ]
    },
    {
        title: "Mar 2020 - Sep 2020",
        cardTitle: "UCI Social Sciences Computing Services",
        cardSubtitle: "IT Help Desk Assistant",
        cardDetailedText: [
            "Provided computing and network support to the school of Social Sciences",
            "Resolved hardware and software issues on Macs and PCs"
        ]
    },
    {
        title: "Sep 2018 - Sep 2019",
        cardTitle: "Children's Discovery Museum",
        cardSubtitle: "Exhibit Specialist",
        cardDetailedText: [
            "Assisted in the opening/closing procedures of the Museum ",
            "Actively interacted with children and adults to enhance visitor experience",
            "Promoted creativity, curiosity, and lifelong learning in the next generation",
        ]
    },
    {
        title: "Feb 2018 - Sep 2018",
        cardTitle: "Children's Discovery Museum",
        cardSubtitle: "Team Teal Volunteer",
        cardDetailedText: [
            "Volunteered as a member of Team Teal to help enhance visitor experience",
            "Developed skills such as interacting with children, group management, creative problem solving, and verbal communication.",
        ]
    },
    {
        title: "Aug 2017 - May 2019",
        cardTitle: "MESA Club, STHS",
        cardSubtitle: "Vice President",
        cardDetailedText: [
            "Grew MESA(Mathematics Engineering Science Achievement) by over 40% from 50+ to 80+ members",
            "Lead club to best year to date, winning over 72% of all prizes, with 90% of members winning",
        ]
    },
];



export const experience_theme = {
    primary: "var(--accent-color-1)",
    secondary: "var(--main-bg-color)",
    cardBgColor: "var(--secondary-bg-color)",
    cardForeColor: "var(--main-text-bg-color)"
}