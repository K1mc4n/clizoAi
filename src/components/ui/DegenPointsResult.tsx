// src/components/ui/DegenPointsResult.tsx

// Tipe data ini sesuai dengan respons dari API Degen.tips
export interface DegenPointsData {
  totalPoints: number;
  tipPoints: number;
  lpPoints: number;
  channelPoints: { [key: string]: number };
}

interface DegenPointsResultProps {
  data: DegenPointsData;
  query: string;
}

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

export const DegenPointsResult = ({ data, query }: DegenPointsResultProps) => {
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
};
