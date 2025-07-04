// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'A Farcaster username or Ethereum address is required.' }, { status: 400 });
  }

  let targetAddress: string | null = null;
  let cleanedQuery = query.trim().replace('@', '');

  try {
    if (isEthereumAddress(cleanedQuery)) {
      targetAddress = cleanedQuery;
    } 
    else {
      const neynarApiKey = process.env.NEYNAR_API_KEY;
      if (!neynarApiKey) {
        throw new Error('Neynar API key is not configured on the server.');
      }
      
      // INI ADALAH CARA YANG BENAR
      const neynarClient = new NeynarAPIClient(neynarApiKey);
      
      const fname = cleanedQuery.endsWith('.eth') 
        ? cleanedQuery.slice(0, -4) 
        : cleanedQuery;

      console.log(`[Neynar API] Looking up username: ${fname}`);

      try {
        const { result } = await neynarClient.lookupUserByUsername(fname);
        const user: any = result?.user;

        if (!user) {
          throw new Error(`User @${fname} not found on Farcaster.`);
        }
        
        const custodyAddress = user.custody_address;
        const verifiedAddress = user.verified_addresses?.eth_addresses?.[0];

        if (custodyAddress) {
            targetAddress = custodyAddress;
        } else if (verifiedAddress) {
            targetAddress = verifiedAddress;
        } else {
            return NextResponse.json({ error: `Could not find a connected wallet for user @${fname}.` }, { status: 404 });
        }

      } catch (neynarError: any) {
        console.error('[Neynar API Error]', neynarError);
        if (neynarError?.response?.status === 404) {
          return NextResponse.json({ error: `Farcaster user "${fname}" not found.` }, { status: 404 });
        }
        throw new Error('Failed to fetch user data from Farcaster. Please try again.');
      }
    }

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
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
