import {
    BubblifyImg,
    PuzzleGameImg,
    BubblesTogetherImg,
    ColorGameImg,
    TodoListImg,
    WebsiteImg,
    DebugDuckImg,
    PingImg,
    PongImg,
    FractalTreeImg,
    GameOfLifeImg,
    SpiralOrbitImg,
    DanielProfileImg,
    TankmaniaImg,
} from "../img";

export const profile = DanielProfileImg;

export const projects = [
    
    {
        title: "This Website!",
        description: [
            "Modern React portfolio with responsive design and optimized performance",
            "Implements component-based architecture with smooth animations",
            "Features dark mode, particle effects, and accessibility considerations",
        ],
        languages: ["ReactJS", "Bootstrap", "HTML", "CSS", "JavaScript"],
        link: "https://github.com/binoy-d/portfolio-website",
        img: WebsiteImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/portfolio-website",
        longDescription: "Portfolio application built with React 18, featuring component-based architecture " +
            "and modern development practices. Migrated from Bootstrap template to custom React implementation " +
            "with improved performance, mobile responsiveness, and maintainable codebase. " +
            "Implemented advanced features including particle animations, dark mode toggle, and optimized " +
            "build pipeline for production deployment.",
    },
    {
        title: "Ping",
        description: [
            "Full-stack real-time analytics application with interactive data visualization",
            "Self-hosted solution using React frontend and Express.js backend",
            "Implements SQLite for lightweight data persistence and graph rendering",
        ],
        languages: ["React", "Express", "SQLite", "JavaScript", "CSS"],
        link: "https://ping.binoy.co",
        img: PingImg,
        featured: false,
        codeLink: "https://ping.binoy.co",
        longDescription: "Full-stack web application demonstrating real-time data collection and visualization " +
            "capabilities. Built with React frontend and Express.js backend, utilizing SQLite for efficient " +
            "data storage. Features responsive design, smooth graph animations, and real-time updates. " +
            "Self-hosted deployment showcases DevOps skills and infrastructure management.",
    },
    {
        title: "Generative Spiral Art",
        description: [
            "3D generative art application using WebGL and Bézier curve mathematics",
            "Interactive visualization with real-time user controls and parameter adjustment",
            "Built with p5.js and WebGL for optimized 3D rendering performance",
        ],
        languages: ["p5.js", "WEBGL", "JavaScript", "HTML", "CSS"],
        link: "https://binoy-d.github.io/spiral-orbit/",
        img: SpiralOrbitImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/spiral-orbit",
        longDescription: "Interactive 3D generative art application utilizing WebGL and advanced mathematical " +
            "algorithms for real-time visualization. Implements Bézier curves, Perlin noise, and dynamic " +
            "parameter manipulation through keyboard and mouse controls. Features optimized rendering " +
            "performance and complex visual effects including jellyfish, mushroom, and iris-like patterns.",
    },
    {
        title: "Bubbles, Together",
        description: [
            "Real-time collaborative drawing application with WebSocket architecture",
            "Multi-user particle system with synchronized state management",
            "Self-hosted with Node.js backend and p5.js frontend",
        ],
        languages: ["p5.js", "Node", "JavaScript", "SocketIO", "Docker"],
        link: "https://bubbles.binoy.co",
        img: BubblesTogetherImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/draw-together",
        longDescription: "Real-time collaborative application enabling simultaneous multi-user interaction through " +
            "WebSocket technology. Built with Node.js backend and p5.js frontend, implementing efficient " +
            "particle systems and real-time state synchronization. Optimized network architecture transmits " +
            "only coordinate data while maintaining responsive user experience across concurrent sessions.",
    },
    {
        title: "Puzzle Game",
        description: [
            "2D puzzle game engine with custom level system and game mechanics",
            "Implemented dual-character control system and collision detection",
            "Built with Java Graphics2D and custom file parsing for level configuration",
        ],
        languages: ["Java", "Graphics2D"],
        link: "https://github.com/binoy-d/2p1p-puzzle-game",
        img: PuzzleGameImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/2p1p-puzzle-game",
        longDescription: "Game engine built from scratch using Java and Graphics2D, featuring custom level " +
            "architecture and simultaneous dual-character control mechanics. Implements efficient collision " +
            "detection, enemy AI pathfinding, and modular level design through matrix-based tile parsing. " +
            "Demonstrates object-oriented design principles and game development fundamentals.",
    },
    {
        title: "Debug Duck",
        description: [
            "Unity3D game developed in 48-hour Global Game Jam with cross-functional team",
            "Implemented dynamic game mechanics and meta-narrative progression system",
            "Created custom assets and programmed interactive story elements in C#",
        ],
        languages: ["C#", "Unity3D", "Piskelapp"],
        link: "https://globalgamejam.org/2020/games/debug-duck-2",
        img: DebugDuckImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/debug-duck",
        longDescription: "Unity3D game developed during Global Game Jam 2020, featuring self-modifying mechanics " +
            "and interactive narrative design. Implemented C# programming for dynamic gameplay systems that " +
            "evolve based on player progress. Collaborated with multidisciplinary team to deliver complete " +
            "game experience within 48-hour constraint, including custom asset creation and narrative design.",
    },
    {
        title: "Tankmania",
        description: [
            "Unity3D simulation with multi-agent AI system and configurable parameters",
            "Implemented three-tier AI behavior: patrol, chase, and combat algorithms",
            "Features scalable team-based warfare with dynamic entity management",
        ],
        languages: ["C#", "Unity3D"],
        link: "https://binoy-d.github.io/tankmania/",
        img: TankmaniaImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/tankmania",
        longDescription: "Unity3D simulation featuring advanced multi-agent AI systems with configurable team " +
            "dynamics and scalable entity management. Implemented sophisticated behavior trees for patrol, " +
            "pursuit, and combat states with efficient pathfinding algorithms. Demonstrates game engine " +
            "proficiency and complex system architecture design.",
    },
    {
        title: "Game of Life",
        description: [
            "C# implementation of Conway's Game of Life with interactive controls",
            "Features real-time simulation with play/pause, cell editing, and randomization",
            "Built with .NET framework demonstrating algorithm optimization and UI design",
        ],
        languages: ["C#", ".NET"],
        link: "https://github.com/binoy-d/Game-Of-Life",
        img: GameOfLifeImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/Game-Of-Life",
        longDescription: "Interactive implementation of Conway's Game of Life cellular automaton using C# and .NET. " +
            "Features optimized algorithm for large grid calculations, real-time visualization, and comprehensive " +
            "user controls including pattern editing and random generation. Demonstrates proficiency in " +
            "mathematical algorithms and desktop application development.",
    },
    {
        title: "Fractal Tree",
        description: [
            "Interactive fractal generation using recursive algorithms and parametric controls",
            "Real-time manipulation of branch angles, lengths, and iteration depth",
            "Mathematical visualization built with p5.js and optimized rendering",
        ],
        languages: ["p5.js", "JavaScript", "HTML", "CSS"],
        link: "https://binoy-d.github.io/fractal-tree",
        img: FractalTreeImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/fractal-tree",
        longDescription: "Mathematical visualization application demonstrating recursive algorithms through " +
            "interactive fractal tree generation. Features real-time parameter manipulation, optimized " +
            "rendering performance, and educational interface for exploring mathematical concepts. " +
            "Built with p5.js for efficient canvas-based graphics rendering.",
    },
    {
        title: "Color Game",
        description: [
            "Interactive RGB color recognition game with responsive design",
            "Features dynamic difficulty progression and smooth CSS transitions",
            "Built with vanilla JavaScript and Bootstrap for cross-platform compatibility",
        ],
        languages: ["Bootstrap", "CSS", "JavaScript"],
        link: "https://binoy-d.github.io/color-game/",
        img: ColorGameImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/color-game",
        longDescription: "Educational web application combining color theory with interactive gameplay. " +
            "Implements dynamic RGB value generation, progressive difficulty scaling, and responsive " +
            "design principles. Features smooth animations and cross-browser compatibility through " +
            "vanilla JavaScript and modern CSS techniques.",
    },

    {
        title: "Bubblify",
        description: [
            "Image processing application with custom particle rendering algorithms",
            "Converts digital images into procedural bubble visualizations",
            "Features download functionality and real-time canvas manipulation with p5.js",
        ],
        languages: ["p5.js", "HTML", "CSS", "JavaScript"],
        link: "https://binoy-d.github.io/bubblify",
        img: BubblifyImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/bubblify",
        longDescription: "Image processing application utilizing advanced computer graphics algorithms to transform " +
            "digital images into artistic bubble representations. Implements pixel sampling, color analysis, " +
            "and procedural generation techniques. Features canvas export functionality and optimized " +
            "rendering performance for large-scale image processing.",
    },
    {
        title: "To Do List",
        description: [
            "Task management application with persistent local storage",
            "Features CRUD operations, list organization, and completion tracking",
            "Built with jQuery and Bootstrap for responsive user experience",
        ],
        languages: ["jQuery", "JavaScript", "Bootstrap", "CSS"],
        link: "https://binoy-d.github.io/to-do-app/",
        img: TodoListImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/to-do-app",
        longDescription: "Task management web application featuring persistent data storage and intuitive user " +
            "interface design. Implements local storage APIs, dynamic DOM manipulation, and responsive " +
            "layouts. Demonstrates proficiency in jQuery, Bootstrap framework, and modern web development " +
            "practices for productivity applications.",
    },
    {
        title: "Pong",
        description: [
            "Classic Pong implementation with physics simulation and collision detection",
            "Features smooth animation, responsive controls, and game state management",
            "Built with Processing for optimized 2D graphics rendering",
        ],
        languages: ["Processing"],
        link: "https://github.com/binoy-d/pong",
        img: PongImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/pong",
        longDescription: "Recreation of the classic Pong arcade game implementing fundamental game development " +
            "concepts including physics simulation, collision detection, and real-time input handling. " +
            "Demonstrates understanding of game loops, vector mathematics, and efficient rendering " +
            "techniques using the Processing framework.",
    },
];

export const info = {
    Name: ["Daniel", "Binoy"],
    Locations: ["San Jose", "Los Gatos", "Irvine"],
    Education: ["UC Irvine", "2021"],
    Major: "Computer Science",
    Status: "Software Engineer 2 @ Badger Meter",
    Email: "dbinoy15@gmail.com",
    Interests: ["VR", "Homelab", "Film", "AI", "Longboarding"],
};

export const description =
    "I'm currently a Software Engineer II at Badger Meter specializing in full-stack development and system architecture. " +
    "Experienced in building scalable applications, optimizing performance, and leading technical initiatives. " +
    "I'm passionate about creating robust solutions that drive meaningful impact, especially with new and emerging technologies.";

export var nightMode = false;

var tagline = "software engineer";
var taglineList = [
    "software engineer",
    "dark mode lover",
    "cs instructor",
    "chess player",
    "web dev expert",
    "longboarder",
    "frontend specialist",
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
        title: "Dec 2024 - Present",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer II",
        cardDetailedText: [
            "Investigated and resolved deep-rooted structural issues, saving thousands of tech-support hours",
            "Triaging tickets, mentoring junior developers, and presenting to product owners/customers",
            "Solving large-scale data-integrity and scalability issues while transitioning to new system architecture",
            "Engaging in high-level system architecture discussions"
        ]
    },
    {
        title: "Feb 2022 - Jan 2025",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer I",
        cardDetailedText: [
            "Developed new Data Exchange (DE2) UI with React, Redux Toolkit, and various frontend libraries",
            "Improved DE2 Python 3 backend processing time by 84% in time series calculation phase",
            "Created automated REST service to identify resolve data integrity errors (Eventbridge/Lambda/Kibana)",
            "Resolved structural bugs in legacy DE1 backend (Python 2, Flask, MySQL, Elasticsearch, EC2)"
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
            "Develop online solutions tailored to aid UCI students",
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