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
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-2xl font-bold">
        XP: {xp} (+{xpPerSec}/s)
      </div>
      
      <div className="relative h-[200px] w-full flex justify-center">
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => buyUpgrade(upgrade.id)}
                disabled={xp < upgrade.cost}
                style={{
                  position: 'absolute',
                  top: `${index * 60}px`,
                }}
                className={`px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow w-[200px] ${
                  xp >= upgrade.cost
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {upgrade.title} - {upgrade.cost} XP
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 