"use client";

import { motion } from 'framer-motion';

interface Skill {
  name: string;
  icon: string;
  bgColor: string;
}

interface SkillCategory {
  label: string;
  skills: Skill[];
}

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const categories: SkillCategory[] = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', icon: `${CDN}/python/python-original.svg`, bgColor: 'bg-blue-500/20' },
      { name: 'TypeScript', icon: `${CDN}/typescript/typescript-original.svg`, bgColor: 'bg-blue-600/20' },
      { name: 'Java', icon: `${CDN}/java/java-original.svg`, bgColor: 'bg-red-500/20' },
      { name: 'C++', icon: `${CDN}/cplusplus/cplusplus-original.svg`, bgColor: 'bg-blue-700/20' },
      { name: 'C#', icon: `${CDN}/csharp/csharp-original.svg`, bgColor: 'bg-[#68217A]/20' },
      { name: 'SQL', icon: `${CDN}/azuresqldatabase/azuresqldatabase-original.svg`, bgColor: 'bg-yellow-500/20' },
    ],
  },
  {
    label: 'Frameworks',
    skills: [
      { name: 'React', icon: `${CDN}/react/react-original.svg`, bgColor: 'bg-cyan-400/20' },
      { name: 'Next.js', icon: `${CDN}/nextjs/nextjs-original.svg`, bgColor: 'bg-gray-800/20' },
      { name: 'PyTorch', icon: `${CDN}/pytorch/pytorch-original.svg`, bgColor: 'bg-orange-500/20' },
      { name: 'Express', icon: `${CDN}/express/express-original.svg`, bgColor: 'bg-gray-600/20' },
      { name: 'Tailwind', icon: `${CDN}/tailwindcss/tailwindcss-original.svg`, bgColor: 'bg-teal-400/20' },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'AWS', icon: `${CDN}/amazonwebservices/amazonwebservices-original-wordmark.svg`, bgColor: 'bg-orange-400/20' },
      { name: 'Docker', icon: `${CDN}/docker/docker-original.svg`, bgColor: 'bg-blue-500/20' },
      { name: 'Git', icon: `${CDN}/git/git-original.svg`, bgColor: 'bg-red-500/20' },
      { name: 'Firebase', icon: `${CDN}/firebase/firebase-original.svg`, bgColor: 'bg-amber-400/20' },
      { name: 'Supabase', icon: `${CDN}/supabase/supabase-original.svg`, bgColor: 'bg-green-500/20' },
    ],
  },
];

export default function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <h2 className="text-[clamp(18px,4vh,28px)] lg:text-[clamp(14px,2.5vh,20px)] font-bold mb-6 lg:mb-2 underline decoration-2">Skills</h2>
      <div className="space-y-4 lg:space-y-1">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.15 }}
          >
            <h3 className="text-[clamp(10px,1.8vh,14px)] lg:text-[clamp(8px,1.3vh,11px)] font-semibold text-gray-500 mb-2 lg:mb-0.5">{category.label}</h3>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-1.5">
              {category.skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIndex * 0.15 + index * 0.05 }}
                  className="flex flex-col items-center gap-1 lg:gap-0"
                >
                  <div className={`w-[clamp(30px,min(8vw,8vh),48px)] h-[clamp(30px,min(8vw,8vh),48px)] lg:w-[clamp(20px,min(4vw,4vh),30px)] lg:h-[clamp(20px,min(4vw,4vh),30px)] rounded-[6px] ${skill.bgColor} p-[clamp(3px,min(0.6vw,0.6vh),6px)] lg:p-[clamp(2px,min(0.4vw,0.4vh),4px)] shadow-sm`} title={skill.name}>
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[#1C1C1C] text-[clamp(8px,1.4vh,11px)] lg:text-[clamp(7px,1.1vh,9px)] font-medium">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
