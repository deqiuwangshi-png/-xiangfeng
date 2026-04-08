# 认证模块 (Auth Module)

<!--
================================================================================
                              ⚠️  统一认证入口  ⚠️
================================================================================

 ████████╗██╗   ██╗███╗   ██╗███████╗██████╗  ██████╗ █████╗ ██╗      ██████╗
 ╚══██╔══╝██║   ██║████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║     ██╔════╝
    ██║   ██║   ██║██╔██╗ ██║█████╗  ██████╔╝██║     ███████║██║     ██║     
    ██║   ██║   ██║██║╚██╗██║██╔══╝  ██╔══██╗██║     ██╔══██║██║     ██║     
    ██║   ╚██████╔╝██║ ╚████║███████╗██║  ██║╚██████╗██║  ██║███████╗╚██████╗
    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                           认证入口使用规范                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  【强制】所有认证相关操作必须从此模块导入，禁止分散定义！                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  客户端使用 (Client Components)                                      │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  import { login, logout, useLogout } from '@/lib/auth/client';      │   │
│  │  import { useAuth, useUser } from '@/hooks/auth';                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  服务端使用 (Server Components / Server Actions)                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  // 获取用户/权限检查                                                │   │
│  │  import { getCurrentUser, requireAuth } from '@/lib/auth/server';   │   │
│  │                                                                     │   │
│  │  // 需要原始 Supabase 客户端时（数据库操作）                          │   │
│  │  import { createClient } from '@/lib/supabase/server';              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⚠️  警告: @/lib/auth/index.ts 已删除，请勿使用 @/lib/auth 导入！            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           四层架构说明                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  第4层 - 业务层 (app/, components/, hooks/)                                  │
│  └── 统一使用 @/lib/auth/server 或 @/hooks/auth                             │
│                                                                             │
│  第3层 - 认证业务层 (lib/auth/)                                              │
│  ├── server.ts - 服务端认证功能统一导出                                      │
│  ├── client.ts - 客户端认证功能统一导出                                      │
│  ├── core/     - 核心实现 (user, permissions)                               │
│  └── actions/  - Server Actions                                             │
│                                                                             │
│  第2层 - Supabase客户端层 (lib/supabase/)                                    │
│  ├── server.ts  - 服务端客户端（仅 lib/auth 和业务代码使用）                 │
│  ├── client.ts  - 浏览器客户端（仅 AuthProvider 使用）                       │
│  └── middleware.ts - 中间件会话刷新                                          │
│                                                                             │
│  第1层 - 基础设施层 (lib/auth/utils/)                                        │
│  └── cookieConfig.ts - Cookie配置（最底层，无依赖）                          │
│                                                                             │
│  ✅ 依赖方向: 第4层 → 第3层 → 第2层 → 第1层（单向，无循环）                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
                              📋  代码审查检查清单  📋
================================================================================

创建新功能时，请确认以下检查项：

□ 1. 是否从 @/lib/auth/client 或 @/lib/auth/server 导入认证功能？
□ 2. 是否在 Client Component 中错误地引入了服务端 API？
□ 3. 是否使用了统一的 getCurrentUser() 获取用户信息？
□ 4. 是否使用了统一的权限检查函数（checkWritePermission/requireAuth）？
□ 5. 是否使用了 sanitizeRedirect() 处理重定向路径？
□ 6. 是否在 Server Action 中调用了 revalidatePath() 刷新缓存？

如发现分散的认证逻辑，请立即迁移至此模块！

================================================================================
-->

## 概述

认证模块是项目的**核心安全模块**，提供完整的用户认证、授权、权限管理功能。基于 Supabase Auth 构建，采用 Server Actions 实现服务端认证逻辑，确保安全性。

> ⚠️ **重要提示**: 此模块是项目**唯一的认证入口**，所有认证相关功能必须从此导入，禁止在业务代码中分散定义认证逻辑！

## 核心特性

- **完整的认证流程**: 登录、注册、退出、密码重置、修改密码
- **OAuth 第三方登录**: 支持 GitHub 等第三方登录
- **权限控制系统**: 基于角色的权限管理（匿名/认证/管理员）
- **安全防护**: 限流、邮箱白名单、重定向安全校验
- **登录历史**: 记录和查询用户登录记录

## 项目结构

```
lib/auth/
├── client.ts                   # 【客户端入口】Client Components 使用
├── server.ts                   # 【服务端入口】Server Components/Actions 使用
├── core/                       # 核心功能
│   ├── user.ts                # 用户获取（带缓存）
│   ├── permissions.ts         # 权限控制
│   ├── withPermission.ts      # 权限包装器
│   └── loginHistory.ts        # 登录历史
├── actions/                    # Server Actions 目录
│   ├── login.ts               # 登录操作
│   ├── register.ts            # 注册操作
│   ├── logout.ts              # 退出登录操作
│   ├── oauth.ts               # OAuth 第三方登录
│   ├── forgot-password.ts     # 忘记密码
│   ├── reset-password.ts      # 重置密码
│   └── change-password.ts     # 修改密码
└── utils/                      # 工具函数
    ├── cookieConfig.ts        # Cookie 配置
    ├── redir.ts               # 重定向安全校验
    └── helpers.ts             # 辅助函数
```

## 快速开始

### 客户端使用（Client Components）

```typescript
// ✅ 正确示例
import { login, logout, useLogout } from '@/lib/auth/client';
import { COMMON_ERRORS } from '@/lib/auth/client';

// ❌ 错误示例 - 已废弃
import { login } from '@/lib/auth';  // index.ts 已删除！
```

### 服务端使用（Server Components / Server Actions）

```typescript
// ✅ 正确示例
import { getCurrentUser, login, logout } from '@/lib/auth/server';
import { requireAuth, withAuth } from '@/lib/auth/server';

// ❌ 错误示例 - 会导致编译错误
import { getCurrentUser } from '@/lib/auth/client';  // 服务端 API 不在 client 中！
```

## 认证操作 (Server Actions)

### 1. 登录 (login)

**位置**: `actions/login.ts`

**功能**:
- 邮箱密码登录
- 输入验证（Zod）
- IP + 邮箱组合限流（防止恶意锁账号）
- 自动激活已停用账户
- 记录登录历史

**安全特性**:
- 使用 IP + 邮箱组合限流，防止恶意锁账号攻击
- 攻击者无法通过伪造请求锁定其他用户的账号

**使用示例**:
```typescript
import { login } from '@/lib/auth/client';  // 或 server

const result = await login(formData)
if (result.success) {
  router.push(result.redirectTo || '/home')
} else {
  toast.error(result.error)
}
```

---

### 2. 注册 (register)

**位置**: `actions/register.ts`

**功能**:
- 邮箱密码注册
- 用户名验证（字母、数字、下划线、中文）
- 邮箱域名白名单验证
- 用户名唯一性检查
- 注册限流（更严格）

**邮箱白名单**:
- qq.com
- gmail.com
- 139.com

**使用示例**:
```typescript
import { register } from '@/lib/auth/client';

const result = await register(formData)
if (result.success) {
  toast.success(result.message)
} else {
  toast.error(result.error)
}
```

---

### 3. 退出登录 (logout)

**位置**: `actions/logout.ts`

**功能**:
- 使用 `scope: 'global'` 使服务端会话失效
- 防止窃取 Cookie 后的未授权访问
- 清除本地 Cookie 和服务端会话状态

**安全特性**:
- `scope: 'global'` 确保服务端会话被标记为失效
- 所有该用户的活跃会话都会被终止
- 已窃取的 Cookie 将无法通过服务端验证

**使用示例**:
```typescript
import { logout } from '@/lib/auth/client';

const result = await logout()
if (result.success) {
  router.push('/login')
}
```

---

### 4. OAuth 第三方登录 (oauthLogin)

**位置**: `actions/oauth.ts`

**功能**:
- GitHub 登录
- Google 登录（预留）
- 自动重定向到授权页面

**支持的提供商**:
| 提供商 | 状态 |
|--------|------|
| GitHub | ✅ 已启用 |
| Google | ⏸️ 预留 |

**使用示例**:
```typescript
import { oauthLogin } from '@/lib/auth/client';

const result = await oauthLogin('github', '/home')
if (result.success && result.url) {
  window.location.href = result.url
}
```

---

### 5. 忘记密码 (forgotPassword)

**位置**: `actions/forgot-password.ts`

**功能**:
- 发送密码重置邮件
- 三层限流防止邮箱轰炸攻击

**安全特性**:
- **IP 级别限流**: 防止单一 IP 发送大量请求
- **邮箱级别限流**: 防止对单一邮箱的频繁请求
- **组合限流**: 防止攻击者轮换邮箱绕过限制
- **统一返回**: 防止邮箱枚举攻击

**使用示例**:
```typescript
import { forgotPassword } from '@/lib/auth/client';

const result = await forgotPassword(formData)
// 无论成功与否都显示相同消息
toast.success(result.message)
```

---

### 6. 重置密码 (resetPassword)

**位置**: `actions/reset-password.ts`

**功能**:
- 通过邮件链接重置密码
- 密码强度验证
- 限流保护

**使用示例**:
```typescript
import { resetPassword } from '@/lib/auth/client';

const result = await resetPassword(formData)
if (result.success) {
  toast.success(result.message)
  router.push('/login')
} else {
  toast.error(result.error)
}
```

---

### 7. 修改密码 (changePassword)

**位置**: `actions/change-password.ts`

**功能**:
- 已登录用户修改密码
- 修改成功后自动退出登录

**使用示例**:
```typescript
import { changePassword } from '@/lib/auth/client';

const result = await changePassword(formData)
if (result.success) {
  toast.success(result.message)
  router.push('/login')
}
```

## 用户获取（统一入口）

### getCurrentUser

**位置**: `core/user.ts`

**说明**: 服务端获取当前登录用户的**唯一入口**，使用 React `cache()` 确保同一请求内共享用户数据。

**使用示例**:
```typescript
import { getCurrentUser } from '@/lib/auth/server';

// Server Component 中使用
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return <div>欢迎, {user.email}</div>;
}
```

### getCurrentUserWithProfile

获取用户及完整资料信息。

```typescript
import { getCurrentUserWithProfile } from '@/lib/auth/server';

const { user, profile } = await getCurrentUserWithProfile();
// profile: { id, email, username, avatar_url }
```

### isAuthenticated

快速检查用户是否已登录。

```typescript
import { isAuthenticated } from '@/lib/auth/server';

if (await isAuthenticated()) {
  // 执行需要登录的操作
}
```

## 权限控制系统

### 角色定义

```typescript
type UserRole = 'anonymous' | 'authenticated' | 'admin'
```

| 角色 | 说明 | 权限 |
|------|------|------|
| anonymous | 匿名用户 | 只能浏览公开内容 |
| authenticated | 认证用户 | 可操作自己的资源 |
| admin | 管理员 | 拥有所有权限 |

### 权限检查函数

**位置**: `core/permissions.ts`

#### checkWritePermission

验证写入操作权限（统一权限检查入口）。

```typescript
import { checkWritePermission } from '@/lib/auth/server';

const check = await checkWritePermission('create_article')
if (!check.allowed) {
  throw new Error(check.error)
}
```

#### requireAuth

要求必须登录，返回用户信息。

```typescript
import { requireAuth } from '@/lib/auth/server';

const user = await requireAuth();
// 未登录会自动抛出错误
```

### 权限保护包装器

**位置**: `core/withPermission.ts`

#### withPermission

包装 Server Action，添加权限检查。

```typescript
import { withPermission } from '@/lib/auth/server';

const protectedAction = withPermission(
  { operation: 'create_article' },
  async (formData: FormData) => {
    // 执行受保护的操作
  }
)
```

#### withAuth

要求认证的包装器。

```typescript
import { withAuth } from '@/lib/auth/server';

const protectedAction = withAuth(async (formData: FormData) => {
  // 执行需要登录的操作
})
```

## 工具函数

### 重定向安全校验 (utils/redir.ts)

```typescript
import { sanitizeRedirect } from '@/lib/auth/server';  // 或 client

// 清洗重定向路径
const safeRedirect = sanitizeRedirect(redirectTo, '/home')
```

**防护机制**:
- 禁止带协议的外部链接
- 禁止协议相对路径
- 禁止反斜杠绕过
- 禁止 @ 符号绕过
- 禁止 URL 编码绕过

### 登录历史 (core/loginHistory.ts)

```typescript
import { getLoginHistory, recordLoginHistory } from '@/lib/auth/server';

// 获取登录历史
const result = await getLoginHistory()
if (result.success) {
  console.log(result.data)
}
```

## 错误消息

### 统一消息常量

**位置**: `lib/messages/auth.ts`

```typescript
import { 
  COMMON_ERRORS,
  LOGIN_MESSAGES,
  REGISTER_MESSAGES,
  RESET_PASSWORD_MESSAGES,
  CHANGE_PASSWORD_MESSAGES,
  mapSupabaseError
} from '@/lib/messages'
```

### 消息类型

| 常量 | 用途 |
|------|------|
| COMMON_ERRORS | 通用错误 |
| LOGIN_MESSAGES | 登录相关（含成功/错误） |
| REGISTER_MESSAGES | 注册相关（含成功/错误） |
| RESET_PASSWORD_MESSAGES | 密码重置相关 |
| CHANGE_PASSWORD_MESSAGES | 修改密码相关 |
| LOGOUT_MESSAGES | 退出登录相关 |
| LOGIN_HISTORY_MESSAGES | 登录历史相关 |
| AUTH_ERRORS | 认证通用 |

## 类型定义

### AuthResult

```typescript
interface AuthResult {
  success: boolean
  error?: string
  message?: string
  redirectTo?: string
}
```

### OAuthLoginResult

```typescript
interface OAuthLoginResult {
  success: boolean
  error?: string
  url?: string
}
```

## 关联文档

### 相关组件

- [认证组件文档](../../components/auth/README.md) - 登录/注册表单组件
- [设置组件文档](../../components/settings/README.md) - 密码修改界面

### 相关 Hooks

- `useAuth` - 认证状态管理（@/hooks/auth）
- `useLogout` - 退出登录 Hook（从 `@/lib/auth/client` 导出）

### 相关类型

- `@/types/auth/permissions` - 权限相关类型定义
- `@/types` - 认证结果类型定义

### 相关服务

- `@/lib/supabase/server` - Supabase 服务端客户端
- `@/lib/supabase/client` - Supabase 客户端
- `@/lib/security/rateLimitServer` - 服务端限流
- `@/lib/security/passwordPolicy` - 密码策略
- `@/lib/messages` - 消息常量

## 安全最佳实践

### 1. 始终使用 Server Actions

所有认证操作都应该是 Server Actions，确保敏感逻辑在服务端执行。

```typescript
'use server'

export async function login(formData: FormData) {
  // 认证逻辑
}
```

### 2. 输入验证

使用 Zod 进行严格的输入验证。

```typescript
const schema = z.object({
  email: z.email(),
  password: z.string().min(8)
})
```

### 3. 限流保护

所有敏感操作都应该有限流保护。

```typescript
const rateLimit = checkServerRateLimit(key)
if (!rateLimit.allowed) {
  return { error: '请求过于频繁' }
}
```

### 4. 安全重定向

使用 `sanitizeRedirect` 清洗用户提供的重定向路径。

```typescript
const redirectTo = sanitizeRedirect(rawRedirect, '/home')
```

### 5. 权限检查

敏感操作前进行权限检查。

```typescript
const check = await checkWritePermission('delete_article', article.user_id)
if (!check.allowed) {
  throw new Error('权限不足')
}
```

## 更新记录

- **2026-04-07**: 删除 index.ts，强制使用 client/server 明确入口；更新文档增加醒目标识
- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-02-20**: 添加登录历史功能
- **2026-02-15**: 添加权限控制系统
- **2026-02-10**: 添加 OAuth 第三方登录
- **2026-02-01**: 初始版本，基础认证功能

## 统计信息

- **Server Actions**: 7个
- **工具函数**: 15+
- **错误消息常量**: 5组
- **权限角色**: 3种
- **最后更新**: 2026-04-07

---

<!--
================================================================================
                          🚨  重要提醒：统一认证入口  🚨
================================================================================

如需修改认证逻辑，请在此模块内进行，禁止在业务代码中分散定义！

发现问题请联系：项目维护团队
================================================================================
-->
