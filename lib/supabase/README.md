# Supabase 客户端模块 (Supabase Module)

## 概述

Supabase 模块提供项目中所有与 Supabase 交互的客户端创建函数。根据不同的使用场景（服务端、客户端、管理员、中间件等）提供专门的客户端实例，确保安全性、性能和功能的平衡。

## 核心特性

- **服务端客户端**: Server Components 和 Server Actions 使用
- **浏览器客户端**: Client Components 使用
- **管理员客户端**: 拥有 Service Role 权限，用于敏感操作
- **中间件集成**: 路由保护和会话刷新
- **用户缓存**: 使用 React cache 缓存用户信息
- **Sitemap 专用**: 无需 Cookie 的静态生成客户端

## 项目结构

```
lib/supabase/
├── server.ts                   # 服务端客户端（Server Components/Actions）
├── client.ts                   # 浏览器客户端（Client Components）
├── admin.ts                    # 管理员客户端（Service Role）
├── middleware.ts               # 中间件会话管理
├── user.ts                     # 用户查询工具（带缓存）
├── sitemap-client.ts           # Sitemap 专用客户端
└── stm.ts                      # STM 专用客户端
```

## 环境配置

在项目根目录创建 `.env.local` 文件，配置以下环境变量：

```bash
# Supabase 基础配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key

# 服务端专用（不要暴露到客户端）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 配置项说明

| 配置项 | 说明 | 使用场景 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 所有客户端 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | 匿名/发布密钥 | 所有客户端 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务角色密钥 | 仅服务端管理员操作 |

⚠️ **安全警告**: `SUPABASE_SERVICE_ROLE_KEY` 拥有绕过 RLS 的权限，绝对不能暴露到客户端！

## 快速开始

### 服务端使用

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase.from('articles').select('*')
```

### 客户端使用

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.from('articles').select('*')
```

### 获取当前用户

```typescript
import { getCurrentUser, isAuthenticated } from '@/lib/supabase/user'

const user = await getCurrentUser()
const isLoggedIn = await isAuthenticated()
```

## 客户端详解

### 1. 服务端客户端 (server.ts)

用于 Server Components 和 Server Actions。

#### createClient

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

**特性**:
- 基于 `@supabase/ssr` 的 `createServerClient`
- 自动处理 Cookie 读写
- 支持会话刷新
- Cookie 安全属性（Secure, SameSite）

**使用场景**:
- Server Components
- Server Actions
- API Routes

---

### 2. 浏览器客户端 (client.ts)

用于 Client Components。

#### createClient

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

**特性**:
- 基于 `@supabase/ssr` 的 `createBrowserClient`
- 自动管理会话状态
- 支持 Realtime 订阅

**使用场景**:
- Client Components
- 浏览器端交互

---

### 3. 管理员客户端 (admin.ts)

用于需要管理员权限的操作。

#### createAdminClient

```typescript
import { createAdminClient } from '@/lib/supabase/admin'

const supabase = createAdminClient()
```

**特性**:
- 使用 Service Role Key
- 绕过 RLS 策略
- 可以删除用户、查看所有数据
- 禁用自动刷新令牌

**使用场景**:
- 删除用户账户
- 批量数据操作
- 管理员后台

⚠️ **只能在服务端使用！**

---

### 4. 中间件集成 (middleware.ts)

用于 Next.js 中间件，实现路由保护和会话刷新。

#### updateSession

```typescript
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

**特性**:
- 自动刷新会话
- 路由访问控制
- Cookie 安全设置
- 性能优化（公开路由快速通过）

**受保护的路由**:
- `/publish` - 发布文章
- `/drafts` - 草稿管理
- `/inbox` - 消息中心
- `/profile` - 个人主页
- `/settings` - 设置中心
- `/feedback` - 反馈中心
- `/updates` - 更新日志
- `/rewards` - 福利中心

**认证路由**（未登录才能访问）:
- `/login` - 登录
- `/register` - 注册
- `/forgot-password` - 忘记密码

---

### 5. 用户查询工具 (user.ts)

提供带缓存的用户查询函数。

#### getCurrentUser

```typescript
import { getCurrentUser } from '@/lib/supabase/user'

const user = await getCurrentUser()
if (user) {
  console.log('用户ID:', user.id)
  console.log('邮箱:', user.email)
}
```

#### isAuthenticated

```typescript
import { isAuthenticated } from '@/lib/supabase/user'

if (await isAuthenticated()) {
  // 用户已登录
}
```

#### getCurrentUserId

```typescript
import { getCurrentUserId } from '@/lib/supabase/user'

const userId = await getCurrentUserId()
```

#### getCurrentUserWithProfile

```typescript
import { getCurrentUserWithProfile } from '@/lib/supabase/user'

const { user, profile } = await getCurrentUserWithProfile()
```

**特性**:
- 使用 React `cache()` 函数缓存
- 同一请求内多次调用复用结果
- 智能错误处理（匿名访问不报错）

---

### 6. Sitemap 专用客户端 (sitemap-client.ts)

用于生成 Sitemap，无需 Cookie 支持。

#### createSitemapClient

```typescript
import { createSitemapClient } from '@/lib/supabase/sitemap-client'

const supabase = createSitemapClient()
```

**特性**:
- 无需 Cookie
- 禁用会话持久化
- 适合静态生成场景

**使用场景**:
- `app/sitemap.ts`
- 静态页面生成

---

### 7. STM 专用客户端 (stm.ts)

用于 STM（可能是特定业务场景）的客户端。

#### createSTMClient

```typescript
import { createSTMClient } from '@/lib/supabase/stm'

const supabase = await createSTMClient()
```

**特性**:
- 强制 `httpOnly` Cookie
- 适合敏感操作场景

## 使用指南

### Server Component 中查询数据

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
  
  return <div>{/* 渲染文章 */}</div>
}
```

### Client Component 中订阅实时更新

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function RealtimeComponent() {
  useEffect(() => {
    const supabase = createClient()
    
    const subscription = supabase
      .channel('articles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  return <div>Realtime Data</div>
}
```

### 管理员操作（删除用户）

```typescript
import { createAdminClient } from '@/lib/supabase/admin'

export async function deleteUser(userId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) throw error
  return { success: true }
}
```

### 获取用户并检查权限

```typescript
import { getCurrentUser } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return <div>Protected Content</div>
}
```

## 关联文档

### 相关模块

- [认证模块文档](../auth/README.md) - 使用 Supabase Auth
- [文章模块文档](../articles/README.md) - 使用 Supabase 数据库
- [用户模块文档](../user/README.md) - 使用 Supabase 用户管理

### 相关类型

- `@supabase/supabase-js` - Supabase 官方类型
- `@supabase/ssr` - SSR 支持类型

### Supabase 官方文档

- [Supabase 文档](https://supabase.com/docs)
- [Next.js SSR 指南](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 最佳实践

### 1. 正确选择客户端类型

```typescript
// ✅ Server Component
import { createClient } from '@/lib/supabase/server'

// ✅ Client Component
import { createClient } from '@/lib/supabase/client'

// ✅ 管理员操作
import { createAdminClient } from '@/lib/supabase/admin'
```

### 2. 使用缓存的用户查询

```typescript
// ✅ 使用缓存版本
import { getCurrentUser } from '@/lib/supabase/user'

// ❌ 避免重复查询
const { data: { user } } = await supabase.auth.getUser()
```

### 3. 错误处理

```typescript
const { data, error } = await supabase.from('articles').select('*')

if (error) {
  console.error('查询失败:', error.message)
  return null
}

return data
```

### 4. 类型安全

```typescript
import { Database } from '@/types/supabase'

const supabase = createClient<Database>()
```

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `Missing Supabase environment variables` | 环境变量未设置 | 检查 `.env.local` 文件 |
| `Auth session missing!` | 用户未登录 | 正常情况，匿名访问 |
| `JWT expired` | 令牌过期 | 中间件会自动刷新 |
| `row-level security policy` | RLS 阻止 | 检查策略或使用 Admin 客户端 |

### 调试模式

```typescript
// 查看当前客户端配置
const supabase = createClient()
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-15**: 优化中间件性能
- **2026-03-01**: 添加用户缓存工具
- **2026-02-20**: 迁移到 `@supabase/ssr`
- **2026-02-01**: 初始版本

## 统计信息

- **客户端类型**: 7种
- **工具函数**: 5个
- **受保护路由**: 8个
- **最后更新**: 2026-03-29
