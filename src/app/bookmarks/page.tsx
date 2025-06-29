// src/app/bookmarks/page.tsx

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import { TalentCard, type TalentProfile } from '~/components/ui/TalentCard';
// PERBAIKAN: Impor TalentCardSkeleton dari filenya sendiri
import { TalentCardSkeleton } from '~/components/ui/TalentCardSkeleton'; 
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { USE_WALLET } from '~/lib/constants';
import Link from 'next/link';

export default function BookmarksPage() {
  const { context } = useMiniApp();
  const [bookmarkedTalents, setBookmarkedTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userFid = context?.user?.fid;

  const fetchBookmarkedTalents = useCallback(async () => {
    if (!userFid) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [talentsRes, bookmarksRes] = await Promise.all([
        fetch('/api/users/list'),
        fetch(`/api/bookmarks?fid=${userFid}`)
      ]);

      if (!talentsRes.ok || !bookmarksRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const talentsData = await talentsRes.json();
      const bookmarksData = await bookmarksRes.json();

      const allTalents: TalentProfile[] = talentsData.talents || [];
      const bookmarkedUsernames: string[] = bookmarksData.map((b: { talent_username: string }) => b.talent_username);
      
      const filteredTalents = allTalents.filter(t => bookmarkedUsernames.includes(t.username));
      setBookmarkedTalents(filteredTalents);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userFid]);

  useEffect(() => {
    if (context?.user) {
        fetchBookmarkedTalents();
    }
  }, [context?.user, fetchBookmarkedTalents]);

  if (!userFid) {
    return (
        <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
            <div className="mx-auto py-2 px-4 pb-20">
                <Header />
                <h1 className="text-2xl font-bold text-center mb-6">Your Bookmarks</h1>
                <div className="flex flex-col items-center justify-center text-center p-4 h-64">
                    <p className="mb-4">Please open in a Farcaster client to see your bookmarks.</p>
                    <Link href="/app" className="text-blue-500 hover:underline">
                        Go back to Home
                    </Link>
                </div>
            </div>
            <Footer showWallet={USE_WALLET} />
        </div>
    );
  }

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
        <div className="mx-auto py-2 px-4 pb-20">
            <Header />
            <h1 className="text-2xl font-bold text-center mb-6">Your Bookmarks</h1>

            <div className="space-y-3">
                {isLoading && <>{Array.from({ length: 5 }).map((_, i) => <TalentCardSkeleton key={i} />)}</>}
                {error && <div className="text-center py-10 text-red-500">{error}</div>}
                {!isLoading && !error && (
                    bookmarkedTalents.length > 0 ? (
                        bookmarkedTalents.map((talent) => (
                            <TalentCard 
                              key={talent.fid} 
                              talent={talent} 
                              onClick={() => {}}
                              isBookmarked={true}
                              onToggleBookmark={() => {}}
                              isLoggedIn={!!userFid}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                          You have no bookmarked talents yet.
                          <br/> 
                          <Link href="/app" className="text-blue-500 hover:underline">
                            Find users on the Home page.
                          </Link>
                        </div>
                    )
                )}
            </div>
        </div>
        <Footer showWallet={USE_WALLET} />
    </div>
  );
}
