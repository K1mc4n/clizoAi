// src/app/app/page.tsx

"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";
import AppLoading from "~/components/AppLoading";

// PERBAIKAN: Tambahkan baris ini untuk mencegah prerendering saat build
export const dynamic = 'force-dynamic';

const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false,
  loading: () => <AppLoading />, 
});

export default function AppPage() {
  return <Demo title={APP_NAME} />;
}
