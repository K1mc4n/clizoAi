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

  console.log('API: Running diagnostic test for fetchBulkUsers...');

  try {
    const neynar = new NeynarAPIClient({ apiKey });
    
    // HANYA MELAKUKAN SATU PANGGILAN API YANG PALING DASAR
    // Kita akan mencoba mengambil data untuk FID 2 (v.eth, salah satu pendiri Farcaster)
    const testFids = [2]; 
    const bulkUsersResponse = await neynar.fetchBulkUsers({ fids: testFids });
    const users = bulkUsersResponse.users;

    console.log(`API: Successfully fetched ${users.length} user(s).`);

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
    console.error('DIAGNOSTIC TEST FAILED:', errorMessage);
    return NextResponse.json({ error: `Diagnostic test failed: ${errorMessage}` }, { status: 500 });
  }
}
