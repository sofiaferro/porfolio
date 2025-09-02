"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ProjectCarousel from "./project-carousel";

interface ProjectImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface Project {
  id: string;
  title: string;
  categoryLabel: string;
  category: string;
  image: string;
  description?: string;
  year?: string;
  client?: string;
  technologies?: string[];
  link?: string;
  video?: string;
  images?: ProjectImage[];
  gallery?: any[];
}

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  // Simple text processing for basic markdown-like formatting
  const formatText = (text: string) => {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\`/g, '`')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .split('\n')
      .map((line, index) => {
        if (line.trim().startsWith('- ')) {
          return `<li>${line.trim().substring(2)}</li>`;
        }
        return line.trim() ? `<p>${line}</p>` : '';
      })
      .filter(line => line)
      .join('');
  };

  const formattedDescription = project.description ? formatText(project.description) : '';

  return (
    <div className="group w-full">
      {/* Image Carousel */}
      <div className="mb-4">
        <ProjectCarousel
          images={project.images || []}
          fallbackImage={project.image}
          fallbackAlt={project.title}
        />
      </div>

      {/* Project Info */}
      <div className="space-y-3 md:space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="text-lg md:text-xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs md:text-sm font-mono text-gray-600 uppercase tracking-wider">
            {project.categoryLabel}
          </p>
        </div>

        {/* Description */}
        {formattedDescription && (
          <div 
            className="project-description text-gray-700 leading-relaxed text-xs md:text-sm w-full"
            dangerouslySetInnerHTML={{ __html: formattedDescription }}
          />
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-mono bg-gray-200 text-gray-700 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Year and Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs md:text-sm font-mono text-gray-600">
            {project.year}
          </span>
          
          <div className="flex items-center space-x-2">
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors rounded"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Live
              </Link>
            )}
            {project.video && (
              <Link
                href={project.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors rounded"
              >
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Video
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
