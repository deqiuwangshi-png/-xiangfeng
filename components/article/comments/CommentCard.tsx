import { formatDistanceToNow } from '@/lib/utils/date'
import { UserAvatar } from '@/components/ui'
import { escapeHtml } from '@/lib/utils/purify'
import { CommentCardActions } from './CommentCardActions'
import { VerifyBadge } from '@/components/user/VerifyBadge'
import type { CommentCardProps } from './types'

/**
 * 单条评论卡片组件 - 服务端组件 + 客户端交互
 * 内容在服务端渲染
 * 点赞、删除等交互由客户端组件处理
 *
 * @param comment - 评论数据
 * @param onLike - 点赞回调
 * @param onDelete - 删除回调
 * @param currentUser - 当前用户
 * @returns 评论卡片JSX
 *
 * @security
 * - 所有用户生成内容（作者名、评论内容）都经过 escapeHtml 转义
 * - 防止 XSS 攻击，确保恶意脚本不会被执行
 */
export function CommentCard({ comment, onLike, onDelete, currentUser }: CommentCardProps) {
  // 对用户生成内容进行 HTML 转义，防止 XSS 攻击
  const safeAuthorName = escapeHtml(comment.author.name)
  const safeContent = escapeHtml(comment.content)

  // 获取作者角色，默认为 user
  const authorRole = comment.author.role || 'user'

  return (
    <div className="comment-item">
      {/* 头像区域 */}
      <div className="comment-avatar relative">
        <VerifyBadge role={authorRole}>
          <UserAvatar
            name={comment.author.name}
            userId={comment.author.id}
            avatarUrl={comment.author.avatar}
            size="sm"
          />
        </VerifyBadge>
      </div>

      {/* 内容区域：包含作者信息、评论文字和操作按钮 */}
      <div className="comment-content">
        {/* 作者和时间 */}
        <div className="comment-header">
          <span className="comment-author">{safeAuthorName}</span>
          <span className="comment-time">{formatDistanceToNow(comment.created_at)}</span>
        </div>

        {/* 评论文字 */}
        <p className="comment-text">{safeContent}</p>

        {/* 操作按钮：点赞、回复、删除 */}
        <CommentCardActions
          comment={comment}
          currentUser={currentUser}
          onLike={onLike}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
