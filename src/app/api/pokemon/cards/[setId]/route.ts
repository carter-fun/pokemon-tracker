import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ setId: string }> }
) {
  const { setId } = await params;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&pageSize=250&orderBy=number`,
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
    return NextResponse.json({ data: data.data, count: data.count || data.data.length });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ data: [], count: 0, error: 'Failed to fetch cards' }, { status: 500 });
  }
}

