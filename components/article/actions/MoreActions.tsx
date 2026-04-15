'use client'

/**
 * 更多操作菜单组件
 * @module components/article/MoreActions
 * @description 分享、收藏、举报的聚合菜单
 */

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Share2, Bookmark, Flag, Link as LinkIcon, X, MessageCircle, AtSign } from 'lucide-react'
import type { MoreActionsProps } from '@/types'
import { ReportMdl } from './ReportMdl'
import { useArticleToast } from '@/hooks/article/useArticleToast'

/**
 * 更多操作菜单组件
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
  const { showCopySuccess } = useArticleToast()

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
      setIsOpen(false)
      return
    }
    setShowReportModal(true)
    setIsOpen(false)
  }

  return (
    <>
      {/* 更多按钮 - 未登录时禁用 */}
      <div className="more-actions-container" ref={menuRef}>
        <button
          className={`douyin-action-btn more-btn ${isOpen ? 'active' : ''} ${!currentUser ? 'disabled' : ''}`}
          onClick={currentUser ? () => setIsOpen(!isOpen) : undefined}
          title={currentUser ? '更多' : '请先登录'}
          disabled={!currentUser}
          style={!currentUser ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
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
            <h3 className="text-lg font-medium text-center text-gray-800 mb-6">
              分享到
            </h3>
            <div className="flex justify-center gap-6">
              {/* 微信好友 */}
              <div className="flex flex-col items-center gap-3 opacity-40 cursor-not-allowed">
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-7 h-7 text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-500">微信好友</span>
              </div>
              {/* 微博 */}
              <div className="flex flex-col items-center gap-3 opacity-40 cursor-not-allowed">
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                  <AtSign className="w-7 h-7 text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-500">微博</span>
              </div>
              {/* 复制链接 */}
              <button
                className="group flex flex-col items-center gap-3"
                onClick={() => handleShare('copy')}
              >
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-[#84709B]/30 transition-all duration-200">
                  <LinkIcon className="w-7 h-7 text-[#84709B]" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#84709B] transition-colors">
                  {shared ? '已复制' : '复制链接'}
                </span>
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
