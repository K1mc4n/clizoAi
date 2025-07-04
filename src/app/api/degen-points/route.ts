// src/app/api/degen-points/route.ts

import { NextRequest, NextResponse } from 'next/server';
// --- PERBAIKAN DI SINI ---
// Menggabungkan impor NeynarAPIClient dan User ke dalam satu baris dari path utama.
import { NeynarAPIClient, User } from '@neynar/nodejs-sdk';

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
  // Membersihkan input dari spasi dan simbol @
  let cleanedQuery = query.trim().replace('@', '');

  try {
    // === BLOK 1: CEK JIKA INPUT ADALAH ALAMAT DOMPET ===
    if (isEthereumAddress(cleanedQuery)) {
      targetAddress = cleanedQuery;
    } 
    // === BLOK 2: JIKA INPUT ADALAH NAMA PENGGUNA, GUNAKAN NEYNAR ===
    else {
      const neynarApiKey = process.env.NEYNAR_API_KEY;
      if (!neynarApiKey) {
        throw new Error('Neynar API key is not configured on the server.');
      }
      
      const neynarClient = new NeynarAPIClient(neynarApiKey);
      
      // Membersihkan .eth dari nama pengguna untuk memastikan kompatibilitas
      const fname = cleanedQuery.endsWith('.eth') 
        ? cleanedQuery.slice(0, -4) 
        : cleanedQuery;

      console.log(`[Neynar API] Looking up username: ${fname}`);

      try {
        const { result } = await neynarClient.lookupUserByUsername(fname);
        // Tipe User sekarang sudah benar dari impor yang diperbaiki
        const user: User | undefined = result?.user;

        if (!user) {
          throw new Error(`User @${fname} not found on Farcaster.`);
        }
        
        // Prioritaskan custody_address, jika tidak ada, gunakan dompet terverifikasi pertama
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
        // Menangani error spesifik jika Neynar tidak menemukan pengguna
        console.error('[Neynar API Error]', neynarError);
        if (neynarError?.response?.status === 404) {
          return NextResponse.json({ error: `Farcaster user "${fname}" not found.` }, { status: 404 });
        }
        // Untuk error lain dari Neynar
        throw new Error('Failed to fetch user data from Farcaster. Please try again.');
      }
    }

    // === BLOK 3: SETELAH DAPAT ALAMAT DOMPET, PANGGIL DEGEN.TIPS API ===
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
    // Menangkap semua error lain yang mungkin terjadi
    console.error('[DEGEN API CATCH BLOCK] Full Error:', error.message);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
