// src/components/ui/DegenPointsResult.tsx

export interface DegenPointsData {
  totalPoints: number;
  tipPoints: number;
  lpPoints: number;
  channelPoints: { [key: string]: number };
}

// Sekarang props ini bisa menerima data atau error
interface DegenPointsResultProps {
  data?: DegenPointsData;
  error?: string;
  query: string;
}

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

export const DegenPointsResult = ({ data, error, query }: DegenPointsResultProps) => {
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto mt-6 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-lg border border-red-200 dark:border-red-700 animate-fade-in text-center">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Could Not Find Data</h2>
        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
        <p className="mt-4 text-xs text-red-500 dark:text-red-500">
          This can happen if the user hasn't received Degen tips or is not eligible for the airdrop.
        </p>
      </div>
    );
  }

  if (data) {
    return (
      <div className="w-full max-w-md mx-auto mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700 animate-fade-in">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Degen Points for</h2>
        <p className="text-xl font-bold text-purple-600 dark:text-purple-400 break-all">{query}</p>

        <div className="my-6 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">Total Points</p>
          <p className="text-5xl font-bold text-gray-900 dark:text-white">{formatNumber(data.totalPoints)}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Points from Tips</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(data.tipPoints)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Points from Liquidity</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(data.lpPoints)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Points from Channels</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatNumber(Object.values(data.channelPoints || {}).reduce((a, b) => a + b, 0))}</span>
          </div>
        </div>
         <div className="text-center mt-6">
            <a href={`https://www.degen.tips/airdrop2/season3/points?address=${query}`} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-500 hover:underline">
              View full details on degen.tips
            </a>
        </div>
      </div>
    );
  }

  return null; // Tidak menampilkan apa-apa jika tidak ada data atau error
};
