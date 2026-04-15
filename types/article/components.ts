/**
 * 文章组件 Props 类型定义
 * @module types/article/components
 * @description 文章相关组件的属性类型
 */

import type { User } from '@supabase/supabase-js';
import type { ArticleWithAuthor, ArticleCardData } from './article';
import type { Comment } from './comment';

// ============================================
// 基础 Props 类型
// ============================================

/**
 * 文章操作基础 Props 接口
 * @interface ArticleActionBaseProps
 * @description 文章操作组件共享的基础属性
 */
export interface ArticleActionBaseProps {
  /** 文章ID */
  articleId: string;
  /** 作者ID */
  authorId: string;
  /** 当前用户 */
  currentUser: User | null;
}

// ============================================
// 评论组件 Props
// ============================================

/**
 * 评论面板 Props 接口
 * @interface CommentPanelProps
 * @description 评论面板组件的属性
 */
export interface CommentPanelProps {
  /** 文章ID */
  articleId: string;
  /** 初始评论列表 */
  initialComments: Comment[];
  /** 初始评论总数 */
  initialTotalCount?: number;
  /** 初始是否还有更多 */
  initialHasMore?: boolean;
  /** 当前用户 */
  currentUser: User | null;
}

/**
 * 评论卡片 Props 接口
 * @interface CommentCardProps
 * @description 评论卡片组件的属性
 */
export interface CommentCardProps {
  /** 评论数据 */
  comment: Comment;
  /** 点赞回调 */
  onLike: (commentId: string) => void;
  /** 删除回调 */
  onDelete: (commentId: string) => void;
  /** 当前用户 */
  currentUser: User | null;
}

/**
 * 评论列表 Props 接口
 * @interface CommentListProps
 * @description 评论列表组件的属性
 */
export interface CommentListProps {
  /** 评论列表 */
  comments: Comment[];
  /** 是否还有更多 */
  hasMore: boolean;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 加载更多回调 */
  onLoadMore: () => void;
  /** 点赞回调 */
  onLike: (commentId: string) => void;
  /** 删除回调 */
  onDelete: (commentId: string) => void;
  /** 当前用户 */
  currentUser: User | null;
}

/**
 * 评论表单 Props 接口
 * @interface CommentFormProps
 * @description 评论表单组件的属性
 */
export interface CommentFormProps {
  /** 提交回调 */
  onSubmit: (content: string) => Promise<boolean>;
  /** 当前用户 */
  currentUser: User | null;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 评论卡片操作 Props 接口
 * @interface CommentCardActionsProps
 * @description 评论卡片操作组件的属性
 */
export interface CommentCardActionsProps {
  /** 评论数据 */
  comment: Comment;
  /** 当前用户 */
  currentUser: User | null;
  /** 点赞回调 */
  onLike: (id: string) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
}

// ============================================
// 文章组件 Props
// ============================================

/**
 * 文章卡片 Props 接口
 * @interface ArticleCardProps
 * @description 文章卡片组件的属性
 */
export type ArticleCardProps = ArticleCardData;

/**
 * 文章头部 Props 接口
 * @interface ArticleHeaderProps
 * @description 文章头部组件的属性
 */
export interface ArticleHeaderProps {
  /** 文章数据 */
  article: ArticleWithAuthor;
}

/**
 * 文章页面 Props 接口
 * @interface ArticlePageProps
 * @description 文章页面的属性
 */
export interface ArticlePageProps {
  /** 路由参数 */
  params: Promise<{
    id: string;
  }>;
}

/**
 * 文章内容 Props 接口
 * @interface ArticleContentProps
 * @description 文章内容组件的属性
 */
export interface ArticleContentProps {
  /** 文章内容（HTML格式） */
  content: string;
}

/**
 * 阅读进度 Props 接口
 * @interface ReadingProgressProps
 * @description 阅读进度组件的属性
 */
export interface ReadingProgressProps {
  /** 文章ID（可选，用于后续扩展） */
  articleId?: string;
}

// ============================================
// 文章操作组件 Props
// ============================================

/**
 * 文章操作按钮 Props 接口
 * @interface ArtActProps
 * @description 文章操作按钮组件(ArtAct)的属性
 */
export interface ArtActProps extends ArticleActionBaseProps {
  /** 作者名称 */
  authorName: string;
  /** 作者头像URL */
  authorAvatar?: string;
  /** 初始点赞数 */
  initialLikeCount?: number;
  /** 初始评论数 */
  initialCommentCount?: number;
  /** 初始点赞状态 */
  initialLiked?: boolean;
  /** 初始收藏状态 */
  initialBookmarked?: boolean;
}

/**
 * 举报按钮 Props 接口
 * @interface ReportBtnProps
 * @description 举报按钮组件(ReportBtn)的属性
 */
export type ReportBtnProps = ArticleActionBaseProps;

/**
 * 更多操作菜单 Props 接口
 * @interface MoreActionsProps
 * @description 更多操作菜单组件(MoreActions)的属性
 */
export interface MoreActionsProps extends ArticleActionBaseProps {
  /** 初始收藏状态 */
  initialBookmarked?: boolean;
  /** 收藏回调 */
  onBookmark: () => void;
  /** 是否正在收藏 */
  isBookmarkLoading?: boolean;
}

/**
 * 作者头像 Props 接口
 * @interface AuthorAvatarProps
 * @description 作者头像组件(AuthorAvatar)的属性
 */
export interface AuthorAvatarProps extends ArticleActionBaseProps {
  /** 作者名称 */
  authorName: string;
  /** 作者头像URL */
  authorAvatar?: string;
}

/**
 * 举报弹窗 Props 接口
 * @interface ReportMdlProps
 * @description 举报弹窗组件(ReportMdl)的属性
 */
export interface ReportMdlProps {
  /** 文章ID */
  articleId: string;
  /** 作者ID */
  authorId: string;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * 打赏弹窗 Props 接口
 * @interface RwMdProps
 * @description 打赏弹窗组件(RwMd)的属性
 */
export interface RwMdProps extends ArticleActionBaseProps {
  /** 关闭回调 */
  onClose: () => void;
  /** 打赏成功回调 */
  onSuccess?: () => void;
}

/**
 * 登录提示 Props 接口
 * @interface LoginPromptProps
 * @description 登录提示组件的属性
 */
export interface LoginPromptProps {
  /** 隐藏的评论数量 */
  hiddenCount: number;
}
