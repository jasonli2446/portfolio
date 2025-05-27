"use client";

import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'Python', level: 95, color: 'bg-blue-500' },
  { name: 'JavaScript/TypeScript', level: 90, color: 'bg-yellow-500' },
  { name: 'React', level: 85, color: 'bg-cyan-500' },
  { name: 'Node.js', level: 80, color: 'bg-green-500' },
  { name: 'Machine Learning', level: 75, color: 'bg-purple-500' },
  { name: 'SQL', level: 70, color: 'bg-orange-500' },
];

export default function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-0 left-0 right-0"
    >
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">{skill.name}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${skill.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 