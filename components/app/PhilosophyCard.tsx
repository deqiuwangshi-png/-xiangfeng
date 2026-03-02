'use client'

import { Quote, Share2 } from 'lucide-react'

/**
 * PhilosophyCard组件属性接口
 * @interface PhilosophyCardProps
 */
interface PhilosophyCardProps {
  /** 引用文本内容 */
  quote: string
  /** 作者名称 */
  author: string
  /** 来源（可选） */
  source?: string
  /** 分享回调函数（可选） */
  onShare?: () => void
  /** 自定义类名（可选） */
  className?: string
}

/**
 * 哲学感悟卡片组件
 * @description 展示每日哲学引文，支持分享功能
 * @param {PhilosophyCardProps} props - 组件属性
 * @returns {JSX.Element} 哲学卡片组件
 */
export function PhilosophyCard({
  quote,
  author,
  source,
  onShare,
  className = ''
}: PhilosophyCardProps) {
  /**
   * 处理分享操作
   * @description 优先使用传入的onShare回调，否则使用Web Share API或剪贴板
   */
  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: '分享感悟',
          text: quote,
        })
      } else {
        await navigator.clipboard.writeText(quote)
        alert('已复制到剪贴板')
      }
    } catch (error) {
      // 用户取消分享或分享失败，静默处理
      console.log('分享操作已取消或失败')
    }
  }

  return (
    <div className={`philosophy-card rounded-2xl p-8 relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-xf-primary/40 shrink-0 mt-1" />
          <div className="flex-1">
            {/* LCP关键元素：使用font-serif确保字体优先加载 */}
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
