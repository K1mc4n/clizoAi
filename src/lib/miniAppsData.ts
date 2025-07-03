// src/lib/miniAppsData.ts

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  url: string; // URL untuk meluncurkan Mini App
  tags: string[];
}

// Ini adalah daftar aplikasi Anda. Anda bisa menambah, mengubah, atau menghapus isinya.
export const miniAppsData: MiniApp[] = [
  {
    id: 'buidl',
    name: 'Buidl',
    description: 'Invest in your favorite Farcaster builders and earn rewards.',
    iconUrl: 'https://i.imgur.com/g91e5y5.jpeg',
    url: 'https://buidl.so',
    tags: ['SocialFi', 'Investing'],
  },
  {
    id: 'fantasy-top',
    name: 'Fantasy Top',
    description: 'The crypto fantasy game for Crypto Twitter influencers on Blast.',
    iconUrl: 'https://d31h136f621G5c.cloudfront.net/images/games/fantasy-top.png',
    url: 'https://www.fantasy.top/',
    tags: ['GameFi', 'Social'],
  },
  {
    id: 'unlonely',
    name: 'Unlonely',
    description: 'A Web3 streaming platform with interactive and token-gated features.',
    iconUrl: 'https://i.seadn.io/s/raw/files/dd483ada345157442a1215448744b63e.png?auto=format&dpr=1&w=1000',
    url: 'https://unlonely.app/',
    tags: ['Streaming', 'Video'],
  },
  {
    id: 'base-paint',
    name: 'Base Paint',
    description: 'A collaborative on-chain pixel art canvas on the Base network.',
    iconUrl: 'https://pbs.twimg.com/profile_images/1762193278855909376/xR3i51Vn_400x400.jpg',
    url: 'https://basepaint.xyz/',
    tags: ['Art', 'On-chain'],
  },
];
