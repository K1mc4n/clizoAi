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
  {
    id: 'buidl-app',
    name: 'Buidl',
    description: 'Invest in your favorite Farcaster builders and earn rewards.',
    iconUrl: 'https://i.imgur.com/g91e5y5.jpeg', // Imgur biasanya aman
    url: 'https://buidl.so',
    tags: ['SocialFi', 'Investing'],
  },
  {
    id: 'fantasy-top-app',
    name: 'Fantasy Top',
    description: 'The crypto fantasy game for Crypto Twitter influencers on Blast.',
    iconUrl: 'https://d31h136f621G5c.cloudfront.net/images/games/fantasy-top.png', // Cloudfront aman
    url: 'https://www.fantasy.top/',
    tags: ['GameFi', 'Social'],
  },
  {
    id: 'unlonely-app',
    name: 'Unlonely',
    description: 'A Web3 streaming platform with interactive and token-gated features.',
    iconUrl: 'https://i.seadn.io/s/raw/files/dd483ada345157442a1215448744b63e.png?auto=format&dpr=1&w=1000', // OpenSea CDN aman
    url: 'https://unlonely.app/',
    tags: ['Streaming', 'Video'],
  },
  {
    id: 'base-paint-app',
    name: 'Base Paint',
    description: 'A collaborative on-chain pixel art canvas on the Base network.',
    // --- PERBAIKAN DI SINI ---
    iconUrl: '/images/base-paint-logo.jpg', 
    url: 'https://basepaint.xyz/',
    tags: ['Art', 'On-chain'],
  },
  {
    id: 'bountycaster-app',
    name: 'Bountycaster',
    description: 'A platform for creating and discovering bounties on Farcaster.',
    // --- PERBAIKAN DI SINI ---
    iconUrl: '/images/bountycaster-logo.jpg',
    url: 'https://www.bountycaster.xyz/',
    tags: ['Bounties', 'Gigs', 'Web3'],
  },
  {
    id: 'perl-app',
    name: 'Perl',
    description: 'A peer-to-peer prediction market on Farcaster.',
    iconUrl: 'https://i.imgur.com/vHqj5jY.png', // Imgur aman
    url: 'https://perl.xyz/',
    tags: ['Predictions', 'SocialFi', 'Betting'],
  },
];
