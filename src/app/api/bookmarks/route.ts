import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Pastikan variabel env di-set di Vercel
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_fid = searchParams.get('fid');

  if (!user_fid) return NextResponse.json({ error: 'FID is required' }, { status: 400 });

  const { data, error } = await supabase
    .from('bookmarks')
    .select('talent_username')
    .eq('user_fid', user_fid);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { user_fid, talent_username, action } = await request.json();
  
  if (!user_fid || !talent_username || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  
  if (action === 'add') {
    const { error } = await supabase.from('bookmarks').insert({ user_fid, talent_username });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Bookmarked!' });
  }

  if (action === 'remove') {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_fid, talent_username });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Bookmark removed' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
