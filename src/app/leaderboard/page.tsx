// src/app/leaderboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { type MinterLeaderboardUser } from '../api/leaderboard/route';
import { ExternalLink } from 'lucide-react';

const LeaderboardRow = ({ user, rank }: { user: MinterLeaderboardUser; rank: number }) => {
  const displayName = user.farcaster_handle.match(/>(.*?)</)?.[1] || user.farcaster_handle;
  const isLink = user.farcaster_handle.startsWith('<a');

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-4 px-2 text-center font-medium text-gray-500">{rank}</td>
      <td className="py-4 px-2">
        <div className="flex items-center space-x-3">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
          {isLink && (
              <a href={`https://warpcast.com/${displayName}`} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700">
                <ExternalLink className="w-4 h-4" />
              </a>
          )}
        </div>
      </td>
      <td className="py-4 px-2 text-center font-semibold text-purple-600 dark:text-purple-400">
        {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(user.total_minted)}
      </td>
      <td className="py-4 px-2 text-center text-gray-600 dark:text-gray-400">
        {user.mint_tx_count}
      </td>
    </tr>
  );
};

const SkeletonRow = () => (
  <tr className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
    <td className="py-4 px-2"><div className="h-5 w-5 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div></td>
    <td className="py-4 px-2"><div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div></td>
    <td className="py-4 px-2"><div className="h-5 w-16 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div></td>
    <td className="py-4 px-2"><div className="h-5 w-10 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div></td>
  </tr>
);

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<MinterLeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();

        if (!response.ok) {
          // Menangkap pesan error dari API backend
          throw new Error(data.error || 'Failed to fetch leaderboard data.');
        }

        setLeaderboard(data.leaderboard || []);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <div className="mx-auto py-2 px-4 pb-20 max-w-2xl">
        <Header />
        <h1 className="text-2xl font-bold text-center my-4">Top Minters Leaderboard</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase">
              <tr>
                <th scope="col" className="py-3 px-2 text-center">#</th>
                <th scope="col" className="py-3 px-2">User</th>
                <th scope="col" className="py-3 px-2 text-center">Total Minted</th>
                <th scope="col" className="py-3 px-2 text-center">Mint Count</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
              {!isLoading && !error && leaderboard.map((user, index) => (
                <LeaderboardRow key={user.fid || index} user={user} rank={index + 1} />
              ))}
            </tbody>
          </table>
          {!isLoading && error && (
            <div className="text-center py-10 px-4 text-red-500">
              <p className="font-bold">Could not load data.</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && leaderboard.length === 0 && (
            <div className="text-center py-10 text-gray-500">No data available.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
