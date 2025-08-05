import React, { useState } from "react";
import { useSound } from "../utils/hooks";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  status: "completed" | "in-progress" | "planning";
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  year: number;
}

const ProjectsApp: React.FC = () => {
  const { playSound } = useSound();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // TODO: Replace with actual portfolio projects data
  const projects: Project[] = [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      longDescription:
        "A comprehensive e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, and admin dashboard for inventory management.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      category: "Web Development",
      status: "completed",
      liveUrl: "https://your-ecommerce-demo.com",
      githubUrl: "https://github.com/yourusername/ecommerce-platform",
      year: 2024,
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      longDescription:
        "A collaborative task management application with real-time synchronization, team collaboration features, and advanced project tracking. Built with React Native for cross-platform compatibility.",
      technologies: ["React Native", "Firebase", "TypeScript", "Socket.io"],
      category: "Mobile Development",
      status: "completed",
      liveUrl: "https://your-task-app.com",
      githubUrl: "https://github.com/yourusername/task-manager",
      caseStudyUrl: "https://your-portfolio.com/case-study/task-manager",
      year: 2023,
    },
    {
      id: "3",
      title: "AI Chat Interface",
      description: "Modern chat interface with AI integration",
      longDescription:
        "An advanced chat interface featuring AI integration, real-time messaging, file sharing, and custom emoji support. Includes both web and mobile implementations.",
      technologies: ["React", "OpenAI API", "WebSocket", "Redis"],
      category: "AI/ML",
      status: "in-progress",
      githubUrl: "https://github.com/yourusername/ai-chat",
      year: 2024,
    },
    {
      id: "4",
      title: "Design System",
      description: "Comprehensive component library and design system",
      longDescription:
        "A complete design system with reusable components, documentation, and guidelines. Includes Storybook integration, automated testing, and npm package distribution.",
      technologies: ["React", "Storybook", "Tailwind CSS", "TypeScript"],
      category: "Design",
      status: "completed",
      liveUrl: "https://your-design-system.com",
      githubUrl: "https://github.com/yourusername/design-system",
      year: 2023,
    },
  ];

  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const handleProjectClick = (project: Project) => {
    playSound("click");
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    playSound("click");
    setSelectedProject(null);
  };

  const handleFilterChange = (newFilter: string) => {
    playSound("click");
    setFilter(newFilter);
    setSelectedProject(null);
  };

  const openLink = (url: string) => {
    playSound("open");
    window.open(url, "_blank");
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "planning":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (selectedProject) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 overflow-y-auto">
        {/* Project Detail Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <button
            onClick={handleBackToList}
            className="mb-4 flex items-center text-blue-100 hover:text-white transition-colors"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-bold mb-2">{selectedProject.title}</h1>
          <p className="text-blue-100 text-lg">{selectedProject.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                selectedProject.status
              )}`}
            >
              {selectedProject.status.replace("-", " ").toUpperCase()}
            </span>
            <span className="text-blue-100">{selectedProject.year}</span>
          </div>
        </div>

        {/* Project Detail Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedProject.longDescription}
            </p>
          </section>

          {/* Technologies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedProject.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                           rounded-lg text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Project Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProject.liveUrl && (
                <button
                  onClick={() => openLink(selectedProject.liveUrl!)}
                  className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors 
                           duration-200 shadow-md hover:shadow-lg text-center"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-medium">Live Demo</div>
                </button>
              )}
              {selectedProject.githubUrl && (
                <button
                  onClick={() => openLink(selectedProject.githubUrl!)}
                  className="p-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-colors 
                           duration-200 shadow-md hover:shadow-lg text-center"
                >
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium">Source Code</div>
                </button>
              )}
              {selectedProject.caseStudyUrl && (
                <button
                  onClick={() => openLink(selectedProject.caseStudyUrl!)}
                  className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors 
                           duration-200 shadow-md hover:shadow-lg text-center"
                >
                  <div className="text-2xl mb-2">📖</div>
                  <div className="font-medium">Case Study</div>
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          My Projects
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category === "all" ? "All Projects" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all 
                       duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 
                       hover:border-blue-300 dark:hover:border-blue-600 group"
            >
              {/* Project Image Placeholder */}
              <div
                className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl 
                           flex items-center justify-center text-white text-4xl"
              >
                🚀
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 
                               dark:group-hover:text-blue-400 transition-colors"
                  >
                    {project.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                               rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   rounded text-xs"
                    >
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No projects found
            </h2>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your filter or check back later for new projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsApp;
