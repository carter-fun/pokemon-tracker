'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store';

// Pokemon companion data with sprites
const companions: Record<string, { emoji: string; name: string; color: string }> = {
  bulbasaur: { emoji: '🌱', name: 'Bulbasaur', color: '#78C850' },
  charmander: { emoji: '🔥', name: 'Charmander', color: '#F08030' },
  squirtle: { emoji: '💧', name: 'Squirtle', color: '#6890F0' },
  pikachu: { emoji: '⚡', name: 'Pikachu', color: '#F8D030' },
  eevee: { emoji: '🦊', name: 'Eevee', color: '#A8A878' },
  jigglypuff: { emoji: '🎀', name: 'Jigglypuff', color: '#FF6B9D' },
  meowth: { emoji: '😺', name: 'Meowth', color: '#F5DEB3' },
  mew: { emoji: '🔮', name: 'Mew', color: '#F85888' },
  psyduck: { emoji: '🦆', name: 'Psyduck', color: '#F8D030' },
  togepi: { emoji: '🥚', name: 'Togepi', color: '#F0F0F0' },
};

export default function FloatingCompanion() {
  const companion = useUserStore((state) => state.companion);
  const [isVisible, setIsVisible] = useState(true);
  const [expression, setExpression] = useState<'normal' | 'happy' | 'sleepy'>('normal');
  
  // Mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      // Follow mouse with offset
      mouseX.set(e.clientX + 30);
      mouseY.set(e.clientY + 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Random expression changes
    const expressionInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.1) {
        setExpression('happy');
        setTimeout(() => setExpression('normal'), 2000);
      } else if (rand < 0.15) {
        setExpression('sleepy');
        setTimeout(() => setExpression('normal'), 3000);
      }
    }, 10000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(expressionInterval);
    };
  }, [mouseX, mouseY]);

  if (!companion || !isVisible) return null;

  const companionData = companions[companion] || companions.pikachu;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ x, y }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -8, 0],
          rotate: expression === 'happy' ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.5 },
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 blur-xl opacity-30 rounded-full"
          style={{ backgroundColor: companionData.color }}
        />
        
        {/* Companion */}
        <motion.div
          className="relative text-4xl cursor-pointer pointer-events-auto"
          onClick={() => setIsVisible(false)}
          whileHover={{ scale: 1.2 }}
          title={`${companionData.name} is following you!`}
        >
          {companionData.emoji}
          
          {/* Expression indicators */}
          {expression === 'happy' && (
            <motion.span
              className="absolute -top-2 -right-2 text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✨
            </motion.span>
          )}
          {expression === 'sleepy' && (
            <motion.span
              className="absolute -top-2 -right-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💤
            </motion.span>
          )}
        </motion.div>

        {/* Shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Toggle button for showing/hiding companion
export function CompanionToggle() {
  const companion = useUserStore((state) => state.companion);
  const [isShowing, setIsShowing] = useState(true);

  if (!companion) return null;

  const companionData = companions[companion] || companions.pikachu;

  return (
    <motion.button
      className="fixed bottom-20 right-4 z-40 p-3 rounded-full glass border border-white/10"
      onClick={() => setIsShowing(!isShowing)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isShowing ? 'Hide companion' : 'Show companion'}
    >
      <span className={`text-xl ${!isShowing ? 'opacity-50' : ''}`}>
        {companionData.emoji}
      </span>
    </motion.button>
  );
}

