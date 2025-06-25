// src/app/app/page.tsx

"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";

// Dynamic import diperlukan untuk komponen yang menggunakan SDK client-side
const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading App...</div>,
});

export default function AppPage() {
  return <Demo title={APP_NAME} />;
}
