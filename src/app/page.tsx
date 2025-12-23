'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getSets, PokemonSet } from '@/lib/pokemon-tcg';
import Link from 'next/link';
import Image from 'next/image';
import { useCollectionStore, useFriendsStore } from '@/lib/store';

const SERIES_ORDER = [
  'Scarlet & Violet', 'Sword & Shield', 'Sun & Moon', 'XY', 'Black & White',
  'HeartGold & SoulSilver', 'Platinum', 'Diamond & Pearl', 'EX', 'E-Card', 'Neo', 'Gym', 'Base',
];

export default function Home() {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const { cards, favorites } = useCollectionStore();
  const { friends } = useFriendsStore();

  useEffect(() => {
    async function loadSets() {
      const data = await getSets();
      setSets(data);
      setLoading(false);
    }
    loadSets();
  }, []);

  const seriesGroups = sets.reduce((acc, set) => {
    if (!acc[set.series]) acc[set.series] = [];
    acc[set.series].push(set);
    return acc;
  }, {} as Record<string, PokemonSet[]>);

  const sortedSeriesList = Object.keys(seriesGroups).sort((a, b) => {
    const aIndex = SERIES_ORDER.findIndex(s => a.includes(s));
    const bIndex = SERIES_ORDER.findIndex(s => b.includes(s));
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const getSetStats = (setName: string, total: number) => {
    const owned = cards.filter(c => c.cardSet === setName).length;
    return { owned, total, percentage: total > 0 ? Math.round((owned / total) * 100) : 0 };
  };

  const filteredSets = sets.filter(set => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries = selectedSeries === 'all' || set.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const groupedFilteredSets = filteredSets.reduce((acc, set) => {
    if (!acc[set.series]) acc[set.series] = [];
    acc[set.series].push(set);
    return acc;
  }, {} as Record<string, PokemonSet[]>);

  const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
  const uniqueCards = cards.length;
  const setsStarted = new Set(cards.map(c => c.cardSet)).size;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white">PokéTracker</span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/collection">
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-orange-500 text-white font-semibold text-sm">
                  Collection {uniqueCards > 0 && <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs">{uniqueCards}</span>}
                </button>
              </Link>
              <Link href="/feed"><button className="h-9 px-3 rounded-lg text-zinc-400 font-medium text-sm hover:text-white hover:bg-white/5">Feed</button></Link>
              <Link href="/friends"><button className="h-9 px-3 rounded-lg text-zinc-400 font-medium text-sm hover:text-white hover:bg-white/5">Friends</button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-8">
          
          {/* Left Sidebar */}
          <aside className="hidden xl:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Stats */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Overview</div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-zinc-500">Cards</span>
                  <span className="text-sm font-mono text-white">{totalCards}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-zinc-500">Unique</span>
                  <span className="text-sm font-mono text-white">{uniqueCards}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-zinc-500">Sets</span>
                  <span className="text-sm font-mono text-white">{setsStarted}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-zinc-500">Favorites</span>
                  <span className="text-sm font-mono text-orange-400">{favorites.length}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Quick Links</div>
                <Link href="/collection" className="flex items-center gap-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                  <span className="w-1 h-1 rounded-full bg-zinc-600"/>
                  My Collection
                </Link>
                <Link href="/feed" className="flex items-center gap-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                  <span className="w-1 h-1 rounded-full bg-zinc-600"/>
                  Activity Feed
                </Link>
                <Link href="/friends" className="flex items-center gap-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                  <span className="w-1 h-1 rounded-full bg-zinc-600"/>
                  Friends
                </Link>
              </div>

              {/* Recent Cards Preview */}
              {cards.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Recent Adds</div>
                  <div className="flex gap-1">
                    {cards.slice(0, 4).map((card) => (
                      <div key={card.cardId} className="w-12 h-16 rounded bg-zinc-800 overflow-hidden">
                        <Image src={card.cardImage} alt={card.cardName} width={48} height={64} className="w-full h-full object-cover"/>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-lg">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sets..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Series Tabs */}
            <div className="mb-6 pb-4 border-b border-white/5">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <button onClick={() => setSelectedSeries('all')} className={`h-8 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedSeries === 'all' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                  All Sets
                </button>
                {sortedSeriesList.map(series => (
                  <button key={series} onClick={() => setSelectedSeries(series)} className={`h-8 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedSeries === series ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                    {series}
                  </button>
                ))}
              </div>
            </div>

            {/* Sets Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : (
              <div className="space-y-12">
                {selectedSeries === 'all' ? (
                  sortedSeriesList.filter(series => groupedFilteredSets[series]?.length > 0).map((series) => (
                    <section key={series}>
                      <div className="flex items-baseline gap-3 mb-5">
                        <h2 className="text-xl font-bold text-white">{series}</h2>
                        <span className="text-xs text-zinc-600">{groupedFilteredSets[series]?.length} sets</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {groupedFilteredSets[series]?.map((set, index) => (
                          <SetCard key={set.id} set={set} getSetStats={getSetStats} index={index} />
                        ))}
                      </div>
                    </section>
                  ))
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredSets.map((set, index) => (
                      <SetCard key={set.id} set={set} getSetStats={getSetStats} index={index} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Friends */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Friends</span>
                  <Link href="/friends" className="text-xs text-orange-400 hover:text-orange-300">View all</Link>
                </div>
                <div className="space-y-2">
                  {friends.slice(0, 4).map((friend) => (
                    <Link key={friend.id} href={`/friends/${friend.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">
                        {friend.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{friend.username}</div>
                        <div className="text-xs text-zinc-600">{friend.topCards.length} cards</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Activity</span>
                  <Link href="/feed" className="text-xs text-orange-400 hover:text-orange-300">View feed</Link>
                </div>
                <div className="space-y-3">
                  {friends.slice(0, 3).map((friend, i) => (
                    <div key={friend.id} className="text-sm">
                      <span className="text-white">{friend.username}</span>
                      <span className="text-zinc-600"> {i === 0 ? 'added a new card' : i === 1 ? 'completed a set' : 'favorited a card'}</span>
                      <div className="text-xs text-zinc-700 mt-0.5">{i === 0 ? '2h ago' : i === 1 ? '5h ago' : 'Yesterday'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friend Cards Preview */}
              {friends[0] && (
                <div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Top Cards</div>
                  <div className="grid grid-cols-3 gap-1">
                    {friends[0].topCards.slice(0, 6).map((card) => (
                      <div key={card.id} className="aspect-[2.5/3.5] rounded bg-zinc-800 overflow-hidden">
                        <Image src={card.image} alt={card.name} width={60} height={84} className="w-full h-full object-cover"/>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SetCard({ set, getSetStats, index }: { 
  set: PokemonSet; 
  getSetStats: (name: string, total: number) => { owned: number; total: number; percentage: number };
  index: number;
}) {
  const stats = getSetStats(set.name, set.total);
  const hasCards = stats.owned > 0;
  
  return (
    <Link href={`/set/${set.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.02, 0.15) }}
        whileHover={{ y: -2 }}
        className={`group relative bg-[#111116] rounded-lg overflow-hidden cursor-pointer border transition-all ${
          hasCards ? 'border-orange-500/20' : 'border-white/5 hover:border-white/10'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center p-1">
              <Image src={set.images.symbol} alt="" width={24} height={24} className="object-contain"/>
            </div>
            <div className="h-8 max-w-[90px]">
              <Image src={set.images.logo} alt={set.name} width={90} height={32} className="object-contain object-right h-full w-auto"/>
            </div>
          </div>
          <h3 className="font-medium text-white text-sm mb-0.5 line-clamp-1">{set.name}</h3>
          <p className="text-xs text-zinc-600 mb-3">{set.total} cards</p>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-500 font-mono">{stats.owned}/{set.total}</span>
            <span className={hasCards ? 'text-orange-400' : 'text-zinc-700'}>{stats.percentage}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.015 }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
