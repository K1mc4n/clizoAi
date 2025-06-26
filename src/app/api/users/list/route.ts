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
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Neynar API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    
    let users: any[] = [];

    // --- PERBAIKAN: FUNGSI PENCARIAN DINONAKTIFKAN ---
    // Karena paket gratis tidak mendukung endpoint searchUser, kita akan selalu
    // mengambil daftar pengguna dari feed channel 'neynar' sebagai gantinya.

    const feed = await neynar.fetchFeed({
      feedType: 'channel' as any, // Menggunakan 'as any' untuk bug typing di SDK
      channelId: 'neynar',
      limit: 25,
    });

    const fids = feed.casts.map(cast => cast.author.fid);
    const uniqueFids = [...new Set(fids)];

    if (uniqueFids.length > 0) {
      const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: uniqueFids });
      users = bulkUsersResponse.users;
    }

    // Blok 'if (query)' sebelumnya telah dihapus seluruhnya.
    // ----------------------------------------------------

    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name,
      headline: user.profile?.bio?.text || 'A Farcaster user.',
      profile_picture_url: user.pfp_url,
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
    }));
    
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
