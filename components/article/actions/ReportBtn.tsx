'use client'

/**
 * 举报按钮组件
 * @module components/article/ReportBtn
 * @description 文章举报功能入口按钮（空壳实现）
 */

import { Flag } from 'lucide-react'
import { useState } from 'react'
import type { ReportBtnProps } from '@/types'
import { ReportMdl } from './ReportMdl'

/**
 * 举报按钮组件
 *
 * @param {ReportBtnProps} props - 组件属性
 * @returns {JSX.Element} 举报按钮组件
 *
 * @description
 * 举报功能入口按钮
 *
 * 后续功能：
 * - 点击弹出举报弹窗
 * - 未登录用户提示登录
 */
export function ReportBtn({ articleId, authorId, currentUser }: ReportBtnProps) {
  const [showModal, setShowModal] = useState(false)

  /**
   * 处理点击举报
   */
  const handleClick = () => {
    if (!currentUser) {
      return
    }
    setShowModal(true)
  }

  return (
    <>
      {/* 举报按钮 */}
      <div
        className="douyin-action-btn report-btn"
        onClick={handleClick}
        title="举报"
      >
        <Flag className="douyin-icon" />
        <span className="douyin-count">举报</span>
      </div>

      {/* 举报弹窗 */}
      {showModal && (
        <ReportMdl
          articleId={articleId}
          authorId={authorId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
