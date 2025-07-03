// src/components/ui/NewsArticleCard.tsx

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

  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          className="w-full h-40 object-cover"
          // Fallback jika gambar gagal dimuat
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="p-4">
        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
          {article.source.name}
        </div>
        <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white leading-tight">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {article.description}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          {formattedDate}
        </p>
      </div>
    </a>
  );
};
