"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function GameStats() {
  const { xp, xpPerSec, upgrades, addXP, buyUpgrade, isUpgradeVisible } = useGameStore();

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
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold">
        XP: {xp} (+{xpPerSec}/s)
      </div>
      
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {visibleUpgrades.map((upgrade) => (
            <motion.button
              key={upgrade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => buyUpgrade(upgrade.id)}
              disabled={xp < upgrade.cost}
              className={`px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                xp >= upgrade.cost
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {upgrade.title} - {upgrade.cost} XP
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 