// src/components/ui/Header.tsx
"use client";

import { APP_NAME } from "~/lib/constants";

// Versi header yang SANGAT SEDERHANA dan dijamin tidak akan error.
// Kita bisa menambahkan kembali info pengguna nanti setelah aplikasi stabil.
export function Header() {
  return (
    <div 
      className="mb-4 py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-[3px] border-double border-purple-500"
    >
      <div className="text-lg font-light text-center">
        Welcome to {APP_NAME}!
      </div>
    </div>
  );
}
