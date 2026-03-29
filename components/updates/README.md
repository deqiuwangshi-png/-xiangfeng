# 更新日志组件库

## 概述

更新日志组件库提供完整的更新日志展示功能，包括版本卡片、更新条目、筛选按钮、月份分组等组件。采用服务端渲染 + 客户端交互的架构，支持 Markdown 数据源和类型筛选。

## 项目结构

```
components/updates/
├── index.ts              # 统一导出入口
├── UpdatesClient.tsx     # 更新日志客户端组件（主容器）
├── VersionCard.tsx       # 版本卡片组件
├── UpdateItem.tsx        # 更新条目组件
├── MonthHeader.tsx       # 月份标题组件
├── FilterButton.tsx      # 筛选按钮组件
└── README.md             # 本文档
```

## 相关文件

```
app/(main)/updates/
└── page.tsx              # 更新日志页面（服务端）

types/
└── updates.ts            # 类型定义

constants/
└── updates.ts            # 常量和模拟数据

hooks/
└── useUpdates.ts         # 状态管理 Hook

lib/updates/
├── updateService.ts      # 更新日志服务
└── markdownLoader.ts     # Markdown 数据加载器
```

## 组件说明

### 1. UpdatesClient（更新日志客户端组件）

**位置**: `UpdatesClient.tsx`

**职责**: 更新日志页面的主容器，处理客户端交互逻辑

**功能**:
- 显示页面头部（标题、描述、当前版本卡片）
- 显示筛选按钮（全部更新、新功能、改进优化、问题修复）
- 显示按月份分组的版本卡片列表
- 管理筛选状态

**Props 接口**:
```typescript
interface UpdatesClientProps {
  /** 初始更新数据（从服务端传入） */
  initialUpdates: MonthlyUpdate[]
  /** 最新版本号 */
  latestVersion: string
}
```

**页面结构**:
```
UpdatesClient
├── 头部区域
│   ├── 标题和图标
│   └── 当前版本卡片
├── 筛选按钮区域
│   ├── 全部更新
│   ├── 新功能
│   ├── 改进优化
│   └── 问题修复
└── 更新内容区域
    └── MonthHeader + VersionCard[]
```

**使用示例**:
```tsx
<UpdatesClient 
  initialUpdates={updatesData} 
  latestVersion="V2.5.0" 
/>
```

---

### 2. VersionCard（版本卡片组件）

**位置**: `VersionCard.tsx`

**职责**: 显示单个版本的更新信息

**功能**:
- 显示版本号和发布日期
- 显示版本标题
- 显示更新条目列表
- 根据版本类型显示不同颜色标签

**Props 接口**:
```typescript
interface VersionCardProps {
  /** 版本信息 */
  version: VersionInfo
}
```

**版本类型颜色**:
| 版本类型 | 背景色 | 说明 |
|----------|--------|------|
| MAJOR（主版本） | bg-xf-accent | 重大更新 |
| MINOR（次版本） | bg-xf-accent | 新功能 |
| PATCH（补丁） | bg-xf-primary | 问题修复 |

**样式结构**:
```
VersionCard
├── 版本标题行
│   ├── 版本号标签（带颜色）
│   └── 发布日期
├── 版本标题
└── 更新条目列表
    └── UpdateItemComponent[]
```

**使用示例**:
```tsx
<VersionCard version={versionInfo} />
```

---

### 3. UpdateItemComponent（更新条目组件）

**位置**: `UpdateItem.tsx`

**职责**: 显示单个更新条目

**功能**:
- 显示更新类型标签
- 显示更新描述

**Props 接口**:
```typescript
interface UpdateItemProps {
  /** 更新条目数据 */
  item: UpdateItem
}
```

**更新类型样式**:
| 类型 | 标签 | 背景色 | 文字色 |
|------|------|--------|--------|
| NEW | 新功能 | bg-green-50 | text-green-700 |
| IMPROVED | 改进 | bg-blue-50 | text-blue-700 |
| FIXED | 修复 | bg-red-50 | text-red-700 |

**使用示例**:
```tsx
<UpdateItemComponent item={updateItem} />
```

---

### 4. MonthHeader（月份标题组件）

**位置**: `MonthHeader.tsx`

**职责**: 显示月份分组标题

**功能**:
- 显示年份和月份
- 第一个月份使用强调色指示点

**Props 接口**:
```typescript
interface MonthHeaderProps {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 是否为第一个月份 */
  isFirst?: boolean
}
```

**样式**:
- 指示点：第一个月份 `bg-xf-accent`，其他 `bg-xf-primary`
- 标题格式：`YYYY年MM月`

**使用示例**:
```tsx
<MonthHeader year={2024} month={11} isFirst={true} />
```

---

### 5. FilterButton（筛选按钮组件）

**位置**: `FilterButton.tsx`

**职责**: 显示更新日志的筛选按钮

**功能**:
- 支持四种筛选类型
- 激活/未激活状态样式

**Props 接口**:
```typescript
interface FilterButtonProps {
  /** 筛选类型 */
  type: FilterType
  /** 按钮文本 */
  label: string
  /** 是否激活 */
  isActive: boolean
  /** 点击回调 */
  onClick: (type: FilterType) => void
}
```

**筛选类型**:
- `all` - 全部更新
- `new` - 新功能
- `improved` - 改进优化
- `fixed` - 问题修复

**样式状态**:
- 激活：`bg-xf-accent text-white`
- 未激活：`bg-white border border-xf-light text-xf-dark`

**使用示例**:
```tsx
<FilterButton
  type="new"
  label="新功能"
  isActive={activeFilter === 'new'}
  onClick={handleFilterChange}
/>
```

## 类型定义

### UpdateType（更新类型）

```typescript
enum UpdateType {
  NEW = 'new',           // 新功能
  IMPROVED = 'improved', // 改进优化
  FIXED = 'fixed'        // 问题修复
}
```

### VersionType（版本类型）

```typescript
enum VersionType {
  MAJOR = 'major',  // 主版本（重大更新）
  MINOR = 'minor',  // 次版本（新功能）
  PATCH = 'patch'   // 补丁版本（修复）
}
```

### 数据接口

```typescript
interface UpdateItem {
  type: UpdateType
  description: string
}

interface VersionInfo {
  version: string
  title: string
  date: string
  versionType: VersionType
  updates: UpdateItem[]
  categories: UpdateType[]
}

interface MonthlyUpdate {
  year: number
  month: number
  versions: VersionInfo[]
}

type FilterType = 'all' | UpdateType
```

## 数据流

```
Markdown 文件
    ↓
markdownLoader.ts (服务端)
    ↓
UpdatesPage (服务端组件)
    ↓
UpdatesClient (客户端组件)
    ↓
useUpdates Hook (状态管理)
    ↓
VersionCard / MonthHeader / FilterButton (展示组件)
```

## 页面架构

```
app/(main)/updates/page.tsx (服务端)
├── 从 Markdown 加载数据
├── 获取最新版本号
└── 渲染 UpdatesClient

UpdatesClient (客户端)
├── 使用 useUpdates 管理状态
├── 渲染筛选按钮
├── 渲染月份标题
└── 渲染版本卡片列表
```

## 数据源

### Markdown 文件

更新日志数据存储在 `content/updates/` 目录下的 Markdown 文件中：

```markdown
---
version: V2.5.0
title: 深度写作工具发布
date: 2024年11月28日
versionType: minor
---

## 新功能
- 新增AI辅助写作工具，支持思维导图式写作和结构建议
- 新增社区投票系统，用户可以对功能建议进行投票

## 改进优化
- 首页加载速度提升40%，大幅减少数据加载时间
```

### 备用数据

当 Markdown 文件不存在时，使用 `MOCK_UPDATES` 常量作为备用数据。

## 统一导出

```typescript
// 推荐导入方式
import { 
  UpdatesClient, 
  VersionCard, 
  UpdateItemComponent, 
  MonthHeader, 
  FilterButton 
} from '@/components/updates'
```

## 设计规范

### 颜色使用

- **主色调**: xf-accent（深紫色）
- **次要色**: xf-primary（紫色）
- **背景色**: xf-light（浅灰色）
- **成功**: green-50 / green-700
- **信息**: blue-50 / blue-700
- **错误**: red-50 / red-700

### 圆角规范

- 卡片：rounded-xl
- 按钮：rounded-lg
- 标签：rounded / rounded-lg

### 间距规范

- 卡片内边距：p-5
- 按钮内边距：px-4 py-2
- 列表间距：space-y-3
- 组件间距：gap-2 / gap-3

## 依赖关系

```
updates/
├── UpdatesClient
│   ├── @/components/icons (GitMerge)
│   ├── @/hooks/useUpdates
│   ├── @/types/updates
│   ├── FilterButton
│   ├── VersionCard
│   └── MonthHeader
├── VersionCard
│   ├── @/types/updates
│   ├── @/constants/updates
│   └── UpdateItemComponent
├── UpdateItemComponent
│   ├── @/types/updates
│   └── @/constants/updates
├── MonthHeader
│   └── (无依赖)
├── FilterButton
│   └── @/types/updates
└── index.ts
    └── 统一导出所有组件
```

## 相关服务

### UpdateService

位置: `lib/updates/updateService.ts`

功能:
- `filterByType()` - 按类型筛选更新
- `searchUpdates()` - 按关键词搜索更新

### MarkdownLoader

位置: `lib/updates/markdownLoader.ts`

功能:
- `loadUpdatesFromMarkdown()` - 从 Markdown 文件加载更新数据
- `getLatestVersionFromMarkdown()` - 获取最新版本号

## 使用示例

### 完整页面示例

```tsx
// app/(main)/updates/page.tsx
import { UpdatesClient } from '@/components/updates'
import { loadUpdatesFromMarkdown } from '@/lib/updates/markdownLoader'

export default function UpdatesPage() {
  const updates = loadUpdatesFromMarkdown()
  const latestVersion = getLatestVersionFromMarkdown()
  
  return (
    <UpdatesClient 
      initialUpdates={updates} 
      latestVersion={latestVersion} 
    />
  )
}
```

### 独立使用组件

```tsx
// 版本卡片
<VersionCard version={{
  version: 'V2.5.0',
  title: '深度写作工具发布',
  date: '2024年11月28日',
  versionType: VersionType.MINOR,
  updates: [...],
  categories: [UpdateType.NEW]
}} />

// 筛选按钮组
<div className="flex gap-2">
  <FilterButton
    type="all"
    label="全部更新"
    isActive={filter === 'all'}
    onClick={setFilter}
  />
  <FilterButton
    type="new"
    label="新功能"
    isActive={filter === 'new'}
    onClick={setFilter}
  />
</div>
```

## 更新记录

- **2026-02-20**: 添加 UpdatesClient 组件，整合所有子组件
- **2026-02-19**: 添加 VersionCard、UpdateItem、MonthHeader、FilterButton 组件
- **2026-02-19**: 初始版本，定义类型和常量

## 统计信息

- **组件总数**: 5个
- **客户端组件**: 2个（UpdatesClient、FilterButton）
- **服务端组件**: 3个（VersionCard、UpdateItemComponent、MonthHeader）
- **类型定义**: 5个枚举/接口
- **最后更新**: 2026-03-29
