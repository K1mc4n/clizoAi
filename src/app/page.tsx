import { Metadata } from "next";
// Impor diperbaiki dari '@/lib/constants' menjadi '~/lib/constants'
import { APP_NAME, APP_DESCRIPTION, APP_SPLASH_URL, APP_URL } from "~/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} - Discover Web3 Talents`,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_SPLASH_URL], 
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': APP_SPLASH_URL,
    'fc:frame:button:1': 'Launch App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${APP_URL}/app`, 
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-[#7C65C1]">{APP_NAME}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{APP_DESCRIPTION}</p>
        <a 
          href="/app" 
          className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Launch App
        </a>
        <p className="text-md text-gray-500 mt-2">
            Or open this in a Farcaster client like Warpcast to use the Mini App.
        </p>
      </div>
    </main>
  );
}
