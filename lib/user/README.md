# 用户模块 (User Module)

## 概述

用户模块提供用户资料管理、账户操作、关注功能等核心用户相关功能。包含资料更新、邮箱更换、账户停用/删除、用户统计、关注系统等完整功能链。

## 核心特性

- **资料管理**: 更新用户名、头像、简介、位置
- **邮箱更换**: 安全的邮箱更换流程，带验证邮件
- **账户操作**: 账户停用（软删除）和硬删除
- **用户统计**: 文章数、粉丝数、点赞数、节点数统计
- **关注系统**: 关注/取消关注用户
- **数据一致性**: 同时更新 profiles 表和 user_metadata

## 项目结构

```
lib/user/
├── actions/
│   └── follow.ts              # 关注功能 Server Actions
├── updateProfile.ts           # 更新用户资料
├── updateEmail.ts             # 更换邮箱
├── stats.ts                   # 用户统计
├── getUserDisplayInfo.ts      # 获取用户显示信息
├── deleteAccount.ts           # 删除账户（硬删除）
└── deactivateAccount.ts       # 停用账户（软删除）
```

## 快速开始

### 导入用户操作

```typescript
import { 
  updateProfile,
  initiateEmailChange,
  getUserStats,
  getUserDisplayInfo,
  deleteAccount,
  deactivateAccount,
  toggleFollow
} from '@/lib/user'
```

## 功能详解

### 1. 更新用户资料 (updateProfile.ts)

更新用户的基本资料信息，同时更新 profiles 表和 user_metadata。

#### 更新资料

```typescript
import { updateProfile } from '@/lib/user/updateProfile'

const result = await updateProfile({
  username: '新用户名',
  bio: '个人简介...',
  location: '北京',
  avatar_url: 'https://example.com/avatar.jpg'
})

if (result.success) {
  console.log('资料更新成功')
} else {
  console.error('更新失败:', result.error)
}
```

**支持的字段**:


| 字段           | 类型     | 说明         |
| ------------ | ------ | ---------- |
| `username`   | string | 用户名        |
| `bio`        | string | 个人简介       |
| `location`   | string | 位置         |
| `avatar_url` | string | 头像 URL     |


**安全特性**:

- Zod Schema 输入验证
- XSS 防护
- 数据净化

---

### 2. 更换邮箱 (updateEmail.ts)

发起邮箱更换请求，使用 Supabase Auth 的邮件验证流程。

#### 发起更换请求

```typescript
import { initiateEmailChange } from '@/lib/user/updateEmail'

const result = await initiateEmailChange('newemail@example.com')

if (result.success) {
  if (result.needsConfirmation) {
    console.log('验证邮件已发送，请查收')
  }
} else {
  console.error('更换失败:', result.error)
}
```

#### 检查更换状态

```typescript
import { checkEmailUpdateStatus } from '@/lib/user/updateEmail'

const result = await checkEmailUpdateStatus()
if (result.success) {
  console.log('当前邮箱:', result.email)
  console.log('是否已确认:', result.isConfirmed)
}
```

**流程说明**:

1. 检查新邮箱是否已被使用
2. 验证邮箱域名白名单
3. 调用 Supabase Auth 触发验证邮件
4. 用户点击邮件链接确认
5. 确认后邮箱更换生效

---

### 3. 用户统计 (stats.ts)

获取用户的统计数据，使用 React cache 进行缓存。

#### 获取统计数据

```typescript
import { getUserStats } from '@/lib/user/stats'

const result = await getUserStats()
if (result.success) {
  console.log('文章数:', result.data.articles)
  console.log('粉丝数:', result.data.followers)
  console.log('获赞数:', result.data.likes)
  console.log('节点数:', result.data.nodes)
}
```

**统计字段**:


| 字段          | 说明      |
| ----------- | ------- |
| `articles`  | 发布的文章数量 |
| `followers` | 粉丝数量    |
| `likes`     | 获得的总点赞数 |
| `nodes`     | 收藏的节点数量 |


**性能优化**:

- 使用 `profiles` 表缓存字段
- React `cache()` 函数缓存结果
- 单次查询替代多次查询
- 触发器自动维护统计字段

---

### 4. 获取用户显示信息 (getUserDisplayInfo.ts)

统一转换用户数据，确保所有组件使用相同的显示逻辑。

#### 获取显示信息

```typescript
import { getUserDisplayInfo } from '@/lib/user/getUserDisplayInfo'

const displayInfo = getUserDisplayInfo(user, profile)

console.log('用户名:', displayInfo.username)
console.log('头像:', displayInfo.avatarUrl)
console.log('简介:', displayInfo.bio)
console.log('位置:', displayInfo.location)
console.log('加入日期:', displayInfo.joinDate)
```

**数据优先级**:

1. `profiles` 表数据（优先）
2. `user_metadata`（备用）
3. 默认值

**返回字段**:


| 字段          | 说明        |
| ----------- | --------- |
| `id`        | 用户ID      |
| `email`     | 邮箱        |
| `username`  | 用户名       |
| `avatarUrl` | 头像URL     |
| `bio`       | 个人简介      |
| `location`  | 位置        |
| `joinDate`  | 加入日期（格式化） |


---

### 5. 删除账户 (deleteAccount.ts)

**硬删除**用户账户及关联数据，操作不可逆。

#### 删除账户

```typescript
import { deleteAccount } from '@/lib/user/deleteAccount'

const result = await deleteAccount('当前密码')

if (result.success) {
  console.log('账户已删除')
  // 跳转到首页
} else {
  console.error('删除失败:', result.error)
}
```

**删除流程**:

1. 验证密码（二次确认）
2. 删除用户发布的所有文章
3. 匿名化用户的评论（保留内容，显示"已删除用户"）
4. 删除点赞记录
5. 删除收藏记录
6. 删除 profiles 表数据
7. 使用 Admin API 删除 Auth 用户
8. 退出登录

⚠️ **警告**: 此操作不可逆，数据将永久丢失。

---

### 6. 停用账户 (deactivateAccount.ts)

**软删除**用户账户，数据保留，可随时重新激活。

#### 停用账户

```typescript
import { deactivateAccount } from '@/lib/user/deactivateAccount'

const result = await deactivateAccount()

if (result.success) {
  console.log('账户已停用')
  // 跳转到登录页
}
```

#### 激活账户

```typescript
import { activateAccount } from '@/lib/user/deactivateAccount'

// 通常在登录时自动调用
const result = await activateAccount(userId)
```

#### 检查账户状态

```typescript
import { isAccountActive } from '@/lib/user/deactivateAccount'

const isActive = await isAccountActive(userId)
```

**停用效果**:

- 设置 `profiles.is_active = false`
- 文章对外不可见（通过查询过滤）
- 所有数据保留
- 重新登录自动激活

---

### 7. 关注功能 (actions/follow.ts)

关注/取消关注其他用户。

#### 关注/取消关注

```typescript
import { toggleFollow } from '@/lib/user/actions/follow'

const result = await toggleFollow('target-user-id')

if (result.success) {
  console.log(result.following ? '已关注' : '已取消关注')
}
```

#### 获取关注状态

```typescript
import { getFollowStatus } from '@/lib/user/actions/follow'

const result = await getFollowStatus('target-user-id')

if (result.success) {
  console.log('是否关注:', result.following)
  console.log('粉丝数:', result.followersCount)
  console.log('关注数:', result.followingCount)
}
```

**特性**:

- 使用唯一约束防重
- 触发器自动维护计数
- 不能关注自己
- 使用 `withAuth` 权限控制

## 类型定义

### UpdateProfileParams

```typescript
interface UpdateProfileParams {
  username?: string
  bio?: string
  location?: string
  avatar_url?: string
}
```

### UpdateProfileResult

```typescript
interface UpdateProfileResult {
  success: boolean
  error?: string
}
```

### UpdateEmailResult

```typescript
interface UpdateEmailResult {
  success: boolean
  needsConfirmation?: boolean
  message?: string
  error?: string
}
```

### UserStats

```typescript
interface UserStats {
  articles: number
  followers: number
  likes: number
  nodes: number
}
```

### UserDisplayInfo

```typescript
interface UserDisplayInfo {
  id: string
  email: string
  username: string
  avatarUrl: string
  bio: string
  location: string
  joinDate: string
}
```

### ToggleFollowResult

```typescript
interface ToggleFollowResult {
  success: boolean
  following: boolean
  error?: string
}
```

## 数据库表结构

### profiles 表

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  visibility VARCHAR(20) DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,
  
  -- 统计缓存字段
  articles_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  nodes_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### follows 表

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
```

## 关联文档

### 相关组件

- [设置中心组件文档](../../components/settings/README.md) - 账户设置 UI
- [个人主页组件文档](../../components/profile/README.md) - 用户资料展示
- [头像链路规范](./AVATAR_FLOW.md) - 头像真源、兜底与事件同步规则
- [头像维护手册](./AVATAR_MAINTENANCE.md) - 修改头像功能时的步骤与排查指南

### 相关类型

- `@/types/settings` - 设置相关类型定义
- `@/types` - 用户相关类型定义

### 相关服务

- `@/lib/supabase/server` - Supabase 服务端客户端
- `@/lib/supabase/admin` - Supabase Admin 客户端
- `@/lib/auth/permissions` - 权限控制
- `@/lib/auth/withPermission` - 权限包装器
- `@/lib/security/inputValidator` - 输入验证
- `@/lib/messages` - 消息常量

## 最佳实践

### 1. 资料更新后刷新页面

```typescript
const result = await updateProfile(params)
if (result.success) {
  router.refresh() // 刷新页面以显示新资料
}
```

### 2. 处理邮箱更换确认

```typescript
const result = await initiateEmailChange(newEmail)
if (result.success && result.needsConfirmation) {
  toast.success('验证邮件已发送，请查收')
}
```

### 3. 删除账户前二次确认

```typescript
// 显示确认对话框
const confirmed = await showConfirmDialog({
  title: '删除账户',
  description: '此操作不可逆，确定要删除吗？',
  confirmText: '删除',
  danger: true
})

if (confirmed) {
  const result = await deleteAccount(password)
}
```

### 4. 使用缓存的统计数据

```typescript
// 同一请求内多次调用会复用缓存
const stats1 = await getUserStats()
const stats2 = await getUserStats() // 使用缓存结果
```

### 5. 关注按钮状态管理

```typescript
const [following, setFollowing] = useState(false)

const handleFollow = async () => {
  const result = await toggleFollow(userId)
  if (result.success) {
    setFollowing(result.following)
  }
}
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-28**: 优化关注功能，使用 withAuth 包装器
- **2026-03-15**: 添加账户删除功能
- **2026-03-01**: 添加账户停用/激活功能
- **2026-02-20**: 初始版本，基础用户功能

## 统计信息

- **Server Actions**: 10+
- **功能模块**: 7个
- **数据库表**: 2个
- **类型定义**: 8个
- **最后更新**: 2026-03-29

