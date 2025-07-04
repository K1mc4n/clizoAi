// src/app/api/degen-points/route.ts --- KODE DEBUGGING

import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

export async function POST(request: NextRequest) {
  const neynarApiKey = process.env.NEYNAR_API_KEY;
  const myFid = process.env.MY_FID;

  if (!neynarApiKey || !myFid) {
    return NextResponse.json({ error: 'NEYNAR_API_KEY or MY_FID is not configured on Vercel.' }, { status: 500 });
  }

  try {
    const neynarClient = new NeynarAPIClient(
      new Configuration({ apiKey: neynarApiKey })
    );

    console.log(`[DEBUG] Testing Neynar API Key. Fetching user with FID: ${myFid}`);

    // Kita menggunakan endpoint yang berbeda untuk tes: fetchBulkUsers
    const { users } = await neynarClient.fetchBulkUsers({ fids: [parseInt(myFid)] });

    if (users && users.length > 0) {
      console.log("[DEBUG] Neynar API connection SUCCESSFUL. User found:", users[0]);
      // Jika berhasil, kita kembalikan data user sebagai bukti.
      return NextResponse.json({ 
        message: "Neynar API connection successful!",
        userFound: users[0] 
      });
    } else {
      console.error("[DEBUG] Neynar API connection FAILED. No user found for FID.");
      return NextResponse.json({ error: "Could not find user with the configured FID." }, { status: 404 });
    }

  } catch (error: any) {
    console.error("[DEBUG] An error occurred during Neynar API test:", error.message);
    // Jika ada error, kita tampilkan agar bisa dianalisis.
    return NextResponse.json({ 
      error: "An error occurred during Neynar API test.",
      details: error.message 
    }, { status: 500 });
  }
}
