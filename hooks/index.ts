/**
 * Hooks 统一导出
 * @module hooks
 */

// ==================== Auth Hooks ====================
export {
  useAuth,
  useUser,
  useIsAuthenticated,
} from './auth'

// ==================== Article Hooks ====================
export { useArticleToast } from './article/useArticleToast'
export { useArticleView } from './article/useArticleView'
export { useComments } from './article/useComments'
export { useCommentSubmit } from './article/useCommentSub'
export { useContentProtection } from './article/useContentProtection'

// ==================== Navigation Hooks ====================
export { useDelayNav } from './navigation/useDelayNav'
export { useFastNav } from './navigation/useFastNav'

// ==================== Notification Hooks ====================
export { useInboxCache } from './notification/useInboxCache'

// ==================== Updates Hooks ====================
export { useUpdates } from './updates/useUpdates'

// ==================== Drafts Hooks ====================
export { useDrafts } from './drafts/useDrafts'

// ==================== Publish Hooks ====================
export { useAutoSave } from './publish/useAutoSave'
export { useEditorActions } from './publish/useEditorActions'
export { useEditorState } from './publish/useEditorState'
export { useTipTapEditor } from './publish/useTipTapEditor'

// ==================== Common Hooks ====================
export { useDebounce } from './useDebounce'

// ==================== Settings Hooks ====================
export { useProfileForm } from './settings/useProfileForm'
export { usePrivacySettings } from './settings/usePrivacySettings'
export { useNotificationSettings } from './settings/useNotificationSettings'

// ==================== Other Hooks ====================
export { useOptimisticMutation } from './useOptimisticMutation'
export { useSWRQuery } from './useSWRQuery'
