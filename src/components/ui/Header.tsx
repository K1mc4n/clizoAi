// src/components/ui/Header.tsx
"use client";

import { useState } from "react";
import { APP_NAME } from "~/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { useMiniApp } from "@neynar/react";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

// Komponen internal yang hanya akan dirender jika ada data pengguna
function UserProfile({ user, neynarUser }: { user: any, neynarUser?: HeaderProps['neynarUser'] }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [hasClickedPfp, setHasClickedPfp] = useState(false);

  return (
    <div className="relative">
      <div 
        className="cursor-pointer"
        onClick={() => {
          setIsUserDropdownOpen(!isUserDropdownOpen);
          setHasClickedPfp(true);
        }}
      >
        {user.pfpUrl && (
          <img 
            src={user.pfpUrl} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-purple-500"
          />
        )}
      </div>
      
      {!hasClickedPfp && (
        <div className="absolute right-0 -bottom-6 text-xs text-purple-500 flex items-center justify-end gap-1 pr-2 pointer-events-none">
          <span className="text-[10px]">↑</span> Click PFP! <span className="text-[10px]">↑</span>
        </div>
      )}
      
      {isUserDropdownOpen && (
        <div className="absolute top-full right-0 z-50 w-fit mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-3 space-y-2">
            <div className="text-right">
              <h3 
                className="font-bold text-sm hover:underline cursor-pointer inline-block"
                onClick={() => sdk.actions.viewProfile({ fid: user.fid })}
              >
                {user.displayName || user.username}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                FID: {user.fid}
              </p>
              {neynarUser && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Neynar Score: {neynarUser.score}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Komponen Header utama yang sudah diamankan
export function Header({ neynarUser }: HeaderProps) {
  // Gunakan try-catch untuk menangani error jika provider tidak ditemukan
  let userContext = null;
  try {
    userContext = useMiniApp().context;
  } catch (e) {
    // Jika terjadi error (karena provider tidak ada), biarkan userContext tetap null.
    // Ini akan mencegah crash saat build.
  }
  const user = userContext?.user;

  return (
    <div className="relative">
      <div 
        className="mb-1 py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between border-[3px] border-double border-purple-500"
      >
        <div className="text-lg font-light">
          Welcome to {APP_NAME}!
        </div>
        
        {/* Bagian ini sekarang aman: hanya akan merender profil jika `user` berhasil didapatkan */}
        {user && <UserProfile user={user} neynarUser={neynarUser} />}
      </div>
    </div>
  );
}
