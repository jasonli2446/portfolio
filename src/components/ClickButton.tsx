"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
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

export default function ClickButton({ onFirstClick }: ClickButtonProps) {
  const { addXP, xpPerClick } = useGameStore();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isHovering) {
      setShouldPulse(false);
    } else {
      timer = setTimeout(() => {
        setShouldPulse(true);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHovering]);

  const handleHoverStart = () => {
    setIsHovering(true);
    setShouldPulse(false);
  };

  const handleHoverEnd = () => {
    setIsHovering(false);
    setTimeout(() => {
      setShouldPulse(true);
    }, 1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPopups(prev => [...prev, {
      id: Date.now(),
      amount: xpPerClick,
      x,
      y
    }]);

    addXP(xpPerClick);

    if (!hasClicked) {
      setHasClicked(true);
      onFirstClick?.();
    }
  };

  const removePopup = (id: number) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  const buttonVariants = {
    idle: {
      scale: 1,
      transition: {
        duration: 0.2
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <div className="relative mb-32">
      <motion.button
        variants={buttonVariants}
        initial="idle"
        animate={isHovering ? "hover" : shouldPulse ? "pulse" : "idle"}
        whileTap="tap"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        className="relative w-[20vw] h-[12vw] min-w-[280px] max-w-[300px] min-h-[160px] max-h-[180px] lg:min-w-[200px] lg:min-h-[120px] rounded-[24px] bg-gray-300 text-[#1C1C1C] font-[600] text-[min(32px,4vh)] md:text-[min(36px,4.5vh)] lg:text-[min(40px,5vh)] shadow-lg hover:bg-gray-400 flex items-center justify-center cursor-pointer"
      >
        {/* Passive XP Pulse Effect */}
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