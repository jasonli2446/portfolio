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
    currentWork: boolean;
  };
  messages: string[];
  addXP: (amount: number) => void;
  buyUpgrade: (upgradeId: string) => void;
  addMessage: (message: string) => void;
  removeMessage: (index: number) => void;
  resetGame: () => void;
  isGameComplete: () => boolean;
  isUpgradeVisible: (upgradeId: string) => boolean;
  passiveXPTrigger: number;
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
    cost: 150,
    xpPerSec: 15,
    xpPerClick: 5,
    unlocked: false,
  },
  {
    id: 'javascript',
    title: 'Learn JavaScript',
    cost: 300,
    xpPerSec: 30,
    xpPerClick: 10,
    unlocked: false,
  },
  {
    id: 'game-dev',
    title: 'Develop a Game',
    cost: 500,
    xpPerSec: 50,
    xpPerClick: 15,
    unlocked: false,
  },
  {
    id: 'python',
    title: 'Master Python',
    cost: 1000,
    xpPerSec: 75,
    xpPerClick: 25,
    unlocked: false,
  },
  {
    id: 'ml',
    title: 'Apply Machine Learning',
    cost: 1500,
    xpPerSec: 100,
    xpPerClick: 40,
    unlocked: false,
  },
  {
    id: 'skills',
    title: 'Master Core Skills',
    cost: 2000,
    xpPerSec: 150,
    xpPerClick: 60,
    unlocked: false,
  },
  {
    id: 'current-work',
    title: 'Continue Development',
    cost: 5000,
    xpPerSec: 180,
    xpPerClick: 70,
    unlocked: false,
  },
  {
    id: 'internship',
    title: 'Get an Internship',
    cost: 10000,
    xpPerSec: 200,
    xpPerClick: 80,
    unlocked: false,
  },
  {
    id: 'remote-collab',
    title: 'Collaborate Remotely',
    cost: 15000,
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
        currentWork: false,
      },
      messages: [],
      addXP: (amount) => {
        set((state) => ({
          xp: state.xp + amount,
        }));
        // Check if this is passive XP (assuming passive XP is added in 1s intervals where xpPerSec > 0)
        // A more robust way might involve passing a source flag to addXP if needed elsewhere
        const isPassive = amount === get().xpPerSec && get().xpPerSec > 0;
        if (isPassive) {
          set(state => ({ passiveXPTrigger: state.passiveXPTrigger + 1 }));
        }
      },
      buyUpgrade: (upgradeId) => {
        const upgrade = get().upgrades.find((u) => u.id === upgradeId);
        if (!upgrade || upgrade.unlocked || get().xp < upgrade.cost) return;

        set((state) => ({
          xp: state.xp - upgrade.cost,
          xpPerSec: state.xpPerSec + upgrade.xpPerSec,
          xpPerClick: state.xpPerClick + upgrade.xpPerClick,
          upgrades: state.upgrades.map((u) =>
            u.id === upgradeId ? { ...u, unlocked: true } : u
          ),
          unlockedSections: {
            ...state.unlockedSections,
            subtitle: upgradeId === 'hello-world' ? true : state.unlockedSections.subtitle,
            projects: upgradeId === 'git-basics' ? true : state.unlockedSections.projects,
            skills: upgradeId === 'skills' ? true : state.unlockedSections.skills,
            currentWork: upgradeId === 'current-work' ? true : state.unlockedSections.currentWork,
            resume: upgradeId === 'internship' ? true : state.unlockedSections.resume,
            contact: upgradeId === 'remote-collab' ? true : state.unlockedSections.contact,
          },
          messages: [...state.messages, `${upgrade.title} unlocked!`],
        }));
      },
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
            currentWork: false,
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
      passiveXPTrigger: 0,
    }),
    {
      name: 'game-storage',
    }
  )
); 