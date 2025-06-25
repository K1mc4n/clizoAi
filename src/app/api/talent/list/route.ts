import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // 1. Verifikasi Kunci API di server
  if (!apiKey) {
    console.error("Server-side error: TALENT_PROTOCOL_API_KEY is not set in Vercel Environment Variables.");
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    // 2. Tentukan URL API yang benar berdasarkan ada atau tidaknya query pencarian
    // Jika ada query, gunakan endpoint '/talents/search'.
    // Jika tidak ada, gunakan endpoint '/talents' untuk daftar default.
    let apiUrl = query 
      ? `https://api.talentprotocol.com/api/v2/talents/search?q=${encodeURIComponent(query)}`
      : `https://api.talentprotocol.com/api/v2/talents`;

    // 3. Lakukan panggilan ke API Talent Protocol
    const response = await fetch(apiUrl, {
        headers: { 
          'X-API-KEY': apiKey,
          'Accept': 'application/json' 
        },
        // Cache data selama 5 menit untuk mengurangi panggilan API
        next: { revalidate: 300 } 
      }
    );

    // 4. Tangani jika API Talent Protocol memberikan error
    if (!response.ok) {
      const errorBody = await response.json();
      console.error(`Talent Protocol API responded with error: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: `Failed to fetch from Talent Protocol. Status: ${response.status}. Message: ${errorBody.error || response.statusText}` }, 
        { status: response.status }
      );
    }

    // 5. Jika berhasil, kirimkan data kembali ke frontend
    const data = await response.json();
    return NextResponse.json({ talents: data.talents });

  } catch (error: unknown) {
    // 6. Tangani error internal di server kita sendiri (misalnya, masalah jaringan)
    console.error('Internal server error while fetching from Talent Protocol:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
