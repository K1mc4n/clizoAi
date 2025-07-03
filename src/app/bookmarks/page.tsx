// src/app/bookmarks/page.tsx

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { MiniAppCard } from '~/components/ui/MiniAppCard';
import { MiniApp, miniAppsData } from '~/lib/miniAppsData';
import { USE_WALLET } from '~/lib/constants';
import Link from 'next/link';

export default function BookmarksPage() {
  const { context, actions } = useMiniApp();
  const [bookmarkedApps, setBookmarkedApps] = useState<MiniApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userFid = context?.user?.fid;

  const fetchBookmarkedApps = useCallback(async () => {
    if (!userFid) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const bookmarksRes = await fetch(`/api/bookmarks?fid=${userFid}`);
      if (!bookmarksRes.ok) throw new Error('Failed to fetch bookmarks');
      
      const bookmarksData = await bookmarksRes.json();
      const bookmarkedIds: string[] = bookmarksData.map((b: { app_id: string }) => b.app_id);
      
      const filteredApps = miniAppsData.filter(app => bookmarkedIds.includes(app.id));
      setBookmarkedApps(filteredApps);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userFid]);
  
  const handleLaunchApp = (url: string) => {
    if (context && actions.openUrl) {
      actions.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (context?.user) {
      fetchBookmarkedApps();
    }
  }, [context?.user, fetchBookmarkedApps]);

  if (!userFid) {
    return (
      <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
        <div className="mx-auto py-2 px-4 pb-20">
          <Header />
          <h1 className="text-2xl font-bold text-center mb-6">Your Bookmarks</h1>
          <div className="flex flex-col items-center justify-center text-center p-4 h-64">
            <p className="mb-4">Please open in a Farcaster client to see your bookmarks.</p>
            <Link href="/" className="text-blue-500 hover:underline">
              Go back to Home
            </Link>
          </div>
        </div>
        {/* Memanggil Footer tanpa prop */}
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
        <div className="mx-auto py-2 px-4 pb-20">
            <Header />
            <h1 className="text-2xl font-bold text-center mb-6">Your Bookmarked Apps</h1>

            <div className="grid grid-cols-4 gap-2">
                {isLoading && <p>Loading...</p>}
                {error && <div className="text-center py-10 text-red-500">{error}</div>}
                {!isLoading && !error && (
                    bookmarkedApps.length > 0 ? (
                        bookmarkedApps.map((app) => (
                            <MiniAppCard 
                              key={app.id} 
                              app={app} 
                              onLaunch={handleLaunchApp}
                              isBookmarked={true}
                              onToggleBookmark={() => fetchBookmarkedApps()}
                              isLoggedIn={!!userFid}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 col-span-4">
                          You have no bookmarked apps yet.
                          <br/> 
                          <Link href="/" className="text-blue-500 hover:underline">
                            Find apps on the Home page.
                          </Link>
                        </div>
                    )
                )}
            </div>
        </div>
        {/* Memanggil Footer tanpa prop */}
        <Footer />
    </div>
  );
}
