"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function GameStats() {
  const { xp, xpPerSec, upgrades, addXP, buyUpgrade } = useGameStore();

  // Handle XP per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (xpPerSec > 0) {
        addXP(xpPerSec);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [xpPerSec, addXP]);

  // Get available upgrades (not unlocked and affordable)
  const availableUpgrades = upgrades
    .filter((upgrade) => !upgrade.unlocked && xp >= upgrade.cost)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold">
        XP: {xp} (+{xpPerSec}/s)
      </div>
      
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {availableUpgrades.map((upgrade) => (
            <motion.button
              key={upgrade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => buyUpgrade(upgrade.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {upgrade.title} - {upgrade.cost} XP
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 