'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionPage() {
  const { cards, removeCard, updateQuantity, toggleFavorite, isFavorite, getFavoriteCards } = useCollectionStore();
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'set'>('recent');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const favoriteCards = getFavoriteCards();

  const sortedCards = [...cards].sort((a, b) => {
    if (sortBy === 'name') return a.cardName.localeCompare(b.cardName);
    if (sortBy === 'set') return a.cardSet.localeCompare(b.cardSet);
    return 0;
  });

  const displayCards = showFavoritesOnly ? sortedCards.filter(c => isFavorite(c.cardId)) : sortedCards;
  const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);

  const adjustQuantity = (cardId: string, delta: number) => {
    const card = cards.find(c => c.cardId === cardId);
    if (!card) return;
    const newQty = card.quantity + delta;
    if (newQty <= 0) {
      removeCard(cardId);
      if (selectedCard?.cardId === cardId) setSelectedCard(null);
    } else {
      updateQuantity(cardId, newQty);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c12] relative overflow-hidden">
      {/* Background Art */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Pokeball pattern */}
        <svg className="absolute top-20 -right-20 w-96 h-96 opacity-[0.03]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4"/>
          <path d="M5 50 H95" stroke="white" strokeWidth="4"/>
          <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="4"/>
        </svg>
        
        <svg className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-[0.02]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3"/>
          <path d="M5 50 H95" stroke="white" strokeWidth="3"/>
          <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="3"/>
        </svg>

        {/* Decorative shapes */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-amber-400/20 rounded-full" />
        <div className="absolute top-1/3 left-20 w-1 h-1 bg-rose-400/20 rounded-full" />
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-cyan-400/10 rounded-full" />
        <div className="absolute bottom-1/4 right-32 w-1.5 h-1.5 bg-emerald-400/20 rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c12]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.1, rotate: -10 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center cursor-pointer shadow-lg shadow-rose-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
              </Link>
              
              {/* Custom Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-8 h-8" viewBox="0 0 40 40">
                    <defs>
                      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b"/>
                        <stop offset="100%" stopColor="#ef4444"/>
                      </linearGradient>
                    </defs>
                    <rect x="4" y="2" width="24" height="32" rx="3" fill="url(#cardGrad)" opacity="0.3"/>
                    <rect x="8" y="5" width="24" height="32" rx="3" fill="url(#cardGrad)" opacity="0.6"/>
                    <rect x="12" y="8" width="24" height="32" rx="3" fill="url(#cardGrad)"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight">MY VAULT</h1>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{cards.length} cards</p>
                </div>
              </div>
            </div>

            {/* Stats Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-xs font-mono text-white">{totalCards}</span>
              </div>
              {favoriteCards.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs font-mono text-amber-400">{favoriteCards.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-1 pb-3">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !showFavoritesOnly 
                  ? 'bg-white text-black' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              All Cards
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                showFavoritesOnly 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span>★</span> Favorites
            </button>
            <div className="flex-1"/>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
              {['recent', 'name', 'set'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s as typeof sortBy)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                    sortBy === s ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section for Favorites */}
      {favoriteCards.length > 0 && !showFavoritesOnly && (
        <section className="relative border-b border-white/5 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent"/>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/20 rounded-full blur-[120px]"/>
          
          <div className="relative max-w-6xl mx-auto px-6 py-10">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <svg className="w-12 h-12" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24"/>
                      <stop offset="100%" stopColor="#f59e0b"/>
                    </linearGradient>
                  </defs>
                  <path d="M24 4 L28 18 L44 18 L32 28 L36 44 L24 34 L12 44 L16 28 L4 18 L20 18 Z" fill="url(#starGrad)"/>
                </svg>
                <motion.div 
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-12 h-12 opacity-30" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4"/>
                  </svg>
                </motion.div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">HALL OF FAME</h2>
                <p className="text-sm text-amber-400/60">Your prized collection</p>
              </div>
            </div>

            {/* Showcase Cards */}
            <div className="flex gap-6 justify-center">
              {favoriteCards.slice(0, 5).map((card, index) => {
                const isCenter = index === Math.floor(Math.min(favoriteCards.length, 5) / 2);
                return (
                  <motion.div
                    key={card.cardId}
                    className="relative cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={() => setSelectedCard(card)}
                    style={{ zIndex: isCenter ? 10 : 5 - Math.abs(index - 2) }}
                  >
                    {/* Card Glow */}
                    <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-b from-amber-400/30 to-transparent blur-2xl ${isCenter ? 'opacity-100' : 'opacity-50'}`}/>
                    
                    {/* Card */}
                    <div className={`relative ${isCenter ? 'w-36' : 'w-28'} aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl shadow-black/50`}>
                      <Image src={card.cardImage} alt={card.cardName} fill className="object-cover" sizes="144px"/>
                      <div className="absolute inset-0 ring-2 ring-inset ring-amber-400/30 rounded-xl"/>
                      
                      {/* Shine Effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%', y: '-100%' }}
                        animate={{ x: '100%', y: '100%' }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </div>

                    {/* Label */}
                    <p className={`mt-3 text-center font-semibold truncate ${isCenter ? 'text-sm text-white' : 'text-xs text-zinc-400'}`}>
                      {card.cardName}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Empty State */}
        {cards.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="w-24 h-24 mx-auto mb-6 opacity-20" viewBox="0 0 100 100">
              <rect x="20" y="10" width="60" height="80" rx="8" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="45" r="15" fill="none" stroke="white" strokeWidth="2"/>
              <path d="M35 75 H65" stroke="white" strokeWidth="2"/>
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">No cards yet</h2>
            <p className="text-zinc-600 mb-6">Start your collection journey</p>
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg shadow-rose-500/25"
              >
                Browse Sets
              </motion.button>
            </Link>
          </div>
        ) : displayCards.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-6xl mb-6 block opacity-20">★</span>
            <h2 className="text-xl font-bold text-white mb-2">No favorites</h2>
            <p className="text-zinc-600 mb-6">Star cards to add them here</p>
            <button onClick={() => setShowFavoritesOnly(false)} className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold">
              View All Cards
            </button>
          </div>
        ) : (
          <>
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full"/>
                <h2 className="text-lg font-bold text-white">
                  {showFavoritesOnly ? 'Favorite Cards' : 'All Cards'}
                </h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"/>
              <span className="text-sm text-zinc-600 font-mono">{displayCards.length}</span>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {displayCards.map((card, index) => (
                <motion.div
                  key={card.cardId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className="group cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className={`relative aspect-[2.5/3.5] rounded-xl overflow-hidden ${
                    isFavorite(card.cardId) ? 'ring-2 ring-amber-400/50' : ''
                  }`}>
                    <Image src={card.cardImage} alt={card.cardName} fill className="object-cover transition-transform group-hover:scale-105" sizes="120px"/>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"/>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                    
                    {/* Info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[10px] text-white font-medium truncate">{card.cardName}</p>
                    </div>

                    {/* Badges */}
                    {isFavorite(card.cardId) && (
                      <div className="absolute top-1.5 right-1.5 text-amber-400 drop-shadow-lg">★</div>
                    )}
                    {card.quantity > 1 && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white">
                        ×{card.quantity}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Card Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={() => setSelectedCard(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl"/>
            
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-[150px]"/>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card */}
              <motion.div 
                className="relative aspect-[2.5/3.5] rounded-2xl overflow-hidden shadow-2xl mb-8"
                whileHover={{ rotateY: 5, rotateX: -5 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image src={selectedCard.cardImage} alt={selectedCard.cardName} fill className="object-cover" sizes="360px"/>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl"/>
              </motion.div>

              {/* Info Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">{selectedCard.cardName}</h2>
                  <p className="text-sm text-zinc-500">{selectedCard.cardSet}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => toggleFavorite(selectedCard.cardId)}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isFavorite(selectedCard.cardId)
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span>{isFavorite(selectedCard.cardId) ? '★' : '☆'}</span>
                    {isFavorite(selectedCard.cardId) ? 'Favorited' : 'Add to Favorites'}
                  </button>

                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4 border border-white/10">
                    <span className="text-sm text-zinc-400">Quantity</span>
                    <div className="flex items-center gap-5">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => adjustQuantity(selectedCard.cardId, -1)} 
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                      >
                        −
                      </motion.button>
                      <span className="text-2xl font-mono font-bold text-white w-8 text-center">{selectedCard.quantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => adjustQuantity(selectedCard.cardId, 1)} 
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <button
                    onClick={() => { removeCard(selectedCard.cardId); setSelectedCard(null); }}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Remove from Collection
                  </button>
                </div>
              </div>

              {/* Close */}
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCard(null)}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
