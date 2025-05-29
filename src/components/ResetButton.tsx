"use client";

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function ResetButton() {
  const { isGameComplete, resetGame } = useGameStore();

  const handleReset = () => {
    // Reset the game first
    resetGame();
    
    // Force scroll to top with multiple methods and a small delay
    setTimeout(() => {
      // Method 1: window.scrollTo
      window.scrollTo(0, 0);
      
      // Method 2: documentElement.scrollTo
      document.documentElement.scrollTo(0, 0);
      
      // Method 3: scrollIntoView
      document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Method 4: Set scrollTop directly
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Disable vertical scrolling only
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
    }, 0);
  };

  if (!isGameComplete()) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleReset}
      className="mt-[16px] px-8 py-[20px] bg-gray-300 hover:bg-[#ef4444] text-[#1C1C1C] rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-200 w-[300px] cursor-pointer"
    >
      <div className="font-[600] text-[14pt]">Reset Game</div>
    </motion.button>
  );
} 