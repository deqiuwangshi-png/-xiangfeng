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
├── drafts/                     # 草稿管理 Hooks
│   └── useDrafts.ts            # 草稿管理
├── feedback/                   # 反馈中心 Hooks
│   ├── useFeedbackForm.ts      # 反馈表单
│   └── useFeedbackReplies.ts   # 反馈回复
├── publish/                    # 文章发布 Hooks
│   ├── useAutoSave.ts          # 自动保存
│   ├── useEditorActions.ts     # 编辑器操作
│   ├── useEditorState.ts       # 编辑器状态
│   └── useTipTapEditor.ts      # TipTap 编辑器
└── rewards/                    # 福利中心 Hooks
    ├── useExchangeRecords.ts   # 兑换记录
    ├── usePoints.ts            # 积分管理
    ├── useShop.ts              # 商城数据
    ├── useSignIn.ts            # 签到功能
    └── useTasks.ts             # 任务数据
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

// Feedback
import { useFeedbackForm } from '@/hooks/feedback/useFeedbackForm';
import { useFeedbackReplies } from '@/hooks/feedback/useFeedbackReplies';

// Publish
import { useAutoSave } from '@/hooks/publish/useAutoSave';
import { useEditorActions } from '@/hooks/publish/useEditorActions';
import { useEditorState } from '@/hooks/publish/useEditorState';
import { useTipTapEditor } from '@/hooks/publish/useTipTapEditor';

// Rewards
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords';
import { usePoints } from '@/hooks/rewards/usePoints';
import { useShop } from '@/hooks/rewards/useShop';
import { useSignIn } from '@/hooks/rewards/useSignIn';
import { useTasks } from '@/hooks/rewards/useTasks';
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

### 7. Feedback 反馈中心

#### useFeedbackForm

反馈表单逻辑 Hook，管理表单状态、验证和提交。

```typescript
import { useFeedbackForm } from '@/hooks/feedback/useFeedbackForm';

function FeedbackForm({ onSubmitSuccess }) {
  const {
    selectedType,
    setSelectedType,
    description,
    setDescription,
    uploadedFiles,
    setUploadedFiles,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useFeedbackForm({ onSubmitSuccess });
  // ...
}
```

**功能：**

- 表单状态管理（类型、描述、文件）
- 表单验证
- 文件上传（延迟到提交时）
- 提交状态管理

#### useFeedbackReplies

反馈回复管理 Hook，管理评论列表的加载和提交。

```typescript
import { useFeedbackReplies } from '@/hooks/feedback/useFeedbackReplies';

function ReplySection({ pageId }) {
  const {
    replies,
    isLoading,
    isSubmitting,
    submitError,
    loadReplies,
    submitNewReply,
  } = useFeedbackReplies({ pageId });
  // ...
}
```

**功能：**

- 评论列表加载
- 新评论提交
- 加载和提交状态管理

### 8. Publish 文章发布

#### useAutoSave

自动保存 Hook，定时自动保存草稿内容。

```typescript
import { useAutoSave } from '@/hooks/publish/useAutoSave';

function Editor({ editorState, saveDraft }) {
  useAutoSave(editorState, saveDraft);
  // ...
}
```

**功能：**

- 定时自动保存（30秒间隔）
- 静默保存模式
- 离开页面前保存提示

#### useEditorActions

编辑器操作 Hook，提供保存草稿、发布文章等功能。

```typescript
import { useEditorActions } from '@/hooks/publish/useEditorActions';

function Editor({ editorState, setEditorState }) {
  const { saveDraft, publishArticle, titleRef } = useEditorActions(
    editorState,
    setEditorState
  );
  // ...
}
```

**功能：**

- 保存草稿
- 发布文章
- 更新媒体状态
- 路由导航

#### useEditorState

编辑器状态管理 Hook，管理编辑器所有状态。

```typescript
import { useEditorState } from '@/hooks/publish/useEditorState';

function Editor({ initialTitle, initialContent, draftId }) {
  const [editorState, setEditorState] = useEditorState(
    initialTitle,
    initialContent,
    draftId
  );
  // ...
}
```

**功能：**

- 标题和内容状态
- 字数统计
- 全屏模式
- 工具栏折叠状态
- 保存/发布状态

#### useTipTapEditor

TipTap 编辑器 Hook，封装 TipTap 编辑器实例创建。

```typescript
import { useTipTapEditor } from '@/hooks/publish/useTipTapEditor';

function Editor({ content, onChange }) {
  const { editor, isMounted } = useTipTapEditor({
    content,
    onChange,
    placeholder: '开始书写...',
  });
  // ...
}
```

**功能：**

- TipTap 编辑器实例创建
- 图片上传处理
- 粘贴图片支持
- 自定义节点视图

### 9. Rewards 福利中心

#### useExchangeRecords

兑换记录 Hook，管理用户兑换记录。

```typescript
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords';

function ExchangeHistory() {
  const { records, isLoading, refreshRecords } = useExchangeRecords({ limit: 50 });
  // ...
}
```

**功能：**

- 兑换记录列表获取
- SWR 缓存优化
- 分页支持
- 数据刷新

#### usePoints

积分功能 Hook，管理用户积分总览和积分流水。

```typescript
import { usePoints } from '@/hooks/rewards/usePoints';

function PointsPage() {
  const { overview, transactions, isLoading, loadMoreTransactions } = usePoints();
  // ...
}
```

**功能：**

- 积分总览获取
- 积分流水查询
- 加载更多
- SWR 缓存

#### useShop

商城数据 Hook，管理商城商品数据和兑换操作。

```typescript
import { useShop } from '@/hooks/rewards/useShop';

function ShopPage({ category }) {
  const { items, isLoading, exchange, isExchanging } = useShop(category);
  // ...
}
```

**功能：**

- 商品列表获取
- 商品兑换
- 分类筛选
- 兑换状态管理

#### useSignIn

签到功能 Hook，管理签到状态和奖励。

```typescript
import { useSignIn } from '@/hooks/rewards/useSignIn';

function SignInCard() {
  const { isSigned, consecutiveDays, handleSignIn, isSigning } = useSignIn();
  // ...
}
```

**功能：**

- 签到状态查询
- 执行签到
- 连续签到天数
- 奖励配置获取

#### useTasks

任务数据 Hook，管理用户任务数据。

```typescript
import { useTasks } from '@/hooks/rewards/useTasks';

function TaskPage({ category }) {
  const { tasks, isLoading, claimReward, accept } = useTasks(category);
  // ...
}
```

**功能：**

- 任务列表获取
- 领取任务奖励
- 接取任务
- 任务状态管理

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

