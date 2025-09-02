"use client";

import { ReactNode } from "react";

interface ThreeColumnLayoutProps {
  profileColumn: ReactNode;
  projectsColumn: ReactNode;
  blogColumn: ReactNode;
}

export default function ThreeColumnLayout({
  profileColumn,
  projectsColumn,
  blogColumn,
}: ThreeColumnLayoutProps) {
  return (
    <div className="h-screen bg-[#f5f5f0] dark:bg-neutral-900 pt-4 overflow-x-hidden">
      {/* Desktop Layout - 3 Columns */}
      <div className="hidden lg:flex h-full">
        {/* Left Column - Profile (~25%) */}
        <div className="w-1/4 border-r border-gray-300 h-full overflow-y-auto custom-scrollbar">
          {profileColumn}
        </div>
        
        {/* Center Column - Projects (~50%) */}
        <div className="w-1/2 border-r border-gray-300 h-full overflow-y-auto custom-scrollbar">
          {projectsColumn}
        </div>
        
        {/* Right Column - Blog (~25%) */}
        <div className="w-1/4 h-full overflow-y-auto custom-scrollbar">
          {blogColumn}
        </div>
      </div>

      {/* Tablet Layout - 2 Columns */}
      <div className="hidden md:flex lg:hidden h-full">
        {/* Left Column - Profile + Blog (40%) */}
        <div className="w-2/5 border-r border-gray-300 h-full flex flex-col">
          <div className="h-1/2 border-b border-gray-300 overflow-y-auto custom-scrollbar">
            {profileColumn}
          </div>
          <div className="h-1/2 overflow-y-auto custom-scrollbar">
            {blogColumn}
          </div>
        </div>
        
        {/* Right Column - Projects (60%) */}
        <div className="w-3/5 h-full overflow-y-auto custom-scrollbar">
          {projectsColumn}
        </div>
      </div>

      {/* Mobile Layout - Stacked single scroll: Profile -> Projects -> Blog */}
      <div className="flex flex-col md:hidden min-h-screen">
        <div className="border-b border-gray-300">
          {profileColumn}
        </div>

        <div className="border-b border-gray-300">
          {projectsColumn}
        </div>

        <div>
          {blogColumn}
        </div>
      </div>
    </div>
  );
}
