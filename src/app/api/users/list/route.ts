// src/app/api/users/list/route.ts

import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { NextResponse, NextRequest } from 'next/server';
import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2';

// Definisikan tipe data yang dibutuhkan oleh komponen frontend Anda (TalentCard)
export interface TalentProfile {
  username: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  wallet_address: string;
  fid: number;
  fid_active_tier_name: string;
  followers: number;
  casts: number;
  engagement: number;
  top_channels: string[];
  top_domains: string[];
  total_transactions: number;
}


// --- KONFIGURASI ---
// FID yang akan diprioritaskan di urutan teratas
const PINNED_FIDS = [250575, 1107084]; 
const USER_LIMIT = 100; // Batas total pengguna yang akan ditampilkan

// Cache hasil dari endpoint ini selama 1 jam untuk menjaga kecepatan dan menghemat panggilan API
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Neynar API Key.' }, { status: 500 });
  }

  try {
    const neynar = new NeynarAPIClient({ apiKey });

    // 1. Ambil data untuk pengguna yang di-pin secara spesifik
    const { users: pinnedUsers } = await neynar.fetchBulkUsers({ fids: PINNED_FIDS });

    // 2. Ambil daftar pengguna dengan "Power Badge" (proxy untuk pengguna top)
    const { users: powerBadgeUsers } = await neynar.fetchPowerBadgeUsers();

    // 3. Gabungkan daftar dan hapus duplikat, dengan memastikan pengguna yang di-pin selalu di depan
    const allUsersMap = new Map<number, User>();

    // Tambahkan pengguna yang di-pin terlebih dahulu untuk menjaga urutan
    pinnedUsers.forEach(user => allUsersMap.set(user.fid, user));

    // Tambahkan pengguna Power Badge, hindari duplikat
    powerBadgeUsers.forEach(user => {
      if (!allUsersMap.has(user.fid)) {
        allUsersMap.set(user.fid, user);
      }
    });

    // Ambil 100 pengguna pertama dari daftar yang sudah digabungkan
    const top100Users = Array.from(allUsersMap.values()).slice(0, USER_LIMIT);

    // 4. Format data sesuai dengan tipe 'TalentProfile' yang dibutuhkan oleh frontend Anda
    const finalTalents: TalentProfile[] = top100Users.map(user => ({
      username: user.username,
      name: user.display_name || user.username,
      headline: user.profile?.bio?.text || 'A top Farcaster user.',
      profile_picture_url: user.pfp_url || '',
      wallet_address: user.verified_addresses?.eth_addresses?.[0] || '',
      fid: user.fid,
      // Tambahkan nilai default untuk properti yang tidak tersedia langsung dari Neynar
      // Ini penting agar komponen frontend tidak error
      fid_active_tier_name: 'active',
      followers: user.follower_count ?? 0,
      casts: 0,
      engagement: 0,
      top_channels: [],
      top_domains: [],
      total_transactions: 0
    }));
    
    return NextResponse.json({ talents: finalTalents });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching from Neynar API:', errorMessage);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
