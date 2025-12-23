'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendsStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

export default function FriendsPage() {
  const { friends, removeFriend } = useFriendsStore();
  const [selectedFriend, setSelectedFriend] = useState<typeof friends[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              
              <div>
                <h1 className="text-xl font-bold text-white">Friends</h1>
                <p className="text-xs text-zinc-500">{friends.length} friends</p>
              </div>
            </div>

            <motion.button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff6b35] text-white font-semibold text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Friend
            </motion.button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends..."
              className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm font-medium"
            />
          </div>
        </div>
      </header>

      {/* Friends List */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No friends yet</h2>
            <p className="text-zinc-500 text-sm mb-6">Add friends to see their collections</p>
            <motion.button 
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-semibold text-sm"
            >
              Add Friend
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-5 cursor-pointer hover:border-white/10 transition-all"
                onClick={() => setSelectedFriend(friend)}
              >
                {/* Friend Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff6b35]/5 flex items-center justify-center text-2xl">
                    {friend.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{friend.username}</h3>
                    <p className="text-xs text-zinc-500">
                      Added {new Date(friend.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 glass-card rounded-xl p-3 text-center">
                    <p className="text-lg font-mono font-bold text-white">{friend.topCards.length}</p>
                    <p className="text-xs text-zinc-500">Shared</p>
                  </div>
                  <div className="flex-1 glass-card rounded-xl p-3 text-center">
                    <p className="text-lg font-mono font-bold text-amber-400">{friend.favoriteCards.length}</p>
                    <p className="text-xs text-zinc-500">Favorites</p>
                  </div>
                </div>

                {/* Preview Cards */}
                {friend.topCards.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {friend.topCards.slice(0, 3).map((card, i) => (
                        <div 
                          key={card.id} 
                          className="relative w-14 aspect-[2.5/3.5] rounded-lg overflow-hidden"
                          style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: 3 - i }}
                        >
                          <Image src={card.image} alt={card.name} fill className="object-cover" sizes="56px" />
                        </div>
                      ))}
                      {friend.topCards.length > 3 && (
                        <div className="w-14 aspect-[2.5/3.5] rounded-lg bg-white/5 flex items-center justify-center text-xs text-zinc-400 font-mono" style={{ marginLeft: '-8px' }}>
                          +{friend.topCards.length - 3}
                        </div>
                      )}
                    </div>
                    <Link href={`/friends/${friend.id}`} onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All →
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Friend Detail Modal */}
      <AnimatePresence>
        {selectedFriend && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={() => setSelectedFriend(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card-strong rounded-2xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff6b35]/5 flex items-center justify-center text-3xl">
                    {selectedFriend.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{selectedFriend.username}</h2>
                    <p className="text-sm text-zinc-500">
                      Friends since {new Date(selectedFriend.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-mono font-bold text-white">{selectedFriend.topCards.length}</p>
                    <p className="text-xs text-zinc-500">Cards Shared</p>
                  </div>
                  <div className="flex-1 glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-mono font-bold text-amber-400">{selectedFriend.favoriteCards.length}</p>
                    <p className="text-xs text-zinc-500">Favorites</p>
                  </div>
                </div>
              </div>

              {/* Favorite Cards Section */}
              {selectedFriend.favoriteCards.length > 0 && (
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-400">★</span>
                    <h3 className="font-bold text-white">Favorite Cards</h3>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedFriend.favoriteCards.map((card) => (
                      <div key={card.id} className="flex-shrink-0">
                        <div className="relative w-24 aspect-[2.5/3.5] rounded-xl overflow-hidden ring-2 ring-amber-500/40">
                          <Image src={card.image} alt={card.name} fill className="object-cover" sizes="96px" />
                        </div>
                        <p className="mt-2 text-xs text-zinc-400 text-center truncate w-24">{card.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Cards Section */}
              {selectedFriend.topCards.length > 0 && (
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00d4aa]">◆</span>
                      <h3 className="font-bold text-white">Collection Preview</h3>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{selectedFriend.topCards.length} cards shown</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedFriend.topCards.slice(0, 6).map((card) => (
                      <div key={card.id} className="flex-shrink-0">
                        <div className="relative w-24 aspect-[2.5/3.5] rounded-xl overflow-hidden">
                          <Image src={card.image} alt={card.name} fill className="object-cover" sizes="96px" />
                        </div>
                        <p className="mt-2 text-xs text-zinc-400 text-center truncate w-24">{card.name}</p>
                        <p className="text-xs text-zinc-600 text-center truncate w-24">{card.set}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 space-y-3">
                <Link href={`/friends/${selectedFriend.id}`} onClick={() => setSelectedFriend(null)}>
                  <button className="w-full py-3 rounded-xl font-semibold text-sm bg-[#ff6b35] text-white hover:bg-[#ff6b35]/90 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    View Full Collection
                  </button>
                </Link>
                <button
                  onClick={() => { removeFriend(selectedFriend.id); setSelectedFriend(null); }}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Remove Friend
                </button>
              </div>

              <button 
                onClick={() => setSelectedFriend(null)} 
                className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={() => setShowAddModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card-strong rounded-2xl overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">Add Friend</h2>
                <p className="text-sm text-zinc-500 mb-6">Enter your friend&apos;s username or friend code</p>

                <input
                  type="text"
                  placeholder="Username or friend code..."
                  className="glass-input w-full px-4 py-3.5 rounded-xl text-sm font-medium mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white/5 text-zinc-400 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#ff6b35] text-white"
                  >
                    Send Request
                  </button>
                </div>

                {/* Quick Add Section */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-xs text-zinc-500 mb-3">Suggested Friends</p>
                  <div className="space-y-2">
                    {[
                      { name: 'GaryOak', avatar: '🏆' },
                      { name: 'ProfessorOak', avatar: '🔬' },
                      { name: 'NurseJoy', avatar: '💗' },
                    ].map((suggestion) => (
                      <div key={suggestion.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{suggestion.avatar}</span>
                          <span className="font-medium text-white text-sm">{suggestion.name}</span>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/30 transition-all">
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowAddModal(false)} 
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

