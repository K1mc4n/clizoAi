// src/components/ui/TalentDetailView.tsx

import { useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { base } from 'wagmi/chains';
import { TalentProfile } from './TalentCard';
import { Button } from './Button';
import { ShareButton } from './Share';
import { APP_NAME, APP_URL } from '~/lib/constants'; // <-- PERBAIKAN: Baris ini ditambahkan

interface TalentDetailViewProps {
  talent: TalentProfile;
  onBack: () => void;
  loggedInUserAddress?: string | null;
}

export const TalentDetailView = ({ talent, onBack, loggedInUserAddress }: TalentDetailViewProps) => {
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const isThisUser = loggedInUserAddress && talent.wallet_address.toLowerCase() === loggedInUserAddress.toLowerCase();
  
  const [tipStatus, setTipStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { sendTransaction, isPending } = useSendTransaction();

  const handleSendTip = () => {
    if (!isConnected) {
      alert("Please connect your wallet first to send a tip.");
      return;
    }
    if (!talent.wallet_address) {
      alert("This user doesn't have a verified wallet address to receive tips.");
      return;
    }
    switchChain({ chainId: base.id }, {
      onSuccess: () => {
        setTipStatus('pending');
        sendTransaction({
          to: talent.wallet_address as `0x${string}`,
          value: parseEther('0.001'),
        }, {
          onSuccess: () => {
            setTipStatus('success');
            setTimeout(() => setTipStatus('idle'), 3000);
          },
          onError: () => {
            setTipStatus('error');
            setTimeout(() => setTipStatus('idle'), 3000);
          },
        });
      },
      onError: () => {
        alert(`Please switch to the Base network in your wallet to send a tip.`);
      }
    });
  };

  const getButtonText = () => {
    if (isPending || tipStatus === 'pending') return 'Processing...';
    if (tipStatus === 'success') return 'Tip Sent! 🎉';
    if (tipStatus === 'error') return 'Tip Failed';
    return 'Support with 0.001 ETH on Base';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <Button onClick={onBack} variant="outline" className="w-auto px-4 mb-4">
        ← Back to List
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 text-center">
          <img
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"
            src={talent.profile_picture_url || '/default-avatar.png'}
            alt={`Profile of ${talent.name}`}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {talent.name}
            {isThisUser && <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">This is you!</span>}
          </h2>
          <p className="text-md text-gray-500 dark:text-gray-400">@{talent.username}</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">{talent.headline}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 space-y-3">
          <Button onClick={handleSendTip} disabled={isThisUser || isPending || !talent.wallet_address} className="w-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400">
            {getButtonText()}
          </Button>
          <ShareButton
            buttonText="Share This Profile"
            cast={{
              text: `Check out this Farcaster user, @${talent.username}! Check out their profile on ${APP_NAME}!`,
              embeds: [APP_URL],
            }}
            className="w-full"
          />
           <a href={`https://warpcast.com/${talent.username}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="secondary" className="w-full">View on Warpcast</Button>
           </a>
        </div>
      </div>
    </div>
  );
};
