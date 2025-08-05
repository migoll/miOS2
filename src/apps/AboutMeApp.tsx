import React from "react";
import { useSound } from "../utils/hooks";

const AboutMeApp: React.FC = () => {
  const { playSound } = useSound();

  // TODO: Replace with actual portfolio data
  const aboutData = {
    name: "Your Name",
    title: "Your Professional Title",
    intro: "A brief introduction about yourself and your work...",
    skills: ["React", "TypeScript", "Node.js", "Python", "Design", "UI/UX"],
    contact: {
      email: "your.email@example.com",
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername",
      website: "https://yourwebsite.com",
    },
  };

  const handleSkillClick = (skill: string) => {
    playSound("click");
    console.log(`Clicked skill: ${skill}`);
  };

  const handleContactClick = (url: string) => {
    playSound("click");
    window.open(url, "_blank");
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
            {aboutData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {aboutData.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {aboutData.title}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {aboutData.intro}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap gap-3">
            {aboutData.skills.map((skill, index) => (
              <button
                key={index}
                onClick={() => handleSkillClick(skill)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full 
                         hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all 
                         duration-200 shadow-md hover:shadow-lg"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Get In Touch
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() =>
                handleContactClick(`mailto:${aboutData.contact.email}`)
              }
              className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <div className="text-2xl mb-2">📧</div>
              <div className="text-sm font-medium">Email</div>
            </button>
            <button
              onClick={() => handleContactClick(aboutData.contact.linkedin)}
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-medium">LinkedIn</div>
            </button>
            <button
              onClick={() => handleContactClick(aboutData.contact.github)}
              className="p-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <div className="text-2xl mb-2">💻</div>
              <div className="text-sm font-medium">GitHub</div>
            </button>
            <button
              onClick={() => handleContactClick(aboutData.contact.website)}
              className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm font-medium">Website</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeApp;
