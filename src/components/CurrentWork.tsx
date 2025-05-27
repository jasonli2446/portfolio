"use client";

import { motion } from 'framer-motion';

export default function CurrentWork() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-[170px] left-0 right-0 text-center w-full"
    >
      <h2 className="text-[28px] font-bold mb-4 underline decoration-2">Current Work</h2>
      <div className="space-y-4 w-full">
        <p className="text-[#1C1C1C]">
          Developing novel KV cache compression technique using low-rank approximation techniques for machine learning models, optimizing memory usage while maintaining model performance.
        </p>
        <a
          href="https://github.com/jasonli2446/kv-cache-visualization"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[#0077B6] hover:text-[#005F8F] transition-colors"
        >
          View Research →
        </a>
      </div>
    </motion.div>
  );
} 