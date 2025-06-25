import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!apiKey) {
    console.error("Server-side error: TALENT_PROTOCOL_API_KEY is not set in Vercel Environment Variables.");
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    // --- PERBAIKAN DI SINI ---
    // Endpoint yang benar untuk search adalah /talents/search
    // Jika tidak ada query, kita panggil /talents
    let apiUrl = query 
      ? `https://api.talentprotocol.com/api/v2/talents/search?q=${encodeURIComponent(query)}`
      : `https://api.talentprotocol.com/api/v2/talents`;

    const response = await fetch(apiUrl, {
        headers: { 
          'X-API-KEY': apiKey,
          'Accept': 'application/json' 
        },
        next: { revalidate: 300 } // Cache selama 5 menit
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(`Talent Protocol API responded with error: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: `Failed to fetch from Talent Protocol. Status: ${response.status}. Message: ${errorBody.error || response.statusText}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    // Respons dari /talents/search dan /talents sama-sama ada di dalam properti 'talents'
    return NextResponse.json({ talents: data.talents });

  } catch (error: unknown) {
    console.error('Internal server error while fetching from Talent Protocol:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
