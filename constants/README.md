# 常量定义目录

## 目录结构

```
constants/
├── README.md               # 本文档
├── contentProtection.ts    # 内容保护配置
├── drafts.ts               # 草稿相关常量
└── updates.ts              # 更新日志常量
```

## 概述

本目录包含项目中使用的各种常量定义，包括配置项、样式映射、筛选选项等。常量按照功能模块进行组织，便于维护和复用。

## 常量模块说明

### 1. 内容保护配置 (contentProtection.ts)

定义文章内容防复制功能的配置开关和参数。

**核心常量：**

| 常量名 | 类型 | 描述 |
|--------|------|------|
| `ENABLE_CONTENT_PROTECTION` | boolean | 全局内容保护开关 |
| `CONTENT_PROTECTION_CONFIG` | object | 内容保护完整配置 |

**配置项：**

```typescript
CONTENT_PROTECTION_CONFIG = {
  enabled: boolean,           // 是否启用保护
  message: string,            // 保护提示信息
  excludeSelectors: string[], // 排除的选择器列表
  disableContextMenu: boolean,      // 禁用右键菜单
  disableKeyboardShortcuts: boolean, // 禁用键盘快捷键
  disableTextSelection: boolean,    // 禁用文本选择
  disableDrag: boolean,             // 禁用拖拽
}
```

**使用示例：**

```typescript
import { 
  ENABLE_CONTENT_PROTECTION, 
  CONTENT_PROTECTION_CONFIG,
  isContentProtectionEnabled 
} from '@/constants/contentProtection';

// 检查保护是否启用
if (isContentProtectionEnabled()) {
  // 启用内容保护
}

// 使用配置
const config = CONTENT_PROTECTION_CONFIG;
console.log(config.message); // '文章内容受保护，禁止复制'
```

**环境变量控制：**

可通过环境变量 `NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION` 控制：
- 设置为 `'false'` 禁用保护
- 默认为启用状态

**排除选择器列表：**

```typescript
excludeSelectors: [
  '.comment-section',   // 评论区
  '.article-actions',   // 文章操作按钮
  '.share-buttons',     // 分享按钮
  '.author-info',       // 作者信息
  'pre',                // 代码块
  'code',               // 行内代码
  '.copy-button',       // 复制按钮
  'input',              // 输入框
  'textarea',           // 文本域
]
```

### 2. 草稿相关常量 (drafts.ts)

定义草稿筛选选项配置。

**核心常量：**

| 常量名 | 类型 | 描述 |
|--------|------|------|
| `filterOptions` | Array | 草稿筛选选项列表 |

**筛选选项：**

```typescript
filterOptions = [
  { value: 'all',       label: '全部' },
  { value: 'draft',     label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived',  label: '待审核' },
]
```

**使用示例：**

```typescript
import { filterOptions } from '@/constants/drafts';

// 在筛选组件中使用
function DraftFilter() {
  return (
    <select>
      {filterOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### 3. 更新日志常量 (updates.ts)

定义更新日志相关的常量，包括模拟数据、样式配置等。

**核心常量：**

| 常量名 | 类型 | 描述 |
|--------|------|------|
| `MOCK_UPDATES` | MonthlyUpdate[] | 模拟更新数据（备用） |
| `UPDATE_TYPE_STYLES` | object | 更新类型标签样式 |
| `VERSION_TAG_COLORS` | object | 版本标签颜色配置 |

**更新类型样式：**

```typescript
UPDATE_TYPE_STYLES = {
  [UpdateType.NEW]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: '新功能'
  },
  [UpdateType.IMPROVED]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: '改进'
  },
  [UpdateType.FIXED]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    label: '修复'
  }
}
```

**版本标签颜色：**

```typescript
VERSION_TAG_COLORS = {
  [VersionType.MAJOR]: 'bg-xf-accent',  // 主版本
  [VersionType.MINOR]: 'bg-xf-accent',  // 次版本
  [VersionType.PATCH]: 'bg-xf-primary', // 补丁版本
}
```

**使用示例：**

```typescript
import { 
  MOCK_UPDATES, 
  UPDATE_TYPE_STYLES, 
  VERSION_TAG_COLORS 
} from '@/constants/updates';
import { UpdateType, VersionType } from '@/types/updates';

// 获取更新类型样式
const newFeatureStyle = UPDATE_TYPE_STYLES[UpdateType.NEW];
// 返回: { bg: 'bg-green-50', text: 'text-green-700', label: '新功能' }

// 获取版本标签颜色
const majorColor = VERSION_TAG_COLORS[VersionType.MAJOR];
// 返回: 'bg-xf-accent'

// 使用模拟数据（开发和测试）
const updates = MOCK_UPDATES;
```

## 设计原则

### 1. 常量命名

- 使用大写下划线命名法（SNAKE_CASE）
- 常量名清晰表达其用途
- 布尔类型常量以 `is` 或 `enable` 开头

```typescript
// 好的命名
export const ENABLE_CONTENT_PROTECTION = true;
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
export const DEFAULT_PAGE_SIZE = 20;

// 不好的命名
export const protection = true;  // 太模糊
export const max = 10;           // 缺少上下文
```

### 2. 类型安全

- 所有常量都使用 `as const` 确保类型安全
- 复杂配置使用接口定义类型

```typescript
export const CONFIG = {
  enabled: true,
  timeout: 5000,
} as const;
```

### 3. 可配置性

- 支持环境变量覆盖
- 提供合理的默认值
- 提供辅助函数检查配置状态

```typescript
// 环境变量控制
export const FEATURE_ENABLED = 
  process.env.NEXT_PUBLIC_FEATURE_ENABLED !== 'false';

// 辅助函数
export function isFeatureEnabled(): boolean {
  return FEATURE_ENABLED;
}
```

### 4. 模块化组织

- 按功能模块组织常量文件
- 避免将所有常量放在一个大文件中
- 常量文件只包含常量定义，不包含逻辑

## 使用规范

### 1. 导入方式

```typescript
// 推荐：按需导入
import { ENABLE_CONTENT_PROTECTION } from '@/constants/contentProtection';

// 不推荐：通配符导入
import * as constants from '@/constants/contentProtection';
```

### 2. 使用场景

**适合定义为常量的内容：**
- 配置项（开关、阈值、限制）
- 样式映射（颜色、尺寸）
- 选项列表（筛选选项、下拉菜单）
- 默认值
- 魔法数字（有业务含义的数字）

**不适合定义为常量的内容：**
- 经常变化的数据（应使用数据库）
- 用户特定配置（应使用状态管理）
- 复杂的业务逻辑（应使用函数）

### 3. 扩展常量

添加新的常量时，请遵循以下步骤：

1. **选择正确的文件**：根据功能模块选择对应的常量文件
2. **添加 JSDoc 注释**：说明常量的用途和使用场景
3. **使用 `as const`**：确保类型安全
4. **提供辅助函数**（可选）：如果常量是配置开关，提供检查函数

**示例：**

```typescript
/**
 * 文章分页大小选项
 * @description 文章列表分页的可选大小
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * 默认分页大小
 * @description 文章列表默认每页显示数量
 */
export const DEFAULT_PAGE_SIZE = 20 as const;
```

## 相关模块

- [内容保护 Hook](../hooks/useContentProtection.ts) - 使用内容保护配置
- [草稿组件](../components/drafts/README.md) - 使用草稿筛选常量
- [更新日志组件](../components/updates/README.md) - 使用更新日志常量
- [类型定义](../types/README.md) - 常量相关的类型定义
