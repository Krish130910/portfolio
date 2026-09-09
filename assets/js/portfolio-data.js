/**
 * portfolio-data.js
 * Default Seed Data for Krish Savaliya's Portfolio
 * Mirrors the original static HTML content while serving as the fallback source of truth.
 */

const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Krish Savaliya",
    title: "Hero Section",
    subtitle: "B.Tech Information Technology Student | Marwadi University",
    bio1: "Information Technology student with a strong interest in Frontend Development and Artificial Intelligence / Machine Learning.",
    bio2: "Skilled in building responsive full-stack web applications using React, TypeScript, Node.js, and Express, while exploring machine learning with Python, Scikit-learn, NumPy, Pandas, and OpenCV. Passionate about creating intuitive user experiences and developing AI-powered solutions through hands-on projects and hackathons.",
    ctaPrimaryText: "View Projects",
    ctaPrimaryLink: "#projects",
    ctaSecondaryText: "Contact Me",
    ctaSecondaryLink: "#contact",
    avatarType: "svg", // 'svg' or 'image'
    avatarUrl: "image.jpg"
  },
  about: {
    title: "About Me",
    paragraphs: [
      "I am currently pursuing a B.Tech in Information Technology at Marwadi University, with a strong interest in Frontend Development and Artificial Intelligence / Machine Learning.",
      "I build responsive full-stack applications using React, TypeScript, Node.js, and Express, and explore machine learning with Python, Scikit-learn, NumPy, Pandas, and OpenCV.",
      "I am passionate about creating intuitive user experiences and developing AI-powered solutions through hands-on projects and hackathons."
    ]
  },
  skills: [
    {
      id: "cat-1",
      title: "Frontend Development",
      items: [
        "React.js, Next.js, TypeScript",
        "HTML5, CSS3, Tailwind CSS",
        "Responsive Web Design",
        "Bootstrap and UI Development",
        "Reusable Components",
        "REST APIs and JWT Authentication"
      ]
    },
    {
      id: "cat-2",
      title: "Machine Learning & AI",
      items: [
        "Python and Scikit-learn",
        "NumPy and Pandas",
        "OpenCV and YOLOv8",
        "Natural Language Processing",
        "Data Preprocessing",
        "Model Training & Evaluation"
      ]
    },
    {
      id: "cat-3",
      title: "Databases & Tools",
      items: [
        "MongoDB and MySQL",
        "Firebase Firestore",
        "Git and GitHub",
        "VS Code and Streamlit",
        "Figma and Vercel",
        "Render and Linux"
      ]
    },
    {
      id: "cat-4",
      title: "Core Computer Skills",
      items: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks",
        "Client-Server Architecture"
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "HealthGuard AI",
      image: "image.jpg",
      shortDesc: "AI-powered preventive healthcare platform built using React and TypeScript with responsive layouts.",
      description: "AI-powered preventive healthcare platform built using React and TypeScript with responsive layouts and reusable UI components.\nFeatures health assessment, dashboard, action plans, progress tracking, and report generation for a seamless cross-device experience.",
      tech: ["React", "TypeScript", "UI Components", "Health Tech"],
      link: "#contact",
      github: "https://github.com/Krish130910",
      live: "",
      status: "Completed",
      order: 1
    },
    {
      id: "proj-2",
      title: "ToolVerse (Ongoing)",
      image: "image.jpg",
      shortDesc: "Modern privacy-first SaaS platform featuring 20+ browser-based and AI developer utilities.",
      description: "Modern privacy-first SaaS platform featuring 20+ browser-based and AI-powered developer utilities for coding, PDF, image processing, security, and productivity.\nBuilt using Next.js, TypeScript, and Tailwind CSS with reusable components and a responsive user experience.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "SaaS"],
      link: "#contact",
      github: "https://github.com/Krish130910",
      live: "",
      status: "Ongoing",
      order: 2
    },
    {
      id: "proj-3",
      title: "GazeGuardian - Driver Drowsiness Detection",
      image: "image.jpg",
      shortDesc: "Real-time computer vision application detecting driver drowsiness using EAR and facial landmarks.",
      description: "Real-time computer vision application that detects driver drowsiness using Eye Aspect Ratio (EAR) and facial landmark analysis.\nBuilt with Python, OpenCV, MediaPipe, and NumPy to trigger alerts and improve road safety.",
      tech: ["Python", "OpenCV", "MediaPipe", "NumPy", "AI/ML"],
      link: "#contact",
      github: "https://github.com/Krish130910",
      live: "",
      status: "Completed",
      order: 3
    }
  ],
  experience: [
    {
      id: "exp-1",
      title: "Smart Crowd Behavior Monitoring System",
      subtitle: "Python | OpenCV | YOLOv8 | PyTorch | NumPy",
      period: "2024 - Present",
      bullets: [
        "Developed a real-time crowd monitoring system using YOLOv8 and OpenCV.",
        "Detects people, estimates crowd density, and analyzes movement patterns.",
        "Identifies overcrowding scenarios for enhanced public safety."
      ],
      order: 1
    },
    {
      id: "exp-2",
      title: "Fire & Smoke Detection System",
      subtitle: "Python | OpenCV | YOLOv8 | PyTorch | NumPy",
      period: "2024",
      bullets: [
        "Developed a real-time fire and smoke detection system using YOLOv8 and OpenCV.",
        "Identifies fire hazards from live video streams for early warning.",
        "Designed for surveillance and practical safety applications."
      ],
      order: 2
    },
    {
      id: "exp-3",
      title: "National Level Hackathons",
      subtitle: "2024 - Present",
      period: "2024 - Present",
      bullets: [
        "Participated in 7 national-level hackathons across India.",
        "Qualified for final rounds in multiple competitions.",
        "Collaborated with teams to build AI/ML and full-stack web applications.",
        "Improved teamwork, UI presentation, and rapid prototyping skills."
      ],
      order: 3
    },
    {
      id: "exp-4",
      title: "B.Tech in Information Technology",
      subtitle: "Marwadi University | CPI: 7.08/10 | 2024 - 2028",
      period: "2024 - 2028",
      bullets: [
        "Focused on modern web technologies, full-stack development, and software engineering practices.",
        "Built foundational knowledge in web design, HTTP, client-server architecture, and responsive UI design.",
        "Developed projects using semantic HTML5, CSS3, JavaScript, and React with TypeScript.",
        "Practiced problem-solving through coursework, labs, and hackathon participation."
      ],
      order: 4
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Frontend Development",
      issuer: "Marwadi University / Coursera",
      date: "2024",
      credentialUrl: "#",
      description: "Building responsive interfaces with React, Next.js, TypeScript, Tailwind CSS, Bootstrap, and reusable UI components."
    },
    {
      id: "cert-2",
      title: "Artificial Intelligence & ML",
      issuer: "DeepLearning.AI / Kaggle",
      date: "2024",
      credentialUrl: "#",
      description: "Developing practical skills in Python, Scikit-learn, Pandas, NumPy, OpenCV, YOLOv8, and model training and evaluation."
    },
    {
      id: "cert-3",
      title: "Tools & Core Skills",
      issuer: "Marwadi University",
      date: "2024",
      credentialUrl: "#",
      description: "Experienced with MongoDB, Firebase, MySQL, Git, GitHub, VS Code, Streamlit, Figma, Vercel, Render, Linux, and core computer science subjects."
    }
  ],
  testimonials: [
    {
      id: "test-1",
      author: "Faculty Member",
      role: "Faculty, Marwadi University",
      quote: "Krish is a hardworking and dedicated student who always gives his best.",
      rating: 5,
      visible: true
    },
    {
      id: "test-2",
      author: "Team Member",
      role: "Hackathon Teammate",
      quote: "Excellent team player with good technical knowledge and strong problem-solving skills.",
      rating: 5,
      visible: true
    },
    {
      id: "test-3",
      author: "Friend",
      role: "Peer & Collaborator",
      quote: "Creative, enthusiastic and always ready to learn new technologies.",
      rating: 5,
      visible: true
    }
  ],
  messages: [
    {
      id: "msg-1",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      subject: "Collaboration on AI Project",
      message: "Hi Krish, I saw your GazeGuardian project and was really impressed. Would love to connect regarding a potential research collaboration.",
      date: "2026-09-08 14:32",
      status: "new" // 'new', 'read', 'replied'
    },
    {
      id: "msg-2",
      name: "Pooja Patel",
      email: "pooja@techcorp.in",
      subject: "Frontend Internship Opportunity",
      message: "Hello Krish, we are looking for a frontend intern familiar with React and TypeScript. Please check our website or reply with your resume.",
      date: "2026-09-07 10:15",
      status: "read"
    }
  ],
  resume: {
    fileName: "resume.pdf",
    fileUrl: "resume.pdf",
    lastUpdated: "September 2026",
    fileSize: "245 KB"
  },
  settings: {
    siteTitle: "Krish Savaliya | Portfolio",
    metaDescription: "Krish Savaliya - Personal Portfolio Webpage | Marwadi University IT Student | Web Technology (01IT0505)",
    metaKeywords: "Krish Savaliya, Portfolio, HTML5, CSS3, Web Technology, Marwadi University",
    email: "krishsavaliya018@gmail.com",
    linkedin: "https://www.linkedin.com/in/krish-savaliya-5a139a31a/",
    github: "https://github.com/Krish130910",
    footerDepartment: "Department of Information Technology | Marwadi University",
    footerCopyright: "© 2026 Krish Savaliya. All Rights Reserved.",
    sections: {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      experience: true,
      certifications: true,
      testimonials: true,
      contact: true
    }
  }
};

// Export to window object for browser access
if (typeof window !== "undefined") {
  window.DEFAULT_PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = DEFAULT_PORTFOLIO_DATA;
}
