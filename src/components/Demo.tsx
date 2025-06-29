// src/components/Demo.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { TalentCard, type TalentProfile } from "./ui/TalentCard";
import { TalentDetailView } from "./ui/TalentDetailView";
import { TalentCardSkeleton } from "./ui/TalentCardSkeleton";
import { SponsorBanner } from './ui/SponsorBanner';
import { USE_WALLET } from "~/lib/constants";

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context } = useMiniApp();
  const [allFetchedTalents, setAllFetchedTalents] = useState<Map<string, TalentProfile>>(new Map());
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { address } = useAccount();
  const userFid = context?.user?.fid;
  const isLoggedIn = !!userFid;

  const fetchTalents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/list');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch talents. Status: ${response.status}`);
      }
      const data = await response.json();
      const newTalents: TalentProfile[] = data.talents || [];
      setTalents(newTalents);
      const newMap = new Map<string, TalentProfile>();
      newTalents.forEach(t => newMap.set(t.username, t));
      setAllFetchedTalents(newMap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

  useEffect(() => {
    if (!userFid) return;
    const fetchAndSetBookmarks = async () => {
      try {
        const response = await fetch(`/api/bookmarks?fid=${userFid}`);
        const data = await response.json();
        if (response.ok) {
          setBookmarks(data.map((b: { talent_username: string }) => b.talent_username));
        }
      } catch (e) { console.error("Failed to fetch bookmarks:", e); }
    };
    fetchAndSetBookmarks();
  }, [userFid]);

  const toggleBookmark = async (talent: TalentProfile) => {
    if (!userFid) {
      alert("Please open in a Farcaster client to use bookmarks.");
      return;
    }
    const isBookmarked = bookmarks.includes(talent.username);
    const action = isBookmarked ? 'remove' : 'add';
    const newBookmarks = isBookmarked ? bookmarks.filter(b => b !== talent.username) : [...bookmarks, talent.username];
    setBookmarks(newBookmarks);
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_fid: userFid, talent_username: talent.username, action }),
    });
  };

  const handleSelectTalent = (talent: TalentProfile) => setSelectedTalent(talent);
  const handleBackToList = () => setSelectedTalent(null);

  if (!isSDKLoaded) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header neynarUser={userFid ? { fid: userFid, score: 0 } : undefined} />
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
        {selectedTalent ? (
          <TalentDetailView talent={selectedTalent} onBack={handleBackToList} loggedInUserAddress={address} />
        ) : (
          <>
            <SponsorBanner />
            {isLoading && <>{Array.from({ length: 8 }).map((_, i) => <TalentCardSkeleton key={i} />)}</>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}
            {!isLoading && !error && (
              <div className="animate-fade-in">
                {talents.length > 0 ? (
                  talents.map((t) => (
                    <TalentCard
                      key={t.fid}
                      talent={t}
                      onClick={() => handleSelectTalent(t)}
                      isBookmarked={bookmarks.includes(t.username)}
                      onToggleBookmark={() => toggleBookmark(t)}
                      isLoggedIn={isLoggedIn}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">No curated talents found.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {!selectedTalent && <Footer showWallet={USE_WALLET} />}
    </div>
  );
}
