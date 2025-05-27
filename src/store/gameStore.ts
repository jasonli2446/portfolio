import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Upgrade = {
  id: string;
  title: string;
  cost: number;
  xpPerSec: number;
  xpPerClick: number;
  unlocked: boolean;
  unlockEffect?: () => void;
};

interface GameState {
  xp: number;
  xpPerSec: number;
  xpPerClick: number;
  upgrades: Upgrade[];
  unlockedSections: {
    subtitle: boolean;
    projects: boolean;
    skills: boolean;
    resume: boolean;
    contact: boolean;
  };
  messages: string[];
  addXP: (amount: number) => void;
  buyUpgrade: (upgradeId: string) => void;
  addMessage: (message: string) => void;
  removeMessage: (index: number) => void;
  resetGame: () => void;
  isGameComplete: () => boolean;
  isUpgradeVisible: (upgradeId: string) => boolean;
}

const initialUpgrades: Upgrade[] = [
  {
    id: 'hello-world',
    title: 'Print Hello World',
    cost: 10,
    xpPerSec: 1,
    xpPerClick: 1,
    unlocked: false,
  },
  {
    id: 'git-basics',
    title: 'Learn Git Basics',
    cost: 50,
    xpPerSec: 5,
    xpPerClick: 2,
    unlocked: false,
  },
  {
    id: 'hackathon',
    title: 'Participate in a Hackathon',
    cost: 250,
    xpPerSec: 15,
    xpPerClick: 5,
    unlocked: false,
  },
  {
    id: 'game-dev',
    title: 'Develop a Game',
    cost: 500,
    xpPerSec: 30,
    xpPerClick: 10,
    unlocked: false,
  },
  {
    id: 'python',
    title: 'Master Python',
    cost: 1000,
    xpPerSec: 50,
    xpPerClick: 15,
    unlocked: false,
  },
  {
    id: 'ml',
    title: 'Apply Machine Learning',
    cost: 1500,
    xpPerSec: 75,
    xpPerClick: 25,
    unlocked: false,
  },
  {
    id: 'portfolio',
    title: 'Create a Portfolio',
    cost: 2000,
    xpPerSec: 100,
    xpPerClick: 40,
    unlocked: false,
  },
  {
    id: 'skills',
    title: 'Master Core Skills',
    cost: 3000,
    xpPerSec: 150,
    xpPerClick: 60,
    unlocked: false,
  },
  {
    id: 'internship',
    title: 'Get an Internship',
    cost: 4000,
    xpPerSec: 200,
    xpPerClick: 80,
    unlocked: false,
  },
  {
    id: 'remote-collab',
    title: 'Collaborate Remotely',
    cost: 5000,
    xpPerSec: 250,
    xpPerClick: 100,
    unlocked: false,
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      xpPerSec: 0,
      xpPerClick: 1,
      upgrades: initialUpgrades,
      unlockedSections: {
        subtitle: false,
        projects: false,
        skills: false,
        resume: false,
        contact: false,
      },
      messages: [],
      addXP: (amount) =>
        set((state) => ({
          xp: state.xp + amount,
        })),
      buyUpgrade: (upgradeId) =>
        set((state) => {
          const upgrade = state.upgrades.find((u) => u.id === upgradeId);
          if (!upgrade || upgrade.unlocked || state.xp < upgrade.cost) return state;

          const newUpgrades = state.upgrades.map((u) =>
            u.id === upgradeId ? { ...u, unlocked: true } : u
          );

          // Handle section unlocks based on upgrade
          const newUnlockedSections = { ...state.unlockedSections };
          switch (upgradeId) {
            case 'hello-world':
              newUnlockedSections.subtitle = true;
              break;
            case 'git-basics':
              newUnlockedSections.projects = true;
              break;
            case 'portfolio':
              newUnlockedSections.resume = true;
              break;
            case 'skills':
              newUnlockedSections.skills = true;
              break;
            case 'remote-collab':
              newUnlockedSections.contact = true;
              break;
          }

          return {
            xp: state.xp - upgrade.cost,
            xpPerSec: state.xpPerSec + upgrade.xpPerSec,
            xpPerClick: state.xpPerClick + upgrade.xpPerClick,
            upgrades: newUpgrades,
            unlockedSections: newUnlockedSections,
            messages: [...state.messages, `${upgrade.title} unlocked!`],
          };
        }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      removeMessage: (index) =>
        set((state) => ({
          messages: state.messages.filter((_, i) => i !== index),
        })),
      resetGame: () =>
        set({
          xp: 0,
          xpPerSec: 0,
          xpPerClick: 1,
          upgrades: initialUpgrades,
          unlockedSections: {
            subtitle: false,
            projects: false,
            skills: false,
            resume: false,
            contact: false,
          },
          messages: ["Game reset! Start your journey again."],
        }),
      isGameComplete: () => {
        const state = get();
        return state.upgrades.every((upgrade) => upgrade.unlocked);
      },
      isUpgradeVisible: (upgradeId) => {
        const state = get();
        const upgrade = state.upgrades.find((u) => u.id === upgradeId);
        if (!upgrade) return false;
        if (upgrade.unlocked) return true;
        // Show upgrade when player has 50% of required XP
        return state.xp >= upgrade.cost * 0.5;
      },
    }),
    {
      name: 'game-storage',
    }
  )
); 