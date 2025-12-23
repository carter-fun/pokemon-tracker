'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import { useSound } from '@/lib/sounds';

const navItems = [
  { href: '/', label: 'Home', emoji: '🏠', hoverEmoji: '⭐' },
  { href: '/search', label: 'Search', emoji: '🔍', hoverEmoji: '⚡' },
  { href: '/collection', label: 'Collection', emoji: '📚', hoverEmoji: '🎴' },
  { href: '/shop', label: 'Shop', emoji: '🏪', hoverEmoji: '🪙' },
  { href: '/eggs', label: 'Eggs', emoji: '🥚', hoverEmoji: '🐣' },
  { href: '/profile', label: 'Profile', emoji: '👤', hoverEmoji: '🎭' },
];

export default function Navbar() {
  const pathname = usePathname();
  const points = useUserStore((state) => state.points);
  const { playClick } = useSound();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" onClick={() => playClick()}>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🎴
              </motion.span>
              <span className="font-bold text-xl bg-gradient-to-r from-pokemon-red via-pokemon-yellow to-pokemon-blue bg-clip-text text-transparent">
                PokeCollect
              </span>
            </motion.div>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => playClick()}>
                  <motion.div
                    className={`
                      relative px-4 py-2 rounded-xl flex items-center gap-2
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-pokemon-dark-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-pokemon-dark-700'}
                    `}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="text-lg"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.emoji}
                    </motion.span>
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-pokemon-yellow rounded-full"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Points Display */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              🪙
            </motion.span>
            <span className="font-bold text-yellow-400">
              {points.toLocaleString()}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => playClick()}>
                <motion.div
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl
                    ${isActive ? 'text-pokemon-yellow' : 'text-gray-400'}
                  `}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.span
                    className="text-xl"
                    animate={isActive ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {item.emoji}
                  </motion.span>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

