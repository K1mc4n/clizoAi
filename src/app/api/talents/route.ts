// src/app/api/talents/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// Cache hasil dari endpoint ini selama 1 jam di edge Vercel
export const revalidate = 3600;

export async function GET() {
  try {
    console.log("Fetching talents from Supabase cache...");
    const { data: talents, error } = await supabase
      .from('dune_talents_cache')
      .select('*')
      .order('followers', { ascending: false }); // Urutkan berdasarkan followers

    if (error) {
      console.error('Error fetching from Supabase cache:', error);
      throw error;
    }
    
    if (!talents || talents.length === 0) {
        console.warn("Talent cache is empty. A refresh might be needed.");
    }

    return NextResponse.json({ talents });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching talents from cache:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
