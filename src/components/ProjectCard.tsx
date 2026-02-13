"use client";

import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  link?: string;
  delay?: number;
}

export default function ProjectCard({ title, description, link, delay = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg shadow-md p-3 lg:p-2 mb-3 lg:mb-0 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-[clamp(14px,2.5vh,20px)] lg:text-[clamp(11px,1.6vh,14px)] font-bold mb-1 lg:mb-0">{title}</h3>
      <p className="text-[clamp(11px,1.8vh,14px)] lg:text-[clamp(9px,1.4vh,12px)] text-gray-600 mb-2 lg:mb-1">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[clamp(11px,1.5vh,14px)] lg:text-[clamp(8px,1.3vh,11px)] text-blue-600 hover:text-blue-800 transition-colors lg:block lg:text-right"
        >
          View Project →
        </a>
      )}
    </motion.div>
  );
} 