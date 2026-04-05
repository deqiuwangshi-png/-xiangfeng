/**
 * 认证模块统一入口
 * @module lib/auth
 * @description 认证模块的统一导出入口
 *
 * @重要提示
 * 此文件已弃用，请根据使用场景选择正确的导入路径：
 *
 * @客户端使用（Client Components）
 * ```typescript
 * import { useLogout, login, logout } from '@/lib/auth/client';
 * ```
 *
 * @服务端使用（Server Components / Server Actions）
 * ```typescript
 * import { getCurrentUser, login, logout } from '@/lib/auth/server';
 * ```
 *
 * @错误示例（会导致客户端引用服务端 API 错误）
 * ```typescript
 * // ❌ 不要在 Client Component 中这样导入
 * import { getCurrentUser } from '@/lib/auth';
 * ```
 *
 * @迁移说明
 * - 原 `@/lib/auth` 的客户端功能已迁移到 `@/lib/auth/client`
 * - 原 `@/lib/auth` 的服务端功能已迁移到 `@/lib/auth/server`
 * - 请根据组件类型选择合适的导入路径
 */

// 为了保持向后兼容性，默认导出客户端版本
// 但强烈建议显式使用 client 或 server 路径
export * from './client';

// 添加控制台警告（仅在开发环境）
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[@/lib/auth] 警告: 请使用 @/lib/auth/client 或 @/lib/auth/server 替代 @/lib/auth'
  );
}
