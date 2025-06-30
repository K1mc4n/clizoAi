// src/lib/staticData.ts
import { type TalentProfile } from '~/components/ui/TalentCard';

// Data pengguna statis untuk ditampilkan di aplikasi.
// Ini menggantikan panggilan API yang gagal.
export const staticTalentData: TalentProfile[] = [
  // Pengguna yang Anda minta
  {
    fid: 250575,
    username: 'clizo',
    name: 'Clizo AI',
    headline: 'Your personal AI assistant for Web3 talent discovery.',
    profile_picture_url: 'https://i.imgur.com/2Y02s2q.png',
    wallet_address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    followers: 10500, fid_active_tier_name: 'active', casts: 150, engagement: 98, top_channels: [], top_domains: [], total_transactions: 10,
  },
  {
    fid: 1107084,
    username: 'kem',
    name: 'Kem',
    headline: 'Product Designer exploring art and technology.',
    profile_picture_url: 'https://i.imgur.com/uF2yA3h.jpg',
    wallet_address: '0x1234567890123456789012345678901234567891',
    followers: 8800, fid_active_tier_name: 'active', casts: 450, engagement: 92, top_channels: [], top_domains: [], total_transactions: 75,
  },
  {
    fid: 1023723,
    username: 'aiv',
    name: 'AIV',
    headline: 'Building the future of onchain social experiences.',
    profile_picture_url: 'https://i.imgur.com/pwcL7gE.jpg',
    wallet_address: '0x1234567890123456789012345678901234567892',
    followers: 12345, fid_active_tier_name: 'active', casts: 780, engagement: 88, top_channels: [], top_domains: [], total_transactions: 210,
  },
  // Contoh pengguna lain yang terkenal
  {
    fid: 3,
    username: 'dwr.eth',
    name: 'Dan Romero',
    headline: 'Co-founder of Farcaster.',
    profile_picture_url: 'https://i.imgur.com/vN32iVz.jpg',
    wallet_address: '0xd7029bdea1c17493893aafe29aad69ef8842c534',
    followers: 150000, fid_active_tier_name: 'active', casts: 1200, engagement: 95, top_channels: [], top_domains: [], total_transactions: 500,
  },
  {
    fid: 2,
    username: 'v',
    name: 'vitalik.eth',
    headline: 'Creator of Ethereum.',
    profile_picture_url: 'https://i.imgur.com/K3GAlD0.jpg',
    wallet_address: '0xd8da6bf26964af9d7eeda9e038c9440e6324dc91',
    followers: 250000, fid_active_tier_name: 'active', casts: 800, engagement: 98, top_channels: [], top_domains: [], total_transactions: 1000,
  },
  // Tambahkan 95 profil lainnya untuk mencapai 100
  ...Array.from({ length: 95 }, (_, i) => ({
    fid: 10000 + i,
    username: `user${10000 + i}`,
    name: `Top User ${i + 6}`,
    headline: `Building cool things in the decentralized space. Talent #${i + 6}`,
    profile_picture_url: `https://i.pravatar.cc/150?u=${10000 + i}`,
    wallet_address: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    followers: 50000 - i * 500,
    fid_active_tier_name: 'active',
    casts: 100 + i * 5,
    engagement: 80 + (i % 15),
    top_channels: [['dev', 'memes', 'food'][i % 3]],
    top_domains: [['github.com', 'superrare.co', 'mirror.xyz'][i % 3]],
    total_transactions: 20 + i * 2,
  })),
];
