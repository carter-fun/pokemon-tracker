'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'points';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  showPointsGain: (points: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Pokemon emoji for each toast type
const toastPokemon: Record<Toast['type'], { emoji: string; bgClass: string }> = {
  success: { emoji: '⚡', bgClass: 'from-green-600 to-green-700' }, // Pikachu cheering
  error: { emoji: '😵', bgClass: 'from-red-600 to-red-700' }, // Sad Psyduck
  info: { emoji: '🐦', bgClass: 'from-blue-600 to-blue-700' }, // Pidgey delivers
  points: { emoji: '🪙', bgClass: 'from-yellow-500 to-yellow-600' }, // Coins!
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const showPointsGain = useCallback((points: number) => {
    showToast(`+${points} points!`, 'points', 2000);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showPointsGain }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              className={`
                pidgey-toast flex items-center gap-3 px-4 py-3 rounded-xl
                bg-gradient-to-r ${toastPokemon[toast.type].bgClass}
                text-white shadow-lg backdrop-blur-sm
                border border-white/10
              `}
            >
              {/* Pokemon carrier */}
              <motion.span
                className="text-2xl"
                animate={{
                  y: [0, -3, 0],
                  rotate: toast.type === 'info' ? [-5, 5, -5] : 0,
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {toastPokemon[toast.type].emoji}
              </motion.span>
              
              {/* Message */}
              <span className="font-medium">{toast.message}</span>
              
              {/* Points animation */}
              {toast.type === 'points' && (
                <motion.span
                  className="text-yellow-200 font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  ✨
                </motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Floating points indicator
export function PointsGainIndicator({ points, x, y }: { points: number; x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 text-yellow-400 font-bold text-xl"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -50, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      +{points}
    </motion.div>
  );
}

