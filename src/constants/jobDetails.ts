import type { JobDetail } from "@/types";

/** Full job descriptions, mirroring the source data.json. */
export const jobDetails: Record<string, JobDetail> = {
  "Software_Tester": {
    "slug": "Software_Tester",
    "title": "Software Tester",
    "experience": "0 - 4 YRS OF EXPERIENCE",
    "jobcode": "PI023",
    "qualifications": [
      "0 - 4 years of experience",
      "Experience in manual testing",
      "Experience in working in agile methodology",
      "Knowledge of testing life cycle and testing process",
      "Should have knowledge of QA processes like test plans, test cases, and bug reporting",
      "Good knowledge of Database Testing, Regression Testing, Integration Testing, Functional Testing, Smoke Testing, Security Testing, Sanity Testing, Performance Testing, Mobile Testing, etc.",
      "Should have knowledge of bug tracking tools like JIRA, Team Foundation Server",
      "Team player as well as a self-starter who needs little supervision"
    ],
    "skills": [],
    "responsibilities": []
  },
  "Senior_Tester": {
    "slug": "Senior_Tester",
    "title": "Senior Tester",
    "experience": "4+ YRS OF EXPERIENCE",
    "jobcode": "PI023",
    "qualifications": [
      "4+ years of experience"
    ],
    "skills": [
      "Strong experience in manual testing",
      "Experience in working in agile methodology. Involved in all meetings – sprint planning, daily scrum calls, etc.",
      "Demo of user stories to client/stakeholder",
      "Updating test plan status to the test manager on a weekly basis",
      "Should have knowledge of QA processes like test plans, test cases, and bug reporting",
      "Knowledge of testing life cycle and testing process",
      "Good knowledge of Database Testing, Regression Testing, Integration Testing, Functional Testing, Smoke Testing, Security Testing, Sanity Testing, Performance Testing, Mobile Testing, etc.",
      "Should have knowledge of bug tracking tools like JIRA, Team Foundation Server",
      "Good to have knowledge of automation testing tools and technologies",
      "Ability to work under pressure, and deliver on time",
      "Team player as well as a self-starter who needs little supervision"
    ],
    "responsibilities": [
      "Excellent written and verbal communication skills",
      "Outstanding teamwork and collaboration skills",
      "Understanding of software development life-cycle and methodologies",
      "Ability to troubleshoot, research, and work through complex problems",
      "Good presentation skills"
    ]
  },
  "MERN_DEVELOPER": {
    "slug": "MERN_DEVELOPER",
    "title": "MERN Developer",
    "experience": "3 - 6 YRS OF EXPERIENCE",
    "jobcode": "PI023",
    "qualifications": [
      "3 - 6 years of experience",
      "Experience with other front-end libraries and frameworks (e.g., Redux, Angular, Vue.js).",
      "Knowledge of GraphQL.",
      "Familiarity with containerization and orchestration (e.g., Docker, Kubernetes).",
      "Experience with continuous integration and continuous deployment (CI/CD) pipelines.",
      "Understanding of web security best practices."
    ],
    "skills": [
      "Bachelor's degree in Computer Science, Information Technology, or related field (or equivalent work experience).",
      "Proven experience as a MERN developer or similar role.",
      "Strong proficiency in JavaScript, HTML, CSS, and related technologies.",
      "Proficiency in React.js for front-end development.",
      "Proficiency in Node.js and Express.js for back-end development.",
      "Experience with MongoDB or other NoSQL databases.",
      "Knowledge of RESTful API design and development.",
      "Familiarity with version control systems (e.g., Git).",
      "Experience with deployment and hosting platforms.",
      "Strong problem-solving and debugging skills.",
      "Excellent teamwork and communication skills.",
      "Ability to work independently and meet project deadlines."
    ],
    "responsibilities": {
      "Front-end Development": [
        "Develop user-friendly web interfaces using React.js.",
        "Implement responsive design principles for a seamless user experience across various devices and screen sizes.",
        "Integrate third-party APIs and libraries as needed.",
        "Debug and optimize client-side code for performance and scalability."
      ],
      "Back-end Development": [
        "Build and maintain server-side applications using Node.js and Express.js.",
        "Design and implement RESTful APIs for data communication.",
        "Create and manage databases using MongoDB, including schema design, indexing, and querying.",
        "Implement user authentication and authorization mechanisms."
      ],
      "Full-stack Development": [
        "Collaborate with front-end and back-end developers to ensure seamless integration between the client and server sides.",
        "Work on both new projects and the enhancement of existing applications."
      ],
      "Documentation": [
        "Create and maintain technical documentation for code, APIs, and system architecture.",
        "Collaborate with other team members to ensure knowledge sharing."
      ],
      "Stay Current with Industry Trends": [
        "Keep up-to-date with the latest trends and technologies in web development.",
        "Proactively suggest improvements and optimizations for existing projects."
      ]
    }
  }
};
