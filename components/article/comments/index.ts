/**
 * 评论组件模块统一导出
 */

export { CommentPanel } from './CommentPanel'
export { CommentList } from './CommentList'
export { CommentCard } from './CommentCard'
export { CommentForm } from './CommentForm'
export { LoginPrompt } from './LoginPrompt'

export { useComments } from './hooks/useComments'
export { useCommentSubmit } from './hooks/useCommentSubmit'

export { formatTime } from './utils/formatTime'
export { getInitials } from './utils/getInitials'

export type {
  Comment,
  CommentPanelProps,
  CommentCardProps,
  CommentListProps,
  LoginPromptProps,
  CommentFormProps,
} from './types'
export { MAX_COMMENTS_WITHOUT_LOGIN } from './types'
