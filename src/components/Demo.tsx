"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMiniApp } from "@neynar/react";
import { useDebounce } from 'use-debounce';
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { TalentCard, type TalentProfile } from "./ui/TalentCard";
import { TalentDetailView } from "./ui/TalentDetailView";
import { TalentCardSkeleton } from "./ui/TalentCardSkeleton";
import { USE_WALLET } from "~/lib/constants";
import { truncateAddress } from "~/lib/truncateAddress";

export type Tab = 'home' | 'bookmarks' | 'wallet';

export default function Demo() {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  const [allFetchedTalents, setAllFetchedTalents] = useState<Map<string, TalentProfile>>(new Map());
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  const userFid = context?.user?.fid;

  const fetchTalents = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/talent/list?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch talents');
      const data = await response.json();
      const newTalents: TalentProfile[] = data.talents || [];
      setTalents(newTalents);
      setAllFetchedTalents(prev => {
        const newMap = new Map(prev);
        newTalents.forEach(t => newMap.set(t.username, t));
        return newMap;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'home') {
      fetchTalents(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, activeTab, fetchTalents]);
  
  useEffect(() => {
    const fetchAndSetBookmarks = async () => {
      if (!userFid) return;
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
    if (!userFid) return;
    const isBookmarked = bookmarks.includes(talent.username);
    const action = isBookmarked ? 'remove' : 'add';
    setBookmarks(prev => isBookmarked ? prev.filter(b => b !== talent.username) : [...prev, talent.username]);
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_fid: userFid, talent_username: talent.username, action }),
    });
  };

  const handleSelectTalent = (talent: TalentProfile) => setSelectedTalent(talent);
  const handleBackToList = () => setSelectedTalent(null);

  useEffect(() => {
    if(activeTab !== 'home' && activeTab !== 'bookmarks') setSelectedTalent(null);
  }, [activeTab]);

  if (!isSDKLoaded) return <div className="flex items-center justify-center h-screen">Loading SDK...</div>;
  
  const getBookmarkedTalents = () => {
    return bookmarks.map(username => allFetchedTalents.get(username)).filter(Boolean) as TalentProfile[];
  }

  const renderHome = () => (
    <>
      <div className="px-2 mb-4">
        <Input type="text" placeholder="Search by name, skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {isLoading && Array.from({ length: 3 }).map((_, i) => <TalentCardSkeleton key={i} />)}
      {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}
      {!isLoading && !error && (
        <div className="animate-fade-in">
          {talents.length > 0 ? (
            talents.map((t) => <TalentCard key={t.username} talent={t} onClick={() => handleSelectTalent(t)} isBookmarked={bookmarks.includes(t.username)} onToggleBookmark={() => toggleBookmark(t)} isLoggedIn={!!userFid}/>)
          ) : (
            <div className="text-center py-10 text-gray-500">No talents found for "{debouncedSearchTerm}".</div>
          )}
        </div>
      )}
    </>
  );

  const renderBookmarks = () => {
    const bTalents = getBookmarkedTalents();
    return (
      <div className="animate-fade-in">
        {bTalents.length > 0 ? (
          bTalents.map((t) => <TalentCard key={t.username} talent={t} onClick={() => handleSelectTalent(t)} isBookmarked={true} onToggleBookmark={() => toggleBookmark(t)} isLoggedIn={!!userFid} />)
        ) : (
          <div className="text-center py-10 text-gray-500">You have no bookmarked talents yet. <br/> Go to Home to find and star talents!</div>
        )}
      </div>
    )
  };

  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0, paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header neynarUser={userFid ? { fid: userFid } : undefined} />
        <h1 className="text-2xl font-bold text-center mb-4">Discovery Talent Web3</h1>
        {selectedTalent ? (
          <TalentDetailView talent={selectedTalent} onBack={handleBackToList} loggedInUserAddress={context?.user?.connected_address} />
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'bookmarks' && renderBookmarks()}
            {activeTab === 'wallet' && (
              <div className="space-y-3 px-6 w-full max-w-md mx-auto">
                 <h2 className="text-lg font-semibold mb-2">Manage Wallet</h2>
                 {isConnected ? (<Button onClick={() => disconnect()} className="w-full">Disconnect {truncateAddress(address!)}</Button>) : (<Button onClick={() => connect({ connector: connectors[0] })} className="w-full">Connect Wallet</Button>)}
              </div>
            )}
          </>
        )}
        {!selectedTalent && <Footer activeTab={activeTab} setActiveTab={setActiveTab} showWallet={USE_WALLET} />}
      </div>
    </div>
  );
}
