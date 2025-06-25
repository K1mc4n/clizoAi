import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;

  if (!apiKey) {
    console.error("SERVER ERROR: TALENT_PROTOCOL_API_KEY is not configured in Vercel.");
    return NextResponse.json({ error: 'Server configuration error: API Key is missing.' }, { status: 500 });
  }

  // 1. Ambil query pencarian 'q' dari URL request
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // 2. Bangun URL API Talent Protocol dengan benar
  const apiUrl = new URL("https://api.talentprotocol.com/api/v2/talents");
  if (query) {
    apiUrl.searchParams.append('q', query);
  }

  console.log(`Forwarding request to Talent Protocol API: ${apiUrl.toString()}`);

  try {
    // 3. Lakukan panggilan fetch dengan header yang benar
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: { 
        'X-API-KEY': apiKey,
        'Accept': 'application/json' 
      },
      // Cache data untuk mengurangi beban API
      next: { revalidate: 300 } 
    });

    // 4. Periksa apakah respons dari Talent Protocol berhasil
    if (!response.ok) {
      // Jika gagal, log error dan kirim pesan yang jelas ke frontend
      const errorBody = await response.json();
      console.error(`Talent Protocol API responded with error: ${response.status}`, errorBody);
      return NextResponse.json(
        { error: `Upstream API Error: ${errorBody.error || response.statusText}` }, 
        { status: response.status }
      );
    }

    // 5. Jika berhasil, parse JSON dan kirimkan ke frontend
    const data = await response.json();
    return NextResponse.json(data); // API mereka sudah mengembalikan objek dengan key 'talents', jadi kita bisa langsung forward

  } catch (error: unknown) {
    // 6. Tangani error jaringan atau error internal lainnya
    console.error('Internal Server Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
