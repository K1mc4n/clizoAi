// src/components/Demo.tsx

"use client";

import { useEffect, useState } from "react";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { USE_WALLET } from "~/lib/constants";
import { miniAppsData, type MiniApp } from "~/lib/miniAppsData";
import { MiniAppCard } from "./ui/MiniAppCard";

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context, actions } = useMiniApp();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const userFid = context?.user?.fid;
  const isLoggedIn = !!userFid;

  useEffect(() => {
    if (!userFid) return;
    const fetchAndSetBookmarks = async () => {
      try {
        const response = await fetch(`/api/bookmarks?fid=${userFid}`);
        if (!response.ok) return;
        const data = await response.json();
        setBookmarks(data.map((b: { app_id: string }) => b.app_id));
      } catch (e) {
        console.error("Failed to fetch bookmarks:", e);
      }
    };
    fetchAndSetBookmarks();
  }, [userFid]);

  const handleLaunchApp = (url: string) => {
    if (isSDKLoaded && actions.openUrl) {
      actions.openUrl(url);
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

    const newBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== app.id)
      : [...bookmarks, app.id];
    setBookmarks(newBookmarks);

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
        <p className="text-center text-gray-500 mb-6">A curated directory of Farcaster Mini Apps.</p>
        
        {/* --- PERUBAHAN TATA LETAK DI SINI --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
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
