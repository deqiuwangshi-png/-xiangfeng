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
} from './auth/auth';

// ============================================
// OAuth 第三方认证模块
// ============================================
export type {
  OAuthProvider,
  OAuthProviderConfig,
  OAuthProviderConfigMap,
  OAuthLoginResult,
  OAuthCallbackParams,
  OAuthCallbackResult,
  UserIdentity,
  LinkedAccountItem,
  GetLinkedAccountsResult,
  LinkAccountResult,
  OAuthButtonsProps,
  OAuthButtonProps,
} from './auth/oauth';

// ============================================
// 文章模块
// ============================================
export {
  MAX_COMMENTS_WITHOUT_LOGIN,
} from './article';
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
} from './user/feedback';

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
  // LinkedAccountItem 已从 @/types/auth/oauth 导出
  LanguageOption,
  ThemeColorOption,
  ThemeModeOption,
  PrivacyOption,
  PrivacyVisibility,
  MessagePermission,
} from './user/settings';

// ============================================
// 更新日志模块
// ============================================
export { UpdateType, VersionType } from './user/updates';
export type {
  UpdateItem,
  VersionInfo,
  MonthlyUpdate,
  FilterType as UpdatesFilterType,
} from './user/updates';

// ============================================
// 登录历史模块
// ============================================
export type {
  LoginType,
  LoginHistoryItem,
  GetLoginHistoryResult,
} from './user/loginHistory';

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
} from './user/user';

// ============================================
// Supabase 数据库类型
// ============================================
export type { Json, Database, UserRole } from './supabase';

// ============================================
// 媒体资源模块
// ============================================
export type {
  MediaStatus,
  MediaRecord,
  CreateMediaParams,
  UpdateMediaStatusParams,
  UploadProgress,
  ImageUploadResult,
} from './media';
