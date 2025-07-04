// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';

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

  try {
    if (isEthereumAddress(cleanedQuery)) {
      targetAddress = cleanedQuery;
    } else {
      const neynarApiKey = process.env.NEYNAR_API_KEY;
      if (!neynarApiKey) {
        throw new Error('Neynar API key is not configured.');
      }

      const fname = cleanedQuery.endsWith('.eth') 
        ? cleanedQuery.slice(0, -4) 
        : cleanedQuery;

      // =========================================================
      // MENGGUNAKAN FETCH MANUAL, TANPA SDK SAMA SEKALI
      // =========================================================
      const neynarLookupUrl = `https://api.neynar.com/v2/farcaster/user/search?q=${fname}&limit=1`;
      
      const neynarResponse = await fetch(neynarLookupUrl, {
        method: 'GET',
        headers: {
          'api_key': neynarApiKey,
          'Accept': 'application/json',
        }
      });

      if (!neynarResponse.ok) {
        return NextResponse.json({ error: `Could not find user @${fname} on Farcaster.` }, { status: 404 });
      }

      const neynarData = await neynarResponse.json();
      const user = neynarData.result?.users?.[0];

      if (!user) {
        throw new Error(`User data for @${fname} is invalid or not found.`);
      }

      const custodyAddress = user.custody_address;
      const verifiedAddress = user.verified_addresses?.eth_addresses?.[0];

      if (custodyAddress) {
        targetAddress = custodyAddress;
      } else if (verifiedAddress) {
        targetAddress = verifiedAddress;
      } else {
        return NextResponse.json({ error: `Could not find a connected wallet for @${fname}.` }, { status: 404 });
      }
    }

    // Bagian Degen.tips
    console.log(`[Degen API] Fetching points for address: ${targetAddress}`);
    const degenApiUrl = `https://degen.tips/api/airdrop2/season3/points-v2?address=${targetAddress}`;
    
    const degenResponse = await fetch(degenApiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!degenResponse.ok) {
      return NextResponse.json({ error: 'Could not retrieve Degen points. User may not be eligible.' }, { status: 404 });
    }
    
    const degenData = await degenResponse.json();
    
    if (typeof degenData.totalPoints === 'undefined') {
      return NextResponse.json({ error: 'No Degen points data found for this address.' }, { status: 404 });
    }

    return NextResponse.json(degenData);

  } catch (error: any) {
    console.error('[DEGEN API CATCH BLOCK]', error.message);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
