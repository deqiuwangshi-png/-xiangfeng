# 全局状态管理 (Zustand)

## 概述

本项目使用 [Zustand](https://github.com/pmndrs/zustand) 作为全局状态管理方案，提供轻量级、高性能的状态管理。

## 目录结构

```
stores/
├── auth/                       # 认证状态管理
│   ├── authStore.ts           # Store 实现
│   ├── authTypes.ts           # 类型定义
│   └── index.ts               # 统一导出
├── index.ts                   # 全局导出
└── README.md                  # 本文档
```

## 认证状态管理

### 基本使用

#### 1. 在组件中获取认证状态

```tsx
'use client'

import { useAuth, useIsAuthenticated, useUserId } from '@/hooks'

// 完整认证状态
function UserProfile() {
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth()
  
  if (isLoading) return <div>加载中...</div>
  if (!isAuthenticated) return <div>请登录</div>
  
  return (
    <div>
      <h1>欢迎, {profile?.username}</h1>
      <button onClick={() => logout()}>退出</button>
    </div>
  )
}

// 仅检查登录状态（性能优化）
function ProtectedButton() {
  const isAuthenticated = useIsAuthenticated()
  
  return (
    <button disabled={!isAuthenticated}>
      需要登录才能点击
    </button>
  )
}

// 仅获取用户 ID（性能优化）
function UserSettings() {
  const userId = useUserId()
  
  // 使用 userId 进行数据获取
  return <div>用户设置</div>
}
```

#### 2. 登录和登出

```tsx
'use client'

import { useAuth } from '@/hooks'

function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await login({
      email: 'user@example.com',
      password: 'password',
      redirectTo: '/home' // 可选：登录后跳转
    })
    
    if (!success) {
      // 登录失败，error 对象会自动更新
      console.error('登录失败:', error?.message)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
      {error && <div className="error">{error.message}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}

function LogoutButton() {
  const { logout } = useAuth()
  
  const handleLogout = async () => {
    await logout({ redirectTo: '/login' })
  }
  
  return <button onClick={handleLogout}>退出</button>
}
```

#### 3. 在 Server Component 中初始化

```tsx
// app/(main)/layout.tsx
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { AuthProvider } from '@/components/providers'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentUserWithProfile()
  
  const user = profile ? {
    id: profile.id,
    email: profile.email,
    user_metadata: {
      username: profile.username,
      avatar_url: profile.avatar_url,
    },
  } : null

  return (
    <AuthProvider initialUser={user} initialProfile={profile}>
      {children}
    </AuthProvider>
  )
}
```

### 性能优化

#### 使用 Selector 避免不必要的重渲染

```tsx
import { useAuthStore, selectUser, selectStatus } from '@/stores'

// 只订阅用户数据
function UserAvatar() {
  const { user, profile } = useAuthStore(selectUser)
  return <img src={profile?.avatar_url} alt={user?.user_metadata?.username} />
}

// 只订阅状态数据
function LoadingIndicator() {
  const { isLoading, status } = useAuthStore(selectStatus)
  return isLoading ? <Spinner /> : null
}

// 只订阅特定字段
function UserName() {
  const username = useAuthStore(
    (state) => state.profile?.username || state.user?.user_metadata?.username
  )
  return <span>{username}</span>
}
```

### 更新用户资料

```tsx
import { useAuth } from '@/hooks'

function EditProfile() {
  const { updateProfile } = useAuth()
  
  const handleUpdate = async () => {
    // 先调用 API 更新服务端数据
    await updateUserProfileAPI({ username: '新用户名' })
    
    // 然后更新本地 Store
    updateProfile({ username: '新用户名' })
  }
  
  return <button onClick={handleUpdate}>更新资料</button>
}
```

### 刷新用户信息

```tsx
import { useAuth } from '@/hooks'

function RefreshUser() {
  const { refreshUser, isLoading } = useAuth()
  
  const handleRefresh = async () => {
    await refreshUser() // 从服务端重新获取用户信息
  }
  
  return (
    <button onClick={handleRefresh} disabled={isLoading}>
      刷新用户信息
    </button>
  )
}
```

## 架构说明

### 数据流

```
Server Component
    ↓
getCurrentUserWithProfile()
    ↓
AuthProvider (initialUser, initialProfile)
    ↓
useAuthStore.initialize()
    ↓
Client Components (useAuth, useAuthStore)
```

### 持久化策略

- **持久化字段**: `user`, `profile`, `isAuthenticated`, `lastUpdated`
- **非持久化字段**: `status`, `isLoading`, `isInitialized`, `error`
- **存储方式**: localStorage
- **版本控制**: 支持数据迁移

### 安全考虑

1. **敏感数据**: 不持久化敏感信息（如 token）
2. **服务端渲染**: 自动跳过持久化水合
3. **状态同步**: 登录/登出后自动刷新页面状态

## 最佳实践

1. **优先使用 Hooks**: 使用 `useAuth` 而不是直接使用 `useAuthStore`
2. **选择性订阅**: 使用 Selector 函数避免不必要的重渲染
3. **服务端初始化**: 在 layout 中使用 AuthProvider 初始化状态
4. **错误处理**: 始终检查 `error` 和 `isLoading` 状态
5. **性能优化**: 使用 `useIsAuthenticated` 或 `useUserId` 进行简单判断

## 类型定义

```typescript
import type { 
  AuthStore, 
  AuthState, 
  AuthStatus, 
  AuthError,
  LoginParams,
  LoginResult 
} from '@/stores'
```

## 迁移指南

### 从 Props Drilling 迁移

**Before:**
```tsx
// 层层传递 user
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />
  </Child>
</Parent>
```

**After:**
```tsx
// 直接在需要的地方获取
function GrandChild() {
  const { user } = useAuth()
  return <div>{user?.email}</div>
}
```

### 从 Context 迁移

**Before:**
```tsx
const { user } = useContext(AuthContext)
```

**After:**
```tsx
const { user } = useAuth()
// 或
const { user } = useAuthStore(selectUser)
```
