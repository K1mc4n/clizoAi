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

  console.log('API: Running final test with fetchBulkUsers...');

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    
    // Kita akan mencoba mengambil data untuk FID 2 (v.eth) dan FID 3 (dwr.eth)
    const testFids = [2, 3]; 
    const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: testFids });
    const users = bulkUsersResponse.users;

    console.log(`API: Successfully fetched ${users.length} user(s).`);

    // --- PERBAIKAN FINAL DI SINI ---
    // Memberikan nilai fallback untuk properti yang mungkin 'undefined'
    const formattedUsers: FarcasterUser[] = users.map(user => ({
      username: user.username,
      name: user.display_name || user.username, // Fallback ke username jika display_name kosong
      headline: user.profile?.bio?.text || 'A Farcaster user.',
      profile_picture_url: user.pfp_url || '', // Fallback ke string kosong jika pfp_url kosong
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
    }));
    
    return NextResponse.json({ talents: formattedUsers });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('DIAGNOSTIC TEST FAILED:', errorMessage);
    // Periksa apakah error message mengandung '402'
    if (errorMessage.includes('402')) {
      return NextResponse.json({ error: 'Neynar API request failed: Payment Required. Please check your Neynar plan and API key.' }, { status: 402 });
    }
    return NextResponse.json({ error: `Diagnostic test failed: ${errorMessage}` }, { status: 500 });
  }
}
