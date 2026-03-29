/**
 * 评论组件模块统一导出
 */

export { CommentPanel } from './CommentPanel'
export { CommentList } from './CommentList'
export { CommentCard } from './CommentCard'
export { CommentForm } from './CommentForm'
export { LoginPrompt } from './LoginPrompt'

// Hooks 从 @/hooks 统一导出
export { useComments } from '@/hooks/article/useComments'
export { useCommentSubmit } from '@/hooks/article/useCommentSub'

export { getInitials } from '@/lib/utils/getInitials'

// 类型和常量从 @/types 统一导出
export type {
  Comment,
  CommentPanelProps,
  CommentCardProps,
  CommentListProps,
  LoginPromptProps,
  CommentFormProps,
} from '@/types'
export { MAX_COMMENTS_WITHOUT_LOGIN } from '@/types'
