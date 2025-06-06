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
    color: 'bg-[#F7DF1E]'
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
    color: 'bg-[rgb(104,33,122)]'
  },
];

export default function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <h2 className="text-[min(28px,4vh)] font-bold mb-8 underline decoration-2">Skills</h2>
      <div className="flex justify-center items-center gap-[32px]">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-[4px]"
          >
            <div className={`w-[min(72px,min(12vw,12vh))] h-[min(72px,min(12vw,12vh))] lg:w-[min(56px,min(8vw,8vh))] lg:h-[min(56px,min(8vw,8vh))] rounded-[8px] ${skill.name === 'C#' ? 'bg-[#68217A]/20' : skill.name === 'JavaScript' ? 'bg-[#F7DF1E]/20' : `${skill.color}/20`} p-[min(8px,min(0.8vw,0.8vh))] shadow-md`}>
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[#1C1C1C] text-[min(14px,2vh)] font-medium">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 