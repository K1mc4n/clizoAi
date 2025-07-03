// src/app/app/page.tsx

"use client";

import dynamic from "next/dynamic"; 
import { APP_NAME } from "~/lib/constants";
import AppLoading from "~/components/AppLoading";

// Baris ini penting untuk mencegah prerendering di server
export const dynamic = 'force-dynamic';

// Memuat komponen Demo secara dinamis di sisi klien
const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false, // Pastikan tidak dirender di server
  loading: () => <AppLoading />, // Gunakan AppLoading sebagai placeholder
});

export default function AppPage() {
  return <Demo title={APP_NAME} />;
}
