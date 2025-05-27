"use client";

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function ClickButton() {
  const addXP = useGameStore((state) => state.addXP);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => addXP(1)}
      className="relative w-48 h-48 rounded-full bg-blue-600 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 rounded-full bg-blue-400 opacity-50"
      />
      <span className="relative z-10">WRITE CODE</span>
    </motion.button>
  );
} 