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
      className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Project →
        </a>
      )}
    </motion.div>
  );
} 