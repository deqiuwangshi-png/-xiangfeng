/**
 * Hooks 统一导出
 * @module hooks
 * @description 所有自定义 Hooks 的集中导出入口
 *
 * 使用方式：
 * ```typescript
 * import { useArticleToast, useComments, useLogout } from '@/hooks';
 * ```
 */

// ==================== Auth Hooks ====================
export { useAuthToast } from './auth/useAuthToast';
export { useLogout } from './auth/useLogout';
export { usePermission } from './auth/usePermission';
export { useRegisterForm } from './auth/useRegisterForm';

// ==================== Article Hooks ====================
export { useArticleToast } from './article/useArticleToast';
export { useArticleView } from './article/useArticleView';
export { useComments } from './article/useComments';
export { useCommentSubmit } from './article/useCommentSub';
export { useContentProtection } from './article/useContentProtection';

// ==================== Navigation Hooks ====================
export { useDebouncedNavigation } from './navigation/useDebouncedNavigation';
export { useOptimisticNavigation } from './navigation/useOptimisticNavigation';

// ==================== Notification Hooks ====================
export { useInboxCache } from './notification/useInboxCache';

// ==================== Updates Hooks ====================
export { useUpdates } from './updates/useUpdates';

// ==================== Drafts Hooks ====================
export { useDrafts } from './drafts/useDrafts';

// ==================== Feedback Hooks ====================
export { useFeedbackForm } from './feedback/useFeedbackForm';
export { useFeedbackReplies } from './feedback/useFeedbackReplies';
