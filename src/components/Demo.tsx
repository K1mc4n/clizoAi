// src/components/Demo.tsx (VERSI FINAL YANG DIPERBARUI)

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useSession } from "next-auth/react";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { Button } from "./ui/Button";
import { Input } from "./ui/input"; // Kita butuh komponen Input dari shadcn
import { USE_WALLET } from "~/lib/constants";

// Import komponen baru kita
import { TalentCard, type TalentProfile } from "./ui/TalentCard";
import { TalentDetailView } from "./ui/TalentDetailView";
import { truncateAddress } from "~/lib/truncateAddress";

export type Tab = 'home' | 'wallet'; // Sederhanakan Tab, karena 'actions' dan 'context' tidak lagi utama

interface NeynarUser {
  fid: number;
  score: number;
}

// Hook untuk debounce (mencegah API call pada setiap ketikan)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Demo() {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);

  // State untuk logika aplikasi kita
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);

  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  // Ambil data profil Farcaster
  useEffect(() => {
    const fetchNeynarUser = async () => {
      if (context?.user?.fid) {
        // ... (logika fetch user sama seperti sebelumnya)
      }
    };
    fetchNeynarUser();
  }, [context?.user?.fid]);

  // Fungsi untuk mengambil data talenta
  const fetchTalents = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/talent/list?q=${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      setTalents(data.talents || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger API call saat debounced search term berubah
  useEffect(() => {
    fetchTalents(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchTalents]);

  const handleSelectTalent = (talent: TalentProfile) => {
    setSelectedTalent(talent);
  };

  const handleBackToList = () => {
    setSelectedTalent(null);
  };

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading SDK...</div>;
  }

  // --- RENDER LOGIC ---
  return (
    <div style={{ paddingTop: context?.client.safeAreaInsets?.top ?? 0, paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0 }}>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header neynarUser={neynarUser} />

        <h1 className="text-2xl font-bold text-center mb-4">Discovery Talent Web3</h1>

        {activeTab === 'home' && (
          <div>
            {selectedTalent ? (
              // Tampilan Detail
              <TalentDetailView
                talent={selectedTalent}
                onBack={handleBackToList}
                loggedInUserAddress={context?.user?.connected_address}
              />
            ) : (
              // Tampilan Daftar & Pencarian
              <>
                <div className="px-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Search by name, skill, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {isLoading && <div className="text-center py-10">Discovering talents...</div>}
                {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}
                
                {!isLoading && !error && (
                  <div className="animate-fade-in">
                    {talents.length > 0 ? (
                      talents.map((talent) => (
                        <TalentCard 
                          key={talent.username} 
                          talent={talent} 
                          onClick={() => handleSelectTalent(talent)} 
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        No talents found for "{debouncedSearchTerm}". Try another search.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
             <h2 className="text-lg font-semibold mb-2">Manage Wallet</h2>
             {isConnected ? (
              <Button onClick={() => disconnect()} className="w-full">
                Disconnect {truncateAddress(address!)}
              </Button>
            ) : (
              <Button onClick={() => connect({ connector: connectors[0] })} className="w-full">
                Connect Wallet
              </Button>
            )}
          </div>
        )}

        <Footer activeTab={activeTab} setActiveTab={setActiveTab} showWallet={USE_WALLET} />
      </div>
    </div>
  );
}
