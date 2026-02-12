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
      <div className="space-y-3">
        <div className="text-left">
          <h3 className="text-[min(15px,1.9vh)] font-bold text-[#1C1C1C]">Technical Lead — xLab / Dealer Tire</h3>
          <p className="text-[min(14px,1.7vh)] text-[#4B5563] mt-1">
            Leading a team of 4 developers building a conversational AI system with multi-agent architecture for Account Managers.
          </p>
        </div>
        <div className="text-left">
          <h3 className="text-[min(15px,1.9vh)] font-bold text-[#1C1C1C]">AI/ML Research — EINSTEIN Lab</h3>
          <p className="text-[min(14px,1.7vh)] text-[#4B5563] mt-1">
            Developing novel KV cache compression using low-rank approximation techniques, achieving 87.5% memory savings on transformer models up to 8B parameters.
          </p>
          <a
            href="https://github.com/jasonli2446/kv-cache-visualization"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[min(14px,1.5vh)] text-[#0077B6] hover:text-[#005F8F] transition-colors mt-1"
          >
            View Research →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
