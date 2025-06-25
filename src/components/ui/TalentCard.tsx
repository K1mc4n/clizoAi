// src/components/ui/TalentCard.tsx

export interface TalentProfile {
  username: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  wallet_address: string;
}

interface TalentCardProps {
  talent: TalentProfile;
}

export const TalentCard = ({ talent }: TalentCardProps) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center p-4">
        <img
          className="w-16 h-16 rounded-full object-cover mr-4"
          src={talent.profile_picture_url}
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
      </div>
      <div className="px-4 pb-4">
        <p className="text-gray-700 dark:text-gray-300">{talent.headline}</p>
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
         <a 
           href={`https://beta.talentprotocol.com/u/${talent.username}`} 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-sm text-blue-500 hover:underline"
         >
           View Profile on Talent Protocol
         </a>
      </div>
    </div>
  );
};
