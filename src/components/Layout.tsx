"use client";

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import ClickButton from './ClickButton';
import GameStats from './GameStats';
import MessagePopup from './MessagePopup';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: "Personal Portfolio",
    description: "A game-like interactive portfolio built with Next.js and Framer Motion.",
    link: "https://github.com/yourusername/portfolio"
  },
  {
    title: "CLI Tool",
    description: "A command-line interface tool for automating development workflows.",
    link: "https://github.com/yourusername/cli-tool"
  },
  {
    title: "API Server",
    description: "A RESTful API server built with Node.js and Express.",
    link: "https://github.com/yourusername/api-server"
  }
];

export default function Layout() {
  const { unlockedSections, upgrades } = useGameStore();
  
  // Determine which projects to show based on upgrades
  const showProjects = {
    first: unlockedSections.projects,
    second: upgrades.find(u => u.id === 'hackathon')?.unlocked,
    third: upgrades.find(u => u.id === 'open-source')?.unlocked
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <MessagePopup />
      
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold">Jason Li</h1>
        {unlockedSections.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-gray-600 mt-2"
          >
            CS + CE @ CWRU · Building with intention
          </motion.p>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Section - Projects */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: unlockedSections.projects ? 1 : 0, x: unlockedSections.projects ? 0 : -100 }}
          className="w-1/3 p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="space-y-4">
            {showProjects.first && (
              <ProjectCard {...projects[0]} delay={0.2} />
            )}
            {showProjects.second && (
              <ProjectCard {...projects[1]} delay={0.4} />
            )}
            {showProjects.third && (
              <ProjectCard {...projects[2]} delay={0.6} />
            )}
          </div>
        </motion.div>

        {/* Center Section - Game */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-8">
          <ClickButton />
          <GameStats />
        </div>

        {/* Right Section - Resume & Contact */}
        <div className="w-1/3 p-8">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Resume</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Resume
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
          >
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <a
              href="mailto:jasonli2446@gmail.com"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              jasonli2446@gmail.com
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 