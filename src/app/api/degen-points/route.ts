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
      
      const userLookup: any = await neynarClient.lookupUserByUsername({ 
        username: cleanedQuery 
      });

      const user = userLookup.user || userLookup.result?.user;
      
      if (!user) {
        throw new Error(`User @${cleanedQuery} not found via Neynar.`);
      }

      const custodyAddress = user.custody_address;
      if (!custodyAddress) {
        return NextResponse.json({ error: `Could not find a connected wallet for user @${cleanedQuery}.` }, { status: 404 });
      }
      targetAddress = custodyAddress;
    }

    console.log(`[Degen API] Fetching points for address: ${targetAddress}`);

    const degenApiUrl = `https://degen.tips/api/airdrop2/season3/points-v2?address=${targetAddress}`;
    
    // --- PERBAIKAN UTAMA DI SINI ---
    // Menambahkan headers agar permintaan kita terlihat seperti browser sungguhan
    const degenResponse = await fetch(degenApiUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        }
    });
    // --------------------------------

    console.log(`[Degen API] Response status: ${degenResponse.status}`);

    const contentType = degenResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const responseText = await degenResponse.text();
        console.error(`[Degen API] Unexpected content type: ${contentType}. Body: ${responseText}`);
        return NextResponse.json({ error: `Received an invalid response from Degen API.` }, { status: 502 });
    }

    if (!degenResponse.ok) {
        const errorData = await degenResponse.json();
        const errorMessage = errorData.error || `Degen API returned an error (Status: ${degenResponse.status}).`;
        console.error(`[Degen API] Error response:`, errorData);
        return NextResponse.json({ error: errorMessage }, { status: 502 });
    }
    
    const degenData = await degenResponse.json();
    
    if (!degenData || typeof degenData.totalPoints === 'undefined') {
      console.log(`[Degen API] No points data found for address: ${targetAddress}`);
      return NextResponse.json({ error: `No Degen points data found for this address. They may not be eligible.` }, { status: 404 });
    }

    return NextResponse.json(degenData);

  } catch (error: any) {
    console.error('[DEGEN API CATCH BLOCK] Full Error:', JSON.stringify(error, null, 2));
    const errorMessage = error.message ? `An error occurred: ${error.message}` : "An internal error occurred. Please try again later.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
