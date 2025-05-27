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
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col px-4 p-[16px]">
      <MessagePopup />
      <SoundEffects />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-row min-w-[1024px] max-w-[1800px] mx-auto w-full">
        {/* Left Section - Projects */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: unlockedSections.projects ? 1 : 0, x: unlockedSections.projects ? 0 : -100 }}
          className="w-1/3 p-4 lg:p-8 text-center text-[#1C1C1C]"
        >
          <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2">Projects</h2>
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
        <div className="w-1/3 flex flex-col items-center justify-start gap-12 text-center pt-4">
          <div className="text-center text-[#1C1C1C] mt-[20px] mb-[100px]">
            <h1 className="text-[min(48px,5vh)] md:text-[min(36px,4vh)] sm:text-[min(28px,3vh)] min-h-[48px] h-[48px] max-h-[48px] font-bold">Jason Li</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: unlockedSections.subtitle ? 1 : 0 }}
              className="text-[min(20px,3vh)] md:text-[min(18px,2.5vh)] sm:text-[min(16px,2vh)] min-h-[24px] h-[24px] max-h-[24px] text-[#6B7280] mt-[-8px]"
            >
              {unlockedSections.subtitle ? "AI-focused full stack engineer and researcher" : ""}
            </motion.p>
          </div>
          <ClickButton />
          <GameStats />
        </div>

        {/* Right Section - Resume, Skills & Contact */}
        <div className="w-1/3 p-4 lg:p-8 text-center text-[#1C1C1C]">
          <div className="flex flex-col gap-[min(32px,2vh)] relative">
            {unlockedSections.skills && <Skills />}
            {unlockedSections.currentWork && <CurrentWork />}

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
              className="w-full"
            >
              <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2">Resume</h2>
              <div className="flex justify-center">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[min(56px,min(8vw,8vh))] h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-blue-500 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                    <img 
                      src="/file.svg"
                      alt="Resume"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors">View PDF →</div>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
              className="w-full"
            >
              <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2">Contact</h2>
              <div className="flex justify-center items-center gap-[32px]">
                <a
                  href="mailto:jasonli2446@gmail.com"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[min(56px,min(8vw,8vh))] h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-red-500 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="Email"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors">jasonli2446@gmail.com</div>
                </a>
                <a
                  href="https://linkedin.com/in/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[min(56px,min(8vw,8vh))] h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-blue-600 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                      alt="LinkedIn"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors">LinkedIn</div>
                </a>
                <a
                  href="https://github.com/jasonli2446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-[min(56px,min(8vw,8vh))] h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-gray-800 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                      alt="GitHub"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors">GitHub</div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
              className="w-full mt-[min(20px,2vh)]"
            >
              <ResetButton />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 