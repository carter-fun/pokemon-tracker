'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useSound } from '@/lib/sounds';
import Image from 'next/image';

interface WildEncounterProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardImage: string;
  rarity?: string;
}

export default function WildEncounter({ isOpen, onClose, cardName, cardImage, rarity }: WildEncounterProps) {
  const { playWildEncounter, playSuccess } = useSound();

  useEffect(() => {
    if (isOpen) {
      playWildEncounter();
      // Auto close after animation
      const timer = setTimeout(() => {
        playSuccess();
        setTimeout(onClose, 1000);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, playWildEncounter, playSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Flash effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0, 1, 0, 1, 0],
            }}
            transition={{ duration: 0.8 }}
          />

          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.8 }}
          />

          {/* Diagonal wipe transition */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-pokemon-dark-900 via-pokemon-dark-800 to-pokemon-dark-900" />
          </motion.div>

          {/* Grass at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-800 to-transparent"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          />

          {/* Card reveal */}
          <motion.div
            className="relative z-10"
            initial={{ y: 100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
          >
            {/* Card glow */}
            <motion.div
              className="absolute inset-0 blur-3xl"
              style={{
                background: rarity?.includes('Rare') 
                  ? 'linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1)' 
                  : 'rgba(255, 215, 0, 0.3)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Card */}
            <motion.div
              className="relative w-64 h-88 rounded-xl overflow-hidden shadow-2xl"
              animate={{
                rotateY: [0, 5, -5, 0],
              }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              <Image
                src={cardImage}
                alt={cardName}
                fill
                className="object-cover"
              />

              {/* Sparkles for rare cards */}
              {rarity?.includes('Rare') && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="absolute top-20 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.h2
              className="text-3xl font-bold text-white mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              Wild {cardName} appeared!
            </motion.h2>
            {rarity && (
              <motion.p
                className="text-yellow-400 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                ✨ {rarity} ✨
              </motion.p>
            )}
          </motion.div>

          {/* Gotcha text */}
          <motion.div
            className="absolute bottom-32 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: 'spring' }}
          >
            <span className="text-4xl font-bold text-pokemon-yellow drop-shadow-lg">
              GOTCHA!
            </span>
          </motion.div>

          {/* Click to continue */}
          <motion.button
            className="absolute bottom-8 text-gray-400 text-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            Click anywhere to continue...
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

