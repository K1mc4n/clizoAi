// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

// Fungsi untuk memeriksa apakah sebuah string adalah alamat Ethereum
function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'A Farcaster username or Ethereum address is required.' }, { status: 400 });
  }

  let targetAddress: string | null = null;

  try {
    // Cek apakah query adalah alamat atau username
    if (isEthereumAddress(query)) {
      targetAddress = query;
    } else {
      // Jika bukan alamat, anggap sebagai username
      const neynarApiKey = process.env.NEYNAR_API_KEY;
      if (!neynarApiKey) throw new Error('Neynar API key is not configured.');
      
      const neynarClient = new NeynarAPIClient(new Configuration({ apiKey: neynarApiKey }));
      
      // PERBAIKAN FINAL: Kirim username sebagai objek
      const userLookup = await neynarClient.lookupUserByUsername({ 
        username: query.replace('@', '') 
      });

      const fid = userLookup.result.user.fid;

      const { users } = await neynarClient.fetchBulkUsers([fid]);
      const user = users[0];

      if (!user) {
        return NextResponse.json({ error: `Farcaster user @${query} not found.` }, { status: 404 });
      }

      const custodyAddress = user.custody_address;
      if (!custodyAddress) {
        return NextResponse.json({ error: `Could not find a connected wallet for user @${query}.` }, { status: 404 });
      }
      targetAddress = custodyAddress;
    }

    const degenApiUrl = `https://www.degen.tips/api/airdrop2/season3/points?address=${targetAddress}`;
    const degenResponse = await fetch(degenApiUrl);

    if (!degenResponse.ok) {
      try {
        const errorData = await degenResponse.json();
        const errorMessage = errorData.error || 'Failed to fetch points from Degen API.';
        return NextResponse.json({ error: errorMessage }, { status: degenResponse.status });
      } catch {
        throw new Error('Failed to fetch points from Degen API.');
      }
    }
    
    const degenData = await degenResponse.json();
    return NextResponse.json(degenData);

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message.includes('User not found')) {
        return NextResponse.json({ error: `Farcaster user "${query}" not found.` }, { status: 404 });
    }
    console.error('Error in /api/degen-points:', error.message);
    const errorMessage = `An error occurred: ${error.message}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
