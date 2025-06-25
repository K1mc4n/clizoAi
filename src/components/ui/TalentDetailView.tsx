// src/components/ui/TalentDetailView.tsx

import { TalentProfile } from './TalentCard';
import { Button } from './Button';
import { ShareButton } from './Share';

interface TalentDetailViewProps {
  talent: TalentProfile;
  onBack: () => void; // Fungsi untuk kembali ke daftar
  loggedInUserAddress?: string; // Alamat wallet pengguna yang login
}

export const TalentDetailView = ({ talent, onBack, loggedInUserAddress }: TalentDetailViewProps) => {
  const isThisUser = loggedInUserAddress && talent.wallet_address.toLowerCase() === loggedInUserAddress.toLowerCase();

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <Button onClick={onBack} variant="outline" className="mb-4">
        ← Back to List
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 text-center">
          <img
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"
            src={talent.profile_picture_url}
            alt={`Profile of ${talent.name}`}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {talent.name}
            {isThisUser && (
              <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                This is you!
              </span>
            )}
          </h2>
          <p className="text-md text-gray-500 dark:text-gray-400">
            @{talent.username}
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
            {talent.headline}
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 space-y-3">
          <ShareButton
            buttonText="Share This Talent Profile"
            cast={{
              text: `Check out this awesome talent, @${talent.username} on @talentprotocol! 🚀`,
              // Kita bisa membuat URL share yang lebih canggih nanti
              embeds: [`${process.env.NEXT_PUBLIC_URL}`], 
            }}
            className="w-full"
          />
           <a 
             href={`https://beta.talentprotocol.com/u/${talent.username}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="w-full"
           >
            <Button variant="secondary" className="w-full">
              View on Talent Protocol
            </Button>
           </a>
        </div>
      </div>
    </div>
  );
};
