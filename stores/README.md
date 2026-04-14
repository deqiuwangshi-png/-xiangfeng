# 全局状态管理（迁移后）

## 当前状态

`stores/auth/*` 已完全移除。认证状态不再通过 Zustand 管理，统一由 `AuthProvider` 提供，并通过以下 Hook 消费：

- `useAuth`
- `useUser`
- `useIsAuthenticated`

## 使用约束

- 不要新增 `useAuthStore`、`useUserId` 等旧模式。
- 客户端认证动作统一走 `@/lib/auth/client`。
- 需要登录态只从 `@/hooks` 获取，不要在业务组件内重复订阅 `supabase.auth.onAuthStateChange`。
