// src/lib/staticData.ts
import { type TalentProfile } from '~/components/ui/TalentCard';

// Array ini diisi dengan data contoh agar aplikasi dapat menampilkan konten.
// Ini adalah "sumber kebenaran" data selama API berbayar tidak digunakan.
export const staticTalentData: TalentProfile[] = [
  {
    username: 'dwr',
    name: 'Dan Romero',
    headline: 'Co-founder of Farcaster. Building a sufficiently decentralized social network.',
    profile_picture_url: 'https://i.imgur.com/sB7914m.jpg',
    wallet_address: '0x63941e17A3E261130392b8293c66a4B945345712',
    fid: 2,
    fid_active_tier_name: 'active',
    followers: 250123,
    casts: 1200,
    engagement: 45000,
    top_channels: ['farcaster', 'warpcast', 'degen'],
    top_domains: ['warpcast.com', 'farcaster.xyz'],
    total_transactions: 150,
  },
  {
    username: 'v',
    name: 'vitalik.eth',
    headline: 'Builder of things. Creator of Ethereum.',
    profile_picture_url: 'https://i.imgur.com/Ky1BvjX.jpg',
    wallet_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    fid: 5650,
    fid_active_tier_name: 'active',
    followers: 180500,
    casts: 500,
    engagement: 95000,
    top_channels: ['ethereum', 'crypto', 'research'],
    top_domains: ['vitalik.ca'],
    total_transactions: 300,
  },
  {
    username: 'gavi',
    name: 'Gavi',
    headline: 'Building discovery tools for Farcaster. Founder of this app.',
    profile_picture_url: 'https://i.imgur.com/4kQ9a2m.png',
    wallet_address: '0x2A31a74213921D41525b65a58232D45064a3565F', // Alamat contoh
    fid: 1107084,
    fid_active_tier_name: 'active',
    followers: 1200,
    casts: 300,
    engagement: 5000,
    top_channels: ['neynar', 'dev', 'web3'],
    top_domains: ['github.com'],
    total_transactions: 25,
  }
];
