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
}

const initialUpgrades: Upgrade[] = [
  {
    id: 'first-line',
    title: 'Wrote My First Line',
    cost: 10,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    cost: 25,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'cli-tool',
    title: 'Built a CLI Tool',
    cost: 75,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'website',
    title: 'Made a Website',
    cost: 150,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'hackathon',
    title: 'Joined a Hackathon',
    cost: 300,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'internship',
    title: 'Got an Internship',
    cost: 500,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'open-source',
    title: 'Published Open Source',
    cost: 700,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'api-server',
    title: 'Built API Server',
    cost: 900,
    xpPerSec: 1,
    unlocked: false,
  },
  {
    id: 'remote-collab',
    title: 'Collaborated Remotely',
    cost: 1200,
    xpPerSec: 2,
    unlocked: false,
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'game-storage',
    }
  )
); 