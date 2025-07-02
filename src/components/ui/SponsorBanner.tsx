// src/components/ui/SponsorBanner.tsx

import { ExternalLink } from 'lucide-react';
import React from 'react';

// Mendefinisikan tipe untuk objek sponsor agar lebih rapi
interface Sponsor {
  name: string;
  tagline: string;
  url: string;
  logoElement: React.ReactNode;
}

// Membuat komponen kecil untuk satu kartu sponsor
const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => (
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
);

export const SponsorBanner = () => {
  // Array yang berisi kedua sponsor
  const sponsors: Sponsor[] = [
    {
      name: 'seconds.money',
      tagline: 'The social wallet for onchain creators.',
      url: 'https://seconds.money/',
      logoElement: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
          S
        </div>
      )
    },
    {
      name: 'poidh',
      tagline: "poidh: \"pics or it didn't happen\"",
      url: 'https://poidh.xyz/',
      logoElement: (
        <img 
          src="/152807131.png" 
          alt="poidh logo"
          className="h-12 w-12 rounded-lg object-cover"
        />
      )
    }
  ];

  return (
    // Melakukan iterasi (map) pada array sponsor dan merender setiap kartu
    // Margin bawah (mb-6) telah dihapus dari sini
    <div className="space-y-4">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.name} sponsor={sponsor} />
      ))}
    </div>
  );
};
