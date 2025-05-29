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
import { useState, useEffect } from 'react';

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
    description: "Unity-based puzzle platformer where players place blocks.",
    link: "https://github.com/jasonli2446/BrickdUp"
  },
  {
    title: "Blackjack Simulator",
    description: "Python-based blackjack simulator with strategy analysis, probability calculations, strategies, and statistical analysis.",
    link: "https://github.com/jasonli2446/blackjack-simulator"
  },
  {
    title: "Premier League Prediction Model",
    description: "Machine learning model that predicts table standings.",
    link: "https://github.com/jasonli2446/premier-league-predictor"
  }
];

export default function Layout() {
  const { unlockedSections, upgrades, xp } = useGameStore();
  const [hasClicked, setHasClicked] = useState(false);
  const [hasShownKeepClicking, setHasShownKeepClicking] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getBreakpointStatus = () => {
    return {
      sm: viewportWidth >= 640,
      md: viewportWidth >= 768,
      lg: viewportWidth >= 1024,
      xl: viewportWidth >= 1280
    };
  };
  
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

  // Watch for reset (when xp goes to 0)
  useEffect(() => {
    if (xp === 0) {
      // Force scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.classList.remove('allow-scroll');
    }
  }, [xp]);

  useEffect(() => {
    if (xp >= 10) {
      setHasShownKeepClicking(true);
    }
  }, [xp]);

  // Handle scroll behavior
  useEffect(() => {
    if (!shouldAllowScroll) {
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
      document.body.classList.remove('allow-scroll');
    } else {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.classList.add('allow-scroll');
    }

    // Cleanup function to ensure scroll is disabled when component unmounts
    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.classList.remove('allow-scroll');
    };
  }, [shouldAllowScroll]);

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
    <div className="h-full w-full">
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
        <MessagePopup />
        <SoundEffects />
        
        {/* Main Content */}
        <main className="flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto pb-8 px-4 lg:px-0">
          {/* Left Section - Projects */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: unlockedSections.projects ? 1 : 0, x: unlockedSections.projects ? 0 : -100 }}
            className="w-full lg:w-1/3 p-4 lg:p-4 text-center text-[#1C1C1C] order-2 lg:order-1 mb-[32px] lg:mb-0"
          >
            <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2 mt-12 lg:mt-0">Projects</h2>
            <div className="space-y-12 lg:space-y-4 w-full">
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
            className="w-full lg:w-1/3 flex flex-col items-center justify-start text-center pt-4 order-1 lg:order-2 mb-24 lg:mb-0"
          >
            <div className="text-center text-[#1C1C1C] mt-12 mb-[40px]">
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
            <div className="mt-[-120px]">
              <GameStats hasClicked={hasClicked} />
            </div>
          </div>

          {/* Right Section - Resume, Skills & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full lg:w-1/3 p-4 lg:p-4 text-center text-[#1C1C1C] order-3 ${allUpgradesPurchased ? 'pb-[64px]' : ''}`}
          >
            <div className="flex flex-col gap-[min(50px,4vh)] lg:gap-[min(32px,2vh)] relative">
              {unlockedSections.skills && <Skills />}
              {unlockedSections.currentWork && <CurrentWork />}

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: unlockedSections.resume ? 1 : 0, x: unlockedSections.resume ? 0 : 100 }}
                className="w-full"
              >
                <h2 className="text-[min(28px,4vh)] font-bold mb-8 underline decoration-2">Resume</h2>
                <div className="flex justify-center">
                  <a
                    href="https://jasonli2446.github.io/portfolio/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(56px,min(8vw,8vh))] lg:h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-blue-500/20 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
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
                <h2 className="text-[min(28px,4vh)] font-bold mb-8 underline decoration-2">Contact</h2>
                <div className="flex justify-center items-center gap-[32px]">
                  <a
                    href="mailto:jasonli2446@gmail.com"
                    className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity w-[120px]"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(56px,min(8vw,8vh))] lg:h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-red-500/20 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                      <img 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                        alt="Email"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">jasonli2446@gmail.com</div>
                  </a>
                  <a
                    href="https://linkedin.com/in/jasonli2446"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity w-[120px]"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(56px,min(8vw,8vh))] lg:h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-blue-600/20 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                      <img 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                        alt="LinkedIn"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">LinkedIn</div>
                  </a>
                  <a
                    href="https://github.com/jasonli2446"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity w-[120px]"
                  >
                    <div className="w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(56px,min(8vw,8vh))] lg:h-[min(56px,min(8vw,8vh))] rounded-[8px] bg-gray-800/20 p-[min(8px,min(0.8vw,0.8vh))] shadow-md">
                      <img 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                        alt="GitHub"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium hover:text-[#0077B6] transition-colors truncate w-full text-center">GitHub</div>
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
          </motion.div>
        </main>
      </div>
    </div>
  );
} 