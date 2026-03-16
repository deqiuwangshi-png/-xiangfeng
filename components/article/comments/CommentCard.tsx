import { formatDistanceToNow } from '@/lib/utils/date'
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder'
import { CommentCardActions } from './CommentCardActions'
import type { CommentCardProps } from './types'

/**
 * 评论卡片内容组件 - 服务端组件
 * ✅ 纯展示内容，服务端渲染
 * ✅ 头像、作者名、评论内容等静态数据
 */
function CommentCardContent({ comment }: { comment: CommentCardProps['comment'] }) {
  return (
    <>
      <div className="comment-avatar relative">
        <AvatarPlaceholder
          name={comment.author.name}
          userId={comment.author.id}
          avatarUrl={comment.author.avatar}
          size="sm"
        />
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author.name}</span>
          <span className="comment-time">{formatDistanceToNow(comment.created_at)}</span>
        </div>

        <p className="comment-text">{comment.content}</p>
      </div>
    </>
  )
}

/**
 * 单条评论卡片组件 - 服务端组件 + 客户端交互
 * ✅ 内容在服务端渲染
 * ✅ 点赞、删除等交互由客户端组件处理
 *
 * @param comment - 评论数据
 * @param onLike - 点赞回调
 * @param onDelete - 删除回调
 * @param currentUser - 当前用户
 * @param isLiking - 是否正在点赞中
 * @returns 评论卡片JSX
 */
export function CommentCard({ comment, onLike, onDelete, currentUser, isLiking }: CommentCardProps) {
  return (
    <div className="comment-item">
      <CommentCardContent comment={comment} />
      <div className="comment-content">
        <CommentCardActions
          comment={comment}
          currentUser={currentUser}
          isLiking={isLiking ?? false}
          onLike={onLike}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
