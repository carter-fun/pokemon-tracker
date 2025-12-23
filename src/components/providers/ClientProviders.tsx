'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/ui/Navbar';
import GrassFooter from '@/components/ui/GrassFooter';
import FloatingCompanion from '@/components/companion/FloatingCompanion';
import { useUserStore, useCollectionStore, useAchievementsStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { initKonamiCode, isPokemonDay } from '@/lib/easter-eggs';

function AppContent({ children }: { children: ReactNode }) {
  const { checkDailyLogin, addPoints, starterPokemon } = useUserStore();
  const { getUniqueCardCount, getCardCount } = useCollectionStore();
  const { checkAchievements } = useAchievementsStore();
  const { showToast, showPointsGain } = useToast();
  const loginStreak = useUserStore((state) => state.loginStreak);
  const [hasCheckedLogin, setHasCheckedLogin] = useState(false);

  useEffect(() => {
    if (hasCheckedLogin) return;
    
    // Check daily login
    const { isNewDay, bonusPoints } = checkDailyLogin();
    if (isNewDay && bonusPoints > 0) {
      setTimeout(() => {
        showPointsGain(bonusPoints);
        showToast(`Welcome back! Day ${loginStreak} streak! 🔥`, 'success');
      }, 1000);
    }

    // Check for Pokemon Day
    if (isPokemonDay()) {
      setTimeout(() => {
        showToast('🎉 Happy Pokemon Day! All points doubled today!', 'info', 5000);
      }, 2000);
    }

    // Initialize Konami code easter egg
    const cleanup = initKonamiCode(() => {
      addPoints(1000);
      showToast('🔮 Mew appeared! +1000 bonus points!', 'success', 5000);
    });

    setHasCheckedLogin(true);

    return cleanup;
  }, [hasCheckedLogin, checkDailyLogin, addPoints, showToast, showPointsGain, loginStreak]);

  // Check achievements when collection changes
  useEffect(() => {
    const uniqueCount = getUniqueCardCount();
    const newAchievements = checkAchievements(getCardCount(), uniqueCount, loginStreak);
    
    newAchievements.forEach((achievement, index) => {
      setTimeout(() => {
        showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success', 5000);
        showPointsGain(achievement.pointReward);
      }, index * 1500);
    });
  }, [getCardCount, getUniqueCardCount, loginStreak, checkAchievements, showToast, showPointsGain]);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24 md:pb-20 min-h-screen">
        {children}
      </main>
      <GrassFooter />
      {starterPokemon && <FloatingCompanion />}
    </>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AppContent>{children}</AppContent>
    </ToastProvider>
  );
}

