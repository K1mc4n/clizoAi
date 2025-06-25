// src/app/api/talent/list/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Talent Protocol API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    // Endpoint ini mengambil daftar talenta (sesuaikan jika ada endpoint yang lebih baik)
    const response = await fetch(
      `https://api.talentprotocol.com/api/v2/talents`, 
      {
        headers: {
          'X-API-KEY': apiKey,
        },
        // Revalidate setiap 10 menit
        next: { revalidate: 600 }
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
