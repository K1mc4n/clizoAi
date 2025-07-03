// src/app/api/leaderboard/route.ts

import { NextResponse } from 'next/server';

// ===================================================================
// TAMBAHAN KRUSIAL: Baris ini memberitahu Vercel/Next.js untuk
// TIDAK menjalankan kode ini saat build. Kode ini HANYA akan
// dijalankan ketika ada permintaan masuk dari browser pengguna.
// Ini akan menyelesaikan error "datapoint limit" saat build.
export const dynamic = 'force-dynamic';
// ===================================================================

// Mendefinisikan struktur data yang kita harapkan dari query Dune Anda
export interface MinterLeaderboardUser {
  farcaster_handle: string;
  fid: number | null;
  mint_tx_count: number;
  total_minted: number;
}

// Mengaktifkan caching di sisi server (Vercel) selama 1 jam
// Catatan: Ini mungkin tidak akan berfungsi secara efektif dengan 'force-dynamic',
// tapi tidak ada salahnya untuk tetap di sini.
export const revalidate = 3600; 

export async function GET() {
  // Mengambil kunci rahasia dari environment
  const DUNE_API_KEY = process.env.DUNE_API_KEY;
  const QUERY_ID = process.env.LEADERBOARD_QUERY_ID;

  // Validasi keamanan
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
      // Menggunakan pesan error dari Dune agar lebih informatif
      const errorMessage = errorData.error || 'Failed to fetch leaderboard data from Dune.';
      return NextResponse.json(
        { error: errorMessage },
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
