// File: src/app/api/users/list/route.ts

import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { NextResponse, NextRequest } from 'next/server';

// Definisikan tipe data agar konsisten dengan yang diharapkan frontend
export interface FarcasterUser {
  username: string;
  name: string; // Menggunakan display_name sebagai name
  headline: string; // Menggunakan bio.text sebagai headline
  profile_picture_url: string;
  wallet_address: string; // Menggunakan verified_addresses.eth_addresses[0]
  fid: number;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!apiKey) {
    console.error("Server-side error: NEYNAR_API_KEY is not set in Vercel Environment Variables.");
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient(apiKey);
    let users: any[] = [];

    if (query && query.trim() !== '') {
      // Jika ada query, gunakan endpoint pencarian user Neynar
      const response = await neynar.searchUser(query, 1); // viewerFid (arg 2) bisa diisi 1
      users = response.result.users;
    } else {
      // Jika tidak ada query, ambil daftar cast dari channel populer untuk mendapatkan FIDs
      const feed = await neynar.fetchFeed('channel', { channelId: 'neynar', limit: 25 });
      const fids = feed.casts.map(cast => cast.author.fid);
      const uniqueFids = [...new Set(fids)];

      if (uniqueFids.length > 0) {
        const bulkUsersResponse = await neynar.fetchBulkUsers(uniqueFids);
        users = bulkUsersResponse.users;
      }
    }

    // Format data dari Neynar agar sesuai dengan interface yang diharapkan frontend
    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name,
      headline: user.profile.bio.text || 'A Farcaster user.', // Fallback jika bio kosong
      profile_picture_url: user.pfp_url,
      wallet_address: user.verified_addresses.eth_addresses[0] || '', // Ambil dompet pertama
      fid: user.fid,
    }));

    // Kirim respons dengan key 'talents' agar frontend tidak perlu diubah banyak
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
