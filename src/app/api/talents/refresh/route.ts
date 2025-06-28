// src/app/api/talents/refresh/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const DUNE_QUERY_ID = process.env.DUNE_QUERY_ID;
const DUNE_REFRESH_KEY = process.env.DUNE_REFRESH_KEY;

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// Fungsi untuk memulai eksekusi kueri Dune
async function executeDuneQuery() {
  const response = await fetch(`https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/execute`, {
    method: 'POST',
    headers: { 'x-dune-api-key': DUNE_API_KEY! },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error(`Dune execution failed: ${await response.text()}`);
  return (await response.json()).execution_id;
}

// Fungsi untuk menunggu dan mendapatkan hasil dari Dune
async function getDuneResults(executionId: string) {
  // Coba polling selama maksimal 2 menit (60 kali * 2 detik)
  for (let i = 0; i < 60; i++) { 
    const response = await fetch(`https://api.dune.com/api/v1/execution/${executionId}/results`, {
      headers: { 'x-dune-api-key': DUNE_API_KEY! },
      cache: 'no-store', // Selalu minta data status terbaru
    });

    if (response.ok) {
      const data = await response.json();
      if (data.state === 'QUERY_STATE_COMPLETED') return data.result.rows;
      if (data.state === 'QUERY_STATE_FAILED') {
        console.error("Dune Query Failed:", data.error);
        throw new Error(`Dune query failed with state: ${data.state}`);
      }
      // Tunggu 2 detik sebelum mencoba lagi
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
       throw new Error(`Failed to fetch Dune results. Status: ${response.status}`);
    }
  }
  throw new Error('Dune query timed out after multiple attempts.');
}


// Handler utama untuk request POST, dipanggil oleh Cron Job
export async function POST(request: NextRequest) {
  // Keamanan: Pastikan hanya Vercel Cron atau Anda yang bisa memanggil ini
  const authHeader = request.headers.get('authorization');
  if (!DUNE_REFRESH_KEY || authHeader !== `Bearer ${DUNE_REFRESH_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting Dune data refresh job...');
    const executionId = await executeDuneQuery();
    console.log(`Dune query execution started. ID: ${executionId}`);
    
    const rows = await getDuneResults(executionId);
    
    const talentsToUpsert = rows.map((row: any) => ({
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

    if (talentsToUpsert.length === 0) {
      console.log('No new talents data from Dune. Cache remains unchanged.');
      return NextResponse.json({ message: 'No new data, cache is up to date.' });
    }

    console.log(`Upserting ${talentsToUpsert.length} talents to Supabase cache...`);
    const { error } = await supabase.from('dune_talents_cache').upsert(talentsToUpsert, { onConflict: 'username' });

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    console.log('Dune data refresh successful!');
    return NextResponse.json({ message: 'Cache updated successfully', count: talentsToUpsert.length });

  } catch (error: any) {
    console.error('Error during Dune data refresh:', error.message);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
