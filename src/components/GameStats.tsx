"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface GameStatsProps {
  hasClicked: boolean;
}

export default function GameStats({ hasClicked }: GameStatsProps) {
  const { xp, xpPerSec, upgrades, addXP, buyUpgrade, isGameComplete } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate progress
  const totalUpgrades = upgrades.length;
  const unlockedUpgrades = upgrades.filter(u => u.unlocked).length;

  // Handle XP per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (xpPerSec > 0) {
        addXP(xpPerSec);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [xpPerSec, addXP]);

  // Handle confetti
  useEffect(() => {
    const gameCompleted = isGameComplete();
    if (gameCompleted) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isGameComplete, unlockedUpgrades]);

  const handleUpgradeClick = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };

  // Set window dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Get visible upgrades (not unlocked and either affordable or close to affordable)
  const visibleUpgrades = hasClicked ? upgrades
    .filter((upgrade) => !upgrade.unlocked)
    .slice(0, 3) : [];

  if (!hasClicked) return null;

  return (
    <>
      {showConfetti && (
        <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50 overflow-hidden">
          <ReactConfetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            colors={['#2563EB', '#16a34a', '#ef4444', '#f59e0b', '#8b5cf6']}
            style={{ position: 'fixed', top: 0, left: 0 }}
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-4 w-full mt-[30px] relative">
        <div className="h-[32px]">
          {xp > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[min(24px,2vh)] font-bold text-[#2563EB]"
            >
              XP: {xp} (+{xpPerSec}/s)
            </motion.div>
          )}
        </div>
        
        <div className="relative h-[200px] w-full flex justify-center my-[8px] lg:my-0">
          <AnimatePresence>
            {isGameComplete() ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-600"
              >
                <motion.p 
                  className="text-[min(20px,2.5vh)] font-semibold mb-2"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    textShadow: [
                      "0 0 0px rgba(0,0,0,0)",
                      "0 0 8px rgba(0,0,0,0.1)",
                      "0 0 0px rgba(0,0,0,0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🎉 Congratulations! 🎉
                </motion.p>
                <p className="text-[min(16px,2vh)]">All sections have been unlocked!</p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="sync">
                  {visibleUpgrades.map((upgrade) => (
                    <motion.div
                      key={upgrade.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        layout: {
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6
                        }
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleUpgradeClick(upgrade.id)}
                        disabled={xp < upgrade.cost}
                        className={`px-4 py-2 rounded-[8px] shadow-lg hover:shadow-xl transition-all duration-200 w-[220px] cursor-pointer ${
                          xp >= upgrade.cost
                            ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 border border-gray-300'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        <div className="font-bold text-[min(14px,1.8vh)] mb-0.5 truncate">{upgrade.title}</div>
                        <div className="text-[min(12px,1.5vh)] opacity-90 flex items-center justify-center gap-1">
                          <span className="text-amber-500">★</span>
                          {upgrade.cost} XP
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {unlockedUpgrades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[300px] max-w-[300px] absolute bottom-[min(-100px,-8vh)] sm:bottom-[min(-50px,-5vh)] md:bottom-[min(-60px,-6vh)] lg:bottom-[min(-120px,-7vh)]"
          >
            <div className="flex justify-center">
              <div className={`text-[min(16px,2vh)] ${unlockedUpgrades === totalUpgrades ? 'text-[#16a34a]' : 'text-[#4B5563]'}`}>
                Progress&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{unlockedUpgrades}/{totalUpgrades} Upgrades
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
} 