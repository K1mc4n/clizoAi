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
    // --- PERBAIKAN FINAL DI SINI ---
    // Selalu gunakan endpoint dasar `/talents`.
    // Parameter `q` akan ditambahkan jika ada.
    const baseUrl = "https://api.talentprotocol.com/api/v2/talents";
    const url = new URL(baseUrl);
    
    if (query) {
      url.searchParams.append('q', query);
    }

    const apiUrl = url.toString();
    console.log(`Server Log: Final attempt, fetching from API: ${apiUrl}`);

    const response = await fetch(apiUrl, {
        headers: { 
          'X-API-KEY': apiKey,
          'Accept': 'application/json' 
        },
        next: { revalidate: 300 }
      }
    );

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error(`Talent Protocol API responded with a non-OK or non-JSON response. Status: ${response.status}. Body:`, responseText);
        return NextResponse.json({ error: `Invalid response from upstream API. Status: ${response.status}` }, { status: 502 });
    }
    
    const data = await response.json();
    
    return NextResponse.json(data); // <-- Langsung kirim data tanpa membungkusnya lagi

  } catch (error: unknown) {
    console.error('Internal server error during fetch operation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
