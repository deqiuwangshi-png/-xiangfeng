'use client'

import { Quote, Share2 } from 'lucide-react'

interface PhilosophyCardProps {
  quote: string
  author: string
  source?: string
  onShare?: () => void
  className?: string
}

export function PhilosophyCard({
  quote,
  author,
  source,
  onShare,
  className = ''
}: PhilosophyCardProps) {
  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      if (navigator.share) {
        navigator.share({
          title: '分享感悟',
          text: quote,
        })
      } else {
        navigator.clipboard.writeText(quote)
        alert('已复制到剪贴板')
      }
    }
  }

  return (
    <div className={`philosophy-card rounded-2xl p-8 relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-xf-primary/40 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="philosophy-text text-2xl font-serif text-xf-accent font-medium leading-relaxed mb-6">
              {quote}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-xf-primary italic">
                —— {author}
                {source && ` · ${source}`}
              </p>
              <button
                onClick={handleShare}
                className="text-xs px-4 py-2 bg-white/50 hover:bg-white/80 text-xf-primary rounded-full border border-xf-bg/60 transition-all active:scale-95"
                aria-label="分享感悟"
              >
                <Share2 className="w-3 h-3 inline mr-1" />
                分享感悟
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
