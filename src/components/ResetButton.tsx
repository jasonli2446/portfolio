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
      className="mt-[16px] px-8 py-[20px] bg-gray-300 hover:bg-[#ef4444] text-[#1C1C1C] rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-200 w-[300px] cursor-pointer"
    >
      <div className="font-[600] text-[14pt]">Reset Game</div>
    </motion.button>
  );
} 