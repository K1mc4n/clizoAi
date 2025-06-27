// src/app/app/page.tsx

"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";
import AppLoading from "~/components/AppLoading"; // Impor komponen loading baru

// Komponen `Demo` dimuat secara dinamis karena mengandung banyak logika client-side.
// `ssr: false` sangat penting untuk komponen yang menggunakan hook dari Farcaster SDK atau Wagmi.
const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false,
  loading: () => <AppLoading />, // Gunakan komponen skeleton loading yang baru
});

export default function AppPage() {
  return <Demo title={APP_NAME} />;
}
