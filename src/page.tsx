'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 bg-gray-100 text-gray-900">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-600">
          ClizoAI Farcaster Miniapp
        </h1>
        <p className="text-lg text-gray-700">
          Welcome to the next-gen crypto quiz experience. Powered by Farcaster Frames, Neynar API, and Supabase.
        </p>

        <div className="mt-6">
          <Link
            href="/api/frame"
            className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white text-lg font-medium hover:bg-indigo-700 transition"
          >
            Open Frame
          </Link>
        </div>
      </div>
    </main>
  );
}
