# 消息中心组件化架构

## 概述

消息中心模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、实时的消息通知系统。支持消息筛选、批量操作、实时更新等功能。

## 项目结构

### 页面文件

```
app/(main)/inbox/
├── page.tsx                    # 消息页面主入口
```

### 组件文件

```
components/inbox/
├── _client/                    # 客户端组件
│   └── InboxClient.tsx         # 消息页主客户端组件
├── _header/                    # 头部组件
│   ├── InboxHeader.tsx         # 消息页头部（Client）
│   └── InboxTitle.tsx          # 消息页标题（Server）
├── _filters/                   # 筛选组件
│   └── FilterTabs.tsx          # 筛选标签栏
├── _list/                      # 列表组件
│   ├── NotifList.tsx           # 通知列表
│   ├── NotifCard.tsx           # 通知卡片
│   ├── EmptyState.tsx          # 空状态
│   ├── CardSkeleton.tsx        # 卡片骨架屏
│   └── LoadMoreBtn.tsx         # 加载更多按钮
├── _actions/                   # 操作组件
│   ├── NotifActions.tsx        # 通知操作按钮
│   ├── BatchSelectBox.tsx      # 批量选择复选框
│   └── DeleteBtn.tsx           # 删除按钮
└── _dialog/                    # 对话框组件
    └── DelConfirmDlg.tsx       # 删除确认弹窗
```

## 组件说明

### 核心容器组件

#### 1. InboxClient（消息页客户端组件）

**位置**: `_client/InboxClient.tsx`

**职责**: 消息页主客户端组件，管理所有状态和交互

**功能**:
- 批量模式管理
- 消息筛选（全部/未读/提及/系统）
- 消息列表展示
- 全部已读
- 批量删除
- 单个删除
- 标记已读
- Realtime 实时更新订阅

**状态管理**:
- `isBatchMode`: 批量模式状态
- `selectedIds`: 选中的消息ID集合
- `showBatchDeleteDialog`: 批量删除确认弹窗显示状态

**使用示例**:
```tsx
<InboxClient userId={userId} />
```

### 头部组件

#### 2. InboxHeader（消息页头部组件）

**位置**: `_header/InboxHeader.tsx`

**职责**: 消息页头部，包含操作按钮

**功能**:
- 全部已读按钮
- 批量删除入口
- 批量模式操作（取消、删除）
- 未读数量显示
- 后台更新指示器

**使用示例**:
```tsx
<InboxHeader
  onMarkAllAsRead={handleMarkAllAsRead}
  onBatchDelete={handleBatchDelete}
  isBatchMode={isBatchMode}
  onToggleBatchMode={toggleBatchMode}
  selectedCount={selectedIds.size}
  onCancelBatch={cancelBatchMode}
  unreadCount={unreadCount}
  isValidating={isValidating}
/>
```

#### 3. InboxTitle（消息页标题组件）

**位置**: `_header/InboxTitle.tsx`

**职责**: 消息页面标题区域，服务端渲染

**功能**:
- 标题显示
- 未读数量徽章

**优化说明**: 从 InboxHeader 提取为独立 Server Component，减少客户端 JS

**使用示例**:
```tsx
<InboxTitle unreadCount={5} />
```

### 筛选组件

#### 4. FilterTabs（筛选标签组件）

**位置**: `_filters/FilterTabs.tsx`

**职责**: 消息页面筛选标签栏

**功能**:
- 4种筛选类型：全部、未读、提及、系统
- 标签切换

**筛选类型**:
- `all`: 全部消息
- `unread`: 未读消息
- `mention`: 提及消息
- `system`: 系统消息

**使用示例**:
```tsx
<FilterTabs
  activeFilter="all"
  onFilterChange={setActiveFilter}
/>
```

### 列表组件

#### 5. NotifList（通知列表组件）

**位置**: `_list/NotifList.tsx`

**职责**: 按时间分组展示通知列表

**功能**:
- 分组显示（今天、昨天、更早）
- 通知卡片列表
- 加载更多
- 批量选择支持

**使用示例**:
```tsx
<NotifList
  groupedNotifications={groupedNotifications}
  onMarkAsRead={handleMarkAsRead}
  onLoadMore={loadMore}
  hasMore={hasMore}
  onDelete={handleDelete}
  isBatchMode={isBatchMode}
  onSelect={selectNotification}
  selectedIds={selectedIds}
/>
```

#### 6. NotifCard（通知卡片组件）

**位置**: `_list/NotifCard.tsx`

**职责**: 显示单条通知信息

**功能**:
- 通知图标显示
- 用户信息展示
- 消息内容
- 时间显示
- 已读/未读状态
- 批量选择支持
- 删除操作

**性能优化**:
- 使用 `memo` 优化避免不必要的重渲染
- LCP 关键元素优化渲染性能

**使用示例**:
```tsx
<NotifCard
  notification={notification}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
  isBatchMode={isBatchMode}
  onSelect={handleSelect}
  isSelected={selectedIds.has(notification.id)}
/>
```

#### 7. EmptyState（空状态组件）

**位置**: `_list/EmptyState.tsx`

**职责**: 无消息时的空状态展示

**功能**:
- 图标显示
- 标题和描述
- 服务端渲染

**使用示例**:
```tsx
<EmptyState
  title="暂无通知"
  description="当有新消息时，会显示在这里"
/>
```

#### 8. CardSkeleton（卡片骨架屏组件）

**位置**: `_list/CardSkeleton.tsx`

**职责**: 用于 Suspense fallback，优化 LCP 感知性能

**功能**:
- 卡片骨架展示
- 可配置数量
- 服务端渲染

**使用示例**:
```tsx
<CardSkeleton count={5} />
```

#### 9. LoadMoreBtn（加载更多按钮组件）

**位置**: `_list/LoadMoreBtn.tsx`

**职责**: 列表底部加载更多按钮

**功能**:
- 加载更多触发
- 图标显示

**使用示例**:
```tsx
<LoadMoreBtn onClick={loadMore} />
```

### 操作组件

#### 10. NotifActions（通知操作按钮组件）

**位置**: `_actions/NotifActions.tsx`

**职责**: 通知卡片右侧的操作按钮区域

**功能**:
- 删除按钮（已读消息）
- 更多按钮（未读消息或批量模式）

**使用示例**:
```tsx
<NotificationActions
  canDelete={!notification.unread}
  isBatchMode={isBatchMode}
  isUnread={notification.unread}
  onDelete={handleDelete}
/>
```

#### 11. BatchSelectBox（批量选择复选框组件）

**位置**: `_actions/BatchSelectBox.tsx`

**职责**: 批量模式下通知卡片的选择复选框

**功能**:
- 复选框显示
- 选择状态变化
- 事件冒泡阻止

**使用示例**:
```tsx
<BatchSelectBox
  isSelected={isSelected}
  onSelect={handleSelect}
/>
```

#### 12. DeleteBtn（删除按钮组件）

**位置**: `_actions/DeleteBtn.tsx`

**职责**: 带确认弹窗的删除按钮

**功能**:
- 删除按钮显示
- 确认弹窗管理
- 删除操作触发

**使用示例**:
```tsx
<DeleteBtn onDelete={handleDelete} title="删除" />
```

### 对话框组件

#### 13. DeleteConfirmDialog（删除确认弹窗组件）

**位置**: `_dialog/DelConfirmDlg.tsx`

**职责**: 删除操作的二次确认弹窗

**功能**:
- 单条删除确认
- 批量删除确认（显示数量）
- 取消和确认按钮
- 遮罩层点击关闭

**使用示例**:
```tsx
<DeleteConfirmDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleConfirm}
  count={selectedIds.size}
/>
```

## 页面组件

### 消息页面主入口

**位置**: `app/(main)/inbox/page.tsx`

**职责**: 消息页面入口，获取用户信息并传递给客户端组件

**功能**:
- 用户身份验证
- 未登录状态显示登录引导
- 传递 userId 给 InboxClient

**使用示例**:
```tsx
// Server Component
export default async function InboxPage() {
  const profile = await getCurrentUserWithProfile()
  
  if (!profile) {
    return <AuthRequiredContent ... />
  }
  
  return <InboxClient userId={profile.id} />
}
```

## 组件层次结构

```
InboxPage (Server Component)
├── AuthRequiredContent (未登录时)
└── InboxClient (Client)
    ├── InboxHeader (Client)
    │   └── InboxTitle (Server)
    ├── FilterTabs (Client)
    ├── NotifList (Client)
    │   └── NotifCard (Client, memo)
    │       ├── BatchSelectBox (Client)
    │       └── NotificationActions (Client)
    │           └── DeleteBtn (Client)
    │               └── DeleteConfirmDialog (Client)
    ├── EmptyState (Server)
    ├── CardSkeleton (Server)
    └── DeleteConfirmDialog (批量删除)
```

## 自定义 Hooks

### useInboxCache（消息缓存 Hook）

**位置**: `hooks/useInboxCache.ts`

**职责**: 管理消息数据的获取、缓存和更新

**功能**:
- SWR 全局缓存
- 消息分组（今天、昨天、更早）
- 筛选功能
- 分页加载
- 标记已读
- 删除消息
- 批量删除

**使用示例**:
```tsx
const {
  groupedNotifications,
  isLoading,
  isValidating,
  hasMore,
  unreadCount,
  activeFilter,
  setActiveFilter,
  loadMore,
  refresh,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  batchDeleteNotifications,
} = useInboxCache(userId)
```

### useInboxRealtime（实时更新 Hook）

**位置**: `hooks/useInboxCache.ts`

**职责**: 订阅 Realtime，接收新通知时触发增量更新

**功能**:
- Supabase Realtime 订阅
- 新通知自动刷新
- 连接状态管理

**使用示例**:
```tsx
useInboxRealtime(userId, refresh)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面入口、静态内容、骨架屏
- **Client Component**: 交互逻辑、状态管理、动态内容
- **Hooks**: 数据获取、缓存管理、业务逻辑

### 2. 性能优化
- Server Component 优先渲染
- SWR 全局缓存，页面切换不重复加载
- 骨架屏优化感知性能
- memo 优化避免不必要的重渲染
- LCP 关键元素优化

### 3. 状态管理
- 使用 SWR 管理服务器状态
- 使用 useState 管理本地状态
- 单一数据源原则

### 4. 用户体验
- 实时更新
- 流畅的动画过渡
- 清晰的加载状态
- 友好的错误提示
- 批量操作支持

## 数据流

```
Server Component (获取用户信息)
  ↓
InboxClient (通过 useInboxCache 获取数据)
  ↓
SWR (全局缓存)
  ↓
用户交互
  ↓
Server Action / API 调用
  ↓
SWR 重新验证
  ↓
UI 更新

Realtime 订阅 (并行)
  ↓
收到新通知
  ↓
触发 refresh
  ↓
SWR 重新获取数据
  ↓
UI 更新
```

## 消息分组逻辑

消息按时间分为三组：

1. **今天**: 当天收到的消息
2. **昨天**: 昨天收到的消息
3. **更早**: 更早之前的消息

## 筛选类型

- **全部**: 显示所有消息
- **未读**: 仅显示未读消息
- **提及**: 仅显示提及消息
- **系统**: 仅显示系统消息

## 批量操作

### 进入批量模式
1. 点击"批量选择"按钮
2. 消息卡片显示复选框
3. 点击卡片或复选框选择消息

### 批量删除
1. 选择要删除的消息（仅已读消息可删除）
2. 点击"删除"按钮
3. 确认弹窗确认删除
4. 批量删除选中的消息

## 实时更新

使用 Supabase Realtime 订阅新通知：
- 订阅 `notifications` 表的 INSERT 事件
- 收到新通知时触发 SWR 重新验证
- 自动更新未读数量

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 卡片式布局
- 圆角设计

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 未读消息左侧边框：xf-primary
- 选中状态：ring-xf-primary + bg-blue-50

### 响应式设计
- 移动端优化触摸区域
- 批量选择框移动端放大
- 按钮和文字大小适配

## 更新时间

2026-03-29
