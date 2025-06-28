// src/components/ui/SponsorBanner.tsx

import { ExternalLink } from 'lucide-react';

export const SponsorBanner = () => {
  const sponsor = {
    name: 'seconds.money',
    tagline: 'The social wallet for onchain creators.',
    url: 'https://seconds.money/',
    // Anda bisa mengganti ini dengan URL logo resmi jika ada
    logoElement: (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
        S
      </div>
    )
  };

  return (
    <div className="mb-6">
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-lg bg-gray-100 p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex items-center space-x-4">
          {sponsor.logoElement}
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Sponsored by
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {sponsor.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {sponsor.tagline}
            </p>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400" />
        </div>
      </a>
    </div>
  );
};
