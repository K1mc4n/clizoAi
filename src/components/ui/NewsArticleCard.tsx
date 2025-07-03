// src/components/ui/NewsArticleCard.tsx

import { ShareButton } from './Share';
import { APP_NAME } from '~/lib/constants';

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsArticleCardProps {
  article: Article;
}

export const NewsArticleCard = ({ article }: NewsArticleCardProps) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // PERBAIKAN: 'embeds' sekarang adalah array of strings
  const castConfig = {
    text: `Interesting read: "${article.title}"\n\nShared from ${APP_NAME}.`,
    embeds: [article.url] as [string], // Kirim URL sebagai string dalam array
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        {article.urlToImage && (
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-40 object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
      </a>
      <div className="p-4">
        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
          {article.source.name}
        </div>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white leading-tight hover:underline">
            {article.title}
          </h3>
        </a>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {article.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {formattedDate}
          </p>
          <ShareButton 
            buttonText="Share"
            cast={castConfig}
            className="px-3 py-1 h-auto text-sm"
          />
        </div>
      </div>
    </div>
  );
};
