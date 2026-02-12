"use client";

import { motion } from 'framer-motion';

interface ExperienceItem {
  title: string;
  company: string;
  dates: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    title: "Technical Lead",
    company: "xLab / Dealer Tire",
    dates: "Jan 2026 – Present",
    description: "Leading a team building a conversational AI system with multi-agent architecture for account summary generation.",
  },
  {
    title: "Software Engineer Intern",
    company: "1848 Ventures",
    dates: "May – Dec 2025",
    description: "Architected a scalable lead-gen platform (AWS/Terraform) and built AI agents automating workflows across 10+ ventures.",
  },
  {
    title: "Undergraduate AI/ML Researcher",
    company: "EINSTEIN Lab, CWRU",
    dates: "Jan 2025 – Present",
    description: "Developed SVD-based KV cache compression achieving 87.5% memory savings with only 5% perplexity increase.",
  },
  {
    title: "Software Engineer Intern",
    company: "Eaton Corporation",
    dates: "Jan – May 2025",
    description: "Built an AI training platform with RAG-powered simulated customers, reducing onboarding time by 40%.",
  },
];

export default function Experience() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <h2 className="text-[min(28px,4vh)] font-bold mb-4 underline decoration-2">Experience</h2>
      <div className="space-y-3">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-[min(16px,2vh)] font-bold">{exp.title}</h3>
              <span className="text-[min(12px,1.5vh)] text-gray-400 whitespace-nowrap">{exp.dates}</span>
            </div>
            <p className="text-[min(13px,1.6vh)] text-blue-600 font-medium">{exp.company}</p>
            <p className="text-[min(13px,1.6vh)] text-gray-600 mt-1">{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
