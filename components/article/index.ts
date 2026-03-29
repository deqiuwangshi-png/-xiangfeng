/**
 * 文章详情组件统一导出
 * @module components/article
 * @description 文章详情模块所有组件的集中导出入口
 */

// Content - 内容展示组件
export { default as ArticleContent } from './content/ArticleContent';
export { default as ArticleHeader } from './content/ArticleHeader';
export { default as ProtectedArticleContent } from './content/ProtectedArticleContent';
export { default as ContentProtection } from './content/ContentProtection';

// Actions - 交互操作组件
export { default as ArtAct } from './actions/ArtAct';
export { MoreActions } from './actions/MoreActions';
export { ReportBtn } from './actions/ReportBtn';
export { ReportMdl } from './actions/ReportMdl';

// UI - 基础UI组件
export { default as AuthorAvatar } from './ui/AuthorAvatar';
export { default as ReadingProgress } from './ui/ReadingProgress';
export { ArticlePaywall } from './ui/ArticlePaywall';

// Tracking - 追踪统计组件
export { ViewTracker } from './tracking/ViewTracker';

// Skeletons - 骨架屏组件
export { default as ArticleSkeleton } from './skeletons/ArticleSkeleton';
export { default as CommentSkeleton } from './skeletons/CommentSkeleton';

// Comments - 评论系统（从子模块导出）
export {
  CommentPanel,
  CommentList,
  CommentCard,
  CommentForm,
  LoginPrompt,
} from './comments';

// Hooks - 从 @/hooks 统一导出
export { useComments } from '@/hooks/article/useComments';
export { useCommentSubmit } from '@/hooks/article/useCommentSub';

// 类型和常量 - 从 @/types 统一导出
export type {
  Comment,
  CommentFormProps,
  CommentListProps,
  CommentCardProps,
  CommentPanelProps,
  LoginPromptProps,
} from '@/types';
export { MAX_COMMENTS_WITHOUT_LOGIN } from '@/types';

// RW - 打赏组件
export { RwMd } from './rw/RwMd';
export { PtRw } from './rw/PtRw';
export { AdRw } from './rw/AdRw';
export { TabBtn } from './rw/TabBtn';
