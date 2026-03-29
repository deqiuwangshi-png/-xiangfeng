# React Hooks 目录

## 目录结构

```
hooks/
├── README.md                   # 本文档
├── useArticleToast.ts          # 文章模块 Toast 提示
├── useArticleView.ts           # 文章浏览量统计
├── useAuthToast.ts             # 认证模块 Toast 提示
├── useContentProtection.ts     # 内容保护（防复制）
├── useDebouncedNavigation.ts   # 防抖导航
├── useInboxCache.ts            # 消息通知缓存
├── useLogout.ts                # 退出登录
├── useOptimisticNavigation.ts  # 乐观导航
├── usePermission.ts            # 权限控制
├── useRegisterForm.ts          # 注册表单管理
└── useUpdates.ts               # 更新日志管理
```

## 概述

本目录包含项目所有的自定义 React Hooks，用于封装可复用的状态逻辑和副作用处理。所有 Hooks 都遵循 React 最佳实践，支持 TypeScript 类型安全。

## Hooks 分类

### 1. Toast 提示类

#### useArticleToast

文章模块统一的 Toast 提示规范。

```typescript
import { useArticleToast } from '@/hooks/useArticleToast';

function ArticleActions() {
  const { showSuccess, showError, showNetworkError, showAuthRequired } = useArticleToast();
  
  const handleLike = async () => {
    try {
      await likeArticle(articleId);
      showSuccess('点赞'); // 显示"点赞成功"
    } catch (error) {
      if (error.code === 'NETWORK_ERROR') {
        showNetworkError();
      } else if (error.code === 'AUTH_REQUIRED') {
        showAuthRequired('点赞');
      } else {
        showError('操作失败', '请稍后重试');
      }
    }
  };
}
```

**提供方法：**
- `showSuccess(action, isUndo?, extra?)` - 成功提示
- `showError(reason, guidance?)` - 错误提示
- `showNetworkError(guidance?)` - 网络错误
- `showAuthRequired(action)` - 需要登录提示
- `showWarning(message)` - 警告提示
- `showInfo(message, description?)` - 信息提示
- `showCopySuccess(item?)` - 复制成功

#### useAuthToast

认证模块的 Toast 提示，支持错误类型自动识别。

```typescript
import { useAuthToast } from '@/hooks/useAuthToast';

function LoginForm() {
  const { showError, showSuccess, showLoading, dismiss, successFromLoading, errorFromLoading } = useAuthToast();
  
  const handleSubmit = async () => {
    const toastId = showLoading('登录中...');
    try {
      await login(credentials);
      successFromLoading(toastId, '登录成功');
    } catch (error) {
      errorFromLoading(toastId, error.message);
    }
  };
}
```

**错误类型自动识别：**
- `network` - 网络错误
- `validation` - 验证错误
- `rateLimit` - 频率限制
- `server` - 服务器错误
- `unknown` - 未知错误

### 2. 文章相关

#### useArticleView

文章浏览量统计和显示。

```typescript
import { useArticleView, useArticleViewCount } from '@/hooks/useArticleView';

// 在文章页面中自动统计浏览量
function ArticlePage({ articleId }: { articleId: string }) {
  useArticleView({ articleId });
  return <div>...</div>;
}

// 显示浏览量（支持实时更新）
function ArticleHeader({ article }: { article: Article }) {
  const { viewCount } = useArticleViewCount({
    articleId: article.id,
    initialCount: article.viewsCount || 0,
  });
  return <span>浏览 {viewCount}</span>;
}
```

**特性：**
- 页面加载 3 秒后自动统计（避免误刷）
- 使用 sessionStorage 防止同一会话重复计数
- 支持自定义事件实时更新浏览量显示

#### useContentProtection

文章内容防复制保护。

```typescript
import { useContentProtection } from '@/hooks/useContentProtection';

function ArticleContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useContentProtection(contentRef, {
    enabled: true,
    excludeSelectors: ['.code-block', '.share-button'],
    message: '文章内容受保护，禁止复制',
  });
  
  return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />;
}
```

**保护机制：**
- 禁用文本选择
- 禁用右键菜单
- 屏蔽复制/剪切/粘贴快捷键
- 屏蔽打印和保存快捷键
- 防止拖拽复制
- 支持排除特定元素

### 3. 导航相关

#### useDebouncedNavigation

防抖导航，防止用户快速连续点击导致的多次导航。

```typescript
import { useDebouncedNavigation } from '@/hooks/useDebouncedNavigation';

function ArticleCard({ article }: { article: Article }) {
  const { navigate, navigateImmediate, cancelNavigation, isNavigating } = useDebouncedNavigation({
    delay: 300,
    showLoading: true,
  });
  
  return (
    <div onClick={() => navigate(`/article/${article.id}`)}>
      {isNavigating() ? '加载中...' : article.title}
    </div>
  );
}
```

**配置选项：**
- `delay` - 防抖延迟（默认 300ms）
- `showLoading` - 是否显示加载状态（默认 true）

#### useOptimisticNavigation

乐观导航，使用 useTransition 实现非阻塞导航。

```typescript
import { useOptimisticNavigation } from '@/hooks/useOptimisticNavigation';

function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { navigate, prefetch, isPending, pendingUrl } = useOptimisticNavigation();
  
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      onMouseEnter={() => prefetch(href)}
      className={isPending && pendingUrl === href ? 'opacity-50' : ''}
    >
      {children}
    </a>
  );
}
```

### 4. 认证相关

#### useLogout

退出登录的状态管理和执行逻辑。

```typescript
import { useLogout } from '@/hooks/useLogout';

function UserMenu() {
  const { isLoggingOut, handleLogout, logout } = useLogout({
    redirectTo: '/login',
    onSuccess: () => console.log('退出成功'),
    onError: (error) => console.error('退出失败:', error),
  });
  
  return (
    <button onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? '退出中...' : '退出登录'}
    </button>
  );
}
```

**安全特性：**
- 使用 `sanitizeRedirect` 清洗跳转路径，防止开放重定向攻击
- 页面刷新确保中间件重新检查会话状态

#### usePermission

前端权限检查，控制 UI 元素显示和操作。

```typescript
import { usePermission } from '@/hooks/usePermission';

function LikeButton({ articleId }: { articleId: string }) {
  const { requireAuth, isChecking, showAuthRequired } = usePermission();
  
  const handleLike = async () => {
    const hasAuth = await requireAuth();
    if (!hasAuth) return;
    
    // 执行点赞操作
  };
  
  return (
    <button onClick={handleLike} disabled={isChecking}>
      点赞
    </button>
  );
}
```

**提供方法：**
- `checkAuth()` - 检查是否已认证
- `requireAuth(redirectTo?)` - 要求认证（未登录时跳转）
- `showAuthRequired(action?)` - 显示登录提示

#### useRegisterForm

注册表单的状态管理和验证。

```typescript
import { useRegisterForm } from '@/hooks/useRegisterForm';

function RegisterForm() {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    passwordValidation,
    updateField,
    submitForm,
    clearErrors,
    getPasswordStrengthColor,
  } = useRegisterForm();
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
      <input
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      {/* ... */}
    </form>
  );
}
```

**表单验证：**
- 邮箱格式验证
- 密码强度验证
- 确认密码匹配
- 用户名格式验证（2-20字符，支持中文）
- 服务条款同意

### 5. 消息通知

#### useInboxCache

消息通知的 SWR 全局缓存管理。

```typescript
import { useInboxCache, useInboxRealtime } from '@/hooks/useInboxCache';

function InboxPage({ userId }: { userId: string }) {
  const {
    groupedNotifications,
    isLoading,
    unreadCount,
    hasMore,
    activeFilter,
    setActiveFilter,
    loadMore,
    refresh,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  } = useInboxCache(userId);
  
  // 订阅实时更新
  useInboxRealtime(userId, refresh);
  
  return (
    <div>
      <span>未读: {unreadCount}</span>
      {groupedNotifications.map(group => (
        <NotificationGroup key={group.id} {...group} />
      ))}
      {hasMore && <button onClick={loadMore}>加载更多</button>}
    </div>
  );
}
```

**特性：**
- SWR 缓存避免重复获取
- 分页加载（每页 20 条）
- 按时间分组（今天、昨天、更早）
- 乐观更新（标记已读、删除）
- 实时订阅（Supabase Realtime）
- 筛选支持（全部、未读、提及、系统）

### 6. 其他

#### useUpdates

更新日志页面的状态管理。

```typescript
import { useUpdates } from '@/hooks/useUpdates';

function UpdatesPage({ initialUpdates }: { initialUpdates: MonthlyUpdate[] }) {
  const {
    updates,
    filteredUpdates,
    activeFilter,
    searchQuery,
    handleFilterChange,
    handleSearchChange,
  } = useUpdates(initialUpdates);
  
  return (
    <div>
      <FilterButtons active={activeFilter} onChange={handleFilterChange} />
      <SearchInput value={searchQuery} onChange={handleSearchChange} />
      <UpdateList updates={filteredUpdates} />
    </div>
  );
}
```

**功能：**
- 类型筛选（全部、新功能、修复、优化）
- 关键词搜索
- 使用 useMemo 缓存筛选结果

## 使用规范

### 1. 命名规范

- 所有 Hooks 以 `use` 开头
- 使用大驼峰命名法：`useArticleToast`
- 文件名与 Hook 名称一致

### 2. 类型定义

- 所有 Hooks 都包含完整的 TypeScript 类型定义
- 参数和返回值都有详细的 JSDoc 注释

```typescript
/**
 * Hook 参数接口
 */
interface UseXXXOptions {
  /** 参数说明 */
  param: string;
}

/**
 * Hook 返回值接口
 */
interface UseXXXReturn {
  /** 返回值说明 */
  data: DataType;
}
```

### 3. 错误处理

- 网络错误统一处理
- 提供用户友好的错误提示
- 支持错误恢复和重试

### 4. 性能优化

- 使用 `useCallback` 缓存函数
- 使用 `useMemo` 缓存计算结果
- 使用 `useRef` 避免重复创建
- 合理使用依赖数组

## 依赖模块

- [认证库](../lib/auth/README.md) - 认证相关 Hooks
- [文章库](../lib/articles/README.md) - 文章相关 Hooks
- [Supabase库](../lib/supabase/README.md) - 数据库操作
- [类型定义](../types/README.md) - Hooks 类型定义
