// src/app/api/talent/list/route.ts (VERSI DIPERBARUI)

import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) { // Gunakan NextRequest untuk akses searchParams
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); // Ambil parameter 'q'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Talent Protocol API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    // Bangun URL API berdasarkan ada atau tidaknya query
    let apiUrl = `https://api.talentprotocol.com/api/v2/talents`;
    if (query) {
      apiUrl += `?q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(apiUrl, {
        headers: {
          'X-API-KEY': apiKey,
        },
        next: { revalidate: 300 } // Revalidate setiap 5 menit
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Talent Protocol API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ talents: data.talents });

  } catch (error: any) {
    console.error('Failed to fetch talent list:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch talent list.' },
      { status: 500 }
    );
  }
}
