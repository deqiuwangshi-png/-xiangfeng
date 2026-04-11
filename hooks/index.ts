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
export {
  useAuth,
  useAuthUser,
  useAuthStatus,
  useIsAuthenticated,
  useUserId,
} from './auth';
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
export { useDelayNav } from './navigation/useDelayNav';
export { useFastNav } from './navigation/useFastNav';

// ==================== Notification Hooks ====================
export { useInboxCache } from './notification/useInboxCache';

// ==================== Updates Hooks ====================
export { useUpdates } from './updates/useUpdates';

// ==================== Drafts Hooks ====================
export { useDrafts } from './drafts/useDrafts';

// ==================== Publish Hooks ====================
export { useAutoSave } from './publish/useAutoSave';
export { useEditorActions } from './publish/useEditorActions';
export { useEditorState } from './publish/useEditorState';
export { useTipTapEditor } from './publish/useTipTapEditor';

// ==================== Rewards Hooks ====================
export { useExchangeRecords } from './rewards/useExchangeRecords'
export { usePoints } from './rewards/usePoints'
export { useShop } from './rewards/useShop'
export { useSignIn } from './rewards/useSignIn'
export { useTasks } from './rewards/useTasks'

// ==================== Common Hooks ====================
export { useDebounce } from './useDebounce';
