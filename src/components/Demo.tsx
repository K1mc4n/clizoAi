// src/components/Demo.tsx

"use client";

import { useEffect, useState } from "react";
import { useMiniApp } from "@neynar/react";
import sdk from "@farcaster/frame-sdk";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { USE_WALLET } from "~/lib/constants";
import { miniAppsData, type MiniApp } from "~/lib/miniAppsData"; // Impor data & tipe MiniApp
import { MiniAppCard } from "./ui/MiniAppCard"; // Impor komponen kartu MiniApp

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context } = useMiniApp();
  const [bookmarks, setBookmarks] = useState<string[]>([]); // Menyimpan ID aplikasi yang di-bookmark
  const userFid = context?.user?.fid;
  const isLoggedIn = !!userFid;

  // Mengambil bookmark saat komponen dimuat
  useEffect(() => {
    if (!userFid) return;
    const fetchAndSetBookmarks = async () => {
      try {
        const response = await fetch(`/api/bookmarks?fid=${userFid}`);
        if (!response.ok) return;
        const data = await response.json();
        // Pastikan API mengembalikan app_id
        setBookmarks(data.map((b: { app_id: string }) => b.app_id));
      } catch (e) {
        console.error("Failed to fetch bookmarks:", e);
      }
    };
    fetchAndSetBookmarks();
  }, [userFid]);

  const handleLaunchApp = (url: string) => {
    if (isSDKLoaded) {
      sdk.openFrame({ url });
    } else {
      window.open(url, '_blank');
    }
  };
  
  const toggleBookmark = async (app: MiniApp) => {
    if (!userFid) {
      alert("Please open in a Farcaster client to use bookmarks.");
      return;
    }
    const isBookmarked = bookmarks.includes(app.id);
    const action = isBookmarked ? 'remove' : 'add';

    // Optimistic UI update
    const newBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== app.id)
      : [...bookmarks, app.id];
    setBookmarks(newBookmarks);

    // Kirim request ke API
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_fid: userFid, app_id: app.id, action }),
    });
  };

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <h1 className="text-2xl font-bold text-center mb-1">{title}</h1>
        <p className="text-center text-gray-500 mb-4">A curated directory of Farcaster Mini Apps.</p>
        
        <div className="animate-fade-in">
          {miniAppsData.map((app) => (
            <MiniAppCard
              key={app.id}
              app={app}
              onLaunch={handleLaunchApp}
              isBookmarked={bookmarks.includes(app.id)}
              onToggleBookmark={() => toggleBookmark(app)}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>
      <Footer showWallet={USE_WALLET} />
    </div>
  );
}
