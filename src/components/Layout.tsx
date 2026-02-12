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
import Experience from './Experience';
import SoundEffects from './SoundEffects';
import { useState, useEffect } from 'react';

const projects = [
  {
    title: "CampusGuessr",
    description: "GeoGuessr-inspired game for CWRU played by 1,000+ students, featuring 360° locations, leaderboards, and real-time multiplayer.",
    link: "https://github.com/jasonli2446/campusguessr"
  },
  {
    title: "AI Avatar Kiosk",
    description: "Permanent interactive exhibit at CWRU's Weatherhead School with real-time AI avatar conversations via WebRTC and SSO authentication.",
    link: "https://github.com/jasonli2446"
  },
  {
    title: "AI Benchmarking Platform",
    description: "Full-stack platform used by 5 paying clients to evaluate and benchmark organizational AI adoption and maturity.",
    link: "https://github.com/jasonli2446"
  },
  {
    title: "SnapMenu",
    description: "AI-powered mobile app that scans restaurant menus and displays real dish images using computer vision.",
    link: "https://github.com/jasonli2446/snapmenu"
  },
  {
    title: "Ariadne",
    description: "Tool that generates complete HTML pages on the fly using LLMs, turning natural language prompts into functional web pages.",
    link: "https://github.com/jasonli2446/ariadne"
  },
  {
    title: "BrickdUp",
    description: "Real-time puzzle platformer built in Unity featuring player-placeable tiles and cooperative gameplay mechanics.",
    link: "https://github.com/jasonli2446/BrickdUp"
  }
];

export default function Layout() {
  const { unlockedSections, upgrades, xp } = useGameStore();
  const [hasClicked, setHasClicked] = useState(false);
  const [hasShownKeepClicking, setHasShownKeepClicking] = useState(false);

  // Rehydrate Zustand persist store on client mount
  useEffect(() => {
    useGameStore.persist.rehydrate();
  }, []);
  
  // Determine which projects to show based on upgrades
  const showProjects = {
    first: unlockedSections.projects,
    second: upgrades.find(u => u.id === 'hackathon')?.unlocked,
    third: upgrades.find(u => u.id === 'javascript')?.unlocked,
    fourth: upgrades.find(u => u.id === 'game-dev')?.unlocked,
    fifth: upgrades.find(u => u.id === 'python')?.unlocked,
    sixth: upgrades.find(u => u.id === 'ml')?.unlocked
  };

  const upgradeCount = upgrades.filter(u => u.unlocked).length;
  const shouldAllowScroll = upgradeCount >= 2;
  const allUpgradesPurchased = upgrades.every(u => u.unlocked);

  useEffect(() => {
    if (xp >= 10) {
      setHasShownKeepClicking(true);
    }
  }, [xp]);

  // Unified scroll management
  useEffect(() => {
    if (xp === 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isDesktop) {
      // Desktop: never allow page-level scroll; columns handle their own overflow
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
    } else if (shouldAllowScroll) {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
    } else {
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
    }

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
    };
  }, [shouldAllowScroll, xp]);

  const getWelcomeText = () => {
    if (!hasClicked) {
      return "Welcome to my portfolio! Click the button below to earn XP.";
    }
    if (!hasShownKeepClicking) {
      return "Keep clicking to earn more XP!";
    }
    if (upgrades.every(u => u.unlocked)) {
      return "Thanks for exploring my portfolio! Feel free to reset and play again.";
    }
    return "Unlock upgrades to learn more about me.";
  };

  return (
    <div className="lg:h-full w-full">
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:max-h-screen w-full">
        <MessagePopup />
        <SoundEffects />
        
        {/* Main Content */}
        <main className="flex flex-col lg:flex-row lg:h-screen w-full max-w-[1800px] mx-auto pb-8 lg:pb-0 px-4 lg:px-0">
          {/* Left Section - Projects */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: unlockedSections.projects ? 1 : 0, x: unlockedSections.projects ? 0 : -100 }}
            className="w-full lg:w-1/3 p-4 lg:p-2 lg:pt-3 text-center text-[#1C1C1C] order-2 lg:order-1 mb-[32px] lg:mb-0 lg:overflow-y-auto lg:h-screen hide-scrollbar"
          >
            <h2 className="text-[min(28px,4vh)] lg:text-[min(22px,3vh)] font-bold mb-4 lg:mb-2 underline decoration-2 mt-12 lg:mt-0">Projects</h2>
            <div className="space-y-12 lg:space-y-2 w-full">
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
          <div 
            className="w-full lg:w-1/3 flex flex-col items-center justify-start text-center pt-4 lg:pt-2 order-1 lg:order-2 mb-24 lg:mb-0"
          >
            <div className="text-center text-[#1C1C1C] mt-12 lg:mt-4 mb-[40px] lg:mb-[20px]">
              <h1 className="text-[min(48px,5vh)] lg:text-[min(60px,6vh)] lg:mb-8 md:text-[min(56px,6vh)] sm:text-[min(28px,4vh)] h-[48px] font-bold">Jason Li</h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: unlockedSections.subtitle ? 1 : 0 }}
                className="text-[min(20px,3vh)] lg:text-[min(18px,2.5vh)] sm:text-[min(16px,2vh)] h-[24px] text-[#6B7280] mt-[30px] lg:mt-[10px]"
              >
                {unlockedSections.subtitle ? "AI-focused full stack engineer and researcher" : ""}
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[min(24px,2.2vh)] text-[#4B5563] mb-2 lg:mb-8 h-[100px] lg:h-[40px] flex items-center justify-center px-4"
            >
              {getWelcomeText()}
            </motion.p>
            <ClickButton onFirstClick={() => setHasClicked(true)} />
            <div className="mt-[-120px] lg:mt-[-80px]">
              <GameStats hasClicked={hasClicked} />
            </div>
          </div>

          {/* Right Section - Resume, Skills & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full lg:w-1/3 p-4 lg:p-2 lg:pt-2 text-center text-[#1C1C1C] order-3 lg:overflow-y-auto lg:h-screen hide-scrollbar ${allUpgradesPurchased ? 'pb-[64px] lg:pb-2' : ''}`}
          >
            <div className="flex flex-col gap-[min(50px,4vh)] lg:gap-[min(6px,0.8vh)] relative">
              {unlockedSections.skills && <Skills />}
              {unlockedSections.experience && <Experience />}
              {unlockedSections.currentWork && <CurrentWork />}

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
                className="w-full"
              >
                <h2 className="text-[min(28px,4vh)] lg:text-[min(18px,2.2vh)] font-bold mb-8 lg:mb-1 underline decoration-2">Resume</h2>
                <div className="flex justify-center">
                  <a
                    href="https://jasonli2446.github.io/portfolio/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[12px] lg:gap-[8px] cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(28px,min(4vw,4vh))] lg:h-[min(28px,min(4vw,4vh))] rounded-[8px] lg:rounded-[4px] bg-blue-500/20 p-[min(8px,min(0.8vw,0.8vh))] lg:p-[min(4px,min(0.4vw,0.4vh))] shadow-md">
                      <img 
                        src="https://jasonli2446.github.io/portfolio/file.svg"
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
                <h2 className="text-[min(28px,4vh)] lg:text-[min(18px,2.2vh)] font-bold mb-8 lg:mb-1 underline decoration-2">Contact</h2>
                <div className="flex justify-center items-center gap-[32px] lg:gap-[16px]">
                  <a
                    href="mailto:jasonli2446@gmail.com"
                    className="flex flex-col items-center gap-[4px] lg:gap-0 cursor-pointer hover:opacity-80 transition-opacity w-[120px] lg:w-auto"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(28px,min(4vw,4vh))] lg:h-[min(28px,min(4vw,4vh))] rounded-[8px] lg:rounded-[4px] bg-red-500/20 p-[min(8px,min(0.8vw,0.8vh))] lg:p-[min(4px,min(0.4vw,0.4vh))] shadow-md">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                        alt="Email"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] lg:text-[min(9px,1.1vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">jasonli2446@gmail.com</div>
                  </a>
                  <a
                    href="https://linkedin.com/in/jasonli2446"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-[4px] lg:gap-0 cursor-pointer hover:opacity-80 transition-opacity w-[120px] lg:w-auto"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(28px,min(4vw,4vh))] lg:h-[min(28px,min(4vw,4vh))] rounded-[8px] lg:rounded-[4px] bg-blue-600/20 p-[min(8px,min(0.8vw,0.8vh))] lg:p-[min(4px,min(0.4vw,0.4vh))] shadow-md">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                        alt="LinkedIn"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] lg:text-[min(9px,1.1vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">LinkedIn</div>
                  </a>
                  <a
                    href="https://github.com/jasonli2446"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-[4px] lg:gap-0 cursor-pointer hover:opacity-80 transition-opacity w-[120px] lg:w-auto"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(28px,min(4vw,4vh))] lg:h-[min(28px,min(4vw,4vh))] rounded-[8px] lg:rounded-[4px] bg-gray-800/20 p-[min(8px,min(0.8vw,0.8vh))] lg:p-[min(4px,min(0.4vw,0.4vh))] shadow-md">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                        alt="GitHub"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] lg:text-[min(9px,1.1vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">GitHub</div>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: unlockedSections.contact ? 1 : 0, x: unlockedSections.contact ? 0 : 100 }}
                className="w-full mt-[min(20px,2vh)] lg:mt-[min(4px,0.5vh)]"
              >
                <ResetButton />
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 