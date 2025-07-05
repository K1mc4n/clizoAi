// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '~/lib/supabase';

// GET semua posts
export async function GET() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST post baru
export async function POST(request: Request) {
  const { content, author_name, image_url, link_url } = await request.json();

  if (!content && !image_url) {
    return NextResponse.json({ error: 'Content or an image is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([{ content, author_name: author_name || 'Anonymous', image_url, link_url }])
    .select();

  if (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}
