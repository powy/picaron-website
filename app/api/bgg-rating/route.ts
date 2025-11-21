import { NextResponse } from 'next/server';
import { BggClient } from 'boardgamegeekclient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
  }

  try {
    const client = BggClient.Create();
    const result = await client.thing.query({ id: [parseInt(gameId)], stats: 1 });

    if (result && result.length > 0 && result[0].statistics) {
      const avgRating = result[0].statistics.ratings?.average;
      if (avgRating) {
        return NextResponse.json({ rating: parseFloat(avgRating.toFixed(1)) });
      }
    }

    return NextResponse.json({ rating: null });
  } catch (error) {
    console.error('BGG API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rating' }, { status: 500 });
  }
}
