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
import SoundEffects from './SoundEffects';

const projects = [
  {
    title: "SnapMenu",
    description: "AI-powered mobile app that scans menus and displays dish information with real images.",
    link: "https://github.com/jasonli2446/snapmenu"
  },
  {
    title: "ExpressInk",
    description: "AI app built for HackCWRU 2025 that analyzes artwork to provide mood insights for parents of nonverbal autistic children.",
    link: "https://github.com/jasonli2446/ExpressInkFrontend"
  },
  {
    title: "Turret Dodge Game",
    description: "Browser-based survival game where players dodge bullets from turrets.",
    link: "https://github.com/jasonli2446/turret-dodge-game"
  },
  {
    title: "Brick'd Up",
    description: "Unity-based puzzle platformer where players place blocks to create paths.",
    link: "https://github.com/jasonli2446/BrickdUp"
  },
  {
    title: "Blackjack Simulator",
    description: "Python-based blackjack simulator with strategy analysis, probability calculations, strategies, and statistical analysis.",
    link: "https://github.com/jasonli2446/blackjack-simulator"
  },
  {
    title: "Premier League Prediction Model",
    description: "Machine learning model that predicts Premier League standings.",
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
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col px-4">
      <MessagePopup />
      <SoundEffects />
      
      {/* Header */}
        <div className="relative h-32 w-full pt-[16px]">
        <header className="absolute inset-0 w-full flex flex-col items-center justify-center text-center text-[#1C1C1C]">
          <h1 className="text-[48px] font-bold">Jason Li</h1>
          {unlockedSections.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-[#1C1C1C] mt-[-8px]"
            >
              AI-focused full stack engineer and researcher
            </motion.p>
          )}
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex max-w-[1800px] mx-auto w-full">
        {/* Left Section - Projects */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: unlockedSections.projects ? 1 : 0, x: unlockedSections.projects ? 0 : -100 }}
          className="w-1/3 p-8 text-center text-[#1C1C1C]"
        >
          <h2 className="text-[28px] font-bold mb-4 underline decoration-2">Projects</h2>
          <div className="space-y-4 w-full">
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
        <div className="w-1/3 flex flex-col items-center justify-center gap-12 text-center py-8">
          <ClickButton />
          <GameStats />
        </div>

        {/* Right Section - Resume, Skills & Contact */}
        <div className="w-1/3 p-8 text-center text-[#1C1C1C]">
          <div className="relative min-h-[400px] w-full">
            {unlockedSections.skills && <Skills />}
            {unlockedSections.currentWork && <CurrentWork />}

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
              className="absolute top-[360px] left-0 right-0 w-full text-[#1C1C1C]"
            >
              <h2 className="text-[28px] font-bold mb-4 underline decoration-2">Resume</h2>
              <div className="flex justify-center">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-blue-500 p-[8px] shadow-md">
                    <img 
                      src="/file.svg"
                      alt="Resume"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[14px] font-medium hover:text-[#0077B6] transition-colors">View PDF →</div>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
              className="absolute top-[530px] left-0 right-0 w-full text-[#1C1C1C]"
            >
              <h2 className="text-[28px] font-bold mb-4 underline decoration-2">Contact</h2>
              <div className="flex justify-center items-center gap-[32px]">
                <a
                  href="mailto:jasonli2446@gmail.com"
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-red-500 p-[8px] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="Email"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[14px] font-medium hover:text-[#0077B6] transition-colors">Email</div>
                </a>
                <a
                  href="https://linkedin.com/in/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-blue-600 p-[8px] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                      alt="LinkedIn"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[14px] font-medium hover:text-[#0077B6] transition-colors">LinkedIn</div>
                </a>
                <a
                  href="https://github.com/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-gray-800 p-[8px] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                      alt="GitHub"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[14px] font-medium hover:text-[#0077B6] transition-colors">GitHub</div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
              className="mt-[52px] absolute top-[700px] left-0 right-0 w-full flex justify-center"
            >
              <ResetButton />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 