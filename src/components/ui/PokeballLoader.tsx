'use client';

import { motion } from 'framer-motion';

interface PokeballLoaderProps {
  size?: number;
  isLoading?: boolean;
}

export default function PokeballLoader({ size = 60, isLoading = true }: PokeballLoaderProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={isLoading ? {
          rotate: [0, -20, 20, -20, 20, 0],
        } : {}}
        transition={{
          duration: 0.8,
          repeat: isLoading ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      >
        {/* Pokeball SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Top half (red) */}
          <path
            d="M 50 5 A 45 45 0 0 1 95 50 L 65 50 A 15 15 0 0 0 35 50 L 5 50 A 45 45 0 0 1 50 5"
            fill="#EE1515"
            stroke="#222224"
            strokeWidth="3"
          />
          
          {/* Bottom half (white) */}
          <path
            d="M 50 95 A 45 45 0 0 1 5 50 L 35 50 A 15 15 0 0 0 65 50 L 95 50 A 45 45 0 0 1 50 95"
            fill="#F0F0F0"
            stroke="#222224"
            strokeWidth="3"
          />
          
          {/* Center line */}
          <line
            x1="5"
            y1="50"
            x2="35"
            y2="50"
            stroke="#222224"
            strokeWidth="4"
          />
          <line
            x1="65"
            y1="50"
            x2="95"
            y2="50"
            stroke="#222224"
            strokeWidth="4"
          />
          
          {/* Center button */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="#F0F0F0"
            stroke="#222224"
            strokeWidth="4"
          />
          
          {/* Center button inner */}
          <motion.circle
            cx="50"
            cy="50"
            r="6"
            fill="#F0F0F0"
            stroke="#222224"
            strokeWidth="2"
            animate={isLoading ? {
              fill: ['#F0F0F0', '#FFD733', '#F0F0F0'],
            } : {}}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
          
          {/* Shine effect */}
          <ellipse
            cx="35"
            cy="30"
            rx="8"
            ry="5"
            fill="rgba(255,255,255,0.4)"
            transform="rotate(-30 35 30)"
          />
        </svg>
      </motion.div>
    </div>
  );
}

// Full page loading screen
export function PokeballLoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-pokemon-dark-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <PokeballLoader size={80} />
      <motion.p
        className="mt-6 text-lg text-gray-300 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
      <motion.div
        className="flex gap-1 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-pokemon-yellow rounded-full"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

