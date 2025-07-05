// src/app/providers.tsx

"use client";

import { MiniAppProvider } from "@neynar/react";
import WagmiProvider from "~/components/providers/WagmiProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <MiniAppProvider>
        {children}
      </MiniAppProvider>
    </WagmiProvider>
  );
}
