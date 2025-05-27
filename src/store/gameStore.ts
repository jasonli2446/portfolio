import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Upgrade = {
  id: string;
  title: string;
  cost: number;
  xpPerSec: number;
  unlocked: boolean;
  unlockEffect?: () => void;
};

interface GameState {
  xp: number;
  xpPerSec: number;
  upgrades: Upgrade[];
  unlockedSections: {
    subtitle: boolean;
    projects: boolean;
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
}

const initialUpgrades: Upgrade[] = [
  {
    id: 'first-line',
    title: 'Write My First Line',
    cost: 10,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'hello-world',
    title: 'Print Hello World',
    cost: 25,
    xpPerSec: 2,
    unlocked: false,
  },
  {
    id: 'git-basics',
    title: 'Learn Git Basics',
    cost: 50,
    xpPerSec: 5,
    unlocked: false,
  },
  {
    id: 'first-pr',
    title: 'Make First Pull Request',
    cost: 100,
    xpPerSec: 8,
    unlocked: false,
  },
  {
    id: 'website',
    title: 'Build a Website',
    cost: 150,
    xpPerSec: 10,
    unlocked: false,
  },
  {
    id: 'hackathon',
    title: 'Participate in a Hackathon',
    cost: 300,
    xpPerSec: 15,
    unlocked: false,
  },
  {
    id: 'open-source',
    title: 'Contribute to Open Source',
    cost: 500,
    xpPerSec: 20,
    unlocked: false,
  },
  {
    id: 'game-dev',
    title: 'Develop a Game',
    cost: 700,
    xpPerSec: 50,
    unlocked: false,
  },
  {
    id: 'python',
    title: 'Master Python',
    cost: 900,
    xpPerSec: 75,
    unlocked: false,
  },
  {
    id: 'ml',
    title: 'Apply Machine Learning',
    cost: 1100,
    xpPerSec: 100,
    unlocked: false,
  },
  {
    id: 'portfolio',
    title: 'Create a Portfolio',
    cost: 1300,
    xpPerSec: 150,
    unlocked: false,
  },
  {
    id: 'internship',
    title: 'Get an Internship',
    cost: 1500,
    xpPerSec: 250,
    unlocked: false,
  },
  {
    id: 'remote-collab',
    title: 'Collaborate Remotely',
    cost: 2000,
    xpPerSec: 500,
    unlocked: false,
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      xpPerSec: 0,
      upgrades: initialUpgrades,
      unlockedSections: {
        subtitle: false,
        projects: false,
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
            case 'website':
              newUnlockedSections.projects = true;
              break;
            case 'internship':
              newUnlockedSections.resume = true;
              break;
            case 'remote-collab':
              newUnlockedSections.contact = true;
              break;
          }

          return {
            xp: state.xp - upgrade.cost,
            xpPerSec: state.xpPerSec + upgrade.xpPerSec,
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
          upgrades: initialUpgrades,
          unlockedSections: {
            subtitle: false,
            projects: false,
            resume: false,
            contact: false,
          },
          messages: ["Game reset! Start your journey again."],
        }),
      isGameComplete: () => {
        const state = get();
        return state.upgrades.every((upgrade) => upgrade.unlocked);
      },
    }),
    {
      name: 'game-storage',
    }
  )
); 