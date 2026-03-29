# React Hooks 目录

## 目录结构

```
hooks/
├── README.md                   # 本文档
├── index.ts                    # 统一导出入口
├── auth/                       # 认证相关 Hooks
│   ├── useAuthToast.ts         # 认证模块 Toast 提示
│   ├── useLogout.ts            # 退出登录
│   ├── usePermission.ts        # 权限控制
│   └── useRegisterForm.ts      # 注册表单管理
├── article/                    # 文章相关 Hooks
│   ├── useArticleToast.ts      # 文章模块 Toast 提示
│   ├── useArticleView.ts       # 文章浏览量统计
│   ├── useComments.ts          # 评论管理
│   ├── useCommentSub.ts        # 评论提交
│   └── useContentProtection.ts # 内容保护（防复制）
├── navigation/                 # 导航相关 Hooks
│   ├── useDebouncedNavigation.ts   # 防抖导航
│   └── useOptimisticNavigation.ts  # 乐观导航
├── notification/               # 通知相关 Hooks
│   └── useInboxCache.ts        # 消息通知缓存
├── updates/                    # 更新日志 Hooks
│   └── useUpdates.ts           # 更新日志管理
└── drafts/                     # 草稿管理 Hooks
    └── useDrafts.ts            # 草稿管理
```

## 概述

本目录包含项目所有的自定义 React Hooks，按功能分类组织到不同子目录中。所有 Hooks 都遵循 React 最佳实践，支持 TypeScript 类型安全。

## 导入方式

### 方式一：统一入口导入（推荐）

```typescript
import { useArticleToast, useComments, useLogout } from '@/hooks';
```

### 方式二：分类路径导入

```typescript
// Auth
import { useAuthToast } from '@/hooks/auth/useAuthToast';
import { useLogout } from '@/hooks/auth/useLogout';

// Article
import { useArticleToast } from '@/hooks/article/useArticleToast';
import { useComments } from '@/hooks/article/useComments';

// Navigation
import { useDebouncedNavigation } from '@/hooks/navigation/useDebouncedNavigation';

// Notification
import { useInboxCache } from '@/hooks/notification/useInboxCache';

// Updates
import { useUpdates } from '@/hooks/updates/useUpdates';

// Drafts
import { useDrafts } from '@/hooks/drafts/useDrafts';
```

## Hooks 分类

### 1. Auth 认证相关

#### useAuthToast

认证模块的 Toast 提示，支持错误类型自动识别。

```typescript
import { useAuthToast } from '@/hooks/auth/useAuthToast';

function LoginForm() {
  const { showError, showSuccess, showLoading } = useAuthToast();
  // ...
}
```

#### useLogout

退出登录的状态管理和执行逻辑。

```typescript
import { useLogout } from '@/hooks/auth/useLogout';

function UserMenu() {
  const { isLoggingOut, handleLogout } = useLogout({
    redirectTo: '/login',
  });
  // ...
}
```

#### usePermission

前端权限检查，控制 UI 元素显示和操作。

```typescript
import { usePermission } from '@/hooks/auth/usePermission';

function LikeButton() {
  const { requireAuth } = usePermission();
  // ...
}
```

#### useRegisterForm

注册表单的状态管理和验证。

```typescript
import { useRegisterForm } from '@/hooks/auth/useRegisterForm';

function RegisterForm() {
  const { formData, errors, submitForm } = useRegisterForm();
  // ...
}
```

### 2. Article 文章相关

#### useArticleToast

文章模块统一的 Toast 提示规范。

```typescript
import { useArticleToast } from '@/hooks/article/useArticleToast';

function ArticleActions() {
  const { showSuccess, showError, showAuthRequired } = useArticleToast();
  // ...
}
```

#### useArticleView

文章浏览量统计和显示。

```typescript
import { useArticleView } from '@/hooks/article/useArticleView';

function ArticlePage({ articleId }: { articleId: string }) {
  useArticleView({ articleId });
  // ...
}
```

#### useComments

评论数据管理 Hook。

```typescript
import { useComments } from '@/hooks/article/useComments';

function CommentPanel({ articleId, initialComments, initialTotalCount }) {
  const { comments, loadMore, toggleLike } = useComments(
    articleId,
    initialComments,
    initialTotalCount
  );
  // ...
}
```

#### useCommentSubmit

评论提交 Hook。

```typescript
import { useCommentSubmit } from '@/hooks/article/useCommentSub';

function CommentForm({ articleId, onCommentAdded }) {
  const { submit, sending, submitError } = useCommentSubmit(articleId, onCommentAdded);
  // ...
}
```

#### useContentProtection

文章内容防复制保护。

```typescript
import { useContentProtection } from '@/hooks/article/useContentProtection';

function ArticleContent({ content }) {
  const contentRef = useRef<HTMLDivElement>(null);
  useContentProtection(contentRef, { enabled: true });
  // ...
}
```

### 3. Navigation 导航相关

#### useDebouncedNavigation

防抖导航，防止用户快速连续点击导致的多次导航。

```typescript
import { useDebouncedNavigation } from '@/hooks/navigation/useDebouncedNavigation';

function ArticleCard({ article }) {
  const { navigate, isNavigating } = useDebouncedNavigation({ delay: 300 });
  // ...
}
```

#### useOptimisticNavigation

乐观导航，使用 useTransition 实现非阻塞导航。

```typescript
import { useOptimisticNavigation } from '@/hooks/navigation/useOptimisticNavigation';

function NavigationLink({ href, children }) {
  const { navigate, isPending } = useOptimisticNavigation();
  // ...
}
```

### 4. Notification 通知相关

#### useInboxCache

消息通知的 SWR 全局缓存管理。

```typescript
import { useInboxCache } from '@/hooks/notification/useInboxCache';

function InboxPage({ userId }: { userId: string }) {
  const { groupedNotifications, unreadCount } = useInboxCache(userId);
  // ...
}
```

### 5. Updates 更新日志

#### useUpdates

更新日志页面的状态管理。

```typescript
import { useUpdates } from '@/hooks/updates/useUpdates';

function UpdatesPage({ initialUpdates }) {
  const { filteredUpdates, activeFilter, handleFilterChange } = useUpdates(initialUpdates);
  // ...
}
```

### 6. Drafts 草稿管理

#### useDrafts

草稿管理 Hook，支持列表、筛选、分页、批量操作。

```typescript
import { useDrafts } from '@/hooks/drafts/useDrafts';

function DraftsPage({ initialArticles }) {
  const {
    drafts,
    filteredDrafts,
    paginatedDrafts,
    selectedIds,
    activeFilter,
    searchQuery,
    currentPage,
    viewMode,
    setActiveFilter,
    setSearchQuery,
    handleSelectDraft,
    executeDeleteDrafts,
  } = useDrafts(initialArticles, 6);
  // ...
}
```

**功能：**
- 草稿列表管理（SWR 缓存）
- 筛选和搜索
- 分页
- 批量选择和操作
- 批量发布/归档/删除

## 使用规范

### 1. 命名规范

- 所有 Hooks 以 `use` 开头
- 使用大驼峰命名法：`useArticleToast`
- 文件名与 Hook 名称一致

### 2. 目录组织

- 按功能分类到不同子目录
- 每个 Hook 一个文件
- 子目录名使用小写

### 3. 导入规范

```typescript
// ✅ 推荐：从统一入口导入
import { useArticleToast, useComments } from '@/hooks';

// ✅ 可选：从分类路径导入
import { useArticleToast } from '@/hooks/article/useArticleToast';

// ❌ 不推荐：过深的相对路径
import { useArticleToast } from '../../../hooks/article/useArticleToast';
```

### 4. 类型定义

- 所有 Hooks 都包含完整的 TypeScript 类型定义
- 参数和返回值都有详细的 JSDoc 注释

### 5. 性能优化

- 使用 `useCallback` 缓存函数
- 使用 `useMemo` 缓存计算结果
- 使用 `useRef` 避免重复创建
- 合理使用依赖数组

## 依赖模块

- [认证库](../lib/auth/README.md) - 认证相关 Hooks
- [文章库](../lib/articles/README.md) - 文章相关 Hooks
- [Supabase库](../lib/supabase/README.md) - 数据库操作
- [类型定义](../types/README.md) - Hooks 类型定义
