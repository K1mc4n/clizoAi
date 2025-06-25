import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!apiKey) {
    console.error("Server-side error: TALENT_PROTOCOL_API_KEY is not set.");
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    // --- PERBAIKAN UTAMA: Menggunakan endpoint /search ---
    // Endpoint ini lebih umum dan kemungkinan besar yang benar.
    // Jika tidak ada query, kita tetap mengirim query kosong agar API tetap merespons.
    const searchQuery = query || ''; 
    const apiUrl = `https://api.talentprotocol.com/api/v2/search?q=${encodeURIComponent(searchQuery)}`;
    
    console.log(`Server Log: Attempting fetch from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
        headers: { 
          'X-API-KEY': apiKey,
          'Accept': 'application/json' 
        },
        next: { revalidate: 300 }
      }
    );

    console.log(`Server Log: Talent Protocol API responded with status: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error(`Talent Protocol API non-JSON response. Status: ${response.status}. Body:`, responseText);
        return NextResponse.json({ error: `Invalid response from Talent Protocol. Status: ${response.status}` }, { status: 502 });
    }
    
    const data = await response.json();
    
    // Endpoint /search membungkus data di dalam `results`.
    return NextResponse.json({ talents: data.results });

  } catch (error: unknown) {
    console.error('Internal server error during fetch operation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
