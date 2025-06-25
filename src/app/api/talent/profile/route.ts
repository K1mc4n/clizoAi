// src/app/api/talent/profile/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address'); // Ambil alamat dompet dari query

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Talent Protocol API key is not configured.' },
      { status: 500 }
    );
  }

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Panggil API Talent Protocol
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/talents/${address}`,
      {
        headers: {
          'X-API-KEY': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // Lemparkan error agar bisa ditangkap di blok catch
      throw new Error(errorData.error || `Talent Protocol API error: ${response.statusText}`);
    }

    const talentProfile = await response.json();
    return NextResponse.json({ talentProfile });

  } catch (error: any) {
    console.error('Failed to fetch talent profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch talent profile.' },
      { status: 500 }
    );
  }
}
