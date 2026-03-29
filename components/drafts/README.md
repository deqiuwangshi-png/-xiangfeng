# 草稿管理组件化架构

## 概述

草稿管理模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、可维护的文章和草稿管理页面。

## 项目结构

### 页面文件

```
app/(main)/drafts/
└── page.tsx                    # 草稿管理页面
```

### 组件文件

```
components/drafts/
├── index.ts                    # 组件索引文件（统一导出）
├── README.md                   # 组件文档
├── core/                       # 核心容器组件
│   ├── DraftsClient.tsx        # 草稿管理客户端协调组件
│   └── DraftsContent.tsx       # 草稿内容布局组件
├── header/                     # 头部组件
│   └── DraftsHeader.tsx        # 草稿页面头部组件
├── card/                       # 卡片展示组件
│   ├── DraftCard.tsx           # 草稿卡片组件
│   ├── DraftCardSkeleton.tsx   # 草稿卡片骨架屏
│   └── EmptyState.tsx          # 空状态组件
├── filter/                     # 筛选搜索组件
│   ├── FilterChips.tsx         # 筛选器组件
│   ├── SearchBox.tsx           # 搜索框组件
│   └── SelectAllCheckbox.tsx   # 全选复选框组件
├── navigation/                 # 导航分页组件
│   └── Pagination.tsx          # 分页器组件
└── actions/                    # 操作相关组件
    ├── BatchActionsBar.tsx     # 批量操作栏组件
    └── DeleteConfirmModal.tsx  # 删除确认弹窗组件
```

### 相关工具文件

```
lib/
├── drafts/
│   └── draftService.ts         # 草稿服务类（纯数据处理）
└── articles/
    └── actions/
        ├── crud.ts             # 文章 CRUD 操作
        └── query.ts            # 文章查询操作
```

## 组件说明

### 页面组件

#### 1. DraftsPage（草稿管理页面）

**位置**: `app/(main)/drafts/page.tsx`

**职责**: 草稿管理页面的入口

**功能**:
- 用户身份验证检查
- 未登录状态显示登录引导
- 使用 Suspense 优化 LCP
- 优先渲染骨架屏，减少感知时间

**性能优化**:
- 使用 Suspense 分离数据获取和渲染
- 骨架屏优化感知性能
- 独立获取草稿数据组件

**使用示例**:
```tsx
// 访问 /drafts 管理文章和草稿
```

### 核心容器组件

#### 2. DraftsClient（草稿管理客户端协调组件）

**位置**: `core/DraftsClient.tsx`

**职责**: 草稿管理的协调层组件

**功能**:
- 调用 useDrafts Hook 获取状态和方法
- 管理 DeleteConfirmModal 的显示状态和模式
- 协调各子组件的渲染和数据传递

**设计原则**:
- 遵循单一职责原则
- 不包含具体业务逻辑
- 仅负责组件协调

**使用示例**:
```tsx
<DraftsClient
  initialArticles={articles}
  filterOptions={filterOptions}
/>
```

#### 3. DraftsContent（草稿内容布局组件）

**位置**: `core/DraftssContent.tsx`

**职责**: 草稿内容区域的布局容器

**功能**:
- 组合 FilterChips、SearchBox、SelectAllCheckbox 等控制组件
- 渲染 DraftCard 列表或 EmptyState
- 渲染 Pagination（当需要时）

**设计原则**:
- 不包含业务逻辑
- 仅负责布局和组件组装

**使用示例**:
```tsx
<DraftsContent
  filterOptions={filterOptions}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
  searchPlaceholder="搜索草稿标题或内容..."
  onSearch={setSearchQuery}
  selectedIds={selectedIds}
  paginatedDrafts={paginatedDrafts}
  selection={selection}
  viewMode={viewMode}
  onSelectDraft={handleSelectDraft}
  onSelectAll={handleSelectAll}
  onEditDraft={handleEditDraft}
  onDeleteDraft={handleOpenDeleteModal}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### 头部组件

#### 4. DraftsHeader（草稿页面头部组件）

**位置**: `header/DraftsHeader.tsx`

**职责**: 草稿页面的头部展示和操作

**功能**:
- 显示页面标题和草稿数量
- 提供视图模式切换（列表/卡片）
- 提供清空草稿按钮

**设计原则**:
- 纯展示组件
- 不管理任何状态
- 所有交互通过回调函数传递

**使用示例**:
```tsx
<DraftsHeader
  articleCount={articleCount}
  draftCount={draftCount}
  onClearAllDrafts={handleClearAllDrafts}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>
```

### 卡片展示组件

#### 5. DraftCard（草稿卡片组件）

**位置**: `card/DraftCard.tsx`

**职责**: 草稿的展示和基本操作

**功能**:
- 支持双模式（卡片/列表）展示
- 显示草稿标题、摘要、状态、日期
- 悬浮显示操作按钮（继续编辑）
- 选择框支持批量操作

**交互**:
- 点击卡片：进入编辑模式
- 点击选择框：切换选中状态
- 悬浮时显示"继续编辑"按钮

**使用示例**:
```tsx
<DraftCard
  draft={draft}
  selected={selectedIds.has(draft.id)}
  viewMode={viewMode}
  onSelect={handleSelectDraft}
  onEdit={handleEditDraft}
  onDelete={onDeleteDraft}
/>
```

#### 6. DraftCardSkeleton（草稿卡片骨架屏）

**位置**: `card/DraftCardSkeleton.tsx`

**职责**: 草稿卡片加载状态的骨架屏

**功能**:
- 模拟 DraftCard 的布局结构
- 使用动画脉冲效果
- 优化 LCP 感知性能

**使用示例**:
```tsx
<DraftCardSkeleton count={6} />
```

#### 7. EmptyState（空状态组件）

**位置**: `card/EmptyState.tsx`

**职责**: 草稿列表空状态展示

**功能**:
- 显示空状态图标和提示文字
- 支持自定义标题和描述
- 支持传入操作区域（Client Component）

**优化**:
- Server Component 渲染
- 操作区域通过 children 传入

**使用示例**:
```tsx
<EmptyState
  title="暂无草稿"
  description="创建你的第一篇文章，开始记录灵感"
>
  <CreateDraftButton />
</EmptyState>
```

### 筛选搜索组件

#### 8. FilterChips（筛选器组件）

**位置**: `filter/FilterChips.tsx`

**职责**: 提供草稿状态筛选功能

**功能**:
- 显示筛选选项（全部、草稿、已发布、已归档）
- 点击切换激活状态
- 悬停显示边框和文字颜色变化

**使用示例**:
```tsx
<FilterChips
  options={filterOptions}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

#### 9. SearchBox（搜索框组件）

**位置**: `filter/SearchBox.tsx`

**职责**: 提供草稿搜索功能

**功能**:
- 输入搜索查询
- 防抖优化性能（300ms）
- 支持 Escape 键清空
- 支持清空按钮

**使用示例**:
```tsx
<SearchBox
  placeholder="搜索草稿标题或内容..."
  onSearch={setSearchQuery}
/>
```

#### 10. SelectAllCheckbox（全选复选框组件）

**位置**: `filter/SelectAllCheckbox.tsx`

**职责**: 显示全选复选框和选中数量

**功能**:
- 支持三种状态：未选中、部分选中、全部选中
- 显示选中数量
- 点击切换全选状态

**使用示例**:
```tsx
<SelectAllCheckbox
  selection={selection}
  selectedCount={selectedIds.size}
  onToggle={handleSelectAll}
/>
```

### 导航分页组件

#### 11. Pagination（分页器组件）

**位置**: `navigation/Pagination.tsx`

**职责**: 提供分页导航功能

**功能**:
- 显示页码导航
- 上一页/下一页按钮
- 省略号减少页码数量
- 响应式显示

**使用示例**:
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  maxVisiblePages={5}
/>
```

### 操作相关组件

#### 12. BatchActionsBar（批量操作栏组件）

**位置**: `actions/BatchActionsBar.tsx`

**职责**: 显示批量操作按钮

**功能**:
- 根据选中状态自动显示或隐藏
- 批量删除按钮
- 批量发布按钮
- 批量归档按钮
- 取消选择按钮

**使用示例**:
```tsx
<BatchActionsBar
  selectedCount={selectedIds.size}
  visible={selectedIds.size > 0}
  onDelete={handleOpenBatchDeleteModal}
  onPublish={handleBatchPublish}
  onArchive={handleBatchArchive}
  onCancel={handleCancelSelection}
/>
```

#### 13. DeleteConfirmModal（删除确认弹窗组件）

**位置**: `actions/DeleteConfirmModal.tsx`

**职责**: 统一的删除确认弹窗

**功能**:
- 支持三种模式：单篇删除、批量删除、清空草稿
- 显示警告信息和确认按钮
- 防止误操作

**使用示例**:
```tsx
<DeleteConfirmModal
  isOpen={deleteModal.isOpen}
  onClose={handleCloseDeleteModal}
  onConfirm={handleConfirmDelete}
  mode={deleteModal.mode}
  count={selectedIds.size}
  itemName={deleteModal.targetName}
/>
```

## 自定义 Hooks

### useDrafts（草稿管理 Hook）

**位置**: `@/hooks/drafts/useDrafts.ts`

**职责**: 提供草稿管理的完整状态和方法

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { useDrafts } from '@/hooks';

// 方式二：从分类路径导入
import { useDrafts } from '@/hooks/drafts/useDrafts';
```

**功能**:
- 使用 SWR 缓存草稿列表
- 筛选和搜索状态管理
- 分页状态管理
- 选择状态管理
- 视图模式管理（localStorage 持久化）
- 批量操作方法（删除、发布、归档）

**返回值**:
```typescript
interface UseDraftsReturn {
  drafts: DraftData[]
  filteredDrafts: DraftData[]
  paginatedDrafts: DraftData[]
  totalPages: number
  selectedIds: Set<string>
  selection: DraftSelection
  activeFilter: DraftFilter
  searchQuery: string
  currentPage: number
  viewMode: ViewMode
  isLoading: boolean
  setActiveFilter: (filter: DraftFilter) => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
  setViewMode: (mode: ViewMode) => void
  handleSelectDraft: (id: string) => void
  handleSelectAll: () => void
  handleEditDraft: (id: string) => void
  executeDeleteDrafts: (ids: string[]) => Promise<void>
  handleBatchPublish: () => Promise<void>
  handleBatchArchive: () => Promise<void>
  handleCancelSelection: () => void
  handleClearAllDrafts: () => Promise<void>
}
```

**使用示例**:
```tsx
const {
  filteredDrafts,
  paginatedDrafts,
  selectedIds,
  handleSelectDraft,
  handleEditDraft,
} = useDrafts(initialArticles)
```

## 工具类

### DraftService（草稿服务类）

**位置**: `lib/drafts/draftService.ts`

**职责**: 提供草稿数据的纯数据处理功能

**方法**:
- `convertToDraftData`: 将数据库文章转换为草稿数据格式
- `filterDraftsByStatus`: 根据状态筛选草稿
- `searchDraftsByQuery`: 根据搜索查询筛选草稿
- `filterDrafts`: 综合筛选和搜索
- `getPaginatedDrafts`: 分页获取草稿
- `getTotalPages`: 计算总页数

**使用示例**:
```typescript
const drafts = articles.map(DraftService.convertToDraftData)
const filtered = DraftService.filterDrafts(drafts, 'draft', '搜索词')
const paginated = DraftService.getPaginatedDrafts(filtered, 1, 6)
```

## 组件层次结构

```
DraftsPage (Server Component)
├── Suspense
│   └── DraftsSkeleton (骨架屏)
└── DraftsData
    └── DraftsClient (Client Component)
        ├── DraftsHeader
        ├── DraftsContent
        │   ├── FilterChips
        │   ├── SearchBox
        │   ├── SelectAllCheckbox
        │   ├── DraftCard / DraftCardSkeleton
        │   └── Pagination
        ├── BatchActionsBar
        └── DeleteConfirmModal
```

## 设计原则

### 1. 职责分离
- **Server Component**: 数据获取、身份验证
- **Client Component**: 交互逻辑、状态管理
- **纯数据处理**: DraftService 类
- **展示组件**: 无业务逻辑，仅负责渲染

### 2. 性能优化
- 使用 SWR 缓存草稿列表
- Suspense 优化 LCP
- 骨架屏优化感知性能
- 防抖优化搜索性能
- localStorage 持久化视图模式

### 3. 状态管理
- 使用 useState 管理本地状态
- 使用 SWR 管理服务器状态
- 单一数据源原则

### 4. 用户体验
- 批量操作支持
- 视图模式切换
- 筛选和搜索
- 分页导航
- 删除确认

## 数据流

```
Server Component (获取初始数据)
  ↓
DraftsClient (协调层)
  ↓
useDrafts Hook (状态管理)
  ↓
子组件 (通过 props 获取状态和回调)
  ↓
用户交互
  ↓
useDrafts Hook (更新状态)
  ↓
SWR (缓存和重新验证)
  ↓
子组件 (重新渲染)
```

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 去除彩色标签，保持界面安静
- 使用 Tailwind CSS v4 工具类

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 状态标签使用灰色系
- 操作按钮使用语义化颜色

## 更新时间

2026-03-29
