"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function SoundEffects() {
  const audioContext = useRef<AudioContext | null>(null);
  const prevUnlockedCount = useRef<number | null>(null);
  const { upgrades } = useGameStore();

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Play click sound — exported via window for ClickButton to call directly
  const playClickSound = useCallback(() => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.1);
  }, []);

  const playUnlockSound = useCallback(() => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.current.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.2);
  }, []);

  // Expose click sound for ClickButton to call directly (avoids XP watcher)
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__playClickSound = playClickSound;
    return () => {
      delete (window as unknown as Record<string, unknown>).__playClickSound;
    };
  }, [playClickSound]);

  // Play unlock sound only when the unlocked count actually increases
  useEffect(() => {
    const unlockedCount = upgrades.filter(u => u.unlocked).length;
    if (prevUnlockedCount.current !== null && unlockedCount > prevUnlockedCount.current) {
      playUnlockSound();
    }
    prevUnlockedCount.current = unlockedCount;
  }, [upgrades, playUnlockSound]);

  return null;
}
