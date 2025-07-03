// src/components/ui/MiniAppCard.tsx

// Properti dan ikon bookmark telah dihapus
import { MiniApp } from '~/lib/miniAppsData';

interface MiniAppCardProps {
  app: MiniApp;
  onLaunch: (url: string) => void;
}

export const MiniAppCard = ({ app, onLaunch }: MiniAppCardProps) => {
  return (
    <div 
      className="flex flex-col items-center text-center w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-2 cursor-pointer"
      onClick={() => onLaunch(app.url)}
    >
      {/* Ikon Aplikasi */}
      <img
        className="w-12 h-12 rounded-lg object-cover mb-1"
        src={app.iconUrl}
        alt={`Icon for ${app.name}`}
      />
      
      {/* Nama Aplikasi */}
      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
        {app.name}
      </p>
    </div>
  );
};
