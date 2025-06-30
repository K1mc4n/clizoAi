// src/app/app/page.tsx

"use client";

// PERBAIKAN: Ganti nama impor 'dynamic' menjadi 'dynamicImport' untuk menghindari konflik
import dynamicImport from "next/dynamic"; 
import { APP_NAME } from "~/lib/constants";
import AppLoading from "~/components/AppLoading";

// Baris ini sudah benar dan harus tetap ada untuk mencegah prerendering
export const dynamic = 'force-dynamic';

// Gunakan nama baru 'dynamicImport' saat memanggil fungsi
const Demo = dynamicImport(() => import("~/components/Demo"), {
  ssr: false,
  loading: () => <AppLoading />, 
});

export default function AppPage() {
  return <Demo title={APP_NAME} />;
}
