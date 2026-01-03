/**
 * 全局类型定义
 * 定义项目中使用的所有TypeScript类型
 */

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  articlesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  isFollowing?: boolean;
}

// 文章相关类型
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleCreateData {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

// 讨论相关类型
export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  status: 'active' | 'closed' | 'locked';
  viewCount: number;
  replyCount: number;
  likeCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionCreateData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// 评论相关类型
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetId: string; // 文章ID或讨论ID
  targetType: 'article' | 'discussion';
  parentId?: string; // 父评论ID（用于回复）
  likeCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 分页相关类型
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}

// 认证相关类型
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// UI组件相关类型
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

// 编辑器相关类型
export interface EditorContent {
  html: string;
  text: string;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

// 路由相关类型
export interface RouteParams {
  params: {
    id: string;
  };
}

export interface SearchParams {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

// 主题相关类型
export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
}

// 配置相关类型
export interface AppConfig {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  apiUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

// 枚举类型
export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum DiscussionStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  LOCKED = 'locked'
}

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum NotificationType {
  COMMENT = 'comment',
  LIKE = 'like',
  FOLLOW = 'follow',
  SYSTEM = 'system'
}