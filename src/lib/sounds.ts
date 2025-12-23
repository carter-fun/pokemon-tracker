'use client';

import { Howl } from 'howler';

// Sound manager singleton
class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load enabled state from localStorage
      const savedEnabled = localStorage.getItem('pokemonSoundsEnabled');
      this.enabled = savedEnabled !== 'false';
      
      const savedVolume = localStorage.getItem('pokemonSoundsVolume');
      this.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
    }
  }

  private loadSound(name: string, src: string): Howl {
    if (!this.sounds.has(name)) {
      const sound = new Howl({
        src: [src],
        volume: this.volume,
        preload: true,
      });
      this.sounds.set(name, sound);
    }
    return this.sounds.get(name)!;
  }

  play(name: string): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      sound.play();
    }
  }

  // Pre-defined sound effects using Web Audio API for simple sounds
  playClick(): void {
    if (!this.enabled) return;
    this.playTone(800, 0.1, 'sine');
  }

  playSuccess(): void {
    if (!this.enabled) return;
    // Play a happy ascending tone
    this.playTone(523, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 200); // G5
  }

  playError(): void {
    if (!this.enabled) return;
    // Play a sad descending tone
    this.playTone(400, 0.15, 'sawtooth');
    setTimeout(() => this.playTone(300, 0.2, 'sawtooth'), 150);
  }

  playLevelUp(): void {
    if (!this.enabled) return;
    // Pokemon level up fanfare
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine'), i * 80);
    });
  }

  playPokeballClick(): void {
    if (!this.enabled) return;
    // Pokeball open/close sound
    this.playTone(600, 0.05, 'square');
    setTimeout(() => this.playTone(900, 0.1, 'square'), 50);
  }

  playCoins(): void {
    if (!this.enabled) return;
    // Coin collection sound
    this.playTone(1200, 0.05, 'sine');
    setTimeout(() => this.playTone(1400, 0.05, 'sine'), 50);
    setTimeout(() => this.playTone(1600, 0.1, 'sine'), 100);
  }

  playWhoosh(): void {
    if (!this.enabled) return;
    // Page transition whoosh using noise
    this.playNoise(0.15);
  }

  playEggHatch(): void {
    if (!this.enabled) return;
    // Egg cracking and hatching
    this.playTone(200, 0.1, 'square');
    setTimeout(() => this.playTone(250, 0.1, 'square'), 100);
    setTimeout(() => this.playTone(300, 0.1, 'square'), 200);
    setTimeout(() => {
      // Triumphant reveal
      this.playTone(523, 0.15, 'sine');
      setTimeout(() => this.playTone(659, 0.15, 'sine'), 100);
      setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
    }, 400);
  }

  playWildEncounter(): void {
    if (!this.enabled) return;
    // Classic wild encounter sound
    const pattern = [
      { freq: 200, dur: 0.05 },
      { freq: 400, dur: 0.05 },
      { freq: 200, dur: 0.05 },
      { freq: 400, dur: 0.05 },
      { freq: 200, dur: 0.05 },
      { freq: 600, dur: 0.2 },
    ];
    let time = 0;
    pattern.forEach(({ freq, dur }) => {
      setTimeout(() => this.playTone(freq, dur, 'square'), time * 1000);
      time += dur;
    });
  }

  playAchievement(): void {
    if (!this.enabled) return;
    // Achievement unlock fanfare
    const notes = [392, 494, 587, 784]; // G4, B4, D5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150);
    });
  }

  playSpinWheel(): void {
    if (!this.enabled) return;
    // Spinning wheel tick
    this.playTone(1000, 0.02, 'square');
  }

  private playTone(frequency: number, duration: number, type: OscillatorType): void {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Audio context not available
    }
  }

  private playNoise(duration: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const bufferSize = audioContext.sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      noise.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(this.volume * 0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      noise.start();
    } catch {
      // Audio context not available
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemonSoundsEnabled', enabled.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemonSoundsVolume', this.volume.toString());
    }
    // Update all loaded sounds
    this.sounds.forEach(sound => {
      sound.volume(this.volume);
    });
  }

  getVolume(): number {
    return this.volume;
  }
}

// Export singleton instance
export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;

// Hook for using sounds in components
export function useSound() {
  return {
    playClick: () => soundManager?.playClick(),
    playSuccess: () => soundManager?.playSuccess(),
    playError: () => soundManager?.playError(),
    playLevelUp: () => soundManager?.playLevelUp(),
    playPokeballClick: () => soundManager?.playPokeballClick(),
    playCoins: () => soundManager?.playCoins(),
    playWhoosh: () => soundManager?.playWhoosh(),
    playEggHatch: () => soundManager?.playEggHatch(),
    playWildEncounter: () => soundManager?.playWildEncounter(),
    playAchievement: () => soundManager?.playAchievement(),
    playSpinWheel: () => soundManager?.playSpinWheel(),
    setEnabled: (enabled: boolean) => soundManager?.setEnabled(enabled),
    isEnabled: () => soundManager?.isEnabled() ?? false,
    setVolume: (volume: number) => soundManager?.setVolume(volume),
    getVolume: () => soundManager?.getVolume() ?? 0.5,
  };
}

