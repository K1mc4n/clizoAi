// src/app/api/talents/route.ts

import { NextResponse } from 'next/server';

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const DUNE_QUERY_ID = process.env.DUNE_QUERY_ID;

async function executeDuneQuery() {
  const DUNE_API_URL = `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/execute`;
  
  const response = await fetch(DUNE_API_URL, {
    method: 'POST',
    headers: {
      'x-dune-api-key': DUNE_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    // Cache request eksekusi untuk mencegah multiple triggers dalam waktu singkat
    next: { revalidate: 60 } 
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Dune API execution error:", errorText);
    throw new Error(`Failed to execute Dune query. Status: ${response.status}`);
  }

  return await response.json();
}

async function getDuneResults(executionId: string) {
  const DUNE_RESULTS_URL = `https://api.dune.com/api/v1/execution/${executionId}/results`;

  const response = await fetch(DUNE_RESULTS_URL, {
    headers: { 'x-dune-api-key': DUNE_API_KEY! },
    // Revalidate data setiap 1 jam
    next: { revalidate: 3600 } 
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Dune results. Status: ${response.status}`);
  }
  return await response.json();
}

export async function GET() {
  if (!DUNE_API_KEY || !DUNE_QUERY_ID) {
    return NextResponse.json({ error: 'Server configuration error: Dune API Key or Query ID is missing.' }, { status: 500 });
  }

  try {
    // 1. Coba dapatkan hasil kueri terbaru
    const latestResults = await fetch(`https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results`, {
        headers: { 'x-dune-api-key': DUNE_API_KEY! },
        next: { revalidate: 3600 } // Ambil dari cache jika tersedia dan umurnya < 1 jam
    });

    if (latestResults.ok) {
        const data = await latestResults.json();
        // Jika data ada dan valid, langsung gunakan
        if (data.result?.rows) {
            console.log("Serving fresh data from Dune's cache.");
            // (Optional) Picu eksekusi baru di latar belakang tanpa menunggu hasilnya
            executeDuneQuery().catch(err => console.error("Background refresh failed:", err));
            
            const formattedTalents = data.result.rows.map((row: any) => ({
              username: row.fname,
              name: row.fname,
              headline: row.bio || 'A top Farcaster user',
              profile_picture_url: row.pfp_url,
              wallet_address: row.custody_address,
              fid: row.fid,
              fid_active_tier_name: row.fid_active_tier_name,
              followers: row.followers,
              casts: row.casts,
              engagement: row.engagement,
              top_channels: row.top_channels,
              top_domains: row.top_domains,
              total_transactions: row.total_transactions,
            }));
            
            return NextResponse.json({ talents: formattedTalents });
        }
    }
    
    // 2. Jika tidak ada hasil, jalankan kueri dan tunggu hasilnya
    console.log("No fresh data, executing new query and waiting for result...");
    const executionResponse = await executeDuneQuery();
    const executionId = executionResponse.execution_id;

    // Polling dengan timeout yang lebih pendek
    for (let i = 0; i < 25; i++) { // Coba selama ~50 detik
      const statusResponse = await fetch(`https://api.dune.com/api/v1/execution/${executionId}/status`, {
        headers: { 'x-dune-api-key': DUNE_API_KEY! },
        cache: 'no-store', // Jangan cache status check
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.state === 'QUERY_STATE_COMPLETED') {
          const results = await getDuneResults(executionId);
          const formattedTalents = results.result.rows.map((row: any) => ({
            username: row.fname,
            name: row.fname,
            headline: row.bio || 'A top Farcaster user',
            profile_picture_url: row.pfp_url,
            wallet_address: row.custody_address,
            fid: row.fid,
            fid_active_tier_name: row.fid_active_tier_name,
            followers: row.followers,
            casts: row.casts,
            engagement: row.engagement,
            top_channels: row.top_channels,
            top_domains: row.top_domains,
            total_transactions: row.total_transactions,
          }));
          return NextResponse.json({ talents: formattedTalents });
        }
        if (statusData.state === 'QUERY_STATE_FAILED') {
          throw new Error(`Dune query failed with state: ${statusData.state}`);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Tunggu 2 detik
    }

    throw new Error('Dune query timed out after multiple attempts.');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Dune API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
