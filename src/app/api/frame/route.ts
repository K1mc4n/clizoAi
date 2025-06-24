import { NextRequest, NextResponse } from 'next/server';
import { getNeynarClient } from '@/lib/neynar';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.untrustedData?.fid) {
    return NextResponse.json({ error: 'Missing FID' }, { status: 400 });
  }

  return NextResponse.json({
    frames: [
      {
        title: "Welcome to ClizoAI",
        image: "https://yourdomain.com/splash.png",
        buttons: [
          { label: "Start Quiz", action: "post", target: "/api/start" },
        ],
      },
    ],
  });
}
