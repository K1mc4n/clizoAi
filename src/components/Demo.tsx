// src/components/Demo.tsx

"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { TalentCard, type TalentProfile } from "./ui/TalentCard";
import { TalentDetailView } from "./ui/TalentDetailView";
import { TalentCardSkeleton } from "./ui/TalentCardSkeleton";
import { USE_WALLET } from "~/lib/constants";
import { staticTalentData } from "~/lib/staticData";

export default function Demo({ title }: { title?: string }) {
  const { isSDKLoaded, context } = useMiniApp();
  // Gunakan data statis sebagai state awal.
  const [talents, setTalents] = useState<TalentProfile[]>(staticTalentData);
  // Atur isLoading ke false karena data sudah ada.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { address } = useAccount();
  const userFid = context?.user?.fid;
  const isLoggedIn = !!userFid;

  // Logika fetch data awal telah dihapus untuk menghilangkan error.

  useEffect(() => {
    if (!userFid) return;
    const fetchAndSetBookmarks = async () => {
      try {
        const response = await fetch(`/api/bookmarks?fid=${userFid}`);
        if (!response.ok) return;
        const data = await response.json();
        setBookmarks(data.map((b: { talent_username: string }) => b.talent_username));
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
    // Logika bookmark tetap menggunakan API
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_fid: userFid, talent_username: talent.username, action }),
    });
  };

  const handleSelectTalent = (talent: TalentProfile) => setSelectedTalent(talent);
  const handleBackToList = () => setSelectedTalent(null);

  if (!isSDKLoaded) return <div className="flex items-center justify-center h-screen"><TalentCardSkeleton /></div>;

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
        {selectedTalent ? (
          <TalentDetailView talent={selectedTalent} onBack={handleBackToList} loggedInUserAddress={address} />
        ) : (
          <>
            {/* SponsorBanner telah dihapus dari sini */}
            {!isLoading && !error && (
              <div className="animate-fade-in">
                {talents.map((t) => (
                  <TalentCard
                    key={t.fid}
                    talent={t}
                    onClick={() => handleSelectTalent(t)}
                    isBookmarked={bookmarks.includes(t.username)}
                    onToggleBookmark={() => toggleBookmark(t)}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {!selectedTalent && <Footer showWallet={USE_WALLET} />}
    </div>
  );
}
