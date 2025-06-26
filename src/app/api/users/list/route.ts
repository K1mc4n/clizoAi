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

// --- SOLUSI FINAL: DAFTAR PENGGUNA PILIHAN (CURATED LIST) ---
// Daftar ini HANYA menggunakan endpoint fetchBulkUsers yang sudah terbukti GRATIS.
const CURATED_FIDS = [
  250575, // Akun Anda!
  2, 3, 5, 6, 7, 8, 9, 10, 13, 40, 48, 50, 61, 95, 109, 133, 143, 147, 150, 153, 159, 191, 194, 195, 207, 214, 222, 225,
  238, 244, 250, 253, 259, 269, 271, 281, 292, 313, 333, 347, 350, 370, 397, 401, 403, 417, 420, 439, 440, 453, 455, 484,
  503, 521, 538, 555, 558, 560, 564, 574, 582, 592, 602, 608, 612, 613, 620, 631, 642, 650, 666, 688, 701, 712, 747, 750,
  777, 800, 808, 818, 888, 909, 923, 933, 955, 961, 999, 1001, 1104, 1111, 1121, 1177, 1234, 1337, 1990, 2000, 2001, 2023, 4242
];
// --------------------------------------------------------

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Neynar API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    
    // Langsung gunakan daftar FID yang sudah kita siapkan
    const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: CURATED_FIDS });
    const users = bulkUsersResponse.users;

    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name || user.username,
      headline: user.profile?.bio?.text || 'A Farcaster user.',
      profile_picture_url: user.pfp_url || '',
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
    }));
    
    // Urutkan untuk memastikan profil Anda selalu di atas
    formattedUsers.sort((a, b) => {
        if (a.fid === MY_FID) return -1;
        if (b.fid === MY_FID) return 1;
        // Anda bisa menambahkan logika pengurutan lain di sini jika mau,
        // misalnya berdasarkan username atau nama.
        return 0; 
    });
    
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
