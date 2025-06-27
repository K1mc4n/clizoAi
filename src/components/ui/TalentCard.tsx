// src/components/ui/TalentCard.tsx

import { Star } from 'lucide-react';

// Perbarui interface ini agar sesuai dengan data dari kueri Dune
export interface TalentProfile {
  username: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  wallet_address: string;
  fid: number;
  
  // Data baru dari Dune
  fid_active_tier_name: string;
  followers: number;
  casts: number;
  engagement: number;
  top_channels: string[];
  top_domains: string[];
  total_transactions: number;
}

interface TalentCardProps {
  talent: TalentProfile;
  onClick: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isLoggedIn: boolean;
}

// Perbarui komponen untuk menampilkan data baru
export const TalentCard = ({ talent, onClick, isBookmarked, onToggleBookmark, isLoggedIn }: TalentCardProps) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark();
  };

  return (
    <div 
      className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start p-4">
        <img
          className="w-16 h-16 rounded-full object-cover mr-4"
          src={talent.profile_picture_url || '/default-avatar.png'}
          alt={`Profile of ${talent.name}`}
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {talent.name}
            </h3>
            {talent.fid_active_tier_name && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                {talent.fid_active_tier_name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{talent.username}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            {talent.followers?.toLocaleString() ?? 0} Followers
          </p>
        </div>
        {isLoggedIn && (
          <button onClick={handleBookmarkClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2 flex-shrink-0">
            <Star className={`w-5 h-5 transition-colors ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          </button>
        )}
      </div>
      <div className="px-4 pb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm truncate">{talent.headline}</p>
      </div>
    </div>
  );
};
