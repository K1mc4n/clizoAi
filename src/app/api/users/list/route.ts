import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { NextResponse, NextRequest } from 'next/server';

export interface FarcasterUser {
  username: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  wallet_address: string;
  fid: number;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Neynar API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    let users: any[] = [];

    // Logika ini akan dicoba. Jika gagal dengan error 402, blok catch akan menanganinya.
    // Ini memungkinkan fungsionalitas pencarian diaktifkan jika paket di-upgrade.
    if (query && query.trim() !== '') {
      // Endpoint pencarian (kemungkinan besar berbayar)
      const response = await neynar.searchUser({ q: query });
      users = response.result.users;
    } else {
      // Endpoint feed channel (seharusnya gratis, kita coba lagi)
      const feed = await neynar.fetchFeed({
        feedType: 'channel' as any,
        channelId: 'neynar',
        limit: 25,
      });

      const fids = feed.casts.map(cast => cast.author.fid);
      const uniqueFids = [...new Set(fids)];

      if (uniqueFids.length > 0) {
        // Endpoint bulk users (pasti gratis)
        const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: uniqueFids });
        users = bulkUsersResponse.users;
      }
    }

    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name || user.username,
      headline: user.profile?.bio?.text || 'A Farcaster user.',
      profile_picture_url: user.pfp_url || '',
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
    }));
    
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    
    if (errorMessage.includes('402')) {
        return NextResponse.json({ error: 'This feature (search/feed) may require a paid Neynar plan.' }, { status: 402 });
    }
    
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
