"use client";

import { motion } from 'framer-motion';

interface Skill {
  name: string;
  icon: string;
  color: string;
}

const skills: Skill[] = [
  { 
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: 'bg-yellow-400'
  },
  { 
    name: 'Java',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    color: 'bg-red-500'
  },
  { 
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    color: 'bg-blue-500'
  },
  { 
    name: 'C#',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    color: 'bg-purple-500'
  },
];

export default function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-0 left-0 right-0 text-center w-full"
    >
      <h2 className="text-[28px] font-bold mb-8 underline decoration-2">Skills</h2>
      <div className="flex justify-center items-center gap-[32px]">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-[4px]"
          >
            <div className={`w-[48px] h-[48px] rounded-[8px] ${skill.color} p-[8px] shadow-md`}>
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[#1C1C1C] text-[14px] font-medium">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 