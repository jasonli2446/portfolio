"use client";

import { motion } from 'framer-motion';

export default function CurrentWork() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2">Current Work</h2>
      <div className="space-y-4 w-full">
        <p className="text-[min(16px,2vh)] text-[#4B5563]">
          Developing novel KV cache compression strategy using low-rank approximation techniques for machine learning models, optimizing memory usage while maintaining model performance.
        </p>
        <a
          href="https://github.com/jasonli2446/kv-cache-visualization"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[min(14px,1.5vh)] text-[#0077B6] hover:text-[#005F8F] transition-colors"
        >
          View Research →
        </a>
      </div>
    </motion.div>
  );
} 