"use client";

import React from "react";
import WagmiProvider from "~/components/providers/WagmiProvider";
import { NeynarProvider } from "@neynar/react";
import { APP_URL } from "~/lib/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  const neynarClientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!neynarClientId) {
    console.error("Neynar Client ID is not configured. Features will be limited.");
    return <WagmiProvider>{children}</WagmiProvider>;
  }
  
  return (
    <NeynarProvider
      clientId={neynarClientId}
      domain={new URL(APP_URL).hostname}
    >
      <WagmiProvider>{children}</WagmiProvider>
    </NeynarProvider>
  );
}
