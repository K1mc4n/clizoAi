// src/components/ui/MiniAppCard.tsx

import { Star } from 'lucide-react';
import { MiniApp } from '~/lib/miniAppsData';
import { Button } from './Button';

interface MiniAppCardProps {
  app: MiniApp;
  onLaunch: (url: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isLoggedIn: boolean;
}

export const MiniAppCard = ({ app, onLaunch, isBookmarked, onToggleBookmark, isLoggedIn }: MiniAppCardProps) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark();
  };

  // --- GAYA KARTU YANG SANGAT RINGKAS ---
  return (
    <div 
      className="flex flex-col items-center text-center w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-2 cursor-pointer"
      onClick={() => onLaunch(app.url)}
    >
      {/* Tombol Bookmark di pojok kanan atas */}
      {isLoggedIn && (
        <button 
          onClick={handleBookmarkClick} 
          className="absolute top-1 right-1 p-0.5 rounded-full bg-white/70 dark:bg-black/70 hover:bg-white dark:hover:bg-black"
        >
          <Star className={`w-3 h-3 transition-colors ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
        </button>
      )}

      {/* Ikon Aplikasi */}
      <img
        className="w-12 h-12 rounded-lg object-cover mb-1"
        src={app.iconUrl}
        alt={`Icon for ${app.name}`}
      />
      
      {/* Nama Aplikasi */}
      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
        {app.name}
      </p>

      {/* Deskripsi sengaja dihilangkan agar kartu lebih kecil */}
    </div>
  );
};
