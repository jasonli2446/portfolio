"use client";

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import ClickButton from './ClickButton';
import GameStats from './GameStats';
import MessagePopup from './MessagePopup';
import ProjectCard from './ProjectCard';
import ResetButton from './ResetButton';
import Skills from './Skills';
import CurrentWork from './CurrentWork';

const projects = [
  {
    title: "SnapMenu",
    description: "AI-powered mobile app that scans menus and displays dish information with real images. Built with React Native, FastAPI, and OpenAI. Features OCR menu scanning, AI-generated dish summaries, and real food image search.",
    link: "https://github.com/jasonli2446/snapmenu"
  },
  {
    title: "ExpressInk",
    description: "AI app built for HackCWRU 2025 that analyzes artwork to provide mood insights for parents of nonverbal autistic children. Features include image analysis, mood tracking, and interactive drawing tools.",
    link: "https://github.com/jasonli2446/ExpressInkFrontend"
  },
  {
    title: "Turret Dodge Game",
    description: "Browser-based survival game where players dodge bullets from turrets. Features include progressive difficulty, power-ups, and real-time combat mechanics.",
    link: "https://github.com/jasonli2446/turret-dodge-game"
  },
  {
    title: "Brick'd Up",
    description: "Unity-based puzzle platformer where players place blocks to create paths. Features include physics-based gameplay, resource management, and progressive difficulty.",
    link: "https://github.com/jasonli2446/BrickdUp"
  },
  {
    title: "Blackjack Simulator",
    description: "Python-based blackjack simulator with strategy analysis. Features include probability calculations, betting strategies, and statistical analysis.",
    link: "https://github.com/jasonli2446/blackjack-simulator"
  },
  {
    title: "Premier League Prediction Model",
    description: "Machine learning model using random forest regression to predict Premier League standings. Achieved 75% accuracy within two positions and R² of 0.73 for 2024 season.",
    link: "https://github.com/jasonli2446/premier-league-predictor"
  }
];

export default function Layout() {
  const { unlockedSections, upgrades } = useGameStore();
  
  // Determine which projects to show based on upgrades
  const showProjects = {
    first: unlockedSections.projects,
    second: upgrades.find(u => u.id === 'hackathon')?.unlocked,
    third: upgrades.find(u => u.id === 'javascript')?.unlocked,
    fourth: upgrades.find(u => u.id === 'game-dev')?.unlocked,
    fifth: upgrades.find(u => u.id === 'python')?.unlocked,
    sixth: upgrades.find(u => u.id === 'ml')?.unlocked
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <MessagePopup />
      
      {/* Header */}
      <div className="relative h-32 w-full">
        <header className="absolute inset-0 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Jason Li</h1>
          {unlockedSections.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-gray-600 mt-2"
            >
              AI-driven full stack engineer | Researcher | Builder of practical, high-impact tools
            </motion.p>
          )}
        </header>
      </div>

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
              <ProjectCard {...projects[1]} delay={0.2} />
            )}
            {showProjects.third && (
              <ProjectCard {...projects[2]} delay={0.2} />
            )}
            {showProjects.fourth && (
              <ProjectCard {...projects[3]} delay={0.2} />
            )}
            {showProjects.fifth && (
              <ProjectCard {...projects[4]} delay={0.2} />
            )}
            {showProjects.sixth && (
              <ProjectCard {...projects[5]} delay={0.2} />
            )}
          </div>
        </motion.div>

        {/* Center Section - Game */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-8">
          <ClickButton />
          <GameStats />
        </div>

        {/* Right Section - Resume, Skills & Contact */}
        <div className="w-1/3 p-8 relative">
          <div className="relative min-h-[600px]">
            {unlockedSections.skills && <Skills />}
            {unlockedSections.currentWork && <CurrentWork />}

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
              className="absolute top-[400px] left-0 right-0"
            >
              <h2 className="text-2xl font-bold mb-4">Resume</h2>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Resume
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
              className="absolute top-[500px] left-0 right-0"
            >
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <div className="space-y-2">
                <a
                  href="mailto:jasonli2446@gmail.com"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  jasonli2446@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-[600px]">
            <ResetButton />
          </div>
        </div>
      </main>
    </div>
  );
} 