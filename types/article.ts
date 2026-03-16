/**
 * 文章模块类型定义
 * @module types/article
 * @description 集中管理文章相关的所有类型定义
 */

import type { User } from '@supabase/supabase-js';

// ============================================
// 基础文章类型
// ============================================

/**
 * 文章状态类型
 * @type ArticleStatus
 * @description 文章的发布状态
 */
export type ArticleStatus = 'draft' | 'published' | 'archived';

/**
 * 数据库文章数据接口
 * @interface Article
 * @description 与数据库 articles 表结构对应
 */
export interface Article {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 摘要 */
  summary: string;
  /** 状态 */
  status: ArticleStatus;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 文章作者信息接口
 * @interface ArticleAuthor
 * @description 文章作者的基本信息
 */
export interface ArticleAuthor {
  /** 作者ID */
  id: string;
  /** 作者名称 */
  name: string;
  /** 作者头像 */
  avatar?: string;
  /** 作者简介 */
  bio?: string;
}

/**
 * 带作者信息的文章接口
 * @interface ArticleWithAuthor
 * @description 包含完整作者信息的文章数据
 */
export interface ArticleWithAuthor {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 摘要 */
  summary: string | null;
  /** 标签 */
  tags: string[];
  /** 状态 */
  status: ArticleStatus;
  /** 封面图片 */
  cover_image: string | null;
  /** 作者ID */
  author_id: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 发布时间 */
  publishedAt: string;
  /** 阅读时长（分钟） */
  readTime: number;
  /** 点赞数 */
  likesCount: number;
  /** 评论数 */
  commentsCount: number;
  /** 浏览数 */
  viewsCount: number;
  /** 当前用户是否点赞 */
  isLiked?: boolean;
  /** 当前用户是否收藏 */
  isBookmarked?: boolean;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 文章卡片展示数据接口
 * @interface ArticleCardData
 * @description 用于文章列表卡片展示的数据
 */
export interface ArticleCardData {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 摘要 */
  summary: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 发布时间 */
  publishedAt: string;
  /** 阅读时长（分钟） */
  readTime: number;
  /** 浏览数 */
  viewsCount: number;
}

// ============================================
// 评论相关类型
// ============================================

/**
 * 评论数据接口
 * @interface Comment
 * @description 评论的完整数据结构
 */
export interface Comment {
  /** 评论ID */
  id: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  created_at: string;
  /** 点赞数 */
  likes: number;
  /** 当前用户是否点赞 */
  liked: boolean;
  /** 回复列表 */
  replies?: Comment[];
}

/**
 * 带作者信息的评论数据接口
 * @interface CommentWithAuthor
 * @description 包含完整作者信息的评论数据
 */
export interface CommentWithAuthor {
  /** 评论ID */
  id: string;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  created_at: string;
  /** 点赞数 */
  likes: number;
  /** 当前用户是否点赞 */
  liked: boolean;
  /** 作者ID */
  author_id: string;
  /** 文章ID */
  article_id: string;
  /** 作者信息 */
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * 评论提交数据接口
 * @interface CommentSubmitData
 * @description 提交评论时所需的数据
 */
export interface CommentSubmitData {
  /** 文章ID */
  articleId: string;
  /** 评论内容 */
  content: string;
  /** 父评论ID（回复时使用） */
  parentId?: string;
}

// ============================================
// 点赞相关类型
// ============================================

/**
 * 文章点赞结果接口
 * @interface ToggleLikeResult
 * @description 文章点赞/取消点赞操作的返回结果
 */
export interface ToggleLikeResult {
  /** 是否成功 */
  success: boolean;
  /** 当前是否已点赞 */
  liked: boolean;
  /** 当前点赞数 */
  likes: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 评论点赞结果接口
 * @interface ToggleCommentLikeResult
 * @description 评论点赞/取消点赞操作的返回结果
 */
export interface ToggleCommentLikeResult {
  /** 是否成功 */
  success: boolean;
  /** 当前是否已点赞 */
  liked: boolean;
  /** 当前点赞数 */
  likes: number;
  /** 错误信息 */
  error?: string;
}

// ============================================
// Server Actions 返回类型
// ============================================

/**
 * 提交评论结果接口
 * @interface SubmitCommentResult
 * @description 提交评论操作的返回结果
 */
export interface SubmitCommentResult {
  /** 是否成功 */
  success: boolean;
  /** 新创建的评论 */
  comment?: Comment;
  /** 错误信息 */
  error?: string;
}

/**
 * 获取评论列表结果接口
 * @interface GetCommentsResult
 * @description 获取评论列表操作的返回结果
 */
export interface GetCommentsResult {
  /** 是否成功 */
  success: boolean;
  /** 评论列表 */
  comments?: Comment[];
  /** 评论总数 */
  totalCount?: number;
  /** 是否还有更多 */
  hasMore?: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 删除评论结果接口
 * @interface DeleteCommentResult
 * @description 删除评论操作的返回结果
 */
export interface DeleteCommentResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 创建文章结果接口
 * @interface CreateArticleResult
 * @description 创建文章操作的返回结果
 */
export interface CreateArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 新创建的文章 */
  article?: Article;
  /** 错误信息 */
  error?: string;
}

/**
 * 更新文章结果接口
 * @interface UpdateArticleResult
 * @description 更新文章操作的返回结果
 */
export interface UpdateArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 更新后的文章 */
  article?: Article;
  /** 错误信息 */
  error?: string;
}

/**
 * 删除文章结果接口
 * @interface DeleteArticleResult
 * @description 删除文章操作的返回结果
 */
export interface DeleteArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

// ============================================
// 组件 Props 类型
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
  /** 是否正在点赞 */
  isLiking?: boolean;
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
  /** 正在点赞的评论ID集合 */
  likingIds?: Set<string>;
}

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
 * 登录提示 Props 接口
 * @interface LoginPromptProps
 * @description 登录提示组件的属性
 */
export interface LoginPromptProps {
  /** 隐藏的评论数量 */
  hiddenCount: number;
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

// ============================================
// 文章操作组件 Props 类型（统一抽取）
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
export type ReportBtnProps = ArticleActionBaseProps

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
 * 积分打赏面板 Props 接口
 * @interface PtRwProps
 * @description 积分打赏面板组件(PtRw)的属性
 */
export interface PtRwProps {
  /** 文章ID */
  articleId: string;
  /** 作者ID */
  authorId: string;
  /** 打赏成功回调 */
  onSuccess?: () => void;
}

/**
 * 选项卡按钮 Props 接口
 * @interface TabBtnProps
 * @description 选项卡按钮组件(TabBtn)的属性
 */
export interface TabBtnProps {
  /** 是否激活 */
  active: boolean;
  /** 点击回调 */
  onClick: () => void;
  /** 图标 */
  icon: React.ReactNode;
  /** 标签文字 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 阅读进度 Props 接口
 * @interface ReadingProgressProps
 * @description 阅读进度组件(ReadingProgress)的属性
 */
export interface ReadingProgressProps {
  /** 文章ID（可选，用于后续扩展） */
  articleId?: string;
}

/**
 * 评论卡片操作 Props 接口
 * @interface CommentCardActionsProps
 * @description 评论卡片操作组件(CommentCardActions)的属性
 */
export interface CommentCardActionsProps {
  /** 评论数据 */
  comment: Comment;
  /** 当前用户 */
  currentUser: User | null;
  /** 是否正在点赞 */
  isLiking: boolean;
  /** 点赞回调 */
  onLike: (id: string) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
}
