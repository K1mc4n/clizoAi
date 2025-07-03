// src/components/Demo.tsx

"use client";

// Logika dan state bookmark telah dihapus
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { miniAppsData, type MiniApp } from "~/lib/miniAppsData";
import { MiniAppCard } from "./ui/MiniAppCard";

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context, actions } = useMiniApp();

  const handleLaunchApp = (url: string) => {
    if (isSDKLoaded && actions.openUrl) {
      actions.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };
  
  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <h1 className="text-2xl font-bold text-center mb-1">{title}</h1>
        <p className="text-center text-gray-500 mb-6">A curated directory of Farcaster Mini Apps.</p>
        
        <div className="grid grid-cols-4 gap-2 animate-fade-in">
          {miniAppsData.map((app) => (
            <MiniAppCard
              key={app.id}
              app={app}
              onLaunch={handleLaunchApp}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
