"use client";

import { motion } from 'framer-motion';

interface ClickPopupProps {
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export default function ClickPopup({ amount, x, y, onComplete }: ClickPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
      className="text-[#2563EB] font-bold select-none"
    >
      +{amount}
    </motion.div>
  );
} 