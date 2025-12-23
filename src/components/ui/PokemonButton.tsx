'use client';

import { motion } from 'framer-motion';
import { useSound } from '@/lib/sounds';
import { ReactNode } from 'react';

type ButtonVariant = 'pokeball' | 'search' | 'shop' | 'profile' | 'save' | 'delete' | 'primary' | 'secondary' | 'ghost';

interface PokemonButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

// Pokemon companion sprites for each button type
const buttonSprites: Record<string, { emoji: string; hoverEmoji?: string; name: string }> = {
  pokeball: { emoji: '🔴', hoverEmoji: '⚪', name: 'Pokeball' },
  search: { emoji: '⚡', hoverEmoji: '⚡', name: 'Pikachu' },
  shop: { emoji: '😺', hoverEmoji: '🪙', name: 'Meowth' },
  profile: { emoji: '🟣', hoverEmoji: '🔮', name: 'Ditto' },
  save: { emoji: '💗', hoverEmoji: '💖', name: 'Chansey' },
  delete: { emoji: '👻', hoverEmoji: '💨', name: 'Gastly' },
  primary: { emoji: '✨', name: 'Star' },
  secondary: { emoji: '🌟', name: 'Sparkle' },
  ghost: { emoji: '', name: '' },
};

const variantStyles: Record<ButtonVariant, string> = {
  pokeball: 'bg-gradient-to-b from-pokeball-red via-pokeball-black to-pokeball-white text-white hover:shadow-[0_0_20px_rgba(238,21,21,0.5)]',
  search: 'bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-pokemon-dark-900 hover:shadow-[0_0_20px_rgba(248,208,48,0.5)]',
  shop: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-pokemon-dark-900 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]',
  profile: 'bg-gradient-to-r from-pokemon-purple to-purple-600 text-white hover:shadow-[0_0_20px_rgba(123,98,163,0.5)]',
  save: 'bg-gradient-to-r from-pokemon-pink to-pink-500 text-white hover:shadow-[0_0_20px_rgba(255,107,157,0.5)]',
  delete: 'bg-gradient-to-r from-purple-900 to-purple-950 text-white hover:shadow-[0_0_20px_rgba(88,28,135,0.5)]',
  primary: 'bg-gradient-to-r from-pokemon-blue to-blue-600 text-white hover:shadow-[0_0_20px_rgba(28,108,255,0.5)]',
  secondary: 'bg-pokemon-dark-600 text-white hover:bg-pokemon-dark-500 border border-pokemon-dark-500',
  ghost: 'bg-transparent text-gray-300 hover:bg-pokemon-dark-700 hover:text-white',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export default function PokemonButton({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  type = 'button',
}: PokemonButtonProps) {
  const { playPokeballClick } = useSound();
  const sprite = buttonSprites[variant];

  const handleClick = () => {
    if (disabled) return;
    playPokeballClick();
    onClick?.();
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 overflow-hidden
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {/* Pokemon companion sprite */}
      {sprite.emoji && (
        <motion.span
          className="text-lg"
          whileHover={{ 
            rotate: variant === 'search' ? [0, -10, 10, -10, 0] : 0,
            scale: 1.2 
          }}
          transition={{ duration: 0.3 }}
        >
          {sprite.emoji}
        </motion.span>
      )}
      
      {/* Button text */}
      <span className="relative z-10">{children}</span>
      
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}

// Specialized Pokeball button for adding to collection
export function PokeballButton({ onClick, isAdding = false }: { onClick: () => void; isAdding?: boolean }) {
  const { playPokeballClick, playSuccess } = useSound();

  const handleClick = () => {
    playPokeballClick();
    onClick();
    setTimeout(() => playSuccess(), 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative w-14 h-14 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-pokemon-yellow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isAdding ? { rotate: [0, -20, 20, -20, 20, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
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
        <line x1="5" y1="50" x2="35" y2="50" stroke="#222224" strokeWidth="4" />
        <line x1="65" y1="50" x2="95" y2="50" stroke="#222224" strokeWidth="4" />
        
        {/* Center button */}
        <circle cx="50" cy="50" r="12" fill="#F0F0F0" stroke="#222224" strokeWidth="4" />
        <circle cx="50" cy="50" r="6" fill="#F0F0F0" stroke="#222224" strokeWidth="2" />
        
        {/* Shine */}
        <ellipse cx="35" cy="30" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-30 35 30)" />
      </svg>
      
      {/* Plus icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
        <span className="text-white text-2xl font-bold">+</span>
      </div>
    </motion.button>
  );
}

// Icon-only button
export function IconButton({ 
  children, 
  onClick, 
  className = '',
  ariaLabel,
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  className?: string;
  ariaLabel: string;
}) {
  const { playClick } = useSound();

  return (
    <motion.button
      onClick={() => {
        playClick();
        onClick?.();
      }}
      aria-label={ariaLabel}
      className={`
        p-2 rounded-lg bg-pokemon-dark-600 text-gray-300
        hover:bg-pokemon-dark-500 hover:text-white
        transition-colors ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

