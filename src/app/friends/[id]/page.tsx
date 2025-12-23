'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendsStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FriendCollectionPage() {
  const params = useParams();
  const friendId = params.id as string;
  
  const { getFriend } = useFriendsStore();
  const friend = getFriend(friendId);
  
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [selectedCard, setSelectedCard] = useState<{ id: string; name: string; image: string; set: string } | null>(null);

  if (!friend) {
    return (
      <div className="pokemon-bg min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-zinc-500 mb-4">Friend not found</p>
          <Link href="/friends">
            <button className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-semibold text-sm">Go Back</button>
          </Link>
        </div>
      </div>
    );
  }

  const displayCards = filter === 'favorites' ? friend.favoriteCards : friend.topCards;
  const isFavorite = (cardId: string) => friend.favoriteCards.some(c => c.id === cardId);

  // Group cards by set
  const cardsBySet = displayCards.reduce((acc, card) => {
    if (!acc[card.set]) acc[card.set] = [];
    acc[card.set].push(card);
    return acc;
  }, {} as Record<string, typeof displayCards>);

  return (
    <div className="pokemon-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card-strong border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/friends">
                <motion.button 
                  className="w-10 h-10 rounded-xl glass-button flex items-center justify-center" 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff6b35]/5 flex items-center justify-center text-2xl">
                  {friend.avatar}
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">{friend.username}&apos;s Collection</h1>
                  <p className="text-xs text-zinc-500">Showing {friend.topCards.length} highlighted cards</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl glass-card text-center">
                <p className="text-lg font-mono font-bold text-white">{friend.topCards.length}</p>
                <p className="text-xs text-zinc-500">Highlights</p>
              </div>
              <div className="px-4 py-2 rounded-xl glass-card text-center">
                <p className="text-lg font-mono font-bold text-amber-400">{friend.favoriteCards.length}</p>
                <p className="text-xs text-zinc-500">Favorites</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter */}
      <div className="sticky top-[84px] z-30 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                filter === 'all' 
                  ? 'bg-[#ff6b35] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Cards
              <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${filter === 'all' ? 'bg-white/20' : 'bg-white/5'}`}>
                {friend.topCards.length}
              </span>
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                filter === 'favorites' 
                  ? 'bg-amber-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>★</span>
              Favorites
              <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${filter === 'favorites' ? 'bg-white/20' : 'bg-white/5'}`}>
                {friend.favoriteCards.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {displayCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <span className="text-3xl">🃏</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No cards to show</h2>
            <p className="text-zinc-500 text-sm">This section is empty</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(cardsBySet).map(([setName, cards]) => (
              <section key={setName}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-bold text-white">{setName}</h2>
                  <span className="text-xs text-zinc-500 font-mono">{cards.length} cards</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(index * 0.02, 0.2) }}
                      className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                        isFavorite(card.id) ? 'ring-2 ring-amber-500/60' : ''
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="relative aspect-[2.5/3.5]">
                        <Image src={card.image} alt={card.name} fill className="object-cover" sizes="150px" />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <span className="text-white text-xs font-semibold text-center line-clamp-2">{card.name}</span>
                        </div>
                        
                        {/* Favorite star */}
                        {isFavorite(card.id) && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs">
                            ★
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={() => setSelectedCard(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card-strong rounded-2xl overflow-hidden max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Card Image */}
                <div className="flex justify-center mb-5">
                  <motion.div 
                    className={`relative w-48 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl ${
                      isFavorite(selectedCard.id) ? 'ring-2 ring-amber-500' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image src={selectedCard.image} alt={selectedCard.name} fill className="object-cover" sizes="200px" />
                  </motion.div>
                </div>

                {/* Card Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-white">{selectedCard.name}</h2>
                    {isFavorite(selectedCard.id) && <span className="text-amber-400">★</span>}
                  </div>
                  <p className="text-sm text-zinc-500 mb-2">{selectedCard.set}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-xs text-zinc-600">Owned by</span>
                    <span className="text-2xl">{friend.avatar}</span>
                    <span className="text-sm font-medium text-white">{friend.username}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCard(null)} 
                className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

