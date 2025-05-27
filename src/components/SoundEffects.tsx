"use client";

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function SoundEffects() {
  const audioContext = useRef<AudioContext | null>(null);
  const { xp, upgrades } = useGameStore();

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
    };

    // Add click listener to initialize audio
    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  // Play click sound
  const playClickSound = () => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime); // A4 note (lower pitch)
    gainNode.gain.setValueAtTime(0.05, audioContext.current.currentTime); // Lower volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.1);
  };

  // Play unlock sound
  const playUnlockSound = () => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime); // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.current.currentTime + 0.2); // Slide up to A5
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.2);
  };

  // Play click sound when XP changes
  useEffect(() => {
    if (xp > 0) {
      playClickSound();
    }
  }, [xp]);

  // Play unlock sound when an upgrade is purchased
  useEffect(() => {
    const unlockedCount = upgrades.filter(u => u.unlocked).length;
    if (unlockedCount > 0) {
      playUnlockSound();
    }
  }, [upgrades]);

  return null;
} 