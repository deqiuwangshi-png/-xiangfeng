'use client'

/**
 * 更多操作菜单组件
 * @module components/article/MoreActions
 * @description 分享、收藏、举报的聚合菜单
 */

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Share2, Bookmark, Flag, Link as LinkIcon, X } from 'lucide-react'
import type { MoreActionsProps } from '@/types'
import { ReportMdl } from './ReportMdl'
import { useArticleToast } from '@/hooks/useArticleToast'

/**
 * 更多操作菜单组件
 *
 * @param {MoreActionsProps} props - 组件属性
 * @returns {JSX.Element} 更多操作菜单组件
 */
export function MoreActions({
  articleId,
  authorId,
  currentUser,
  initialBookmarked = false,
  onBookmark,
  isBookmarkLoading = false,
}: MoreActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [shared, setShared] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { showCopySuccess, showAuthRequired } = useArticleToast()

  /**
   * 点击外部关闭菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * 处理分享
   *
   * @param {string} platform - 分享平台
   */
  const handleShare = (platform: string) => {
    const url = window.location.href

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 500)
        showCopySuccess('链接')
        break
    }
    setShowShareMenu(false)
    setIsOpen(false)
  }

  /**
   * 处理收藏
   */
  const handleBookmark = () => {
    if (!currentUser) {
      showAuthRequired('收藏文章')
      setIsOpen(false)
      return
    }
    onBookmark()
    setIsOpen(false)
  }

  /**
   * 处理举报
   */
  const handleReport = () => {
    if (!currentUser) {
      showAuthRequired('举报')
      setIsOpen(false)
      return
    }
    setShowReportModal(true)
    setIsOpen(false)
  }

  return (
    <>
      {/* 更多按钮 */}
      <div className="more-actions-container" ref={menuRef}>
        <button
          className={`douyin-action-btn more-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          title="更多"
        >
          <MoreVertical className="douyin-icon" />
          <span className="douyin-count">更多</span>
        </button>

        {/* 下拉菜单 */}
        {isOpen && (
          <div className="more-actions-menu">
            {/* 分享 */}
            <button
              className={`more-action-item ${shared ? 'shared' : ''}`}
              onClick={() => setShowShareMenu(true)}
            >
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>

            {/* 收藏 */}
            <button
              className={`more-action-item ${initialBookmarked ? 'bookmarked' : ''} ${isBookmarkLoading ? 'loading' : ''}`}
              onClick={handleBookmark}
              disabled={isBookmarkLoading}
            >
              <Bookmark className="w-4 h-4" />
              <span>{initialBookmarked ? '已收藏' : '收藏'}</span>
            </button>

            {/* 举报 */}
            <button
              className="more-action-item report"
              onClick={handleReport}
            >
              <Flag className="w-4 h-4" />
              <span>举报</span>
            </button>
          </div>
        )}
      </div>

      {/* 分享弹窗 */}
      {showShareMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowShareMenu(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowShareMenu(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-medium text-center text-gray-900 mb-6">
              分享到
            </h3>
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <span className="text-sm text-gray-600">微信好友</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xl">📢</span>
                </div>
                <span className="text-sm text-gray-600">微博</span>
              </div>
              <button
                className="flex flex-col items-center gap-2 hover:opacity-80 transition"
                onClick={() => handleShare('copy')}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm text-gray-600">复制链接</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 举报弹窗 */}
      {showReportModal && (
        <ReportMdl
          articleId={articleId}
          authorId={authorId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  )
}
