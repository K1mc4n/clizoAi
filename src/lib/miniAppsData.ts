// src/lib/miniAppsData.ts

export interface MiniApp {
  id: string; 
  name: string;
  description: string;
  iconUrl: string;
  url: string; 
  tags: string[];
}

export const miniAppsData: MiniApp[] = [
  // --- SPONSOR DI POSISI TERATAS ---
  {
    id: 'poidh-app',
    name: 'poidh',
    description: "poidh: \"pics or it didn't happen\". Onchain social media.",
    // Menggunakan logo poidh yang sudah ada di proyek Anda.
    // Pastikan file '152807131.png' ada di dalam folder 'public'.
    iconUrl: '/152807131.png',
    url: 'https://poidh.xyz/',
    tags: ['Social', 'On-chain', 'Sponsored'],
  },
  {
    id: 'seconds-money-app',
    name: 'seconds.money',
    description: 'The social wallet for onchain creators and communities.',
    // Anda perlu menambahkan logo untuk seconds.money ke folder public/images
    iconUrl: '/images/seconds-money-logo.png',
    url: 'https://seconds.money/',
    tags: ['Wallet', 'Creator Tools', 'Sponsored'],
  },
  // --- DAFTAR APLIKASI LAINNYA ---
  {
    id: 'buidl-app',
    name: 'Buidl',
    description: 'Invest in your favorite Farcaster builders and earn rewards.',
    iconUrl: '/images/buidl-logo.jpeg',
    url: 'https://buidl.so',
    tags: ['SocialFi', 'Investing'],
  },
  {
    id: 'fantasy-top-app',
    name: 'Fantasy Top',
    description: 'The crypto fantasy game for Crypto Twitter influencers on Blast.',
    iconUrl: '/images/fantasy-top-logo.png',
    url: 'https://www.fantasy.top/',
    tags: ['GameFi', 'Social'],
  },
  {
    id: 'unlonely-app',
    name: 'Unlonely',
    description: 'A Web3 streaming platform with interactive and token-gated features.',
    iconUrl: '/images/unlonely-logo.png',
    url: 'https://unlonely.app/',
    tags: ['Streaming', 'Video'],
  },
  {
    id: 'base-paint-app',
    name: 'Base Paint',
    description: 'A collaborative on-chain pixel art canvas on the Base network.',
    iconUrl: '/images/base-paint-logo.jpg',
    url: 'https://basepaint.xyz/',
    tags: ['Art', 'On-chain'],
  },
  {
    id: 'bountycaster-app',
    name: 'Bountycaster',
    description: 'A platform for creating and discovering bounties on Farcaster.',
    iconUrl: '/images/bountycaster-logo.jpg',
    url: 'https://www.bountycaster.xyz/',
    tags: ['Bounties', 'Gigs', 'Web3'],
  },
  {
    id: 'perl-app',
    name: 'Perl',
    description: 'A peer-to-peer prediction market on Farcaster.',
    iconUrl: '/images/perl-logo.png',
    url: 'https://perl.xyz/',
    tags: ['Predictions', 'SocialFi', 'Betting'],
  },
  {
    id: 'zora-app',
    name: 'Zora',
    description: 'A decentralized protocol to mint, share, and collect NFTs on-chain.',
    iconUrl: '/images/zora-logo.png',
    url: 'https://zora.co',
    tags: ['NFTs', 'Art', 'Protocol'],
  },
  {
    id: 'base-app',
    name: 'Base',
    description: 'Bridge and manage assets on Base, a secure, low-cost Ethereum L2.',
    iconUrl: '/images/base-logo.png',
    url: 'https://bridge.base.org/',
    tags: ['L2', 'Bridge', 'Infrastructure'],
  },
  {
    id: 'degen-app',
    name: 'Degen',
    description: 'A community token for the Farcaster ecosystem, often used for tipping.',
    iconUrl: '/images/degen-logo.png',
    url: 'https://degen.tips/',
    tags: ['Community', 'Token', 'SocialFi'],
  }
];
