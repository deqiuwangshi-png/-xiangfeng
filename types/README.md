# TypeScript 类型定义目录

## 目录结构

```
types/
├── README.md           # 本文档
├── index.ts            # 类型统一导出入口
├── article.ts          # 文章相关类型定义
├── auth.ts             # 认证相关类型定义
├── drafts.ts           # 草稿相关类型定义
├── feedback.ts         # 反馈相关类型定义
├── loginHistory.ts     # 登录历史类型定义
├── media.ts            # 媒体相关类型定义
├── notification.ts     # 通知相关类型定义
├── permissions.ts      # 权限相关类型定义
├── rewards.ts          # 积分奖励类型定义
├── settings.ts         # 设置相关类型定义
├── supabase.ts         # Supabase 数据库类型
├── updates.ts          # 更新日志类型定义
└── user.ts             # 用户相关类型定义
```

## 概述

本目录包含项目所有 TypeScript 类型定义，为整个应用提供类型安全支持。类型定义按照业务模块进行组织，确保代码的可维护性和类型一致性。

## 类型模块说明

### 1. 认证模块 (auth.ts)

定义用户认证相关的类型，包括登录、注册、密码验证等。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `AuthResult` | 认证操作结果 | 统一认证返回格式 |
| `AuthErrorType` | 认证错误类型 | 错误分类处理 |
| `RegisterFormData` | 注册表单数据 | 注册页面表单类型 |
| `RegisterFormErrors` | 注册表单错误 | 表单验证错误 |
| `UseRegisterFormReturn` | 注册 Hook 返回 | useRegisterForm 返回值 |
| `LoginFormData` | 登录表单数据 | 登录页面表单类型 |
| `LoginResult` | 登录结果 | 登录操作返回 |
| `LogoutResult` | 登出结果 | 登出操作返回 |
| `PasswordValidationResult` | 密码验证结果 | 密码强度检查 |
| `UpdateEmailResult` | 更新邮箱结果 | 邮箱修改操作 |
| `DeleteAccountResult` | 删除账户结果 | 账户删除操作 |
| `DeactivateAccountResult` | 停用账户结果 | 账户停用操作 |
| `RateLimitResult` | 限流结果 | 限流检查返回 |

**使用示例：**

```typescript
import type { LoginFormData, LoginResult } from '@/types';

async function handleLogin(data: LoginFormData): Promise<LoginResult> {
  // 登录逻辑
}
```

### 2. 文章模块 (article.ts)

定义文章、评论、点赞等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `ArticleStatus` | 文章状态 | 'draft' \| 'published' \| 'archived' |
| `Article` | 数据库文章 | 与 articles 表对应 |
| `ArticleAuthor` | 文章作者 | 作者基本信息 |
| `ArticleWithAuthor` | 带作者的文章 | 完整文章数据 |
| `ArticleCardData` | 文章卡片数据 | 列表展示用 |
| `Comment` | 评论数据 | 数据库评论结构 |
| `CommentWithAuthor` | 带作者的评论 | 完整评论数据 |
| `CommentSubmitData` | 评论提交数据 | 发表评论用 |
| `ToggleLikeResult` | 点赞结果 | 点赞操作返回 |
| `ToggleCommentLikeResult` | 评论点赞结果 | 评论点赞操作 |
| `SubmitCommentResult` | 提交评论结果 | 发表评论返回 |
| `GetCommentsResult` | 获取评论结果 | 评论列表返回 |
| `DeleteCommentResult` | 删除评论结果 | 删除评论操作 |
| `CreateArticleResult` | 创建文章结果 | 发布文章返回 |
| `UpdateArticleResult` | 更新文章结果 | 编辑文章返回 |
| `DeleteArticleResult` | 删除文章结果 | 删除文章操作 |

**组件 Props 类型：**

| 类型名 | 描述 |
|--------|------|
| `CommentPanelProps` | 评论面板组件属性 |
| `CommentCardProps` | 评论卡片组件属性 |
| `CommentListProps` | 评论列表组件属性 |
| `ArticleCardProps` | 文章卡片组件属性 |
| `ArticleHeaderProps` | 文章头部组件属性 |
| `ArticleContentProps` | 文章内容组件属性 |
| `CommentFormProps` | 评论表单组件属性 |
| `ArticlePageProps` | 文章页面组件属性 |

**常量：**

| 常量名 | 值 | 描述 |
|--------|-----|------|
| `MAX_COMMENTS_WITHOUT_LOGIN` | 3 | 未登录用户可查看的最大评论数 |

**使用示例：**

```typescript
import type { ArticleWithAuthor, ArticleStatus } from '@/types';

const article: ArticleWithAuthor = {
  id: 'uuid',
  title: '文章标题',
  status: 'published',
  // ... 其他字段
};
```

### 3. 用户模块 (user.ts)

定义用户资料、统计数据等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `User` | 用户数据 | 数据库用户表结构 |
| `UserProfile` | 用户资料 | 个人主页展示数据 |
| `UserStats` | 用户统计 | 文章数、获赞数等 |
| `UserWithStats` | 带统计的用户 | 完整用户数据 |
| `UpdateProfileData` | 更新资料数据 | 修改个人资料 |
| `UpdateProfileResult` | 更新资料结果 | 资料修改返回 |
| `UserDisplayInfo` | 用户展示信息 | 头像、昵称等 |
| `GetUserDisplayInfoResult` | 获取展示信息结果 | 用户信息查询 |
| `FollowResult` | 关注结果 | 关注操作返回 |
| `UnfollowResult` | 取消关注结果 | 取消关注操作 |
| `CheckFollowResult` | 检查关注结果 | 关注状态查询 |
| `GetFollowStatsResult` | 获取关注统计 | 粉丝数、关注数 |

**使用示例：**

```typescript
import type { UserProfile, UserStats } from '@/types';

interface ProfilePageProps {
  profile: UserProfile;
  stats: UserStats;
}
```

### 4. 草稿模块 (drafts.ts)

定义草稿箱相关的类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `Draft` | 草稿数据 | 数据库草稿结构 |
| `DraftWithAuthor` | 带作者的草稿 | 完整草稿数据 |
| `CreateDraftData` | 创建草稿数据 | 新建草稿 |
| `CreateDraftResult` | 创建草稿结果 | 创建操作返回 |
| `UpdateDraftData` | 更新草稿数据 | 编辑草稿 |
| `UpdateDraftResult` | 更新草稿结果 | 更新操作返回 |
| `DeleteDraftResult` | 删除草稿结果 | 删除操作返回 |
| `GetDraftsResult` | 获取草稿结果 | 草稿列表查询 |
| `PublishDraftResult` | 发布草稿结果 | 草稿转文章 |

**使用示例：**

```typescript
import type { Draft, CreateDraftData } from '@/types';

async function saveDraft(data: CreateDraftData): Promise<CreateDraftResult> {
  // 保存草稿逻辑
}
```

### 5. 反馈模块 (feedback.ts)

定义用户反馈、FAQ 等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `Feedback` | 反馈数据 | 用户反馈结构 |
| `FeedbackStatus` | 反馈状态 | 'pending' \| 'processing' \| 'resolved' |
| `FeedbackType` | 反馈类型 | 'bug' \| 'feature' \| 'other' |
| `FeedbackWithReplies` | 带回复的反馈 | 完整反馈数据 |
| `FeedbackReply` | 反馈回复 | 管理员回复 |
| `SubmitFeedbackData` | 提交反馈数据 | 创建反馈 |
| `SubmitFeedbackResult` | 提交反馈结果 | 提交操作返回 |
| `GetFeedbackResult` | 获取反馈结果 | 反馈列表查询 |
| `GetFeedbackDetailResult` | 获取反馈详情 | 单个反馈查询 |
| `FAQ` | FAQ 数据 | 常见问题 |
| `FAQCategory` | FAQ 分类 | 问题分类 |

**使用示例：**

```typescript
import type { Feedback, FeedbackStatus } from '@/types';

const feedback: Feedback = {
  id: 'uuid',
  type: 'bug',
  status: 'pending',
  // ... 其他字段
};
```

### 6. 积分奖励模块 (rewards.ts)

定义积分系统、任务系统、签到等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `UserPoints` | 用户积分 | 积分余额信息 |
| `PointsTransaction` | 积分交易 | 积分变动记录 |
| `PointsTransactionType` | 交易类型 | 'earn' \| 'spend' |
| `Task` | 任务数据 | 任务定义 |
| `TaskStatus` | 任务状态 | 'pending' \| 'completed' |
| `UserTask` | 用户任务 | 用户任务进度 |
| `SignInRecord` | 签到记录 | 签到历史 |
| `SignInResult` | 签到结果 | 签到操作返回 |
| `GetTasksResult` | 获取任务结果 | 任务列表查询 |
| `CompleteTaskResult` | 完成任务结果 | 任务完成操作 |
| `PointsHistoryResult` | 积分历史结果 | 积分记录查询 |
| `Product` | 商品数据 | 积分商城商品 |
| `ExchangeResult` | 兑换结果 | 商品兑换操作 |
| `RwMdProps` | 积分弹窗属性 | 积分组件 Props |
| `PtRwProps` | 积分提示属性 | 积分提示组件 |

**使用示例：**

```typescript
import type { UserPoints, Task, SignInRecord } from '@/types';

interface RewardsPageData {
  points: UserPoints;
  tasks: Task[];
  signInHistory: SignInRecord[];
}
```

### 7. 设置模块 (settings.ts)

定义用户设置、偏好等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `UserSettings` | 用户设置 | 所有设置项 |
| `NotificationSettings` | 通知设置 | 通知偏好 |
| `PrivacySettings` | 隐私设置 | 隐私选项 |
| `ThemeSettings` | 主题设置 | 外观主题 |
| `LanguageSettings` | 语言设置 | 语言偏好 |
| `UpdateSettingsData` | 更新设置数据 | 修改设置 |
| `UpdateSettingsResult` | 更新设置结果 | 设置保存返回 |
| `GetSettingsResult` | 获取设置结果 | 设置查询 |
| `SettingTab` | 设置标签页 | 设置页面标签 |

**使用示例：**

```typescript
import type { UserSettings, NotificationSettings } from '@/types';

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: false,
  },
  // ... 其他设置
};
```

### 8. 通知模块 (notification.ts)

定义系统通知、消息等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `Notification` | 通知数据 | 系统通知结构 |
| `NotificationType` | 通知类型 | 'like' \| 'comment' \| 'follow' 等 |
| `NotificationStatus` | 通知状态 | 'unread' \| 'read' |
| `NotificationWithActor` | 带触发者的通知 | 完整通知数据 |
| `GetNotificationsResult` | 获取通知结果 | 通知列表查询 |
| `MarkAsReadResult` | 标记已读结果 | 已读操作返回 |
| `MarkAllAsReadResult` | 全部已读结果 | 批量已读操作 |
| `DeleteNotificationResult` | 删除通知结果 | 删除操作返回 |
| `GetUnreadCountResult` | 获取未读数结果 | 未读数量查询 |

**使用示例：**

```typescript
import type { Notification, NotificationType } from '@/types';

const notification: Notification = {
  id: 'uuid',
  type: 'like',
  status: 'unread',
  // ... 其他字段
};
```

### 9. 媒体模块 (media.ts)

定义文件上传、图片处理等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `UploadResult` | 上传结果 | 文件上传返回 |
| `DeleteFileResult` | 删除文件结果 | 文件删除操作 |
| `MediaFile` | 媒体文件 | 文件信息 |
| `ImageMetadata` | 图片元数据 | 图片信息 |
| `UploadProgress` | 上传进度 | 进度跟踪 |

**使用示例：**

```typescript
import type { UploadResult, MediaFile } from '@/types';

async function uploadImage(file: File): Promise<UploadResult> {
  // 上传逻辑
}
```

### 10. 权限模块 (permissions.ts)

定义用户权限、角色等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `UserRole` | 用户角色 | 'user' \| 'admin' \| 'moderator' |
| `Permission` | 权限 | 具体权限项 |
| `RolePermissions` | 角色权限 | 角色权限映射 |
| `CheckPermissionResult` | 检查权限结果 | 权限检查返回 |
| `RequirePermissionResult` | 需要权限结果 | 权限要求返回 |

**使用示例：**

```typescript
import type { UserRole, Permission } from '@/types';

const adminPermissions: Permission[] = [
  'articles:delete',
  'users:manage',
  // ... 其他权限
];
```

### 11. 登录历史模块 (loginHistory.ts)

定义登录历史记录相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `LoginHistory` | 登录历史 | 登录记录结构 |
| `LoginDevice` | 登录设备 | 设备信息 |
| `LoginLocation` | 登录位置 | 地理位置 |
| `GetLoginHistoryResult` | 获取历史结果 | 历史记录查询 |
| `DeleteLoginHistoryResult` | 删除历史结果 | 记录删除操作 |

**使用示例：**

```typescript
import type { LoginHistory, LoginDevice } from '@/types';

const history: LoginHistory = {
  id: 'uuid',
  device: {
    type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
  },
  // ... 其他字段
};
```

### 12. 更新日志模块 (updates.ts)

定义版本更新、变更日志等相关类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `Update` | 更新数据 | 版本更新信息 |
| `UpdateType` | 更新类型 | 'feature' \| 'fix' \| 'improvement' |
| `UpdatePriority` | 更新优先级 | 'low' \| 'medium' \| 'high' |
| `VersionInfo` | 版本信息 | 版本详情 |
| `GetUpdatesResult` | 获取更新结果 | 更新列表查询 |
| `GetLatestVersionResult` | 获取最新版本 | 最新版本查询 |

**使用示例：**

```typescript
import type { Update, UpdateType } from '@/types';

const update: Update = {
  id: 'uuid',
  version: '1.2.0',
  type: 'feature',
  // ... 其他字段
};
```

### 13. Supabase 类型 (supabase.ts)

定义 Supabase 数据库相关的类型。

**核心类型：**

| 类型名 | 描述 | 用途 |
|--------|------|------|
| `Database` | 数据库类型 | Supabase 数据库定义 |
| `Tables` | 表类型 | 所有表定义 |
| `Enums` | 枚举类型 | 数据库枚举 |
| `CompositeTypes` | 复合类型 | 自定义类型 |

**使用示例：**

```typescript
import type { Database } from '@/types';

type ArticleRow = Database['public']['Tables']['articles']['Row'];
```

## 类型导出

所有类型都通过 `index.ts` 统一导出，使用时只需：

```typescript
// 推荐方式：从统一入口导入
import type { Article, User, AuthResult } from '@/types';

// 或者按需从具体文件导入
import type { Article } from '@/types/article';
```

## 类型使用规范

### 1. 命名规范

- 接口名使用 PascalCase：`ArticleWithAuthor`
- 类型别名使用 PascalCase：`ArticleStatus`
- Props 类型以 Props 结尾：`ArticleCardProps`
- Result 类型以 Result 结尾：`LoginResult`

### 2. 文档注释

所有类型定义都包含 JSDoc 注释：

```typescript
/**
 * 文章状态类型
 * @type ArticleStatus
 * @description 文章的发布状态
 */
export type ArticleStatus = 'draft' | 'published' | 'archived';

/**
 * 数据库文章数据接口
 * @interface Article
 * @description 与数据库 articles 表结构对应
 */
export interface Article {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
}
```

### 3. 类型组合

使用继承和交叉类型组合类型：

```typescript
// 接口继承
interface ArticleWithAuthor extends Article {
  author: ArticleAuthor;
}

// 交叉类型
type UserWithStats = User & UserStats;
```

## 相关模块

- [认证库](../lib/auth/README.md) - 认证相关类型使用
- [文章库](../lib/articles/README.md) - 文章相关类型使用
- [用户库](../lib/user/README.md) - 用户相关类型使用
- [设置库](../lib/settings/README.md) - 设置相关类型使用
- [Supabase库](../lib/supabase/README.md) - 数据库类型定义
