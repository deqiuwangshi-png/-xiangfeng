'use client'

interface DraftsHeaderProps {
  draftCount: number
  onClearAllDrafts: () => void
  onNewDraft: () => void
}

export function DraftsHeader({
  draftCount,
  onClearAllDrafts,
  onNewDraft,
}: DraftsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-xf-primary bg-xf-subtle px-3 py-1.5 rounded-lg">
              草稿管理
            </div>
            <span className="text-sm text-xf-medium ml-2">
              {draftCount} 篇草稿
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAllDrafts}
              className="text-sm text-xf-danger hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">清空草稿</span>
            </button>
            <button
              onClick={onNewDraft}
              className="bg-xf-primary text-white px-4 py-1.5 rounded-lg hover:bg-xf-accent transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>新建草稿</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
