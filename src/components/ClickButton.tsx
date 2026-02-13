"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useState, useRef } from 'react';
import ClickPopup from './ClickPopup';

interface Popup {
  id: number;
  amount: number;
  x: number;
  y: number;
}

interface ClickButtonProps {
  onFirstClick?: () => void;
}

let popupCounter = 0;

export default function ClickButton({ onFirstClick }: ClickButtonProps) {
  const { addXP, xpPerClick } = useGameStore();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [hasClicked, setHasClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPopups(prev => [...prev, {
      id: ++popupCounter,
      amount: xpPerClick,
      x,
      y
    }]);

    addXP(xpPerClick);

    // Play click sound directly
    const playClickSound = (window as unknown as Record<string, unknown>).__playClickSound;
    if (typeof playClickSound === 'function') {
      (playClickSound as () => void)();
    }

    if (!hasClicked) {
      setHasClicked(true);
      onFirstClick?.();
    }
  };

  const removePopup = (id: number) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  return (
    <div className="relative mb-32 lg:mb-20">
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="relative w-[20vw] h-[12vw] min-w-[280px] max-w-[300px] min-h-[160px] max-h-[180px] lg:min-w-[180px] lg:max-w-[220px] lg:min-h-[100px] lg:max-h-[120px] rounded-[24px] bg-gray-300 text-[#1C1C1C] font-[600] text-[clamp(24px,4vh,32px)] md:text-[clamp(28px,4.5vh,36px)] lg:text-[clamp(24px,4vh,32px)] shadow-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer animate-subtle-pulse"
      >
        <div className="absolute inset-[-2px] rounded-[24px] border-[3px] border-gray-400 opacity-70" />
        <div className="absolute inset-0 rounded-[24px] bg-gray-300 opacity-50" />
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
