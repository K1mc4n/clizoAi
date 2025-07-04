// Lokasi: src/app/api/posts/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '~/lib/supabase'; // Pastikan path ini benar

// Fungsi ini akan mengambil semua post dari database
export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

  if (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// Fungsi ini akan menyimpan post baru ke database
export async function POST(request: Request) {
  const { content, author_name } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_name: author_name || 'Anonymous' }])
    .select();

  if (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}
