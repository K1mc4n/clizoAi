// src/components/ui/MiniAppCard.tsx

import { MiniApp } from '~/lib/miniAppsData';
import { Button } from './Button';

interface MiniAppCardProps {
  app: MiniApp;
  onLaunch: (url: string) => void;
}

export const MiniAppCard = ({ app, onLaunch }: MiniAppCardProps) => {
  return (
    <div className="flex flex-col justify-between w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-3 border border-gray-200 dark:border-gray-700">
      <div>
        <div className="p-4 flex items-start space-x-4">
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={app.iconUrl}
            alt={`Icon for ${app.name}`}
          />
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {app.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="px-4 text-gray-700 dark:text-gray-300 text-sm">
          {app.description}
        </p>
      </div>
      <div className="p-4 mt-2">
        <Button onClick={() => onLaunch(app.url)} className="w-full">
          Launch App
        </Button>
      </div>
    </div>
  );
};
