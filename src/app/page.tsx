// src/app/page.tsx

import { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION, APP_SPLASH_URL, APP_URL } from "~/lib/constants";

// `generateMetadata` digunakan untuk memastikan variabel lingkungan
// seperti APP_URL tersedia saat Next.js membangun metadata.
export async function generateMetadata(): Promise<Metadata> {
  // Pastikan URL dan nama aplikasi tersedia
  const appUrl = APP_URL || 'https://default-url.com';
  const appName = APP_NAME || 'My Farcaster App';
  const appSplashUrl = APP_SPLASH_URL || `${appUrl}/splash.png`;

  return {
    title: `${appName} - Discover Web3 Talents`,
    description: APP_DESCRIPTION,
    openGraph: {
      title: appName,
      description: APP_DESCRIPTION,
      images: [appSplashUrl], 
    },
    // Ini adalah bagian penting untuk Farcaster
    other: {
      // Menandakan bahwa ini adalah Farcaster Frame/Mini App
      'fc:frame': 'vNext',
      // Gambar yang ditampilkan di dalam frame
      'fc:frame:image': appSplashUrl,

      // --- Meta tag untuk tombol "Launch App" ---
      'fc:frame:button:1': 'Launch App',
      // Menggunakan 'post_redirect' akan membuat klien Farcaster (Warpcast)
      // mengalihkan pengguna ke dalam Mini App setelah tombol diklik.
      'fc:frame:button:1:action': 'post_redirect',
      // URL API yang akan menerima POST request saat tombol diklik.
      // API ini yang akan melakukan redirect ke halaman aplikasi.
      'fc:frame:post_url': `${appUrl}/api/launch`,
    },
  };
}

// Komponen halaman utama tetap sama.
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
