"use client";

import { motion } from 'framer-motion';

export default function CurrentWork() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-[200px] left-0 right-0"
    >
      <h2 className="text-2xl font-bold mb-4">Current Work</h2>
      <div className="space-y-4">
        <p className="text-gray-700">
          Developing novel KV cache compression technique using low-rank approximation techniques.
        </p>
        <a
          href="https://github.com/jasonli2446/kv-cache-visualization"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Research →
        </a>
      </div>
    </motion.div>
  );
} 