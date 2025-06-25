/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// --- BAGIAN IMPORT (DENGAN TAMBAHAN) ---
import { useCallback, useEffect, useMemo, useState } from "react";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";
import { useAccount, useSendTransaction, useSignMessage, useSignTypedData, useWaitForTransactionReceipt, useDisconnect, useConnect, useSwitchChain, useChainId } from "wagmi";
import { useConnection as useSolanaConnection, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useHasSolanaProvider } from "./providers/SafeFarcasterSolanaProvider";
import { ShareButton } from "./ui/Share";
import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, degen, mainnet, optimism, unichain } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import { useSession } from "next-auth/react";
import { useMiniApp } from "@neynar/react";
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { USE_WALLET, APP_NAME } from "~/lib/constants";

// --- IMPORT BARU KITA ---
import { TalentCard, type TalentProfile } from "./ui/TalentCard";

// Tipe Tab tetap sama
export type Tab = 'home' | 'actions' | 'context' | 'wallet';

interface NeynarUser {
  fid: number;
  score: number;
}

export default function Demo(
  { title }: { title?: string } = { title: "Discovery Talent Web3" } // Ganti judul default
) {
  // --- BAGIAN STATE (DENGAN TAMBAHAN) ---
  const { isSDKLoaded, context, added, notificationDetails, actions } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);

  // --- STATE BARU UNTUK APLIKASI KITA ---
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoadingTalents, setIsLoadingTalents] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // --- BAGIAN USEEFFECT (DENGAN TAMBAHAN) ---
  useEffect(() => {
    // Fetch Neynar user (logika ini bagus, kita pertahankan)
    const fetchNeynarUserObject = async () => {
      if (context?.user?.fid) {
        try {
          const response = await fetch(`/api/users?fids=${context.user.fid}`);
          const data = await response.json();
          if (data.users?.[0]) {
            setNeynarUser(data.users[0]);
          }
        } catch (error) {
          console.error('Failed to fetch Neynar user object:', error);
        }
      }
    };
    fetchNeynarUserObject();
  }, [context?.user?.fid]);

  // --- USEEFFECT BARU UNTUK MENGAMBIL DATA TALENTA ---
  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoadingTalents(true);
      setFetchError(null);
      try {
        const response = await fetch('/api/talent/list');
        const data = await response.json();
        if (response.ok) {
          setTalents(data.talents || []);
        } else {
          throw new Error(data.error || 'Failed to fetch talents');
        }
      } catch (error: any) {
        setFetchError(error.message);
        console.error(error);
      } finally {
        setIsLoadingTalents(false);
      }
    };
    
    fetchTalents();
  }, []); // <-- Dijalankan sekali saat komponen dimuat

  // --- Sisa hooks dan fungsi (tidak perlu diubah, bisa kita biarkan) ---
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  // ... (semua fungsi lain seperti sendTx, signTyped, dll. kita biarkan saja)

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading SDK...</div>;
  }

  // --- BAGIAN RENDER / JSX ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto py-2 px-4 pb-20">
        <Header neynarUser={neynarUser} />

        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        {/* --- INI BAGIAN UTAMA YANG KITA UBAH --- */}
        {activeTab === 'home' && (
          <div className="px-2">
            {isLoadingTalents && (
              <div className="text-center py-10">
                <p>Discovering amazing talents...</p>
              </div>
            )}
            {fetchError && (
              <div className="text-center py-10 text-red-500">
                <p>Oops! Could not fetch talents.</p>
                <p className="text-sm">{fetchError}</p>
              </div>
            )}
            {!isLoadingTalents && !fetchError && (
              <div>
                {talents.map((talent) => (
                  <TalentCard key={talent.username} talent={talent} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 'Actions' masih ada, bisa kita gunakan nanti */}
        {activeTab === 'actions' && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">App Actions</h2>
            <ShareButton 
              buttonText="Share This App"
              cast={{
                text: "Discover awesome Web3 talents on this mini-app! 🚀",
                embeds: [`${process.env.NEXT_PUBLIC_URL}`]
              }}
              className="w-full"
            />
            <Button onClick={actions.close} className="w-full">Close Mini App</Button>
            {/* Sisanya bisa disembunyikan jika tidak relevan */}
          </div>
        )}

        {/* Tab 'Context' untuk debug */}
        {activeTab === 'context' && (
          <div className="mx-6">
            <h2 className="text-lg font-semibold mb-2">Context (for debug)</h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words w-full">
                {JSON.stringify(context, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 'Wallet' tetap sama, sangat berguna */}
        {activeTab === 'wallet' && USE_WALLET && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
             <h2 className="text-lg font-semibold mb-2">Manage Wallet</h2>
             {/* KODE WALLET DARI FILE ASLI ANDA ADA DI SINI. TIDAK PERLU DIUBAH. */}
             {/* ... (Contoh: Tombol Connect/Disconnect, dll) ... */}
             {isConnected ? (
              <Button onClick={() => disconnect()} className="w-full">
                Disconnect {truncateAddress(address!)}
              </Button>
            ) : (
              <Button onClick={() => connect({ connector: connectors[0] })} className="w-full">
                Connect Wallet
              </Button>
            )}
             {/* ... sisa fungsi wallet lainnya ... */}
          </div>
        )}

        <Footer activeTab={activeTab} setActiveTab={setActiveTab} showWallet={USE_WALLET} />
      </div>
    </div>
  );
}

// Komponen helper lainnya seperti SignEvmMessage, SendEth, dll. bisa dibiarkan di bawah
// atau dipindahkan ke file terpisah jika Anda ingin merapikan. Untuk saat ini, biarkan saja.
// ... (Kode untuk SignEvmMessage, SendEth, SignIn, dll.)
