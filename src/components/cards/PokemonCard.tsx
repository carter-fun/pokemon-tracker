'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { PokemonCard as CardType, isRareCard, getCardPrice, getTypeColor } from '@/lib/pokemon-tcg';

interface PokemonCardProps {
  card: CardType;
  onClick?: () => void;
  showPrice?: boolean;
  isInCollection?: boolean;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PokemonCard({ 
  card, 
  onClick, 
  showPrice = false,
  isInCollection = false,
  quantity = 0,
  size = 'md',
}: PokemonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isRare = isRareCard(card);
  
  // Mouse tracking for holographic effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Transform mouse position to rotation and gradient position
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
  const gradientX = useTransform(mouseX, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-88',
  };

  const price = showPrice ? getCardPrice(card) : null;
  const typeColor = card.types?.[0] ? getTypeColor(card.types[0]) : '#A8A878';

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative ${sizeClasses[size]} cursor-pointer perspective-1000
        ${isInCollection ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-pokemon-dark-900' : ''}
      `}
      onClick={() => {
        if (onClick) onClick();
        else setIsFlipped(!isFlipped);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 180 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Front of card */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Card image */}
        <Image
          src={card.images.large || card.images.small}
          alt={card.name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 128px, 192px"
        />
        
        {/* Holographic overlay for rare cards */}
        {isRare && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `
                linear-gradient(
                  ${gradientX.get() * 3.6}deg,
                  transparent 0%,
                  rgba(255, 0, 0, 0.1) 10%,
                  rgba(255, 165, 0, 0.1) 20%,
                  rgba(255, 255, 0, 0.1) 30%,
                  rgba(0, 255, 0, 0.1) 40%,
                  rgba(0, 255, 255, 0.1) 50%,
                  rgba(0, 0, 255, 0.1) 60%,
                  rgba(128, 0, 128, 0.1) 70%,
                  rgba(255, 0, 255, 0.1) 80%,
                  transparent 100%
                )
              `,
              opacity: 0.6,
            }}
          />
        )}

        {/* Sparkle effects for rare cards */}
        {isRare && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Quantity badge */}
        {quantity > 0 && (
          <motion.div
            className="absolute top-2 right-2 bg-pokemon-dark-900/90 text-white px-2 py-1 rounded-lg text-sm font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            ×{quantity}
          </motion.div>
        )}

        {/* In collection indicator */}
        {isInCollection && (
          <motion.div
            className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            ✓
          </motion.div>
        )}

        {/* Price tag */}
        {price && (
          <motion.div
            className="absolute bottom-2 right-2 bg-pokemon-dark-900/90 text-green-400 px-2 py-1 rounded-lg text-sm font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ${price.toFixed(2)}
          </motion.div>
        )}

        {/* Rarity indicator */}
        {card.rarity && (
          <div 
            className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ backgroundColor: typeColor }}
          >
            {card.rarity}
          </div>
        )}
      </motion.div>

      {/* Back of card */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center"
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">🎴</div>
          <div className="text-white font-bold">{card.set.name}</div>
          <div className="text-blue-300 text-sm mt-1">#{card.number}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Card grid component
export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {children}
    </div>
  );
}

// Card skeleton for loading states
export function CardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-88',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-pokemon-dark-700 animate-pulse`}>
      <div className="h-full w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          🎴
        </motion.div>
      </div>
    </div>
  );
}

