'use client'

import { Save, Send } from '@/components/icons'
import { cn } from '@/lib/utils'

interface EditorHeaderProps {
  onSaveDraft: () => void
  onPublish: () => void
  className?: string
}

export function EditorHeader({ onSaveDraft, onPublish, className }: EditorHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-xf-light/50", className)}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onSaveDraft}
            className="text-sm text-xf-medium hover:text-xf-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-xf-bg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">保存文章</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onPublish}
              className="bg-xf-primary text-white border-none rounded-xl px-6 py-2 font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center gap-3"
            >
              <Send className="w-4 h-4" />
              <span>发布</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
