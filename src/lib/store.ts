'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  points: number;
  totalEarned: number;
  loginStreak: number;
  lastLogin: string | null;
  starterPokemon: string | null;
  companion: string | null;
  equippedFrame: string | null;
  equippedTitle: string | null;
  equippedBackground: string | null;
  soundEnabled: boolean;
  
  // Actions
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  setStarterPokemon: (pokemon: string) => void;
  setCompanion: (companion: string) => void;
  equipFrame: (frame: string | null) => void;
  equipTitle: (title: string | null) => void;
  equipBackground: (background: string | null) => void;
  toggleSound: () => void;
  checkDailyLogin: () => { isNewDay: boolean; bonusPoints: number };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      points: 0,
      totalEarned: 0,
      loginStreak: 0,
      lastLogin: null,
      starterPokemon: null,
      companion: null,
      equippedFrame: null,
      equippedTitle: null,
      equippedBackground: null,
      soundEnabled: true,

      addPoints: (amount: number) => {
        set((state) => ({
          points: state.points + amount,
          totalEarned: state.totalEarned + amount,
        }));
      },

      spendPoints: (amount: number) => {
        const { points } = get();
        if (points >= amount) {
          set({ points: points - amount });
          return true;
        }
        return false;
      },

      setStarterPokemon: (pokemon: string) => {
        set({ starterPokemon: pokemon, companion: pokemon });
      },

      setCompanion: (companion: string) => {
        set({ companion });
      },

      equipFrame: (frame: string | null) => {
        set({ equippedFrame: frame });
      },

      equipTitle: (title: string | null) => {
        set({ equippedTitle: title });
      },

      equipBackground: (background: string | null) => {
        set({ equippedBackground: background });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      checkDailyLogin: () => {
        const { lastLogin, loginStreak } = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastLogin === today) {
          return { isNewDay: false, bonusPoints: 0 };
        }

        let newStreak = 1;
        let bonusPoints = 25; // Base daily login bonus

        if (lastLogin === yesterday) {
          newStreak = loginStreak + 1;
          // Streak bonus
          if (newStreak === 7) {
            bonusPoints += 100;
          } else if (newStreak % 30 === 0) {
            bonusPoints += 500;
          }
        }

        set({
          lastLogin: today,
          loginStreak: newStreak,
          points: get().points + bonusPoints,
          totalEarned: get().totalEarned + bonusPoints,
        });

        return { isNewDay: true, bonusPoints };
      },
    }),
    {
      name: 'pokemon-tracker-user',
    }
  )
);

// Collection store
interface CollectionCard {
  cardId: string;
  quantity: number;
  cardName: string;
  cardImage: string;
  cardSet: string;
  cardRarity: string | null;
  addedAt: string;
  isWishlist: boolean;
}

interface CollectionState {
  cards: CollectionCard[];
  wishlist: CollectionCard[];
  favorites: string[]; // Array of favorite card IDs
  
  // Actions
  addCard: (card: Omit<CollectionCard, 'quantity' | 'addedAt' | 'isWishlist'>) => void;
  removeCard: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  addToWishlist: (card: Omit<CollectionCard, 'quantity' | 'addedAt' | 'isWishlist'>) => void;
  removeFromWishlist: (cardId: string) => void;
  moveFromWishlistToCollection: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  isInWishlist: (cardId: string) => boolean;
  getCardCount: () => number;
  getUniqueCardCount: () => number;
  toggleFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
  getFavoriteCards: () => CollectionCard[];
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      cards: [],
      wishlist: [],
      favorites: [],

      addCard: (card) => {
        const { cards } = get();
        const existingIndex = cards.findIndex((c) => c.cardId === card.cardId);

        if (existingIndex >= 0) {
          const updated = [...cards];
          updated[existingIndex].quantity += 1;
          set({ cards: updated });
        } else {
          set({
            cards: [
              ...cards,
              {
                ...card,
                quantity: 1,
                addedAt: new Date().toISOString(),
                isWishlist: false,
              },
            ],
          });
        }
      },

      removeCard: (cardId: string) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.cardId !== cardId),
        }));
      },

      updateQuantity: (cardId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeCard(cardId);
          return;
        }
        set((state) => ({
          cards: state.cards.map((c) =>
            c.cardId === cardId ? { ...c, quantity } : c
          ),
        }));
      },

      addToWishlist: (card) => {
        const { wishlist } = get();
        if (!wishlist.find((c) => c.cardId === card.cardId)) {
          set({
            wishlist: [
              ...wishlist,
              {
                ...card,
                quantity: 1,
                addedAt: new Date().toISOString(),
                isWishlist: true,
              },
            ],
          });
        }
      },

      removeFromWishlist: (cardId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter((c) => c.cardId !== cardId),
        }));
      },

      moveFromWishlistToCollection: (cardId: string) => {
        const { wishlist } = get();
        const card = wishlist.find((c) => c.cardId === cardId);
        if (card) {
          get().addCard({
            cardId: card.cardId,
            cardName: card.cardName,
            cardImage: card.cardImage,
            cardSet: card.cardSet,
            cardRarity: card.cardRarity,
          });
          get().removeFromWishlist(cardId);
        }
      },

      hasCard: (cardId: string) => {
        return get().cards.some((c) => c.cardId === cardId);
      },

      isInWishlist: (cardId: string) => {
        return get().wishlist.some((c) => c.cardId === cardId);
      },

      getCardCount: () => {
        return get().cards.reduce((sum, c) => sum + c.quantity, 0);
      },

      getUniqueCardCount: () => {
        return get().cards.length;
      },

      toggleFavorite: (cardId: string) => {
        const { favorites } = get();
        if (favorites.includes(cardId)) {
          set({ favorites: favorites.filter(id => id !== cardId) });
        } else {
          set({ favorites: [...favorites, cardId] });
        }
      },

      isFavorite: (cardId: string) => {
        return get().favorites.includes(cardId);
      },

      getFavoriteCards: () => {
        const { cards, favorites } = get();
        return cards.filter(card => favorites.includes(card.cardId));
      },
    }),
    {
      name: 'pokemon-tracker-collection',
    }
  )
);

// Achievements store
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointReward: number;
  unlockedAt: string | null;
}

interface AchievementsState {
  achievements: Achievement[];
  checkAchievements: (collectionCount: number, uniqueCount: number, loginStreak: number) => Achievement[];
}

const defaultAchievements: Achievement[] = [
  { id: 'first-card', name: 'First Catch!', description: 'Add your first card to the collection', icon: '🎯', pointReward: 50, unlockedAt: null },
  { id: 'collector-10', name: 'Budding Collector', description: 'Collect 10 unique cards', icon: '📚', pointReward: 100, unlockedAt: null },
  { id: 'collector-50', name: 'Card Enthusiast', description: 'Collect 50 unique cards', icon: '🃏', pointReward: 250, unlockedAt: null },
  { id: 'collector-100', name: 'Gotta Catch Em All!', description: 'Collect 100 unique cards', icon: '🏆', pointReward: 500, unlockedAt: null },
  { id: 'streak-7', name: 'Dedicated Trainer', description: 'Log in 7 days in a row', icon: '🔥', pointReward: 100, unlockedAt: null },
  { id: 'streak-30', name: 'Pokemon Master', description: 'Log in 30 days in a row', icon: '👑', pointReward: 500, unlockedAt: null },
  { id: 'rare-hunter', name: 'Rare Hunter', description: 'Add 5 rare cards to your collection', icon: '✨', pointReward: 200, unlockedAt: null },
  { id: 'secret-mew', name: 'Mew Discoverer', description: '???', icon: '🔮', pointReward: 1000, unlockedAt: null },
  { id: 'secret-missingno', name: 'Glitch Hunter', description: '???', icon: '👾', pointReward: 500, unlockedAt: null },
];

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: defaultAchievements,

      checkAchievements: (collectionCount: number, uniqueCount: number, loginStreak: number) => {
        const { achievements } = get();
        const newlyUnlocked: Achievement[] = [];

        const updatedAchievements = achievements.map((achievement) => {
          if (achievement.unlockedAt) return achievement;

          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first-card':
              shouldUnlock = uniqueCount >= 1;
              break;
            case 'collector-10':
              shouldUnlock = uniqueCount >= 10;
              break;
            case 'collector-50':
              shouldUnlock = uniqueCount >= 50;
              break;
            case 'collector-100':
              shouldUnlock = uniqueCount >= 100;
              break;
            case 'streak-7':
              shouldUnlock = loginStreak >= 7;
              break;
            case 'streak-30':
              shouldUnlock = loginStreak >= 30;
              break;
          }

          if (shouldUnlock) {
            const unlocked = { ...achievement, unlockedAt: new Date().toISOString() };
            newlyUnlocked.push(unlocked);
            return unlocked;
          }

          return achievement;
        });

        if (newlyUnlocked.length > 0) {
          set({ achievements: updatedAchievements });
        }

        return newlyUnlocked;
      },
    }),
    {
      name: 'pokemon-tracker-achievements',
    }
  )
);

// Friends store
interface Friend {
  id: string;
  username: string;
  avatar: string;
  addedAt: string;
  topCards: { id: string; name: string; image: string; set: string }[];
  favoriteCards: { id: string; name: string; image: string; set: string }[];
}

interface FriendsState {
  friends: Friend[];
  pendingRequests: string[];
  addFriend: (friend: Omit<Friend, 'addedAt'>) => void;
  removeFriend: (friendId: string) => void;
  isFriend: (friendId: string) => boolean;
  getFriend: (friendId: string) => Friend | undefined;
}

// Mock friends data for demo
const MOCK_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    username: 'AshKetchum',
    avatar: '🧢',
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    topCards: [
      { id: 'sv3pt5-143', name: 'Charizard ex', image: 'https://images.pokemontcg.io/sv3pt5/143.png', set: '151' },
      { id: 'sv1-198', name: 'Miraidon ex', image: 'https://images.pokemontcg.io/sv1/198.png', set: 'Scarlet & Violet' },
      { id: 'swsh12pt5-160', name: 'Pikachu VMAX', image: 'https://images.pokemontcg.io/swsh12pt5/160.png', set: 'Crown Zenith' },
      { id: 'base1-4', name: 'Charizard', image: 'https://images.pokemontcg.io/base1/4.png', set: 'Base Set' },
      { id: 'sv3pt5-25', name: 'Pikachu', image: 'https://images.pokemontcg.io/sv3pt5/25.png', set: '151' },
      { id: 'sv2-226', name: 'Iono', image: 'https://images.pokemontcg.io/sv2/226.png', set: 'Paldea Evolved' },
      { id: 'swsh9-124', name: 'Charizard V', image: 'https://images.pokemontcg.io/swsh9/124.png', set: 'Brilliant Stars' },
      { id: 'sv1-211', name: 'Koraidon ex', image: 'https://images.pokemontcg.io/sv1/211.png', set: 'Scarlet & Violet' },
      { id: 'base1-58', name: 'Pikachu', image: 'https://images.pokemontcg.io/base1/58.png', set: 'Base Set' },
      { id: 'sv3pt5-6', name: 'Venusaur ex', image: 'https://images.pokemontcg.io/sv3pt5/6.png', set: '151' },
      { id: 'sv3pt5-9', name: 'Blastoise ex', image: 'https://images.pokemontcg.io/sv3pt5/9.png', set: '151' },
      { id: 'swsh7-203', name: 'Umbreon VMAX', image: 'https://images.pokemontcg.io/swsh7/203.png', set: 'Evolving Skies' },
      { id: 'sv4-228', name: 'Iron Valiant ex', image: 'https://images.pokemontcg.io/sv4/228.png', set: 'Paradox Rift' },
      { id: 'sm12-218', name: 'Arceus & Dialga & Palkia GX', image: 'https://images.pokemontcg.io/sm12/218.png', set: 'Cosmic Eclipse' },
      { id: 'swsh4-188', name: 'Pikachu VMAX', image: 'https://images.pokemontcg.io/swsh4/188.png', set: 'Vivid Voltage' },
    ],
    favoriteCards: [
      { id: 'sv3pt5-143', name: 'Charizard ex', image: 'https://images.pokemontcg.io/sv3pt5/143.png', set: '151' },
      { id: 'base1-4', name: 'Charizard', image: 'https://images.pokemontcg.io/base1/4.png', set: 'Base Set' },
      { id: 'swsh7-203', name: 'Umbreon VMAX', image: 'https://images.pokemontcg.io/swsh7/203.png', set: 'Evolving Skies' },
    ],
  },
  {
    id: 'friend-2',
    username: 'MistyWaterflower',
    avatar: '💧',
    addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    topCards: [
      { id: 'sv2-182', name: 'Gyarados ex', image: 'https://images.pokemontcg.io/sv2/182.png', set: 'Paldea Evolved' },
      { id: 'swsh7-30', name: 'Vaporeon VMAX', image: 'https://images.pokemontcg.io/swsh7/30.png', set: 'Evolving Skies' },
      { id: 'base1-6', name: 'Gyarados', image: 'https://images.pokemontcg.io/base1/6.png', set: 'Base Set' },
      { id: 'base1-64', name: 'Starmie', image: 'https://images.pokemontcg.io/base1/64.png', set: 'Base Set' },
      { id: 'sv1-41', name: 'Quaquaval ex', image: 'https://images.pokemontcg.io/sv1/41.png', set: 'Scarlet & Violet' },
      { id: 'swsh7-31', name: 'Glaceon VMAX', image: 'https://images.pokemontcg.io/swsh7/31.png', set: 'Evolving Skies' },
      { id: 'sv3-46', name: 'Palafin', image: 'https://images.pokemontcg.io/sv3/46.png', set: 'Obsidian Flames' },
      { id: 'sm9-35', name: 'Blastoise GX', image: 'https://images.pokemontcg.io/sm9/35.png', set: 'Team Up' },
      { id: 'base1-12', name: 'Ninetales', image: 'https://images.pokemontcg.io/base1/12.png', set: 'Base Set' },
      { id: 'swsh6-69', name: 'Ice Rider Calyrex VMAX', image: 'https://images.pokemontcg.io/swsh6/69.png', set: 'Chilling Reign' },
    ],
    favoriteCards: [
      { id: 'sv2-182', name: 'Gyarados ex', image: 'https://images.pokemontcg.io/sv2/182.png', set: 'Paldea Evolved' },
      { id: 'base1-6', name: 'Gyarados', image: 'https://images.pokemontcg.io/base1/6.png', set: 'Base Set' },
    ],
  },
  {
    id: 'friend-3',
    username: 'BrockPewter',
    avatar: '🪨',
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    topCards: [
      { id: 'sv4-220', name: 'Roaring Moon ex', image: 'https://images.pokemontcg.io/sv4/220.png', set: 'Paradox Rift' },
      { id: 'base1-34', name: 'Machoke', image: 'https://images.pokemontcg.io/base1/34.png', set: 'Base Set' },
      { id: 'swsh8-178', name: 'Tyranitar V', image: 'https://images.pokemontcg.io/swsh8/178.png', set: 'Fusion Strike' },
      { id: 'sv3-102', name: 'Tyranitar ex', image: 'https://images.pokemontcg.io/sv3/102.png', set: 'Obsidian Flames' },
      { id: 'swsh5-88', name: 'Single Strike Urshifu VMAX', image: 'https://images.pokemontcg.io/swsh5/88.png', set: 'Battle Styles' },
      { id: 'sv1-115', name: 'Great Tusk ex', image: 'https://images.pokemontcg.io/sv1/115.png', set: 'Scarlet & Violet' },
      { id: 'base1-9', name: 'Magneton', image: 'https://images.pokemontcg.io/base1/9.png', set: 'Base Set' },
    ],
    favoriteCards: [
      { id: 'sv4-220', name: 'Roaring Moon ex', image: 'https://images.pokemontcg.io/sv4/220.png', set: 'Paradox Rift' },
      { id: 'sv3-102', name: 'Tyranitar ex', image: 'https://images.pokemontcg.io/sv3/102.png', set: 'Obsidian Flames' },
    ],
  },
  {
    id: 'friend-4',
    username: 'TeamRocketJessie',
    avatar: '🚀',
    addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    topCards: [
      { id: 'base5-18', name: 'Dark Arbok', image: 'https://images.pokemontcg.io/base5/18.png', set: 'Team Rocket' },
      { id: 'base5-20', name: 'Dark Weezing', image: 'https://images.pokemontcg.io/base5/20.png', set: 'Team Rocket' },
      { id: 'base5-52', name: 'Meowth', image: 'https://images.pokemontcg.io/base5/52.png', set: 'Team Rocket' },
      { id: 'sm10-195', name: 'Persian GX', image: 'https://images.pokemontcg.io/sm10/195.png', set: 'Unbroken Bonds' },
      { id: 'swsh3-113', name: 'Eternatus VMAX', image: 'https://images.pokemontcg.io/swsh3/113.png', set: 'Darkness Ablaze' },
      { id: 'sv2-133', name: 'Forretress ex', image: 'https://images.pokemontcg.io/sv2/133.png', set: 'Paldea Evolved' },
    ],
    favoriteCards: [
      { id: 'base5-18', name: 'Dark Arbok', image: 'https://images.pokemontcg.io/base5/18.png', set: 'Team Rocket' },
      { id: 'base5-52', name: 'Meowth', image: 'https://images.pokemontcg.io/base5/52.png', set: 'Team Rocket' },
      { id: 'swsh3-113', name: 'Eternatus VMAX', image: 'https://images.pokemontcg.io/swsh3/113.png', set: 'Darkness Ablaze' },
    ],
  },
];

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: MOCK_FRIENDS,
      pendingRequests: [],

      addFriend: (friend) => {
        const { friends } = get();
        if (!friends.find(f => f.id === friend.id)) {
          set({
            friends: [...friends, { ...friend, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter(f => f.id !== friendId),
        }));
      },

      isFriend: (friendId) => {
        return get().friends.some(f => f.id === friendId);
      },

      getFriend: (friendId) => {
        return get().friends.find(f => f.id === friendId);
      },
    }),
    {
      name: 'pokemon-tracker-friends',
    }
  )
);

// Eggs store
interface Egg {
  id: string;
  type: 'common' | 'rare' | 'legendary';
  hatchTime: string;
  isHatched: boolean;
}

interface EggsState {
  eggs: Egg[];
  addEgg: (type: Egg['type']) => void;
  hatchEgg: (id: string) => string | null;
  getReadyEggs: () => Egg[];
}

export const useEggsStore = create<EggsState>()(
  persist(
    (set, get) => ({
      eggs: [],

      addEgg: (type) => {
        const hatchDuration = {
          common: 1 * 60 * 60 * 1000, // 1 hour
          rare: 4 * 60 * 60 * 1000, // 4 hours
          legendary: 24 * 60 * 60 * 1000, // 24 hours
        };

        const newEgg: Egg = {
          id: `egg-${Date.now()}`,
          type,
          hatchTime: new Date(Date.now() + hatchDuration[type]).toISOString(),
          isHatched: false,
        };

        set((state) => ({ eggs: [...state.eggs, newEgg] }));
      },

      hatchEgg: (id) => {
        const { eggs } = get();
        const egg = eggs.find((e) => e.id === id);

        if (!egg || egg.isHatched) return null;
        if (new Date(egg.hatchTime) > new Date()) return null;

        // Determine reward based on egg type
        const rewards = {
          common: ['badge-pokeball', 'frame-basic', 'title-trainer'],
          rare: ['badge-greatball', 'frame-silver', 'title-collector', 'companion-eevee'],
          legendary: ['badge-masterball', 'frame-gold', 'title-champion', 'companion-pikachu'],
        };

        const possibleRewards = rewards[egg.type];
        const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

        set((state) => ({
          eggs: state.eggs.map((e) =>
            e.id === id ? { ...e, isHatched: true } : e
          ),
        }));

        return reward;
      },

      getReadyEggs: () => {
        return get().eggs.filter(
          (e) => !e.isHatched && new Date(e.hatchTime) <= new Date()
        );
      },
    }),
    {
      name: 'pokemon-tracker-eggs',
    }
  )
);

// Shop items store
interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'frame' | 'title' | 'background' | 'companion' | 'badge';
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  imageUrl?: string;
}

interface ShopState {
  ownedItems: string[];
  purchaseItem: (itemId: string, price: number) => boolean;
  hasItem: (itemId: string) => boolean;
}

export const defaultShopItems: ShopItem[] = [
  // Frames
  { id: 'frame-fire', name: 'Fire Frame', description: 'A blazing border for your profile', type: 'frame', price: 500, rarity: 'common' },
  { id: 'frame-water', name: 'Water Frame', description: 'A flowing aqua border', type: 'frame', price: 500, rarity: 'common' },
  { id: 'frame-grass', name: 'Grass Frame', description: 'A verdant nature border', type: 'frame', price: 500, rarity: 'common' },
  { id: 'frame-electric', name: 'Electric Frame', description: 'A shocking yellow border', type: 'frame', price: 500, rarity: 'common' },
  { id: 'frame-psychic', name: 'Psychic Frame', description: 'A mystical pink border', type: 'frame', price: 750, rarity: 'uncommon' },
  { id: 'frame-dragon', name: 'Dragon Frame', description: 'A powerful purple border', type: 'frame', price: 1000, rarity: 'rare' },
  { id: 'frame-rainbow', name: 'Rainbow Frame', description: 'All types united!', type: 'frame', price: 2500, rarity: 'legendary' },

  // Titles
  { id: 'title-trainer', name: 'Pokemon Trainer', description: 'A basic title for beginners', type: 'title', price: 100, rarity: 'common' },
  { id: 'title-collector', name: 'Card Collector', description: 'For the dedicated collectors', type: 'title', price: 300, rarity: 'common' },
  { id: 'title-master', name: 'Pokemon Master', description: 'The ultimate title', type: 'title', price: 1000, rarity: 'rare' },
  { id: 'title-champion', name: 'League Champion', description: 'You conquered them all', type: 'title', price: 2000, rarity: 'legendary' },
  { id: 'title-shiny', name: 'Shiny Hunter', description: 'Seeker of rare variants', type: 'title', price: 750, rarity: 'uncommon' },

  // Backgrounds
  { id: 'bg-pokecenter', name: 'Pokemon Center', description: 'The healing station background', type: 'background', price: 400, rarity: 'common' },
  { id: 'bg-gym', name: 'Pokemon Gym', description: 'Battle arena background', type: 'background', price: 600, rarity: 'uncommon' },
  { id: 'bg-league', name: 'Pokemon League', description: 'Elite Four chambers', type: 'background', price: 1500, rarity: 'rare' },
  { id: 'bg-space', name: 'Space Station', description: 'Where Deoxys roams', type: 'background', price: 2000, rarity: 'legendary' },

  // Companions
  { id: 'companion-pikachu', name: 'Pikachu', description: 'The iconic electric mouse', type: 'companion', price: 1000, rarity: 'rare' },
  { id: 'companion-eevee', name: 'Eevee', description: 'The evolution Pokemon', type: 'companion', price: 1000, rarity: 'rare' },
  { id: 'companion-jigglypuff', name: 'Jigglypuff', description: 'The balloon Pokemon', type: 'companion', price: 500, rarity: 'uncommon' },
  { id: 'companion-meowth', name: 'Meowth', description: 'That\'s right!', type: 'companion', price: 750, rarity: 'uncommon' },
  { id: 'companion-mew', name: 'Mew', description: 'The mythical Pokemon', type: 'companion', price: 5000, rarity: 'legendary' },

  // Badges
  { id: 'badge-boulder', name: 'Boulder Badge', description: 'Brock\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-cascade', name: 'Cascade Badge', description: 'Misty\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-thunder', name: 'Thunder Badge', description: 'Lt. Surge\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-rainbow', name: 'Rainbow Badge', description: 'Erika\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-soul', name: 'Soul Badge', description: 'Koga\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-marsh', name: 'Marsh Badge', description: 'Sabrina\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-volcano', name: 'Volcano Badge', description: 'Blaine\'s badge', type: 'badge', price: 200, rarity: 'common' },
  { id: 'badge-earth', name: 'Earth Badge', description: 'Giovanni\'s badge', type: 'badge', price: 200, rarity: 'common' },
];

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      ownedItems: [],

      purchaseItem: (itemId: string, price: number) => {
        const userStore = useUserStore.getState();
        if (get().hasItem(itemId)) return false;
        
        if (userStore.spendPoints(price)) {
          set((state) => ({ ownedItems: [...state.ownedItems, itemId] }));
          return true;
        }
        return false;
      },

      hasItem: (itemId: string) => {
        return get().ownedItems.includes(itemId);
      },
    }),
    {
      name: 'pokemon-tracker-shop',
    }
  )
);

