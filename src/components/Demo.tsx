// src/components/Demo.tsx

"use client";

import { useMiniApp } from "@neynar/react";
import sdk from "@farcaster/frame-sdk";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { SponsorBanner } from './ui/SponsorBanner';
import { USE_WALLET } from "~/lib/constants";
import { miniAppsData } from "~/lib/miniAppsData"; // <-- Impor data Mini App baru
import { MiniAppCard } from "./ui/MiniAppCard"; // <-- Impor komponen kartu baru

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context } = useMiniApp();

  // Fungsi untuk meluncurkan Mini App menggunakan Farcaster SDK
  const handleLaunchApp = (url: string) => {
    if (isSDKLoaded) {
      // openFrame adalah cara yang benar untuk membuka Mini App lain
      // dari dalam Farcaster client seperti Warpcast.
      sdk.openFrame({ url });
    } else {
      // Fallback jika SDK tidak termuat (misal: dibuka di browser biasa)
      window.open(url, '_blank');
    }
  };

  // Kita tidak perlu state loading karena datanya statis.
  if (!isSDKLoaded) {
      return (
        <div className="flex items-center justify-center h-screen">
            {/* Anda bisa membuat skeleton baru untuk MiniAppCard jika mau */}
            <p>Loading...</p> 
        </div>
      );
  }

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <h1 className="text-2xl font-bold text-center mb-1">{title}</h1>
        <p className="text-center text-gray-500 mb-4">A curated directory of Farcaster Mini Apps.</p>
        
        {/* Konten utama sekarang adalah daftar Mini App */}
        <div className="animate-fade-in">
          {miniAppsData.map((app) => (
            <MiniAppCard
              key={app.id}
              app={app}
              onLaunch={handleLaunchApp}
            />
          ))}
        </div>

      </div>
      <Footer showWallet={USE_WALLET} />
    </div>
  );
}
