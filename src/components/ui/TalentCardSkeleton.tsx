export const TalentCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700">
      <div className="animate-pulse flex items-center p-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <div className="animate-pulse px-4 pb-4">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    </div>
  );
};
