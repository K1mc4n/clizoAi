// src/components/ui/MiniAppCard.tsx

import { Star } from 'lucide-react';
import { MiniApp } from '~/lib/miniAppsData';
import { Button } from './Button';

// PERBAIKAN: Pastikan semua properti didefinisikan di sini.
interface MiniAppCardProps {
  app: MiniApp;
  onLaunch: (url: string) => void;
  // Properti untuk fungsionalitas bookmark
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isLoggedIn: boolean;
}

export const MiniAppCard = ({ app, onLaunch, isBookmarked, onToggleBookmark, isLoggedIn }: MiniAppCardProps) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah card di-klik saat tombol bookmark di-klik
    onToggleBookmark();
  };

  return (
    <div className="flex flex-col justify-between w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-3 border border-gray-200 dark:border-gray-700">
      <div>
        <div className="p-4 flex items-start space-x-4">
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={app.iconUrl}
            alt={`Icon for ${app.name}`}
          />
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {app.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {app.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Tombol Bookmark */}
          {isLoggedIn && (
            <button onClick={handleBookmarkClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2 flex-shrink-0">
              <Star className={`w-5 h-5 transition-colors ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
            </button>
          )}
        </div>
        <p className="px-4 text-gray-700 dark:text-gray-300 text-sm">
          {app.description}
        </p>
      </div>
      <div className="p-4 mt-2">
        <Button onClick={() => onLaunch(app.url)} className="w-full">
          Launch App
        </Button>
      </div>
    </div>
  );
};
