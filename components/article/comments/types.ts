import type { User } from '@supabase/supabase-js'

{/* 未登录用户可查看的最大评论数 */}
export const MAX_COMMENTS_WITHOUT_LOGIN = 3

{/* 评论数据接口 */}
export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  created_at: string
  likes: number
  liked: boolean
  replies?: Comment[]
}

{/* CommentPanel Props 接口 */}
export interface CommentPanelProps {
  articleId: string
  initialComments: Comment[]
  initialTotalCount?: number
  initialHasMore?: boolean
  currentUser: User | null
}

{/* CommentCard Props 接口 */}
export interface CommentCardProps {
  comment: Comment
  onLike: (commentId: string) => void
  currentUser: User | null
}

{/* CommentList Props 接口 */}
export interface CommentListProps {
  comments: Comment[]
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  currentUser: User | null
}

{/* LoginPrompt Props 接口 */}
export interface LoginPromptProps {
  hiddenCount: number
}

{/* CommentForm Props 接口 */}
export interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>
  currentUser: User | null
  disabled?: boolean
}
