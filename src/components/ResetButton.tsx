"use client";

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function ResetButton() {
  const { isGameComplete, resetGame } = useGameStore();

  if (!isGameComplete()) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={resetGame}
      className="fixed bottom-8 right-8 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
    >
      Reset Game
    </motion.button>
  );
} 