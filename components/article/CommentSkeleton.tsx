export default function CommentSkeleton() {
  return (
    <div className="comments-panel">
      <div className="comments-header animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
      
      <div className="comments-list">
        {[1, 2, 3].map(i => (
          <div key={i} className="comment-item animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2 w-20" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="comment-input-area animate-pulse">
        <div className="h-12 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
