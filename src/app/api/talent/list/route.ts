import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  console.log("Server Log: Checking for TALENT_PROTOCOL_API_KEY...");

  // 1. Verifikasi Kunci API dengan log yang jelas
  if (!apiKey) {
    console.error("FATAL ERROR: TALENT_PROTOCOL_API_KEY is missing or not set in Vercel Environment Variables.");
    return NextResponse.json({ error: 'Server configuration error: API key is not configured.' }, { status: 500 });
  }
  console.log("Server Log: TALENT_PROTOCOL_API_KEY found.");

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  try {
    // 2. Tentukan URL API yang benar
    const baseUrl = "https://api.talentprotocol.com/api/v2/talents";
    const apiUrl = query ? `${baseUrl}/search?q=${encodeURIComponent(query)}` : baseUrl;
    
    console.log(`Server Log: Fetching from API: ${apiUrl}`);

    // 3. Lakukan panggilan ke API Talent Protocol
    const response = await fetch(apiUrl, {
        headers: { 
          'X-API-KEY': apiKey,
          'Accept': 'application/json' 
        },
        next: { revalidate: 300 } 
      }
    );

    console.log(`Server Log: Talent Protocol API responded with status: ${response.status}`);

    // 4. Tangani jika respons BUKAN JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Talent Protocol API did not return JSON. Response body:", responseText);
        return NextResponse.json({ error: `Invalid response from upstream API. Expected JSON but got ${contentType}.` }, { status: 502 }); // Bad Gateway
    }
    
    const data = await response.json();

    // 5. Tangani jika API Talent Protocol memberikan error
    if (!response.ok) {
      console.error(`Talent Protocol API error response:`, data);
      return NextResponse.json(
        { error: `Failed to fetch from Talent Protocol. Status: ${response.status}. Message: ${data.error || response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // 6. Jika berhasil, kirimkan data kembali ke frontend
    console.log("Server Log: Successfully fetched data from Talent Protocol.");
    return NextResponse.json({ talents: data.talents });

  } catch (error: unknown) {
    console.error('Internal server error during fetch operation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
