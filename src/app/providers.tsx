// src/app/providers.tsx
"use client";

import React from "react";

// Versi Provider yang disederhanakan untuk debugging.
// Ini akan menonaktifkan Wagmi dan Neynar sementara.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
