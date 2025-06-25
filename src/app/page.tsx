import { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} - Discover Web3 Talents`,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    // Ganti dengan URL gambar OG statis Anda jika ada
    images: [`${process.env.NEXT_PUBLIC_URL}/splash.png`],
  },
  other: {
    // fc:frame di-nonaktifkan karena kita fokus pada Mini App, bukan frame statis
    // "fc:frame": "vNext",
    // "fc:frame:image": `${process.env.NEXT_PUBLIC_URL}/splash.png`,
    // 'fc:frame:button:1': 'Launch App',
    // 'fc:frame:button:1:action': 'link',
    // 'fc:frame:button:1:target': `${process.env.NEXT_PUBLIC_URL}/app`,
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-[#7C65C1]">{APP_NAME}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{APP_DESCRIPTION}</p>
        <p className="text-md text-gray-500">Open this in a Farcaster client like Warpcast to use the Mini App.</p>
      </div>
    </main>
  );
}
