'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useSound } from '@/lib/sounds';
import PokemonButton from '../ui/PokemonButton';

interface SpinWheelProps {
  onResult: (prize: { points: number; label: string }) => void;
  disabled?: boolean;
}

const prizes = [
  { points: 10, label: '10 pts', color: '#A8A878' },
  { points: 25, label: '25 pts', color: '#78C850' },
  { points: 50, label: '50 pts', color: '#6890F0' },
  { points: 100, label: '100 pts', color: '#F8D030' },
  { points: 25, label: '25 pts', color: '#78C850' },
  { points: 10, label: '10 pts', color: '#A8A878' },
  { points: 200, label: '200 pts', color: '#F08030' },
  { points: 25, label: '25 pts', color: '#78C850' },
];

export default function SpinWheel({ onResult, disabled = false }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();
  const { playSpinWheel, playCoins, playLevelUp } = useSound();

  const spin = async () => {
    if (isSpinning || disabled) return;
    
    setIsSpinning(true);
    
    // Determine winning segment (weighted towards lower prizes)
    const weights = [25, 20, 15, 5, 20, 25, 3, 20]; // Sum should ideally be ~100
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let winningIndex = 0;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        winningIndex = i;
        break;
      }
    }

    // Calculate rotation
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 - (winningIndex * segmentAngle) - segmentAngle / 2;
    const totalRotation = 360 * 5 + targetAngle; // 5 full rotations + target

    // Play tick sounds during spin
    const tickInterval = setInterval(() => {
      playSpinWheel();
    }, 100);

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4,
        ease: [0.17, 0.67, 0.12, 0.99], // Custom easing for realistic spin
      },
    });

    clearInterval(tickInterval);
    
    const prize = prizes[winningIndex];
    if (prize.points >= 100) {
      playLevelUp();
    } else {
      playCoins();
    }
    
    onResult(prize);
    setIsSpinning(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel container */}
      <div className="relative w-72 h-72">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-pokemon-yellow drop-shadow-lg" />
        </div>

        {/* Voltorb center decoration */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-b from-pokeball-red via-black to-white flex items-center justify-center shadow-lg"
            animate={isSpinning ? { scale: [1, 0.95, 1] } : {}}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <span className="text-2xl">😠</span>
          </motion.div>
        </div>

        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-pokemon-dark-600"
          animate={controls}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {prizes.map((prize, i) => {
              const angle = (360 / prizes.length) * i;
              const startAngle = (angle - 90) * (Math.PI / 180);
              const endAngle = (angle + 360 / prizes.length - 90) * (Math.PI / 180);
              
              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);
              
              const largeArc = 360 / prizes.length > 180 ? 1 : 0;
              
              // Text position
              const midAngle = ((angle + 360 / prizes.length / 2 - 90) * Math.PI) / 180;
              const textX = 50 + 32 * Math.cos(midAngle);
              const textY = 50 + 32 * Math.sin(midAngle);
              const textRotation = angle + 360 / prizes.length / 2;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke="#1a1a25"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Outer ring decoration */}
        <div className="absolute inset-0 rounded-full border-8 border-pokemon-dark-500 pointer-events-none" />
      </div>

      {/* Spin button */}
      <PokemonButton
        variant="pokeball"
        onClick={spin}
        disabled={isSpinning || disabled}
        size="lg"
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </PokemonButton>
    </div>
  );
}

