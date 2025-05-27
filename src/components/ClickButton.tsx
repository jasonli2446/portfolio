"use client";

import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import ClickPopup from './ClickPopup';

interface Popup {
  id: number;
  amount: number;
  x: number;
  y: number;
}

export default function ClickButton() {
  const { addXP, xpPerClick, passiveXPTrigger } = useGameStore();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [nextId, setNextId] = useState(0);
  const pulseControls = useAnimation(); // Use separate controls for pulsing

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addXP(xpPerClick);
    setPopups(prev => [...prev, { id: nextId, amount: xpPerClick, x, y }]);
    setNextId(prev => prev + 1);
  };

  const removePopup = (id: number) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  // Trigger pulse animation on passive XP gain
  useEffect(() => {
    pulseControls.start({
      scale: [1, 1.02, 1], // Small pulse scale, relative to current state
      transition: { duration: 0.4 }
    });
  }, [passiveXPTrigger, pulseControls]);

  return (
    <div className="relative mb-32">
      <motion.button
        whileHover={{ scale: 1.05 }} // Subtle hover scale
        whileTap={{ scale: 0.95 }} // Click down scale
        onClick={handleClick}
        animate={pulseControls} // Apply pulse animation
        className="relative w-48 h-32 min-w-[16rem] min-h-[10rem] rounded-[24px] bg-gray-300 text-[#1C1C1C] font-[600] text-[18pt] shadow-lg hover:bg-gray-400 transition-shadow flex items-center justify-center cursor-pointer"
      >
        {/* Passive XP Pulse Effect */}
        <motion.div
          key={passiveXPTrigger}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-[-2px] rounded-[24px] border-[3px] border-gray-400 opacity-70"
        />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 rounded-[24px] bg-gray-300 opacity-50"
        />
        <span className="relative z-10 whitespace-nowrap">Write Code</span>
      </motion.button>

      <AnimatePresence>
        {popups.map(popup => (
          <ClickPopup
            key={popup.id}
            amount={popup.amount}
            x={popup.x}
            y={popup.y}
            onComplete={() => removePopup(popup.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 