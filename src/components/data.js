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
        title: "Lockstep",
        description: [
            "Browser-first puzzle game where all players move together each turn",
            "Built an in-game level editor for designing and publishing custom maps",
            "Implemented pathfinding-based level verification with leaderboard-backed challenge progression",
        ],
        languages: ["TypeScript", "Phaser 3", "Vite", "Node.js", "SQLite", "Docker"],
        link: "https://lockstep.binoy.co",
        img: PuzzleGameImg,
        featured: false,
        codeLink: "https://github.com/binoy-d/lockstep",
        longDescription: "Multiplayer browser puzzle game centered on coordinated movement, with a full " +
            "custom level creation pipeline and integrated level editor for rapid map iteration. Includes " +
            "pathfinding-based puzzle level verification and backend-backed leaderboards to support replayable " +
            "challenge progression and community-created content.",
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
    Interests: ["AI Agents", "VR", "Homelab", "Film", "Longboarding"],
};

export const description =
    "I'm currently a Software Engineer II at Badger Meter, where my recent work has been heavily full stack across React, Flask, MySQL, and Elasticsearch. " +
    "I focus on architecture, reliability, and building features in close partnership with product managers to deliver experiences customers and internal users love. " +
    "I also help teams leverage AI tools and agents in practical day-to-day engineering workflows to improve speed and execution quality.";

export var nightMode =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

var tagline = "software engineer";
var taglineList = [
    "software engineer",
    "dark mode lover",
    "small commits, big impact",
    "risk lowered, value shipped",
    "built for real users",
    "vibes: stable and scalable",
    "clean diffs only",
    "latency is a feature",
    "the bug stops here",
    "high uptime energy",
    "less clickbait, more throughput",
    "made with tests and stubbornness",
    "calm in production incidents",
    "fewer meetings, more shipping",
    "ship > perfect",
    "coffee in, code out",
    "yes, I read the logs",
    "frontend by day, backend by night",
    "probably over-engineered (on purpose)",
    "zero merge conflicts (today)",
    "it works on my machine",
    "rubber duck approved",
    "this page has range",
    "web dev expert",
    "longboarder",
    "chess player",
    "cs instructor",
    "frontend specialist",
    "filmmaker",
    "graphic designer",
    "proud anteater",
    "pixel-perfect-ish",
    "opened 37 tabs for this",
    "expect the unexpected",
    "check out my pixels",
    "consider scrolling down",
    "more coming soon",
    "ok back to the top",
    "click, rinse, repeat!",
    "proudly made on earth",
    "based on a true story",
    "six seasons and a movie!",
    "2, electric boogaloo",
    "this time, its personal",
    "s'all good, man",
    "yeah science!",
    "cool. cool cool cool",
    "you really made it this far",
    "I'm proud of you",
    "no, really",
    "good job",
    "keep it up",
    "the darkest timeline",
    ".com was taken",
    "no refunds",
    "stop clicking!",
    "now please hire me ty",
    "binoy#4941",
    "youtu.be/dQw4w9WgXcQ",
    "deployed and prayed",
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
    root.setAttribute("data-theme", nightMode ? "dark" : "light");
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
            "AI Agent Workflows",
            "LLM Tooling",
            "Prompt Engineering",
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
        impact: "Drove platform reliability improvements while leveraging AI tools and agents to reduce support cost/time and improve engineering productivity.",
        cardDetailedText: [
            "Led deep-dive investigations into structural platform issues and shipped long-term fixes",
            "Resolved data-integrity and scalability bottlenecks during a major architecture transition",
            "Built and deployed multiple internal tech-support tools independently to speed issue triage and resolution",
            "Deployed monitoring tools that continuously reported on data-integrity health across pipelines",
            "Increased legacy service test coverage from 0% to 94% to improve release confidence and regression detection",
            "Designed and rolled out AI-assisted engineering workflows used by multiple teams",
            "Regularly gave presentations and live demos to engineers/managers on AI workflow adoption",
            "Partnered across teams as an AI evangelist to improve day-to-day developer efficiency",
            "Partnered directly with product owners and customers to prioritize high-impact technical work",
            "Mentored junior engineers while driving triage and incident response quality"
        ]
    },
    {
        title: "Feb 2022 - Jan 2025",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer I",
        impact: "Led end-to-end BEACON modernization and built automation that improved delivery speed, reliability, and supportability.",
        cardDetailedText: [
            "Built and launched major BEACON user experience improvements with React + Redux Toolkit",
            "Improved Python backend time-series processing performance by 84%",
            "Designed an automated service to detect and resolve data-integrity failures across pipelines",
            "Created internal support tooling that reduced technical support time and operational cost",
            "Built reusable workflow automation patterns that reduced repetitive engineering and support effort",
            "Untangled critical legacy DE1 backend defects across Python, Flask, MySQL, and Elasticsearch"
        ]
    },
    {
        title: "Jan 2021 - Sep 2021",
        cardTitle: "Badger Meter",
        cardSubtitle: "Software Engineer Intern",
        impact: "Shipped production code early, strengthened test coverage, and resolved customer-impacting defects in a live system.",
        cardDetailedText: [
            "Delivered production code from user stories across Python and React systems",
            "Wrote unit, integration, and system tests to improve release confidence",
            "Debugged and shipped fixes in a mature codebase with real customer impact"
        ]
    },
    {
        title: "Nov 2020 - Present",
        cardTitle: "UCI ICS Student Council",
        cardSubtitle: "Projects Committee Member",
        impact: "Built high-utility student tools and led a full React rebuild to modernize key campus project infrastructure.",
        cardDetailedText: [
            "Built online tools tailored to real student workflows",
            "Rebuilt and redesigned the Zotistics website from the ground up in React",
        ]
    },
    {
        title: "Sep 2020 - Dec 2020",
        cardTitle: "Curicular",
        cardSubtitle: "Web Developer / UI Design Intern",
        impact: "Delivered a UX + performance overhaul that improved clarity, usability, and page load speed by 4x.",
        cardDetailedText: [
            "Owned interface improvements end-to-end, from UX proposals to implementation",
            "Designed clearer navigation patterns and interaction flows",
            "Streamlined website structure and page layouts, resulting in 4x faster load times"
        ]
    },
    {
        title: "Apr 2020 - Jan 2022",
        cardTitle: "KTBYTE",
        cardSubtitle: "Computer Science Instructor",
        impact: "Scaled CS instruction quality for 60+ students with stronger curriculum design and auto-graded learning systems.",
        cardDetailedText: [
            "Taught Processing and Java to 60+ pre-college students across multiple levels",
            "Improved problem-set quality with operations staff to maximize learning retention",
            "Built auto-graded curriculum and assignments to scale instruction quality"
        ]
    },
    {
        title: "Mar 2020 - Sep 2020",
        cardTitle: "UCI Social Sciences Computing Services",
        cardSubtitle: "IT Help Desk Assistant",
        impact: "Maintained operational continuity for campus users through fast, reliable frontline technical support.",
        cardDetailedText: [
            "Provided computing and network support to the school of Social Sciences",
            "Resolved hardware and software issues on Macs and PCs"
        ]
    },
    {
        title: "Sep 2018 - Sep 2019",
        cardTitle: "Children's Discovery Museum",
        cardSubtitle: "Exhibit Specialist",
        impact: "Created engaging, hands-on learning experiences while operating high-traffic public exhibits reliably.",
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
        impact: "Built strong communication and leadership skills in fast-paced, public-facing environments.",
        cardDetailedText: [
            "Volunteered as a member of Team Teal to help enhance visitor experience",
            "Developed skills such as interacting with children, group management, creative problem solving, and verbal communication.",
        ]
    },
    {
        title: "Aug 2017 - May 2019",
        cardTitle: "MESA Club, STHS",
        cardSubtitle: "Vice President",
        impact: "Expanded membership by 40% and led the club’s strongest competitive year, with 90% of members winning awards.",
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
