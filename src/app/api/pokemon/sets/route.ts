import { NextResponse } from 'next/server';
import { FALLBACK_SETS } from '@/lib/sets-data';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      'https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate&pageSize=500',
      {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('API failed');
    }
    
    const data = await response.json();
    return NextResponse.json({ data: data.data, source: 'api' });
  } catch (error) {
    console.log('Using fallback sets data');
    return NextResponse.json({ data: FALLBACK_SETS, source: 'fallback' });
  }
}

