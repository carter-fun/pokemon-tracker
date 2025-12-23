'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getTimeOfDay } from '@/lib/easter-eggs';

// Pokemon that peek out of the grass
const peekingPokemon = [
  { emoji: '🐛', name: 'Caterpie' },
  { emoji: '🐀', name: 'Rattata' },
  { emoji: '🌸', name: 'Oddish' },
  { emoji: '🍄', name: 'Paras' },
  { emoji: '🦋', name: 'Butterfree' },
];

const nightPokemon = [
  { emoji: '🦇', name: 'Zubat' },
  { emoji: '👻', name: 'Gastly' },
  { emoji: '🦉', name: 'Hoothoot' },
  { emoji: '🌙', name: 'Clefairy' },
];

export default function GrassFooter() {
  const [peekingIndex, setPeekingIndex] = useState<number | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    
    // Randomly show a Pokemon peeking
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPeekingIndex(Math.floor(Math.random() * 12));
        setTimeout(() => setPeekingIndex(null), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pokemon = timeOfDay === 'night' ? nightPokemon : peekingPokemon;
  const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];

  // Generate grass blades
  const grassBlades = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    height: 20 + Math.random() * 30,
    delay: Math.random() * 2,
    x: (i / 40) * 100,
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden z-30 md:h-20">
      {/* Grass background gradient */}
      <div 
        className={`
          absolute inset-0
          ${timeOfDay === 'night' 
            ? 'bg-gradient-to-t from-green-950 via-green-900/50 to-transparent' 
            : 'bg-gradient-to-t from-green-800 via-green-700/50 to-transparent'}
        `}
      />

      {/* Grass blades */}
      <svg 
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        {grassBlades.map((blade) => (
          <motion.path
            key={blade.id}
            d={`M ${blade.x} 20 Q ${blade.x + 0.5} ${20 - blade.height / 2} ${blade.x + 0.3} ${20 - blade.height}`}
            stroke={timeOfDay === 'night' ? '#166534' : '#22c55e'}
            strokeWidth="0.8"
            fill="none"
            initial={{ rotate: 0 }}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: blade.delay,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: `${blade.x}% 100%` }}
          />
        ))}
      </svg>

      {/* Peeking Pokemon */}
      {peekingIndex !== null && (
        <motion.div
          className="absolute bottom-2"
          style={{ left: `${(peekingIndex / 12) * 80 + 10}%` }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.span
            className="text-2xl cursor-pointer pointer-events-auto"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            title={randomPokemon.name}
          >
            {randomPokemon.emoji}
          </motion.span>
        </motion.div>
      )}

      {/* Ambient particles (fireflies at night, butterflies during day) */}
      {timeOfDay === 'night' ? (
        // Fireflies
        Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              bottom: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              x: [0, 10, -10, 0],
              y: [0, -10, 5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))
      ) : (
        // Floating pollen/petals during day
        Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-xs opacity-60"
            style={{
              left: `${10 + i * 30}%`,
              bottom: '60%',
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            🌸
          </motion.div>
        ))
      )}
    </div>
  );
}

