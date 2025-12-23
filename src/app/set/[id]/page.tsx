'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCardsForSet, getSet, PokemonCard as CardType, PokemonSet } from '@/lib/pokemon-tcg';
import { FALLBACK_SETS } from '@/lib/sets-data';
import { useCollectionStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SetPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [set, setSet] = useState<PokemonSet | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [filter, setFilter] = useState<'all' | 'owned' | 'missing'>('all');

  const { cards: ownedCards, addCard, removeCard, hasCard, updateQuantity, toggleFavorite, isFavorite } = useCollectionStore();
  const [loadingCards, setLoadingCards] = useState(false);
  const [cardError, setCardError] = useState(false);

  const loadCards = async () => {
    setLoadingCards(true);
    setCardError(false);
    try {
      const cardsData = await getCardsForSet(id);
      if (cardsData.length === 0) setCardError(true);
      setCards(cardsData);
    } catch {
      setCardError(true);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      const setData = await getSet(id);
      if (setData) {
        setSet(setData);
        setLoading(false);
        loadCards();
      } else {
        const fallback = FALLBACK_SETS.find(s => s.id === id);
        if (fallback) setSet(fallback as unknown as PokemonSet);
        setLoading(false);
      }
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredCards = cards.filter(card => {
    if (filter === 'owned') return hasCard(card.id);
    if (filter === 'missing') return !hasCard(card.id);
    return true;
  });

  const ownedCount = cards.filter(c => hasCard(c.id)).length;
  const percentage = cards.length > 0 ? Math.round((ownedCount / cards.length) * 100) : 0;

  const handleToggleOwned = (card: CardType) => {
    if (hasCard(card.id)) {
      removeCard(card.id);
    } else {
      addCard({
        cardId: card.id,
        cardName: card.name,
        cardImage: card.images.small,
        cardSet: set?.name || '',
        cardRarity: card.rarity || null,
      });
    }
  };

  const getOwnedQuantity = (cardId: string) => {
    return ownedCards.find(c => c.cardId === cardId)?.quantity || 0;
  };

  const adjustQuantity = (card: CardType, delta: number) => {
    const currentQty = getOwnedQuantity(card.id);
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeCard(card.id);
    } else if (currentQty === 0 && delta > 0) {
      addCard({ cardId: card.id, cardName: card.name, cardImage: card.images.small, cardSet: set?.name || '', cardRarity: card.rarity || null });
    } else {
      updateQuantity(card.id, newQty);
    }
  };

  if (loading) {
    return (
      <div className="pokemon-bg min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#ff6b35]/30 border-t-[#ff6b35] rounded-full animate-spin" />
      </div>
    );
  }

  if (!set) {
    return (
      <div className="pokemon-bg min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-zinc-500 mb-4">Set not found</p>
          <Link href="/"><button className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-semibold text-sm">Go Back</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-bg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card-strong border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
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
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                  <Image src={set.images.symbol} alt="" width={24} height={24} className="object-contain" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">{set.name}</h1>
                  <p className="text-xs text-zinc-500">{set.series}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-zinc-500">Progress</p>
                <p className="font-mono font-bold text-white">{ownedCount}<span className="text-zinc-600">/{cards.length}</span></p>
              </div>
              <div className="w-32">
                <div className="flex justify-end mb-1">
                  <span className={`text-sm font-mono font-bold ${percentage === 100 ? 'text-[#00d4aa]' : 'text-[#ff6b35]'}`}>{percentage}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${percentage === 100 ? 'bg-[#00d4aa]' : 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a]'}`} 
                    initial={{ width: 0 }} 
                    animate={{ width: `${percentage}%` }} 
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter */}
      <div className="sticky top-[84px] z-30 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: cards.length },
              { key: 'owned', label: 'Collected', count: ownedCount },
              { key: 'missing', label: 'Missing', count: cards.length - ownedCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                  filter === key 
                    ? key === 'owned' ? 'bg-[#00d4aa] text-white' : key === 'missing' ? 'bg-rose-500 text-white' : 'bg-[#ff6b35] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${filter === key ? 'bg-white/20' : 'bg-white/5'}`}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loadingCards && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#ff6b35]/30 border-t-[#ff6b35] rounded-full animate-spin" />
            <p className="mt-4 text-zinc-500 text-sm">Loading cards...</p>
          </div>
        )}

        {cardError && cards.length === 0 && !loadingCards && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <span className="text-3xl">😢</span>
            </div>
            <p className="text-zinc-500 mb-4">Unable to load cards</p>
            <button onClick={loadCards} className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-semibold text-sm">
              Retry
            </button>
          </div>
        )}

        {!loadingCards && cards.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {filteredCards.map((card, index) => {
              const owned = hasCard(card.id);
              const quantity = getOwnedQuantity(card.id);
              const favorited = isFavorite(card.id);

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.015, 0.3) }}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                    owned ? 'ring-2 ring-[#00d4aa]/60' : ''
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="relative aspect-[2.5/3.5]">
                    <Image src={card.images.small} alt={card.name} fill className="object-cover" sizes="150px" />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-white text-xs font-mono">#{card.number}</span>
                    </div>
                    
                    {/* Owned check */}
                    {owned && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#00d4aa] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Favorite star */}
                    {favorited && (
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs">★</div>
                    )}

                    {/* Quantity */}
                    {quantity > 1 && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs font-mono font-bold">
                        ×{quantity}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
              className="relative glass-card-strong rounded-2xl overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Card Image */}
                <div className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                  <motion.div 
                    className={`relative w-48 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl ${
                      hasCard(selectedCard.id) ? 'ring-2 ring-[#00d4aa]' : ''
                    }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image src={selectedCard.images.large || selectedCard.images.small} alt={selectedCard.name} fill className="object-cover" sizes="200px" />
                  </motion.div>
                </div>

                {/* Card Info */}
                <div className="md:w-1/2 p-6">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-xl font-bold text-white">{selectedCard.name}</h2>
                    <button
                      onClick={() => toggleFavorite(selectedCard.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isFavorite(selectedCard.id) ? 'bg-amber-500 text-white' : 'bg-white/5 text-zinc-500 hover:text-amber-400'
                      }`}
                    >
                      {isFavorite(selectedCard.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 mb-5">{set.name} · #{selectedCard.number}</p>

                  {selectedCard.rarity && (
                    <div className="flex justify-between py-2.5 border-b border-white/5 text-sm">
                      <span className="text-zinc-500">Rarity</span>
                      <span className="text-white">{selectedCard.rarity}</span>
                    </div>
                  )}
                  {selectedCard.artist && (
                    <div className="flex justify-between py-2.5 border-b border-white/5 text-sm">
                      <span className="text-zinc-500">Artist</span>
                      <span className="text-white">{selectedCard.artist}</span>
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="glass-card rounded-xl p-4 mt-5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">In Collection</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => adjustQuantity(selectedCard, -1)} 
                          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white font-bold transition-all"
                        >
                          −
                        </button>
                        <span className="text-xl font-mono font-bold text-white w-8 text-center">{getOwnedQuantity(selectedCard.id)}</span>
                        <button 
                          onClick={() => adjustQuantity(selectedCard, 1)} 
                          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white font-bold transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleOwned(selectedCard)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      hasCard(selectedCard.id)
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-[#00d4aa] text-white'
                    }`}
                  >
                    {hasCard(selectedCard.id) ? 'Remove from Collection' : 'Add to Collection'}
                  </button>
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
