"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import UpgradePopup from './UpgradePopup';

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
  const [upgradePopups, setUpgradePopups] = useState<{id: number}[]>([]);

  // Calculate progress
  const totalUpgrades = upgrades.length;
  const unlockedUpgrades = upgrades.filter(u => u.unlocked).length;
  const progress = (unlockedUpgrades / totalUpgrades) * 100;

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
    setUpgradePopups(prev => [...prev, { id: Date.now() }]);
    buyUpgrade(upgradeId);
  };

  const removeUpgradePopup = (id: number) => {
    setUpgradePopups(prev => prev.filter(popup => popup.id !== id));
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
        
        <div className="relative h-[200px] w-full flex justify-center my-[16px]">
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
              visibleUpgrades.map((upgrade, index) => (
                <motion.button
                  key={upgrade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleUpgradeClick(upgrade.id)}
                  disabled={xp < upgrade.cost}
                  style={{
                    position: 'absolute',
                    top: `${index * 70}px`,
                  }}
                  className={`px-6 py-3 rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-200 w-[250px] cursor-pointer ${
                    xp >= upgrade.cost
                      ? 'bg-gray-300 text-[#1C1C1C] hover:bg-gray-400'
                      : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold text-[min(16px,2vh)]">{upgrade.title}</div>
                  <div className="text-[min(14px,1.5vh)] opacity-90">{upgrade.cost} XP</div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {unlockedUpgrades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[300px] absolute bottom-[min(-40px,-4vh)] sm:bottom-[min(-50px,-5vh)] md:bottom-[min(-60px,-6vh)] lg:bottom-[min(-70px,-7vh)] left-1/2 transform -translate-x-1/2"
          >
            <div className="flex justify-between text-sm text-[#4B5563] mb-1">
              <span className={`text-[min(14px,1.5vh)] ${unlockedUpgrades === totalUpgrades ? 'text-[#16a34a]' : 'text-[#4B5563]'}`}>Progress</span>
              <span className={`text-[min(14px,1.5vh)] ${unlockedUpgrades === totalUpgrades ? 'text-[#16a34a]' : 'text-[#4B5563]'}`}>{unlockedUpgrades}/{totalUpgrades} Upgrades</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[#2563EB] rounded-full"
              />
              <AnimatePresence>
                {upgradePopups.map(popup => (
                  <UpgradePopup
                    key={popup.id}
                    onComplete={() => removeUpgradePopup(popup.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
} 