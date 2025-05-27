"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import ClickPopup from './ClickPopup';

interface Popup {
  id: number;
  amount: number;
  x: number;
  y: number;
}

export default function ClickButton() {
  const { addXP, xpPerClick } = useGameStore();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [nextId, setNextId] = useState(0);

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

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
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