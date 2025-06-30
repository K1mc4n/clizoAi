"use client";

import { MiniAppProvider } from "@neynar/react";
// Impor WagmiProvider yang sudah disederhanakan
import WagmiProvider from "~/components/providers/WagmiProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <MiniAppProvider analyticsEnabled={true}>
        {children}
      </MiniAppProvider>
    </WagmiProvider>
  );
}
