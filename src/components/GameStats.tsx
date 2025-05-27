"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function GameStats() {
  const { xp, xpPerSec, upgrades, addXP, buyUpgrade, isUpgradeVisible, isGameComplete } = useGameStore();

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

  // Get visible upgrades (not unlocked and either affordable or close to affordable)
  const visibleUpgrades = upgrades
    .filter((upgrade) => !upgrade.unlocked && isUpgradeVisible(upgrade.id))
    .slice(0, 3);

  return (
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
              <p className="text-[min(20px,2.5vh)] font-semibold mb-2">🎉 Congratulations! 🎉</p>
              <p className="text-[min(16px,2vh)]">All sections have been unlocked!</p>
            </motion.div>
          ) : (
            visibleUpgrades.map((upgrade, index) => (
              <motion.button
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => buyUpgrade(upgrade.id)}
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
          className="w-full max-w-[300px] absolute bottom-[-80px] left-1/2 transform -translate-x-1/2"
        >
          <div className="flex justify-between text-sm text-[#4B5563] mb-1">
            <span className="text-[min(14px,1.5vh)] text-[#4B5563]">Progress</span>
            <span className="text-[min(14px,1.5vh)] text-[#4B5563]">{unlockedUpgrades}/{totalUpgrades} Upgrades</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#2563EB] rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
} 