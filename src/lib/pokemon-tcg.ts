// Pokemon TCG API wrapper

import { FALLBACK_SETS } from './sets-data';

const API_BASE = 'https://api.pokemontcg.io/v2';

// Alternative API - TCGdex (backup)
const TCGDEX_API = 'https://api.tcgdex.net/v2/en';

export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  resistances?: {
    type: string;
    value: string;
  }[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      normal?: { market: number; low: number; mid: number; high: number };
      holofoil?: { market: number; low: number; mid: number; high: number };
      reverseHolofoil?: { market: number; low: number; mid: number; high: number };
      firstEditionHolofoil?: { market: number; low: number; mid: number; high: number };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
    };
  };
}

export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export interface SearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

export async function searchCards(params: SearchParams): Promise<{
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.page) searchParams.set('page', params.page.toString());
  // Default to 250 to get all cards in a set
  searchParams.set('pageSize', (params.pageSize || 250).toString());
  if (params.orderBy) searchParams.set('orderBy', params.orderBy);
  
  const response = await fetch(`${API_BASE}/cards?${searchParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  
  return response.json();
}

// Get ALL cards from a set (handles pagination for large sets)
export async function getAllCardsInSet(setId: string): Promise<PokemonCard[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(
      `${API_BASE}/cards?q=set.id:${setId}&pageSize=250&orderBy=number`,
      {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('Failed to fetch cards');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('API Error fetching cards:', error);
    return [];
  }
}

// Map Pokemon TCG API set IDs to TCGdex set IDs
function mapSetIdToTcgdex(setId: string): string {
  // Scarlet & Violet sets use different format
  const svMapping: Record<string, string> = {
    'sv8': 'sv08',
    'sv7': 'sv07',
    'sv6pt5': 'sv06.5',
    'sv6': 'sv06',
    'sv5': 'sv05',
    'sv4pt5': 'sv04.5',
    'sv4': 'sv04',
    'sv3pt5': 'sv03.5',
    'sv3': 'sv03',
    'sv2': 'sv02',
    'sv1': 'sv01',
    'swsh12pt5': 'swsh12.5',
  };
  return svMapping[setId] || setId;
}

// Fetch cards from TCGdex API (more reliable)
export async function getCardsForSet(setId: string): Promise<PokemonCard[]> {
  const tcgdexSetId = mapSetIdToTcgdex(setId);
  console.log(`Fetching cards for set: ${setId} (TCGdex: ${tcgdexSetId})`);
  
  try {
    // Fetch set data with card list
    const response = await fetch(`${TCGDEX_API}/sets/${tcgdexSetId}`, {
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      console.error('TCGdex set not found:', tcgdexSetId);
      return [];
    }
    
    const setData = await response.json();
    
    if (!setData.cards || setData.cards.length === 0) {
      console.log('No cards in set');
      return [];
    }
    
    console.log(`Found ${setData.cards.length} cards in set`);
    
    // Convert cards to our format - TCGdex already provides image URLs
    const cards: PokemonCard[] = setData.cards.map((card: { id: string; localId: string; name: string; image?: string }) => ({
      id: card.id,
      name: card.name,
      number: card.localId || '0',
      rarity: 'Common',
      artist: '',
      types: [],
      images: {
        small: card.image ? `${card.image}/low.webp` : `https://assets.tcgdex.net/en/${tcgdexSetId.includes('sv') ? 'sv' : tcgdexSetId.split(/\d/)[0]}/${tcgdexSetId}/${card.localId}/low.webp`,
        large: card.image ? `${card.image}/high.webp` : `https://assets.tcgdex.net/en/${tcgdexSetId.includes('sv') ? 'sv' : tcgdexSetId.split(/\d/)[0]}/${tcgdexSetId}/${card.localId}/high.webp`,
      },
      tcgplayer: null,
      cardmarket: null,
    }));
    
    // Sort by number
    return cards.sort((a, b) => {
      const numA = parseInt(a.number) || 0;
      const numB = parseInt(b.number) || 0;
      return numA - numB;
    });
  } catch (error) {
    console.error('TCGdex API error:', error);
    return [];
  }
}

export async function getCard(id: string): Promise<PokemonCard> {
  const response = await fetch(`${API_BASE}/cards/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch card');
  }
  
  const data = await response.json();
  return data.data;
}

export async function getSets(): Promise<PokemonSet[]> {
  // Use local fallback data - instant and reliable
  return FALLBACK_SETS as unknown as PokemonSet[];
}

export async function getSet(id: string): Promise<PokemonSet | null> {
  // Find in fallback data - instant
  const set = FALLBACK_SETS.find(s => s.id === id);
  return set ? (set as unknown as PokemonSet) : null;
}

export function isRareCard(card: PokemonCard): boolean {
  const rareRarities = [
    'Rare Holo',
    'Rare Holo EX',
    'Rare Holo GX',
    'Rare Holo V',
    'Rare Holo VMAX',
    'Rare Holo VSTAR',
    'Rare Ultra',
    'Rare Rainbow',
    'Rare Secret',
    'Rare Shiny',
    'Rare Shining',
    'Amazing Rare',
    'LEGEND',
    'Radiant Rare',
    'Special Art Rare',
    'Double Rare',
    'Illustration Rare',
    'Ultra Rare',
    'Hyper Rare',
  ];
  
  return card.rarity ? rareRarities.includes(card.rarity) : false;
}

export function getCardPrice(card: PokemonCard): number | null {
  if (card.tcgplayer?.prices) {
    const prices = card.tcgplayer.prices;
    return (
      prices.holofoil?.market ||
      prices.normal?.market ||
      prices.reverseHolofoil?.market ||
      prices.firstEditionHolofoil?.market ||
      null
    );
  }
  return card.cardmarket?.prices?.averageSellPrice || null;
}

export function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    Grass: '#78C850',
    Fire: '#F08030',
    Water: '#6890F0',
    Lightning: '#F8D030',
    Psychic: '#F85888',
    Fighting: '#C03028',
    Darkness: '#705848',
    Metal: '#B8B8D0',
    Fairy: '#EE99AC',
    Dragon: '#7038F8',
    Colorless: '#A8A878',
  };
  
  return typeColors[type] || '#A8A878';
}

