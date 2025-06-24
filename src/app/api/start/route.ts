import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const fid = body?.untrustedData?.fid;

  if (!fid) {
    return NextResponse.json({ error: 'Missing FID' }, { status: 400 });
  }

  await supabase.from('quiz_sessions').insert({ fid });

  return NextResponse.json({
    frames: [
      {
        title: "Question 1",
        image: "https://yourdomain.com/question1.png",
        buttons: [
          { label: "Answer A", action: "post", target: "/api/answer?a=A" },
          { label: "Answer B", action: "post", target: "/api/answer?a=B" },
        ],
      },
    ],
  });
}
