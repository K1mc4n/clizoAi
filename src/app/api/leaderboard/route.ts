// src/app/api/leaderboard/route.ts

import { NextResponse } from 'next/server';

// ===================================================================
// KONFIGURASI PENTING UNTUK VERCEL & DUNE API
// -------------------------------------------------------------------
// 1. Memaksa endpoint ini agar HANYA berjalan saat ada permintaan (on-demand),
//    BUKAN saat proses build. Ini adalah solusi utama untuk error "datapoint limit".
export const dynamic = 'force-dynamic';

// 2. Memberitahu Vercel untuk menyimpan (cache) hasil dari endpoint ini
//    selama 1 jam (3600 detik). Ini akan secara drastis mengurangi jumlah
//    panggilan ke Dune API jika banyak pengguna mengunjungi halaman.
export const revalidate = 3600;
// ===================================================================

// Mendefinisikan struktur data yang kita harapkan dari query Dune Anda
export interface MinterLeaderboardUser {
  farcaster_handle: string;
  fid: number | null;
  mint_tx_count: number;
  total_minted: number;
}

export async function GET() {
  const DUNE_API_KEY = process.env.DUNE_API_KEY;
  const QUERY_ID = process.env.LEADERBOARD_QUERY_ID;

  // Validasi keamanan di server
  if (!DUNE_API_KEY || !QUERY_ID) {
    console.error('Server configuration error: Dune API Key or Query ID is missing.');
    return NextResponse.json(
      { error: 'Server configuration error. Administrator has been notified.' },
      { status: 500 }
    );
  }

  const DUNE_API_URL = `https://api.dune.com/api/v1/query/${QUERY_ID}/results`;
  console.log(`[Leaderboard API] Fetching data from Dune for Query ID: ${QUERY_ID}`);

  try {
    // Menggunakan fetch dengan konfigurasi Next.js untuk revalidasi
    const response = await fetch(DUNE_API_URL, {
      method: 'GET',
      headers: {
        'x-dune-api-key': DUNE_API_KEY,
      },
      // Opsi revalidasi Next.js, konsisten dengan export const di atas
      next: { revalidate: 3600 },
    });

    // Cek jika respons dari Dune tidak OK (misal: 4xx, 5xx)
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Dune API Error Response:', errorData);
      const errorMessage = errorData.error || 'Failed to fetch leaderboard data from Dune.';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status } // Teruskan status error dari Dune
      );
    }

    const data = await response.json();
    const leaderboardData: MinterLeaderboardUser[] = data.result?.rows || [];

    console.log(`[Leaderboard API] Successfully fetched ${leaderboardData.length} rows.`);
    return NextResponse.json({ leaderboard: leaderboardData });

  } catch (error) {
    console.error('Internal Server Error while fetching from Dune:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
