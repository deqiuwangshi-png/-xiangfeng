# 认证模块 (Auth Module)

## 概述

认证模块是项目的核心安全模块，提供完整的用户认证、授权、权限管理功能。基于 Supabase Auth 构建，采用 Server Actions 实现服务端认证逻辑，确保安全性。

## 核心特性

- **完整的认证流程**: 登录、注册、退出、密码重置、修改密码
- **OAuth 第三方登录**: 支持 GitHub 等第三方登录
- **权限控制系统**: 基于角色的权限管理（匿名/认证/管理员）
- **安全防护**: 限流、邮箱白名单、重定向安全校验
- **登录历史**: 记录和查询用户登录记录

## 项目结构

```
lib/auth/
├── index.ts                    # 统一导出入口（客户端安全）
├── actions/                    # Server Actions 目录
│   ├── types.ts               # 认证操作类型定义
│   ├── login.ts               # 登录操作
│   ├── register.ts            # 注册操作
│   ├── logout.ts              # 退出登录操作
│   ├── oauth.ts               # OAuth 第三方登录
│   ├── forgot-password.ts     # 忘记密码
│   ├── reset-password.ts      # 重置密码
│   └── change-password.ts     # 修改密码
├── messages/                  # 消息常量（已迁移到 lib/messages）
├── permissions.ts             # 权限控制系统（服务端专用）
├── utils.ts                   # 认证工具函数
├── redir.ts                   # 重定向安全工具
├── loginHistory.ts            # 登录历史服务
└── withPermission.ts          # 权限保护包装器
```

## 快速开始

### 统一导入（推荐）

```typescript
// 客户端安全导入
import { 
  login, 
  register, 
  logout,
  useLogout,
  COMMON_ERRORS 
} from '@/lib/auth'

// 服务端专用导入
import { 
  checkWritePermission, 
  requireAuth,
  withPermission 
} from '@/lib/auth/permissions'
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
const result = await changePassword(formData)
if (result.success) {
  toast.success(result.message)
  router.push('/login')
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

**位置**: `permissions.ts`

#### getCurrentUserWithRole

获取当前用户及角色信息。

```typescript
const { user, role } = await getCurrentUserWithRole()
```

#### isAuthenticated

检查是否已认证。

```typescript
if (await isAuthenticated()) {
  // 执行需要登录的操作
}
```

#### isAdmin

检查是否为管理员。

```typescript
if (await isAdmin()) {
  // 执行管理员操作
}
```

#### checkWritePermission

验证写入操作权限。

```typescript
const check = await checkWritePermission('create_article')
if (!check.allowed) {
  throw new Error(check.error)
}
```

### 权限保护包装器

**位置**: `withPermission.ts`

#### withPermission

包装 Server Action，添加权限检查。

```typescript
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
const protectedAction = withAuth(async (formData: FormData) => {
  // 执行需要登录的操作
})
```

## 工具函数

### 邮箱白名单验证 (utils.ts)

```typescript
import { isAllowedEmail, getAllowedEmailHint } from '@/lib/auth/utils'

// 验证邮箱
if (!isAllowedEmail(email)) {
  return { error: getAllowedEmailHint() }
}
```

### 重定向安全校验 (redir.ts)

```typescript
import { sanitizeRedirect } from '@/lib/auth/redir'

// 清洗重定向路径
const safeRedirect = sanitizeRedirect(redirectTo, '/home')
```

**防护机制**:
- 禁止带协议的外部链接
- 禁止协议相对路径
- 禁止反斜杠绕过
- 禁止 @ 符号绕过
- 禁止 URL 编码绕过

### 登录历史 (loginHistory.ts)

```typescript
import { getLoginHistory, recordLoginHistory } from '@/lib/auth/loginHistory'

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
| RESET_PASSWORD_ERRORS | 密码重置 |
| CHANGE_PASSWORD_ERRORS | 修改密码 |
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

- `useLogout` - 退出登录 Hook（从 `@/lib/auth` 导出）

### 相关类型

- `@/types/permissions` - 权限相关类型定义
- `@/types` - 认证结果类型定义

### 相关服务

- `@/lib/supabase/server` - Supabase 服务端客户端
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
- **最后更新**: 2026-03-29
