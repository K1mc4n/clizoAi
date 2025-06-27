// src/components/AppLoading.tsx

import { Header } from "~/components/ui/Header";
import { TalentCardSkeleton } from "~/components/ui/TalentCardSkeleton";
import { APP_NAME } from "~/lib/constants";

/**
 * Komponen ini adalah "App Shell" atau kerangka UI.
 * Ini ditampilkan segera saat pengguna membuka Mini App,
 * memberikan kesan loading yang cepat sebelum komponen interaktif siap.
 */
export default function AppLoading() {
  return (
    <div className="mx-auto py-2 px-4 pb-20">
      {/* Header statis agar pengguna langsung melihat bagian atas aplikasi */}
      <Header />
      <h1 className="text-2xl font-bold text-center mb-4">{APP_NAME}</h1>
      
      {/* Skeleton untuk area pencarian */}
      <div className="px-2 mb-4">
        <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Tampilkan beberapa skeleton card untuk mengisi ruang konten */}
      <div>
        <TalentCardSkeleton />
        <TalentCardSkeleton />
        <TalentCardSkeleton />
        <TalentCardSkeleton />
      </div>

      {/* Footer tidak perlu ditampilkan di sini karena ia adalah bagian dari UI utama yang dinamis */}
    </div>
  );
}
