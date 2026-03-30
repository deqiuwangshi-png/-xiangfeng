# 设置模块 (Settings Module)

## 概述

设置模块提供用户偏好设置的统一管理功能，包括外观主题、通知偏好、隐私设置、内容语言等。采用统一的认证包装器和字段映射机制，确保代码一致性和可维护性。

## 核心特性

- **统一认证机制**: 使用 `withAuth` 包装器处理所有认证的设置操作
- **字段映射系统**: 前端 key 与数据库字段的映射，便于维护
- **分类管理**: 外观、通知、隐私、内容四大设置类别
- **关联账号管理**: 第三方 OAuth 账号的绑定与解绑
- **类型安全**: 完整的 TypeScript 类型定义

## 项目结构

```
lib/settings/
├── actions/                    # Server Actions 目录
│   ├── index.ts               # 统一导出入口
│   ├── appearance.ts          # 外观设置
│   ├── notifications.ts       # 通知设置
│   ├── privacy.ts             # 隐私设置
│   ├── content.ts             # 内容设置
│   └── linkedAccounts.ts      # 关联账号管理
├── constants/                  # 常量定义
│   └── field-maps.ts          # 字段映射常量
└── utils/                      # 工具函数
    └── auth.ts                # 认证工具函数
```

## 快速开始

### 统一导入（推荐）

```typescript
import { 
  getAppearanceSettings,
  updateAppearanceSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
  getContentSettings,
  updateContentSettings,
  getLinkedAccounts
} from '@/lib/settings/actions'
```

### 导入字段映射

```typescript
import { 
  NOTIFICATION_FIELD_MAP,
  APPEARANCE_FIELD_MAP,
  PRIVACY_FIELD_MAP,
  CONTENT_FIELD_MAP
} from '@/lib/settings/actions'
```

## 设置类别

### 1. 外观设置 (appearance.ts)

管理主题模式和主题背景设置。

#### 获取外观设置

```typescript
import { getAppearanceSettings } from '@/lib/settings/actions'

const result = await getAppearanceSettings()
if (result.success) {
  console.log('主题模式:', result.settings?.theme)        // 'light' | 'dark' | 'auto'
  console.log('主题背景:', result.settings?.theme_background) // 'default' | 'custom'
}
```

#### 更新外观设置

```typescript
import { updateAppearanceSettings } from '@/lib/settings/actions'

const formData = new FormData()
formData.append('key', 'theme')
formData.append('value', 'dark')

const result = await updateAppearanceSettings(formData)
```

**支持的外观设置项**:

| 前端 Key | 数据库字段 | 说明 |
|----------|------------|------|
| `theme` | `theme_mode` | 主题模式: light/dark/auto |
| `theme_background` | `theme_background` | 主题背景: default/custom |

---

### 2. 通知设置 (notifications.ts)

管理各类通知的接收偏好。

#### 获取通知设置

```typescript
import { getNotificationSettings } from '@/lib/settings/actions'

const result = await getNotificationSettings()
if (result.success) {
  console.log('邮件通知:', result.settings?.email)
  console.log('新粉丝:', result.settings?.newFollowers)
  console.log('评论:', result.settings?.comments)
  console.log('点赞:', result.settings?.likes)
  console.log('提及:', result.settings?.mentions)
  console.log('系统通知:', result.settings?.system)
  console.log('成就:', result.settings?.achievements)
}
```

#### 更新通知设置

```typescript
import { updateNotificationSettings } from '@/lib/settings/actions'

const formData = new FormData()
formData.append('key', 'email')
formData.append('value', 'true')

const result = await updateNotificationSettings(formData)
```

**支持的通知设置项**:

| 前端 Key | 数据库字段 | 说明 |
|----------|------------|------|
| `email` | `email_notifications` | 邮件通知 |
| `newFollowers` | `notify_new_follower` | 新粉丝通知 |
| `comments` | `notify_comment` | 评论通知 |
| `likes` | `notify_like` | 点赞通知 |
| `mentions` | `notify_mention` | 提及通知 |
| `system` | `notify_system` | 系统通知 |
| `achievements` | `notify_achievement` | 成就通知 |

---

### 3. 隐私设置 (privacy.ts)

管理个人资料可见性等隐私选项。

**注意**: 隐私设置存储在 `profiles` 表，而非 `user_settings` 表。

#### 获取隐私设置

```typescript
import { getPrivacySettings } from '@/lib/settings/actions'

const result = await getPrivacySettings()
if (result.success) {
  console.log('资料可见性:', result.settings?.profileVisibility) // 'public' | 'private'
}
```

#### 更新隐私设置

```typescript
import { updatePrivacySettings } from '@/lib/settings/actions'

const formData = new FormData()
formData.append('key', 'profile_visible')
formData.append('value', 'public')

const result = await updatePrivacySettings(formData)
```

**支持的隐私设置项**:

| 前端 Key | 数据库字段 | 说明 |
|----------|------------|------|
| `profile_visible` | `visibility` | 资料可见性: public/private |

---

### 4. 内容设置 (content.ts)

管理内容语言偏好。

#### 获取内容设置

```typescript
import { getContentSettings } from '@/lib/settings/actions'

const result = await getContentSettings()
if (result.success) {
  console.log('内容语言:', result.content_language) // 'zh-CN' | 'zh-TW' | 'en' | 'ja'
}
```

#### 更新内容语言

```typescript
import { updateContentLanguage } from '@/lib/settings/actions'

const result = await updateContentLanguage('en')
```

#### 更新内容设置（通用接口）

```typescript
import { updateContentSettings } from '@/lib/settings/actions'

const formData = new FormData()
formData.append('key', 'language')
formData.append('value', 'zh-CN')

const result = await updateContentSettings(formData)
```

**支持的内容设置项**:

| 前端 Key | 数据库字段 | 说明 |
|----------|------------|------|
| `language` | `content_language` | 内容语言 |

**支持的语言**:
- `zh-CN` - 简体中文
- `zh-TW` - 繁体中文
- `en` - 英语
- `ja` - 日语

---

### 5. 关联账号管理 (linkedAccounts.ts)

管理第三方 OAuth 账号的绑定与解绑。

#### 获取已关联账号

```typescript
import { getLinkedAccounts } from '@/lib/settings/actions'

const result = await getLinkedAccounts()
if (result.success) {
  result.accounts.forEach(account => {
    console.log('提供商:', account.name)
    console.log('已绑定:', account.connected)
    console.log('邮箱:', account.email)
  })
}
```

#### 支持的 OAuth 提供商

| 提供商 | 状态 | Supabase Provider |
|--------|------|-------------------|
| GitHub | ✅ 已启用 | github |
| Google | ⏸️ 预留 | google |

## 认证工具

### withAuth 包装器

所有设置操作都使用 `withAuth` 包装器进行认证验证。

```typescript
import { withAuth } from '@/lib/settings/actions'

const result = await withAuth(async (user, supabase) => {
  // 在认证上下文中执行操作
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    
  return data
})
```

### verifyAuth 函数

用于单独验证认证状态。

```typescript
import { verifyAuth } from '@/lib/settings/actions'

const authResult = await verifyAuth()
if (authResult.success) {
  console.log('用户:', authResult.user)
  console.log('Supabase 客户端:', authResult.supabase)
} else {
  console.error('认证失败:', authResult.error)
}
```

## 字段映射常量

### NOTIFICATION_FIELD_MAP

通知设置的前端 key 到数据库字段的映射。

```typescript
import { NOTIFICATION_FIELD_MAP } from '@/lib/settings/actions'

// { email: 'email_notifications', newFollowers: 'notify_new_follower', ... }
console.log(NOTIFICATION_FIELD_MAP)
```

### APPEARANCE_FIELD_MAP

外观设置的字段映射。

```typescript
import { APPEARANCE_FIELD_MAP } from '@/lib/settings/actions'

// { theme: 'theme_mode', theme_background: 'theme_background' }
console.log(APPEARANCE_FIELD_MAP)
```

### PRIVACY_FIELD_MAP

隐私设置的字段映射。

```typescript
import { PRIVACY_FIELD_MAP } from '@/lib/settings/actions'

// { profile_visible: 'visibility' }
console.log(PRIVACY_FIELD_MAP)
```

### CONTENT_FIELD_MAP

内容设置的字段映射。

```typescript
import { CONTENT_FIELD_MAP } from '@/lib/settings/actions'

// { language: 'content_language' }
console.log(CONTENT_FIELD_MAP)
```

## 类型定义

### AppearanceSettingsResult

```typescript
interface AppearanceSettingsResult {
  success: boolean
  settings?: {
    theme: string
    theme_background: string
  }
  error?: string
}
```

### NotificationSettingsResult

```typescript
interface NotificationSettingsResult {
  success: boolean
  settings?: Record<string, boolean>
  error?: string
}
```

### PrivacySettingsResult

```typescript
interface PrivacySettingsResult {
  success: boolean
  settings?: {
    profileVisibility: string
  }
  error?: string
}
```

### ContentSettingsResult

```typescript
interface ContentSettingsResult {
  success: boolean
  content_language?: string
  error?: string
}
```

### GetLinkedAccountsResult

```typescript
interface GetLinkedAccountsResult {
  success: boolean
  accounts?: LinkedAccountItem[]
  error?: string
}

interface LinkedAccountItem {
  id: string
  name: string
  connected: boolean
  email?: string
}
```

## 数据库表结构

### user_settings 表

存储外观、通知、内容设置。

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 外观设置
  theme_mode VARCHAR(20) DEFAULT 'auto',
  theme_background VARCHAR(50) DEFAULT 'default',
  
  -- 通知设置
  email_notifications BOOLEAN DEFAULT true,
  notify_new_follower BOOLEAN DEFAULT true,
  notify_comment BOOLEAN DEFAULT true,
  notify_like BOOLEAN DEFAULT true,
  notify_mention BOOLEAN DEFAULT true,
  notify_system BOOLEAN DEFAULT true,
  notify_achievement BOOLEAN DEFAULT true,
  
  -- 内容设置
  content_language VARCHAR(10) DEFAULT 'zh-CN',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### profiles 表

存储隐私设置（visibility 字段）。

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  visibility VARCHAR(20) DEFAULT 'public', -- 隐私设置
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_identities 表

存储关联的第三方账号。

```sql
CREATE TABLE user_identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  display_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);
```

## 关联文档

### 相关组件

- [设置中心组件文档](../../components/settings/README.md) - 设置页面 UI 组件

### 相关类型

- `@/types/settings` - 设置相关类型定义

### 相关服务

- `@/lib/supabase/server` - Supabase 服务端客户端
- `@/lib/messages` - 消息常量

## 最佳实践

### 1. 使用统一导入

```typescript
// ✅ 推荐
import { getAppearanceSettings, updateAppearanceSettings } from '@/lib/settings/actions'

// ❌ 不推荐（直接导入具体文件）
import { getAppearanceSettings } from '@/lib/settings/actions/appearance'
```

### 2. 处理默认值

```typescript
const result = await getNotificationSettings()
const settings = result.success ? result.settings : {
  email: true,
  newFollowers: true,
  // ... 其他默认值
}
```

### 3. 表单数据处理

```typescript
const formData = new FormData()
formData.append('key', 'theme')
formData.append('value', 'dark')

const result = await updateAppearanceSettings(formData)
if (!result.success) {
  toast.error(result.error)
}
```

### 4. 语言切换

```typescript
const result = await updateContentLanguage('en')
if (result.success) {
  // 刷新页面或更新 UI
  router.refresh()
}
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-28**: 将 theme_color 改为 theme_background
- **2026-03-15**: 添加关联账号管理功能
- **2026-03-01**: 优化认证工具函数
- **2026-02-20**: 初始版本，基础设置功能

## 统计信息

- **Server Actions**: 11个
- **设置类别**: 4类
- **字段映射**: 4组
- **OAuth 提供商**: 2个
- **最后更新**: 2026-03-29
