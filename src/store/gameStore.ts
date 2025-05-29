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
    xpPerSec: 30000000,
    xpPerClick: 2,
    unlocked: false,
  },
  {
    id: 'git-basics',
    title: 'Learn Git Basics',
    cost: 25,
    xpPerSec: 8,
    xpPerClick: 5,
    unlocked: false,
  },
  {
    id: 'hackathon',
    title: 'Participate in a Hackathon',
    cost: 50,
    xpPerSec: 20,
    xpPerClick: 10,
    unlocked: false,
  },
  {
    id: 'javascript',
    title: 'Learn JavaScript',
    cost: 100,
    xpPerSec: 50,
    xpPerClick: 25,
    unlocked: false,
  },
  {
    id: 'game-dev',
    title: 'Develop a Game',
    cost: 250,
    xpPerSec: 80,
    xpPerClick: 50,
    unlocked: false,
  },
  {
    id: 'python',
    title: 'Practice Python',
    cost: 500,
    xpPerSec: 200,
    xpPerClick: 100,
    unlocked: false,
  },
  {
    id: 'ml',
    title: 'Apply Machine Learning',
    cost: 1000,
    xpPerSec: 400,
    xpPerClick: 250,
    unlocked: false,
  },
  {
    id: 'skills',
    title: 'Master Core Skills',
    cost: 2500,
    xpPerSec: 600,
    xpPerClick: 500,
    unlocked: false,
  },
  {
    id: 'current-work',
    title: 'Continue Development',
    cost: 5000,
    xpPerSec: 1000,
    xpPerClick: 1000,
    unlocked: false,
  },
  {
    id: 'internship',
    title: 'Apply to an Internship',
    cost: 10000,
    xpPerSec: 2000,
    xpPerClick: 2000,
    unlocked: false,
  },
  {
    id: 'remote-collab',
    title: 'Collaborate Remotely',
    cost: 25000,
    xpPerSec: 5000,
    xpPerClick: 3000,
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

        set((state) => {
          // Unlock the upgrade
          const newUpgrades = state.upgrades.map((u) =>
            u.id === upgradeId ? { ...u, unlocked: true } : u
          );
          // Find max xpPerClick among unlocked upgrades
          const maxXpPerClick = Math.max(1, ...newUpgrades.filter(u => u.unlocked).map(u => u.xpPerClick));
          return {
            xp: state.xp - upgrade.cost,
            xpPerSec: state.xpPerSec + upgrade.xpPerSec,
            xpPerClick: maxXpPerClick,
            upgrades: newUpgrades,
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
          };
        });
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