"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function MessagePopup() {
  const { messages, removeMessage } = useGameStore();

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        removeMessage(0);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messages, removeMessage]);

  return (
    <div className="fixed top-[12px] left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#8B4513]/20 text-[#8B4513] px-6 py-3 rounded-lg shadow-lg max-w-[90vw] text-center"
          >
            {messages[0]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 