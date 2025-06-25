import { Star } from 'lucide-react';

export interface TalentProfile {
  username: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  wallet_address: string;
}

interface TalentCardProps {
  talent: TalentProfile;
  onClick: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isLoggedIn: boolean;
}

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
      <div className="flex items-center p-4">
        <img
          className="w-16 h-16 rounded-full object-cover mr-4"
          src={talent.profile_picture_url || '/default-avatar.png'}
          alt={`Profile of ${talent.name}`}
        />
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {talent.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{talent.username}
          </p>
        </div>
        {isLoggedIn && (
          <button onClick={handleBookmarkClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2">
            <Star className={`w-5 h-5 transition-colors ${isBookmarked ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          </button>
        )}
      </div>
      <div className="px-4 pb-4">
        <p className="text-gray-700 dark:text-gray-300 truncate">{talent.headline}</p>
      </div>
    </div>
  );
};