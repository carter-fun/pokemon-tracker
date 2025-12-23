'use client';

// Easter egg detection and triggers

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

let konamiIndex = 0;
let konamiCallback: (() => void) | null = null;

export function initKonamiCode(onActivate: () => void) {
  konamiCallback = onActivate;
  
  if (typeof window === 'undefined') return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase() === e.key ? e.key : e.key;
    
    if (key === KONAMI_CODE[konamiIndex] || key.toLowerCase() === KONAMI_CODE[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === KONAMI_CODE.length) {
        konamiIndex = 0;
        konamiCallback?.();
      }
    } else {
      konamiIndex = 0;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

// Psyduck click counter
let psyduckClicks = 0;
let psyduckCallback: (() => void) | null = null;

export function registerPsyduckClick(onHeadache: () => void) {
  psyduckCallback = onHeadache;
  psyduckClicks++;
  
  if (psyduckClicks >= 10) {
    psyduckClicks = 0;
    psyduckCallback?.();
    return true;
  }
  
  return false;
}

export function resetPsyduckClicks() {
  psyduckClicks = 0;
}

// MISSINGNO search detection
export function checkMissingno(searchTerm: string): boolean {
  const normalized = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalized === 'missingno' || normalized === 'missingn0';
}

// Pokemon Day check (February 27)
export function isPokemonDay(): boolean {
  const today = new Date();
  return today.getMonth() === 1 && today.getDate() === 27;
}

// Time-based features
export function getTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getTimePokemon(): { name: string; sprite: string } {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'morning':
      return { name: 'Pidgey', sprite: '🐦' };
    case 'day':
      return { name: 'Pikachu', sprite: '⚡' };
    case 'evening':
      return { name: 'Eevee', sprite: '🦊' };
    case 'night':
      return { name: 'Hoothoot', sprite: '🦉' };
  }
}

// Special date events
export function getSpecialEvent(): { name: string; bonus: number } | null {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  
  // Pokemon Day - February 27
  if (month === 1 && day === 27) {
    return { name: 'Pokemon Day', bonus: 3 };
  }
  
  // Halloween - October 31
  if (month === 9 && day === 31) {
    return { name: 'Ghost Pokemon Day', bonus: 2 };
  }
  
  // Christmas - December 25
  if (month === 11 && day === 25) {
    return { name: 'Holiday Special', bonus: 2 };
  }
  
  // New Year - January 1
  if (month === 0 && day === 1) {
    return { name: 'New Year Celebration', bonus: 2 };
  }
  
  return null;
}

// Glitch effect for MISSINGNO
export function triggerGlitchEffect(element: HTMLElement, duration: number = 2000) {
  element.classList.add('glitch');
  
  // Create glitch overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 0, 0.03) 2px,
      rgba(0, 255, 0, 0.03) 4px
    );
    pointer-events: none;
    z-index: 9999;
    animation: glitch 0.3s ease-in-out infinite;
  `;
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    element.classList.remove('glitch');
    overlay.remove();
  }, duration);
}

// Sparkle effect generator
export function createSparkle(container: HTMLElement) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
  container.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1500);
}

// Confetti explosion for achievements
export function triggerConfetti(count: number = 50) {
  if (typeof window === 'undefined') return;
  
  const colors = ['#FF1C1C', '#1C6CFF', '#FFD733', '#4DAD5B', '#7B62A3', '#FF9C54'];
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;
  document.body.appendChild(container);
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = 50 + (Math.random() - 0.5) * 20;
    const endX = startX + (Math.random() - 0.5) * 100;
    const rotation = Math.random() * 720;
    const duration = 1 + Math.random() * 2;
    const delay = Math.random() * 0.5;
    
    confetti.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${color};
      left: ${startX}%;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
    `;
    
    // Add keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) translateX(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) translateX(${endX - startX}vw) rotate(${rotation}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    container.appendChild(confetti);
  }
  
  setTimeout(() => container.remove(), 4000);
}

