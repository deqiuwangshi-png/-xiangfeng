export default function LoadingArticlePage() {
  return (
    <div className="main-container pt-14">
      <div className="article-container animate-pulse">
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-6" />
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
