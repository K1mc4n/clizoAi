// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Fungsi untuk memeriksa apakah sebuah string adalah alamat Ethereum
function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Input is required.' }, { status: 400 });
  }

  let targetAddress: string | null = null;
  const cleanedQuery = query.trim().replace('@', '');

  // Jika input BUKAN alamat, kita kembalikan error.
  // Ini untuk sementara menonaktifkan pencarian via Neynar agar build berhasil.
  if (!isEthereumAddress(cleanedQuery)) {
    return NextResponse.json({ error: 'For now, please enter an ETH address directly (e.g., 0x...). Username lookup is temporarily disabled.' }, { status: 400 });
  }
  
  targetAddress = cleanedQuery;

  try {
    // Bagian Degen.tips tidak berubah
    console.log(`[Degen API] Fetching points for address: ${targetAddress}`);
    const degenApiUrl = `https://degen.tips/api/airdrop2/season3/points-v2?address=${targetAddress}`;
    
    const degenResponse = await fetch(degenApiUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        }
    });

    if (!degenResponse.ok) {
        return NextResponse.json({ error: `Could not retrieve Degen points. The user may not be eligible.` }, { status: degenResponse.status });
    }
    
    const degenData = await degenResponse.json();
    
    if (!degenData || typeof degenData.totalPoints === 'undefined') {
      return NextResponse.json({ error: `No Degen points data found for this address.` }, { status: 404 });
    }

    return NextResponse.json(degenData);

  } catch (error: any) {
    console.error('[DEGEN API CATCH BLOCK] Full Error:', error.message);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
