// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'A Farcaster username or Ethereum address is required.' }, { status: 400 });
  }

  let targetAddress: string | null = null;
  const cleanedQuery = query.replace('@', '');

  try {
    if (isEthereumAddress(cleanedQuery)) {
      targetAddress = cleanedQuery;
    } else {
      const neynarApiKey = process.env.NEYNAR_API_KEY;
      if (!neynarApiKey) throw new Error('Neynar API key is not configured.');
      
      const neynarClient = new NeynarAPIClient(new Configuration({ apiKey: neynarApiKey }));
      
      const userLookup = await neynarClient.lookupUserByUsername({ username: cleanedQuery });
      const user = userLookup.user;
      
      if (!user || !user.custody_address) {
        return NextResponse.json({ error: `Could not find a connected wallet for @${cleanedQuery}.` }, { status: 404 });
      }
      targetAddress = user.custody_address;
    }

    console.log(`[Degen API] Fetching points for address: ${targetAddress}`);

    const degenApiUrl = `https://www.degen.tips/api/airdrop2/season3/points?address=${targetAddress}`;
    const degenResponse = await fetch(degenApiUrl);

    // Log status dari Degen API untuk debugging
    console.log(`[Degen API] Response status: ${degenResponse.status}`);

    if (!degenResponse.ok) {
        const errorText = await degenResponse.text();
        console.error(`[Degen API] Error response text: ${errorText}`);
        return NextResponse.json({ error: `Degen API returned an error (Status: ${degenResponse.status}).` }, { status: 502 }); // 502 Bad Gateway
    }
    
    const degenData = await degenResponse.json();

    // PERBAIKAN PENTING: Cek jika Degen API mengembalikan array kosong
    if (Array.isArray(degenData) && degenData.length === 0) {
      console.log(`[Degen API] No points data found for address: ${targetAddress}`);
      return NextResponse.json({ error: `No Degen points data found for this address. They may not be eligible.` }, { status: 404 });
    }

    // Jika data ada, kembalikan data pertama dari array (sesuai dokumentasi Degen API)
    return NextResponse.json(degenData[0] || {});

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message.includes('User not found')) {
        return NextResponse.json({ error: `Farcaster user "${cleanedQuery}" not found.` }, { status: 404 });
    }
    console.error('[Degen API] CATCH BLOCK:', error.message);
    const errorMessage = `An internal error occurred. Please try again later.`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
