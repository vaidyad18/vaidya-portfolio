export interface ProjectLinks {
  live?: string;
  github?: string;
  demo?: string;
}

export interface Project {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  tech: string[];
  highlights: string[];
  links: ProjectLinks;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  highlights: string[];
  offerLetter?: string;
  completionLetter?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

export const profile: {
  name: string;
  tagline: string;
  disambiguation: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  instagram: string;
  cal: string;
  resumeUrl: string;
  about: string[];
  skills: Record<string, string[]>;
  experience: ExperienceItem[];
  projects: Project[];
  education: EducationItem[];
} = {
  name: "Vaidya Dandriyal",
  tagline: "Software Engineer",
  disambiguation:
    "Distinct from other individuals named Vaidya Dandriyal, including professionals and public profiles with the same name.",
  intro:
    "I take problems from idea to implementation, building across frontend, backend, and data systems, learning whatever the solution demands, and refining each piece until it works cleanly in the real world.",
  email: "vaidyadandriyal04@gmail.com",
  phone: "+91 7703908277",
  location: "New Delhi, India",
  github: "https://github.com/vaidyad18",
  linkedin: "https://www.linkedin.com/in/vaidyadandriyal",
  instagram: "https://www.instagram.com/_.vaidya._/",
  cal: "https://cal.com/vaidya-dandriyal-0k8fha",
  resumeUrl: "/resume.pdf",
  about: [
    "I build by getting my hands dirty with real problems. Every project is an opportunity to explore a new technology, understand how systems work under the hood, and turn an idea into something people can actually use. I enjoy working across the stack, from designing interfaces and APIs to working with data and thinking about how everything fits together.",
    "Software Engineer and Computer Science graduate with 9+ months of hands-on internship experience building web applications, data-driven systems, and production-focused solutions. I have worked across frontend development, backend development, and data engineering, with a strong focus on writing clean, practical, and maintainable code.",
    "I specialize in C++, JavaScript, React, Next.js, Node.js, SQL, Python, and cloud technologies including AWS and Azure, with experience exploring Apache Spark, PySpark, and Databricks. I enjoy learning by building, solving problems with DSA and system design, and continuously improving a solution beyond its first working version.",
  ],
  skills: {
    Languages: ["C++", "Python", "TypeScript", "JavaScript", "SQL"],
    "Backend & APIs": [
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "MySQL",
      "PostgreSQL",
    ],
    Frontend: ["React.js", "Next.js", "Redux", "Tailwind CSS"],
    "Data & Cloud": [
      "PySpark",
      "Databricks",
      "Microsoft Azure",
      "AWS",
      "ETL pipelines",
    ],
    "Developer Tools": [
      "Git",
      "GitHub",
      "GitLab",
      "VS Code",
      "Postman",
      "Docker",
    ],
  },
  experience: [
    {
      company: "Nagarro",
      role: "Associate Engineer Trainee",
      period: "Mar 2026 – Present",
      description:
        "Building production-grade web and data systems across the MERN stack and modern cloud data platforms, bridging application engineering with scalable data workflows.",
      tech: [
        "Python",
        "JavaScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MySQL",
        "Microsoft Azure",
        "Apache Spark",
        "Databricks",
      ],
      highlights: [
        "API Architecture: Designed and shipped 25+ RESTful API endpoints powering core application workflows, owning the integration path from React interfaces to Node.js/Express services and database operations.",
        "Full-Stack Engineering: Built and integrated production MERN-stack features end-to-end, translating frontend requirements into reliable backend services while containerizing application components with Docker for consistent development and deployment.",
        "Data Engineering: Engineered PySpark ETL pipelines on Databricks and Microsoft Azure to ingest, transform, validate, and prepare data for downstream analytics and reporting workflows.",
        "Scale & Reliability: Worked across application and data layers to build modular pipelines and services that are easier to maintain, extend, and operate as data volumes and product requirements grow.",
      ],
      offerLetter: "/Nagarro-offer-letter.pdf",
    },
    {
      company: "4 Way Technologies",
      role: "Software Engineer Intern",
      period: "Dec 2025 – Feb 2026",
      description:
        "Built and scaled product experiences for a Celebrity AI Chatbot Platform, spanning admin workflows, real-time interactions, authentication, localization, and performance optimization.",
      tech: [
        "JavaScript",
        "TypeScript",
        "React.js",
        "Next.js",
        "REST APIs",
        "Logto",
        "Sentry",
      ],
      highlights: [
        "Product Engineering: Built the Admin Portal and chatbot-creation workflows for a Celebrity AI Chatbot Platform, delivering real-time chat experiences and cutting manual setup time by 50%.",
        "API & Authentication: Integrated 25+ REST APIs and configured Logto authentication, working across frontend, backend, and DevOps layers to maintain secure and reliable data flows through production deployments.",
        "Globalization: Implemented localization across 8+ languages and collaborated with the AI/ML team on locale-aware content adaptation, enabling the platform to support multi-region user experiences.",
        "Performance Engineering: Reduced unnecessary API traffic by 40%+ and improved page load times by 25%+ using lazy loading, debouncing, and Sentry-driven performance monitoring.",
      ],
      offerLetter: "/4-way-technologies.pdf",
    },
    {
      company: "JPL IT Solution",
      role: "Frontend Developer Intern",
      period: "Aug 2025 – Sept 2025",
      description:
        "Built and optimized the customer-facing experience of an online grocery delivery platform, turning complex shopping and delivery workflows into responsive, intuitive interfaces.",
      tech: [
        "JavaScript",
        "TypeScript",
        "React.js",
        "REST APIs",
        "Tailwind CSS",
      ],
      highlights: [
        "Interface at Scale: Built 50+ responsive and reusable UI components for the grocery platform, creating a consistent shopping experience across desktop, tablet, and mobile devices.",
        "API Integration: Integrated 30+ RESTful APIs across product discovery, cart, orders, and delivery workflows, connecting frontend experiences with backend services and improving overall application performance and mobile compatibility by 30%.",
        "Built for Real Users: Translated real-world e-commerce workflows into responsive interfaces, focusing on smooth navigation, reusable components, and reliable API-driven interactions.",
      ],
    },
  ],
  projects: [
    {
      title: "DevMatch",
      subtitle: "Social Media App for Developers",
      period: "Dec 2025",
      description:
        "A developer networking platform built around skill-based discovery, real-time conversations, and premium experiences, taking users from matching with like-minded developers to connecting instantly.",
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Socket.io",
        "Razorpay",
        "AWS EC2",
      ],
      highlights: [
        "Match by What You Build: Architected a swipe-based developer networking platform that connects users through shared skills and interests, with a React frontend backed by Node.js, Express.js, and MongoDB.",
        "Real-Time Connections: Built instant messaging between matched developers using Socket.IO, enabling persistent real-time communication without relying on repeated API polling.",
        "API & Performance: Designed 20+ RESTful APIs covering user profiles, developer discovery, matching, and messaging, while introducing lazy loading to reduce redundant network requests and improve the browsing experience.",
        "Built to Ship: Integrated a sandboxed Razorpay payment flow for premium features and deployed the complete application on AWS EC2 as a publicly accessible production system.",
      ],
      links: {
        live: "https://devmatch.live/",
        github: "https://github.com/vaidyad18/DevMatch-Web",
      },
    },
    {
      title: "CareerPilot",
      subtitle: "AI-Powered Career Management Platform",
      period: "Mar 2026",
      description:
        "An AI-powered career companion that turns the job hunt into a structured workflow, from building ATS-ready resumes and preparing for interviews to tracking applications and making data-driven career decisions.",
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Google Gemini",
        "LinkedIn API",
      ],
      highlights: [
        "Career, Automated: Built prompt-engineered workflows with Google Gemini 2.5 Flash to generate ATS-friendly resumes, professional summaries, and project descriptions tailored to each user's experience.",
        "Your Personal Interview Coach: Integrated Gemini-powered workflows to dynamically generate MCQ assessments, interview preparation material, and personalized career guidance based on the user's profile and goals.",
        "Jobs in One Pipeline: Engineered a job-tracking workflow ingesting 1,000+ listings through the LinkedIn API, giving users a single place to discover opportunities, track applications, and manage their job search.",
        "From Application to Analytics: Added PDF resume export and an analytics dashboard to turn application history into actionable insights and give users visibility into their overall job-search progress.",
      ],
      links: {
        github: "https://github.com/vaidyad18/CareerPilot",
      },
    },
  ],
  education: [
    {
      institution: "Dr. Akhilesh Das Gupta Institute of Professional Studies, New Delhi",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      period: "Nov 2022 – Jun 2026",
    },
    {
      institution: "Darbari Lal DAV Model School, New Delhi",
      degree: "CBSE Class XII, PCM + Computer Science",
      period: "2022",
    },
  ],
};

/**
 * Canonical helper to derive consistent project URL slugs from titles.
 */
export function getProjectSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export interface NavRoute {
  name: string;
  path: string;
  description: string;
}

/**
 * Centralized static navigation routes derived for Sitelinks, Sitemaps, and Breadcrumbs.
 */
export const staticRoutes: NavRoute[] = [
  {
    name: "Projects",
    path: "/projects",
    description:
      "Explore projects built by Vaidya Dandriyal, spanning full-stack development, AI-powered applications, and data engineering.",
  },
  {
    name: "Experience",
    path: "/experience",
    description:
      "Explore Vaidya Dandriyal's software engineering experience across full-stack development, frontend engineering, APIs, cloud, and data engineering.",
  },
  {
    name: "About",
    path: "/about",
    description:
      "Learn about Vaidya Dandriyal's engineering background, technical interests, projects, and approach to building software.",
  },
  {
    name: "Resume",
    path: profile.resumeUrl,
    description:
      "View Vaidya Dandriyal's resume, including professional experience, technical skills, projects, and education.",
  },
];

/**
 * Dynamically synthesizes the canonical disambiguation description from profile data.
 */
export function getDisambiguatingDescription(p = profile): string {
  const projectsList = p.projects.map((proj) => proj.title).join(" and ");
  const companiesList = p.experience.map((exp) => exp.company).join(", ");
  return `${p.tagline} based in ${p.location} (creator of ${projectsList}, with completed engineering internships at ${companiesList}; ${p.disambiguation || ""})`.trim();
}

