// src/app/wallet/page.tsx

"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { USE_WALLET } from "~/lib/constants";

export default function WalletPage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors } = useConnect();
    
    return (
        <div>
            <div className="mx-auto py-2 px-4 pb-20">
                <Header />
                <h1 className="text-2xl font-bold text-center mb-6">Manage Wallet</h1>
                
                <div className="space-y-4 px-6 w-full max-w-md mx-auto">
                    {isConnected ? (
                        <>
                            <p className="text-center text-green-600 dark:text-green-400">Wallet Connected</p>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 break-all">
                                {truncateAddress(address!)}
                            </p>
                            <Button onClick={() => disconnect()} className="w-full" variant="destructive">
                                Disconnect
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-center text-gray-500">Please connect your wallet.</p>
                            <Button onClick={() => connect({ connector: connectors.find(c => c.id === 'coinbaseWallet') || connectors[0] })} className="w-full">
                                Connect Wallet
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Footer showWallet={USE_WALLET} />
        </div>
    );
}
