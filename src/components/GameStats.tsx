"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function GameStats() {
  const { xp, xpPerSec, upgrades, addXP, buyUpgrade, isUpgradeVisible, isGameComplete } = useGameStore();

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
    <div className="flex flex-col items-center gap-4 w-full mt-[20px]">
      <div className="text-2xl font-bold text-[#2563EB]">
        XP: {xp} (+{xpPerSec}/s)
      </div>
      
      <div className="relative h-[200px] w-full flex justify-center my-[16px]">
        <AnimatePresence>
          {isGameComplete() ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-600"
            >
              <p className="text-xl font-semibold mb-2">🎉 Congratulations! 🎉</p>
              <p>All sections have been unlocked!</p>
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
                className={`px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-[250px] cursor-pointer ${
                  xp >= upgrade.cost
                    ? 'bg-gray-300 text-[#1C1C1C] hover:bg-gray-400'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                <div className="font-bold">{upgrade.title}</div>
                <div className="text-sm opacity-90">{upgrade.cost} XP</div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 