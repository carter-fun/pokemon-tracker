'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendsStore, useCollectionStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

interface FeedPost {
  id: string;
  type: 'added' | 'favorited';
  userId: string;
  username: string;
  avatar: string;
  text?: string;
  card?: { id: string; name: string; image: string; set: string };
  timestamp: Date;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

function generateFeedPosts(friends: ReturnType<typeof useFriendsStore.getState>['friends']): FeedPost[] {
  const posts: FeedPost[] = [];
  
  const pullMessages = [
    "Just pulled this from a booster pack! 🔥",
    "Finally got it!!",
    "Look what came in the mail today 📦",
    "Added to the collection ✨",
    "Can't believe my luck",
    "Pack luck was insane today",
  ];

  const favMessages = [
    "One of my all-time favorites",
    "The artwork on this is incredible",
    "Grail card 🏆",
  ];

  const mockComments: Comment[][] = [
    [
      { id: 'c1', userId: 'u1', username: 'TrainerRed', avatar: '🔴', text: 'Nice pull! 🔥', timestamp: new Date(Date.now() - 1800000) },
      { id: 'c2', userId: 'u2', username: 'CardCollector', avatar: '🃏', text: 'I need this one', timestamp: new Date(Date.now() - 900000) },
    ],
    [{ id: 'c3', userId: 'u3', username: 'PokeFan2024', avatar: '⚡', text: 'Congrats!! 🎉', timestamp: new Date(Date.now() - 3600000) }],
    [],
  ];
  
  friends.forEach(friend => {
    friend.topCards.forEach((card, index) => {
      const hoursAgo = index * 3 + Math.floor(Math.random() * 4);
      posts.push({
        id: `${friend.id}-${card.id}`,
        type: 'added',
        userId: friend.id,
        username: friend.username,
        avatar: friend.avatar,
        text: pullMessages[Math.floor(Math.random() * pullMessages.length)],
        card,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 200) + 10,
        liked: Math.random() > 0.7,
        comments: mockComments[Math.floor(Math.random() * mockComments.length)],
      });
    });
    
    friend.favoriteCards.slice(0, 1).forEach((card, index) => {
      const hoursAgo = index * 8 + Math.floor(Math.random() * 6) + 10;
      posts.push({
        id: `${friend.id}-fav-${card.id}`,
        type: 'favorited',
        userId: friend.id,
        username: friend.username,
        avatar: friend.avatar,
        text: favMessages[Math.floor(Math.random() * favMessages.length)],
        card,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 300) + 50,
        liked: Math.random() > 0.5,
        comments: [],
      });
    });
  });
  
  return posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export default function FeedPage() {
  const { friends } = useFriendsStore();
  const { cards: myCards } = useCollectionStore();
  const [posts, setPosts] = useState<FeedPost[]>(() => generateFeedPosts(friends));
  const [filter, setFilter] = useState<'all' | 'pulls' | 'favorites'>('all');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) newExpanded.delete(postId);
    else newExpanded.add(postId);
    setExpandedComments(newExpanded);
  };

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, {
            id: `me-${Date.now()}`,
            userId: 'me',
            username: 'You',
            avatar: '👤',
            text,
            timestamp: new Date(),
          }]}
        : post
    ));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => filter === 'pulls' ? p.type === 'added' : p.type === 'favorited');

  const myRecentPosts: FeedPost[] = myCards.slice(0, 3).map((card) => ({
    id: `me-${card.cardId}`,
    type: 'added' as const,
    userId: 'me',
    username: 'You',
    avatar: '👤',
    text: 'Added to my collection',
    card: { id: card.cardId, name: card.cardName, image: card.cardImage, set: card.cardSet },
    timestamp: new Date(card.addedAt),
    likes: 0,
    liked: false,
    comments: [],
  }));

  const allPosts = [...filteredPosts, ...myRecentPosts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const hotCards = [
    { name: 'Charizard ex', set: '151', count: 847 },
    { name: 'Pikachu VMAX', set: 'Crown Zenith', count: 623 },
    { name: 'Umbreon VMAX', set: 'Evolving Skies', count: 412 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto flex gap-6 px-4">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0 py-6">
          <div className="sticky top-6 space-y-6">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              PokéTracker
            </Link>
            
            <nav className="space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Sets
              </Link>
              <Link href="/collection" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                Collection
              </Link>
              <Link href="/feed" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                Feed
              </Link>
              <Link href="/friends" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Friends
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-w-0 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Feed</h1>
            <div className="flex bg-white/5 rounded-lg p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'pulls', label: 'Pulls' },
                { key: 'favorites', label: 'Favorites' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === key ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {allPosts.map((post) => (
              <article key={post.id} className="bg-[#111116] rounded-xl border border-white/5 overflow-hidden">
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Link href={post.userId === 'me' ? '/collection' : `/friends/${post.userId}`}>
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={post.userId === 'me' ? '/collection' : `/friends/${post.userId}`} className="font-semibold text-white hover:underline">
                          {post.username}
                        </Link>
                        <span className="text-zinc-600 text-sm">· {formatTimeAgo(post.timestamp)}</span>
                      </div>
                      {post.text && <p className="text-zinc-300 text-sm mt-0.5">{post.text}</p>}
                    </div>
                  </div>
                </div>

                {/* Card */}
                {post.card && (
                  <div className="px-4">
                    <div className="flex gap-4 p-3 bg-zinc-900/50 rounded-xl">
                      <div className="w-24 aspect-[2.5/3.5] rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                        <Image src={post.card.image} alt={post.card.name} width={96} height={134} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-white">{post.card.name}</h3>
                        <p className="text-zinc-500 text-sm">{post.card.set}</p>
                        {post.type === 'favorited' && (
                          <span className="inline-flex items-center gap-1 mt-2 text-amber-400 text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            Favorite
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-4 py-3 flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? 'text-rose-400' : 'text-zinc-500 hover:text-rose-400'}`}
                  >
                    {post.liked ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                      </svg>
                    )}
                    {post.likes}
                  </button>

                  <button 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${expandedComments.has(post.id) ? 'text-orange-400' : 'text-zinc-500 hover:text-orange-400'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
                    </svg>
                    {post.comments.length || 'Comment'}
                  </button>

                  <button className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors ml-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                    </svg>
                    Share
                  </button>
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {expandedComments.has(post.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">{comment.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-sm">{comment.username}</span>
                                <span className="text-zinc-600 text-xs">{formatTimeAgo(comment.timestamp)}</span>
                              </div>
                              <p className="text-zinc-300 text-sm">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">👤</div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-zinc-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-orange-500/50"
                            />
                            <button
                              onClick={() => addComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium disabled:opacity-40"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-64 flex-shrink-0 py-6">
          <div className="sticky top-6 space-y-6">
            {/* Hot Cards */}
            <div className="bg-[#111116] rounded-xl border border-white/5 p-4">
              <h3 className="font-bold text-white mb-4">🔥 Hot Right Now</h3>
              <div className="space-y-3">
                {hotCards.map((card, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-zinc-600 text-sm font-mono w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{card.name}</div>
                      <div className="text-zinc-600 text-xs">{card.count} posts today</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Friends */}
            <div className="bg-[#111116] rounded-xl border border-white/5 p-4">
              <h3 className="font-bold text-white mb-4">Active Collectors</h3>
              <div className="space-y-3">
                {friends.slice(0, 4).map((friend) => (
                  <Link key={friend.id} href={`/friends/${friend.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">{friend.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{friend.username}</div>
                      <div className="text-zinc-600 text-xs">{friend.topCards.length} cards</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500"/>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
