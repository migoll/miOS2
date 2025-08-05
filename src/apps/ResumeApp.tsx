import React, { useState } from "react";
import { useSound } from "../utils/hooks";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies?: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
  achievements?: string[];
}

const ResumeApp: React.FC = () => {
  const { playSound } = useSound();
  const [activeSection, setActiveSection] = useState<
    "overview" | "experience" | "education" | "skills"
  >("overview");

  // TODO: Replace with actual resume data
  const resumeData = {
    personalInfo: {
      name: "Your Name",
      title: "Software Developer & Designer",
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "Your City, State",
      website: "https://yourwebsite.com",
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername",
    },
    summary:
      "Passionate software developer with 5+ years of experience creating innovative web and mobile applications. Skilled in full-stack development, UI/UX design, and agile methodologies. Committed to writing clean, efficient code and delivering exceptional user experiences.",
    experience: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "Tech Company Inc.",
        period: "2022 - Present",
        description: [
          "Led development of React-based web applications serving 100K+ users",
          "Collaborated with design team to implement responsive, accessible UI components",
          "Optimized application performance, reducing load times by 40%",
          "Mentored junior developers and conducted code reviews",
        ],
        technologies: ["React", "TypeScript", "Node.js", "AWS"],
      },
      {
        id: "2",
        title: "Full Stack Developer",
        company: "Startup Solutions LLC",
        period: "2020 - 2022",
        description: [
          "Built and maintained full-stack applications using React and Node.js",
          "Designed and implemented RESTful APIs and database schemas",
          "Worked in agile environment with cross-functional teams",
          "Contributed to product strategy and technical decision-making",
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "MongoDB"],
      },
      {
        id: "3",
        title: "Junior Web Developer",
        company: "Digital Agency Co.",
        period: "2019 - 2020",
        description: [
          "Developed responsive websites for various clients using modern web technologies",
          "Collaborated with designers to implement pixel-perfect layouts",
          "Maintained and updated existing client websites",
          "Learned and applied best practices in web development",
        ],
        technologies: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
      },
    ] as Experience[],
    education: [
      {
        id: "1",
        degree: "Bachelor of Science in Computer Science",
        institution: "University Name",
        period: "2015 - 2019",
        gpa: "3.8/4.0",
        achievements: [
          "Summa Cum Laude",
          "Dean's List for 6 semesters",
          "Computer Science Excellence Award",
        ],
      },
      {
        id: "2",
        degree: "Certified React Developer",
        institution: "Tech Certification Institute",
        period: "2020",
        achievements: [
          "Advanced React Patterns",
          "Performance Optimization",
          "Testing Best Practices",
        ],
      },
    ] as Education[],
    skills: {
      "Programming Languages": [
        "JavaScript",
        "TypeScript",
        "Python",
        "Java",
        "PHP",
      ],
      Frontend: ["React", "Vue.js", "HTML5", "CSS3", "Tailwind CSS", "SASS"],
      Backend: ["Node.js", "Express", "Django", "FastAPI", "REST APIs"],
      Database: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
      "Tools & Platforms": ["Git", "AWS", "Docker", "Webpack", "Vite"],
      Design: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping"],
    },
  };

  const handleSectionClick = (section: typeof activeSection) => {
    playSound("click");
    setActiveSection(section);
  };

  const handleDownloadResume = () => {
    playSound("click");
    // TODO: Replace with actual resume PDF URL
    const resumeUrl = "/path/to/your-resume.pdf";
    window.open(resumeUrl, "_blank");
  };

  const handleContactClick = (
    type: "email" | "phone" | "website" | "linkedin" | "github"
  ) => {
    playSound("click");
    const { personalInfo } = resumeData;

    switch (type) {
      case "email":
        window.open(`mailto:${personalInfo.email}`);
        break;
      case "phone":
        window.open(`tel:${personalInfo.phone}`);
        break;
      case "website":
        window.open(personalInfo.website, "_blank");
        break;
      case "linkedin":
        window.open(personalInfo.linkedin, "_blank");
        break;
      case "github":
        window.open(personalInfo.github, "_blank");
        break;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">
          {resumeData.personalInfo.name}
        </h2>
        <p className="text-blue-100 text-lg mb-4">
          {resumeData.personalInfo.title}
        </p>
        <p className="text-blue-100 leading-relaxed">{resumeData.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleContactClick("email")}
          className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-left"
        >
          <div className="text-2xl mb-2">📧</div>
          <div className="font-medium">Email</div>
          <div className="text-red-100 text-sm">
            {resumeData.personalInfo.email}
          </div>
        </button>

        <button
          onClick={() => handleContactClick("phone")}
          className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-left"
        >
          <div className="text-2xl mb-2">📱</div>
          <div className="font-medium">Phone</div>
          <div className="text-green-100 text-sm">
            {resumeData.personalInfo.phone}
          </div>
        </button>

        <button
          onClick={() => handleContactClick("linkedin")}
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-left"
        >
          <div className="text-2xl mb-2">💼</div>
          <div className="font-medium">LinkedIn</div>
          <div className="text-blue-100 text-sm">View Profile</div>
        </button>

        <button
          onClick={() => handleContactClick("github")}
          className="p-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-colors text-left"
        >
          <div className="text-2xl mb-2">💻</div>
          <div className="font-medium">GitHub</div>
          <div className="text-gray-300 text-sm">View Repositories</div>
        </button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {resumeData.experience.map((exp) => (
        <div
          key={exp.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {exp.title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {exp.company}
              </p>
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 md:mt-0">
              {exp.period}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            {exp.description.map((item, index) => (
              <li
                key={index}
                className="text-gray-600 dark:text-gray-300 flex items-start"
              >
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>

          {exp.technologies && (
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                           rounded-lg text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {resumeData.education.map((edu) => (
        <div
          key={edu.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {edu.degree}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {edu.institution}
              </p>
              {edu.gpa && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  GPA: {edu.gpa}
                </p>
              )}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 md:mt-0">
              {edu.period}
            </span>
          </div>

          {edu.achievements && (
            <ul className="space-y-1">
              {edu.achievements.map((achievement, index) => (
                <li
                  key={index}
                  className="text-gray-600 dark:text-gray-300 flex items-start"
                >
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {Object.entries(resumeData.skills).map(([category, skills]) => (
        <div
          key={category}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                         rounded-lg text-sm font-medium shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const sections = [
    { key: "overview", label: "Overview", icon: "👤" },
    { key: "experience", label: "Experience", icon: "💼" },
    { key: "education", label: "Education", icon: "🎓" },
    { key: "skills", label: "Skills", icon: "🛠️" },
  ] as const;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Resume
          </h1>
          <button
            onClick={handleDownloadResume}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                     transition-colors font-medium shadow-md hover:shadow-lg"
          >
            📄 Download PDF
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => handleSectionClick(section.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeSection === section.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "overview" && renderOverview()}
        {activeSection === "experience" && renderExperience()}
        {activeSection === "education" && renderEducation()}
        {activeSection === "skills" && renderSkills()}
      </div>
    </div>
  );
};

export default ResumeApp;
