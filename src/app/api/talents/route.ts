// src/app/api/talents/route.ts

import { NextResponse } from 'next/server';

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const DUNE_QUERY_ID = process.env.DUNE_QUERY_ID;

// Fungsi untuk memulai eksekusi kueri
async function executeDuneQuery() {
  const DUNE_API_URL = `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/execute`;
  
  const response = await fetch(DUNE_API_URL, {
    method: 'POST',
    headers: {
      'x-dune-api-key': DUNE_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    // Menggunakan cache revalidation dari Next.js untuk data dari Dune
    // Ini akan meng-cache hasil selama 1 jam untuk mengurangi panggilan API
    next: { revalidate: 3600 } 
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Dune API execution error:", errorText);
    throw new Error(`Failed to execute Dune query. Status: ${response.status}`);
  }

  const data = await response.json();
  return data.execution_id;
}

// Fungsi untuk memeriksa status dan mendapatkan hasil
async function getDuneResults(executionId: string) {
  const DUNE_RESULTS_URL = `https://api.dune.com/api/v1/execution/${executionId}/results`;

  // Kita coba beberapa kali karena kueri butuh waktu untuk berjalan
  for (let i = 0; i < 10; i++) { 
    const response = await fetch(DUNE_RESULTS_URL, {
      headers: { 'x-dune-api-key': DUNE_API_KEY! },
      next: { revalidate: 3600 } // Cache juga hasil dari results
    });

    if (response.ok) {
      const data = await response.json();
      if (data.state === 'QUERY_STATE_COMPLETED') {
        return data.result.rows;
      }
      if (data.state === 'QUERY_STATE_FAILED') {
        console.error("Dune Query Failed:", data.error);
        throw new Error(`Dune query failed with state: ${data.state}`);
      }
      // Jika masih berjalan, tunggu 2 detik sebelum mencoba lagi
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      throw new Error(`Failed to fetch Dune results. Status: ${response.status}`);
    }
  }
  throw new Error('Dune query timed out after multiple attempts.');
}

// Handler utama untuk request GET
export async function GET() {
  if (!DUNE_API_KEY || !DUNE_QUERY_ID) {
    return NextResponse.json({ error: 'Server configuration error: Dune API Key or Query ID is missing.' }, { status: 500 });
  }

  try {
    const executionId = await executeDuneQuery();
    const rows = await getDuneResults(executionId);
    
    // Pastikan kueri Anda di Dune menyeleksi kolom dengan nama-nama ini
    const formattedTalents = rows.map((row: any) => ({
      username: row.fname,
      name: row.fname, // Anda bisa menggunakan kolom `display_name` dari kueri jika ada
      headline: row.bio || 'A top Farcaster user', // Pastikan kolom `bio` ada di SELECT kueri Anda
      profile_picture_url: row.pfp_url, // Pastikan kolom `pfp_url` ada di SELECT kueri Anda
      wallet_address: row.custody_address, // Pastikan kolom `custody_address` ada di SELECT kueri Anda
      fid: row.fid,
      // Data baru yang kaya dari Dune
      fid_active_tier_name: row.fid_active_tier_name,
      followers: row.followers,
      casts: row.casts,
      engagement: row.engagement,
      top_channels: row.top_channels,
      top_domains: row.top_domains,
      total_transactions: row.total_transactions,
    }));
    
    return NextResponse.json({ talents: formattedTalents });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Dune API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
