/**
 * 认证相关 Server Actions 主入口
 * @module lib/auth/actions
 * @description 统一导出所有认证操作，保持向后兼容性
 *
 * 文件结构：
 * - actions/
 *   ├── types.ts           # 类型定义
 *   ├── login.ts           # 登录
 *   ├── register.ts        # 注册
 *   ├── logout.ts          # 退出
 *   ├── forgot-password.ts # 忘记密码
 *   ├── reset-password.ts  # 重置密码
 *   └── change-password.ts # 修改密码
 */

// 类型导出
export type { AuthResult } from './actions/types';

// 函数导出
export { login } from './actions/login';
export { register } from './actions/register';
export { logout } from './actions/logout';
export { forgotPassword } from './actions/forgot-password';
export { resetPassword } from './actions/reset-password';
export { changePassword } from './actions/change-password';
