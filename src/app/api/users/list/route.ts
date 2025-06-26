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

// FID Anda untuk selalu ditampilkan di atas
const MY_FID = 250575;
const USER_LIMIT = 100;

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Neynar API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    let users: any[] = [];
    
    // Ambil feed dari channel populer untuk mendapatkan FID yang aktif
    const feed = await neynar.fetchFeed({
      feedType: 'channel' as any, // Workaround untuk bug typing di SDK
      channelId: 'farcaster', // Channel yang lebih umum dan aktif
      limit: 150, // Ambil lebih banyak untuk memastikan kita dapat 100 FID unik
    });

    // Kumpulkan semua FID dari feed dan tambahkan FID Anda
    const fidsFromFeed = feed.casts.map(cast => cast.author.fid);
    
    // Gabungkan FID Anda, hapus duplikat, dan batasi jumlahnya
    const uniqueFids = [...new Set([MY_FID, ...fidsFromFeed])].slice(0, USER_LIMIT);

    if (uniqueFids.length > 0) {
      // Ambil detail pengguna untuk FID yang sudah dikumpulkan
      const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: uniqueFids });
      users = bulkUsersResponse.users;
    }

    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name || user.username,
      headline: user.profile?.bio?.text || 'A Farcaster user.',
      profile_picture_url: user.pfp_url || '',
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
    }));
    
    // Pastikan profil Anda selalu ada di urutan pertama
    formattedUsers.sort((a, b) => {
        if (a.fid === MY_FID) return -1;
        if (b.fid === MY_FID) return 1;
        return 0; // Pertahankan urutan asli untuk sisanya
    });
    
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    
    // Fallback jika fetchFeed gagal (misalnya karena error 402)
    if (errorMessage.includes('402')) {
        return NextResponse.json({ error: 'The feature to fetch a dynamic feed may require a paid Neynar plan. Please contact support or check your plan.' }, { status: 402 });
    }
    
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
