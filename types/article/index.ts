/**
 * 文章模块类型定义统一出口
 * @module types/article
 * @description 文章、评论、点赞、组件 Props 等类型定义
 */

// ============================================
// 通用类型
// ============================================
export {
  MAX_COMMENTS_WITHOUT_LOGIN,
  type ArticleStatus,
} from './common';

// ============================================
// 文章类型
// ============================================
export type {
  Article,
  ArticleAuthor,
  ArticleWithAuthor,
  ArticleCardData,
} from './article';

// ============================================
// 评论类型
// ============================================
export type {
  Comment,
  CommentWithAuthor,
  CommentSubmitData,
} from './comment';

// ============================================
// 操作返回类型
// ============================================
export type {
  ToggleLikeResult,
  ToggleCommentLikeResult,
  SubmitCommentResult,
  GetCommentsResult,
  DeleteCommentResult,
  CreateArticleResult,
  UpdateArticleResult,
  DeleteArticleResult,
} from './actions';

// ============================================
// 组件 Props 类型
// ============================================
export type {
  ArticleActionBaseProps,
  CommentPanelProps,
  CommentCardProps,
  CommentListProps,
  CommentFormProps,
  CommentCardActionsProps,
  ArticleCardProps,
  ArticleHeaderProps,
  ArticlePageProps,
  ArticleContentProps,
  ReadingProgressProps,
  ArtActProps,
  ReportBtnProps,
  MoreActionsProps,
  AuthorAvatarProps,
  ReportMdlProps,
  RwMdProps,
  LoginPromptProps,
} from './components';
