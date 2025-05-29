"use client";

import { motion } from 'framer-motion';

interface UpgradePopupProps {
  onComplete: () => void;
}

export default function UpgradePopup({ onComplete }: UpgradePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="absolute top-[-30px] left-1/2 -translate-x-1/2 pointer-events-none z-[9999] text-[#16a34a] font-bold select-none text-[min(24px,2vh)] bg-white/50"
    >
      +1
    </motion.div>
  );
} 