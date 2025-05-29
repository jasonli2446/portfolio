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
      className="bg-white rounded-lg shadow-md p-3 mb-3 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-[min(20px,2.5vh)] lg:text-[min(18px,2vh)] font-bold mb-1">{title}</h3>
      <p className="text-[min(14px,1.8vh)] lg:text-[min(14px,1.8vh)] text-gray-600 mb-2">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[min(14px,1.5vh)] text-blue-600 hover:text-blue-800 transition-colors lg:block lg:text-right"
        >
          View Project →
        </a>
      )}
    </motion.div>
  );
} 