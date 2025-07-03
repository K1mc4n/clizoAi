// src/app/api/leaderboard/route.ts

import { NextResponse } from 'next/server';

export interface MinterLeaderboardUser {
  farcaster_handle: string;
  fid: number | null;
  mint_tx_count: number;
  total_minted: number;
}

export const revalidate = 3600; // Cache data selama 1 jam

export async function GET() {
  const DUNE_API_KEY = process.env.DUNE_API_KEY;
  const QUERY_ID = process.env.LEADERBOARD_QUERY_ID;

  if (!DUNE_API_KEY || !QUERY_ID) {
    return NextResponse.json(
      { error: 'Server configuration error: Dune API Key or Query ID is missing.' },
      { status: 500 }
    );
  }

  const DUNE_API_URL = `https://api.dune.com/api/v1/query/${QUERY_ID}/results`;

  try {
    const response = await fetch(DUNE_API_URL, {
      method: 'GET',
      headers: {
        'x-dune-api-key': DUNE_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Dune API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard data from Dune.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const leaderboardData: MinterLeaderboardUser[] = data.result?.rows || [];

    return NextResponse.json({ leaderboard: leaderboardData });

  } catch (error) {
    console.error('Internal Server Error fetching from Dune:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
