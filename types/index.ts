/**
 * 类型定义统一导出
 * @module types/index
 * @description 统一导出所有类型定义，方便外部引用
 *
 * 使用方式：
 * ```typescript
 * import { AuthResult, Article, DraftData } from '@/types';
 * ```
 */

// ============================================
// 认证模块
// ============================================
export type {
  AuthResult,
  AuthErrorType,
  RegisterFormData,
  RegisterFormErrors,
  UseRegisterFormReturn,
  LoginFormData,
  LoginResult,
  LogoutResult,
  UseLogoutOptions,
  UseLogoutReturn,
  PasswordValidationResult,
  UpdateEmailResult,
  DeleteAccountResult,
  DeactivateAccountResult,
  RateLimitResult,
} from './auth';

// ============================================
// 文章模块
// ============================================
export type {
  ArticleStatus,
  Article,
  ArticleAuthor,
  ArticleWithAuthor,
  ArticleCardData,
  Comment,
  CommentWithAuthor,
  CommentSubmitData,
  ToggleLikeResult,
  ToggleCommentLikeResult,
  SubmitCommentResult,
  GetCommentsResult,
  DeleteCommentResult,
  CreateArticleResult,
  UpdateArticleResult,
  DeleteArticleResult,
  CommentPanelProps,
  CommentCardProps,
  CommentListProps,
  ArticleCardProps,
  ArticleHeaderProps,
  ArticleContentProps,
  LoginPromptProps,
  CommentFormProps,
  ArticlePageProps,
  ArticleActionBaseProps,
  ArtActProps,
  ReportBtnProps,
  MoreActionsProps,
  AuthorAvatarProps,
  ReportMdlProps,
  RwMdProps,
  PtRwProps,
  TabBtnProps,
  ReadingProgressProps,
  CommentCardActionsProps,
} from './article';

// ============================================
// 草稿模块
// ============================================
export type {
  DraftStatus,
  DraftData,
  DraftFilter,
  DraftAction,
  DraftSelection,
} from './drafts';

// ============================================
// 反馈模块
// ============================================
export type {
  FeedbackStatus,
  FeedbackType,
  Reply,
  Attachment,
  FeedbackItem,
  HotFeedbackItem,
  FAQItem,
  FeedbackInput,
  FeedbackSubmitResult,
  FeedbackQueryResult,
  ReplyQueryResult,
  ReplySubmitResult,
  FileUploadStatus,
  UploadedFile,
} from './feedback';

// ============================================
// 通知模块
// ============================================
export type {
  NotificationType,
  FilterType as NotificationFilterType,
  NotificationData,
  NotificationWithIcon,
  NotificationGroup,
} from './notification';
export { notificationIconMap, notificationTypeLabels } from './notification';

// ============================================
// 福利中心模块
// ============================================
export type {
  PointTransactionType,
  PointSourceType,
  TaskCategory,
  TaskType,
  TaskStatus,
  ShopItemCategory,
  ExchangeStatus,
  UserPoints,
  PointExpiration,
  PointTransaction,
  SignInRecord,
  SignInReward,
  Task,
  UserTaskRecord,
  PointLevel,
  UserLevelRecord,
  ShopItem,
  ExchangeRecord,
  UserPointsOverview,
  SignInResponse,
  TaskProgressResponse,
  ExchangeRequest,
  ExchangeResponse,
  RewardsHomeData,
  TaskCenterData,
  ShopData,
  LevelConfig,
  TaskCategoryConfig,
  ShopCategoryConfig,
  ShopCategoryType,
} from './rewards';

// ============================================
// 设置模块
// ============================================
export type {
  ContentSettings,
  UserData,
  SettingCategory,
  UpdateSettingInput,
  UpdateSettingResult,
  NotificationSettingConfig,
  ContentSettingsResult,
  UpdateProfileParams,
  UpdateProfileResult,
  AccountViewMode,
  LinkedAccountItem,
  LanguageOption,
  ThemeColorOption,
  ThemeModeOption,
  PrivacyOption,
  PrivacyVisibility,
  MessagePermission,
} from './settings';

// ============================================
// 更新日志模块
// ============================================
export { UpdateType, VersionType } from './updates';
export type {
  UpdateItem,
  VersionInfo,
  MonthlyUpdate,
  FilterType as UpdatesFilterType,
} from './updates';

// ============================================
// 登录历史模块
// ============================================
export type {
  LoginType,
  LoginHistoryItem,
  GetLoginHistoryResult,
} from './loginHistory';

// ============================================
// 用户模块
// ============================================
export type {
  SimpleUser,
  UserProfile,
  SimpleUserProfile,
  UserProfileSectionProps,
  UserDropdownMenuProps,
  DropdownItem,
  UserDisplayInfo,
  UserStats,
} from './user';

// ============================================
// Supabase 数据库类型
// ============================================
export type { Json, Database, UserRole } from './supabase';
