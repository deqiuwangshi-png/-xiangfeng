# 工具函数模块 (Utils Module)

## 概述

工具函数模块提供项目中常用的通用工具函数，包括类名合并、日期格式化、HTML 净化、请求管理等功能。这些函数被广泛应用于组件、页面和其他模块中。

## 核心特性

- **类名合并**: 使用 `clsx` 和 `tailwind-merge` 合并 Tailwind CSS 类名
- **日期处理**: 相对时间格式化和本地日期格式化
- **XSS 防护**: HTML 内容净化，防止 XSS 攻击
- **请求管理**: 支持请求去重和取消
- **数据缓存**: 使用 React cache 缓存服务端数据

## 项目结构

```
lib/utils/
├── utils.ts                   # 类名合并工具 (cn)
├── date.ts                    # 日期工具函数
├── purify.ts                  # HTML 净化工具 (XSS 防护)
├── html.ts                    # HTML 处理工具
├── getInitials.ts             # 获取名称首字母
├── cachedActions.ts           # 缓存的 Server Actions
└── requestManager.ts          # 请求管理器
```

## 快速开始

### 导入常用工具

```typescript
import { cn } from '@/lib/utils'
import { formatDistanceToNow, formatDate } from '@/lib/utils/date'
import { sanitizeHtml, sanitizePlainText } from '@/lib/utils/purify'
import { getInitials } from '@/lib/utils/getInitials'
```

## 功能详解

### 1. 类名合并 (utils.ts)

使用 `clsx` 和 `tailwind-merge` 合并 Tailwind CSS 类名，自动处理类名冲突。

#### cn 函数

```typescript
import { cn } from '@/lib/utils'

// 基础用法
const className = cn('px-2 py-1', 'px-4') // 'px-4 py-1'

// 条件类名
const className = cn(
  'btn',
  isActive && 'btn-active',
  isDisabled && 'btn-disabled'
)

// 数组类名
const className = cn(['px-4', 'py-2'], 'rounded')
```

**特性**:
- 自动合并冲突的 Tailwind 类名
- 支持条件类名
- 支持数组和对象形式

---

### 2. 日期工具 (date.ts)

提供日期格式化和相对时间计算功能。

#### formatDistanceToNow

将日期转换为相对时间描述（如：2天前、5小时前）。

```typescript
import { formatDistanceToNow } from '@/lib/utils/date'

formatDistanceToNow('2026-03-03T10:00:00Z') // '2天前'
formatDistanceToNow(new Date()) // '刚刚'
formatDistanceToNow('2026-03-28T08:00:00Z') // '1小时前'
```

**时间粒度**:
- `< 60秒` - 刚刚
- `< 60分钟` - X分钟前
- `< 24小时` - X小时前
- `< 30天` - X天前
- `< 12个月` - X个月前
- `>= 12个月` - X年前

#### formatDate

格式化日期为本地字符串。

```typescript
import { formatDate } from '@/lib/utils/date'

// 默认格式
formatDate('2026-03-29') // '2026年3月29日'

// 自定义格式
formatDate('2026-03-29', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}) // '2026年3月29日'
```

---

### 3. HTML 净化 (purify.ts)

提供 XSS 防护功能，净化用户输入的 HTML 内容。

#### sanitizeRichText

净化富文本内容，保留安全的 HTML 标签。

```typescript
import { sanitizeRichText } from '@/lib/utils/purify'

const safeHtml = sanitizeRichText('<p>Hello</p><script>alert(1)</script>')
// 返回: '<p>Hello</p>'

const safeHtml = sanitizeRichText('<b>Bold</b><iframe src="..."></iframe>')
// 返回: '<b>Bold</b>'
```

**允许的标签**:
- 文本: `p`, `br`, `hr`
- 标题: `h1`-`h6`
- 格式: `strong`, `b`, `em`, `i`, `u`, `strike`, `del`
- 链接: `a` (带 `href`, `title`, `target`)
- 图片: `img` (带 `src`, `alt`, `title`, `width`, `height`)
- 列表: `ul`, `ol`, `li`
- 代码: `blockquote`, `code`, `pre`
- 表格: `table`, `thead`, `tbody`, `tr`, `th`, `td`
- 容器: `div`, `span`

#### sanitizePlainText

移除所有 HTML 标签，返回纯文本。

```typescript
import { sanitizePlainText } from '@/lib/utils/purify'

const text = sanitizePlainText('<p>Hello <b>World</b></p>')
// 返回: 'Hello World'
```

#### generateExcerpt

从 HTML 内容生成摘要。

```typescript
import { generateExcerpt } from '@/lib/utils/purify'

const excerpt = generateExcerpt('<p>这是一篇很长的文章...</p>', 100)
// 返回前100个字符的纯文本摘要
```

**安全特性**:
- 移除危险标签 (script, iframe, object, embed, link, style)
- 移除事件处理器属性 (onerror, onclick 等)
- 过滤危险协议 (javascript:, data:, vbscript:, file:)
- 属性值转义防止注入

---

### 4. HTML 处理 (html.ts)

提供额外的 HTML 处理功能。

#### sanitizeHtml

基于白名单的 HTML 净化（简化版）。

```typescript
import { sanitizeHtml } from '@/lib/utils/html'

const safe = sanitizeHtml('<p>Hello</p><script>alert(1)</script>')
// 返回: '<p>Hello</p>'
```

**与 purify.ts 的区别**:
- `purify.ts`: 完整功能，推荐用于用户内容
- `html.ts`: 简化版本，用于特定场景

---

### 5. 获取首字母 (getInitials.ts)

获取用户名称的前两个字符作为头像占位符。

```typescript
import { getInitials } from '@/lib/utils/getInitials'

getInitials('张三') // '张三'
getInitials('John Doe') // 'Jo'
getInitials('A') // 'A'
```

---

### 6. 缓存的 Server Actions (cachedActions.ts)

使用 React `cache` 函数缓存服务端数据获取。

#### fetchWithRetry

带重试的数据获取。

```typescript
import { fetchWithRetry } from '@/lib/utils/cachedActions'

const data = await fetchWithRetry(
  () => fetchData(),
  3,      // 重试3次
  1000    // 初始延迟1秒
)
```

#### fetchWithTimeout

带超时的数据获取。

```typescript
import { fetchWithTimeout } from '@/lib/utils/cachedActions'

const data = await fetchWithTimeout(
  () => fetchData(),
  5000    // 5秒超时
)
```

---

### 7. 请求管理器 (requestManager.ts)

管理并发请求，支持请求去重和取消。

#### createCancellableRequest

创建可取消的请求。

```typescript
import { createCancellableRequest } from '@/lib/utils/requestManager'

const controller = createCancellableRequest('/api/data', { id: 1 })

fetch('/api/data', {
  signal: controller.signal
})

// 取消请求
controller.abort()
```

#### cancelRequest

取消指定 URL 的请求。

```typescript
import { cancelRequest } from '@/lib/utils/requestManager'

cancelRequest('/api/data', { id: 1 })
```

#### cancelAllRequests

取消所有挂起的请求。

```typescript
import { cancelAllRequests } from '@/lib/utils/requestManager'

// 页面卸载时调用
cancelAllRequests()
```

**使用场景**:
- 组件卸载时取消未完成的请求
- 防止重复提交
- 搜索输入时的防抖

## 使用示例

### 完整的 XSS 防护流程

```typescript
import { sanitizeRichText, sanitizePlainText, generateExcerpt } from '@/lib/utils/purify'

// 用户提交的富文本内容
const userContent = '<p>Hello <script>alert(1)</script></p>'

// 净化后存储
const safeContent = sanitizeRichText(userContent)

// 生成摘要用于列表展示
const excerpt = generateExcerpt(safeContent, 100)

// 纯文本场景
const plainText = sanitizePlainText(userContent)
```

### 日期格式化组合

```typescript
import { formatDistanceToNow, formatDate } from '@/lib/utils/date'

// 文章列表显示相对时间
const timeAgo = formatDistanceToNow(article.created_at)

// 详情页显示完整日期
const fullDate = formatDate(article.created_at, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})
```

### 请求取消模式

```typescript
import { createCancellableRequest, cancelRequest } from '@/lib/utils/requestManager'

function useDataFetching() {
  useEffect(() => {
    const controller = createCancellableRequest('/api/data')
    
    fetch('/api/data', { signal: controller.signal })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('请求失败:', err)
        }
      })
    
    return () => {
      cancelRequest('/api/data')
    }
  }, [])
}
```

## 关联文档

### 相关组件

- [UI 组件文档](../../components/ui/README.md) - 使用 `cn` 函数合并类名
- [文章详情组件文档](../../components/article/README.md) - 使用日期格式化

### 相关模块

- `@/lib/articles` - 使用 HTML 净化
- `@/lib/user` - 使用日期格式化

### 相关类型

- `@/types` - 通用类型定义

## 最佳实践

### 1. 始终净化用户输入

```typescript
// ✅ 正确
const safeContent = sanitizeRichText(userInput)

// ❌ 错误 - 直接渲染用户输入
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. 使用 cn 合并类名

```typescript
// ✅ 正确
<div className={cn('btn', isActive && 'btn-active')} />

// ❌ 错误 - 手动拼接
<div className={`btn ${isActive ? 'btn-active' : ''}`} />
```

### 3. 合理使用缓存

```typescript
// ✅ 正确 - 服务端组件中使用缓存
const data = await fetchWithTimeout(() => fetchData(), 5000)

// ❌ 错误 - 客户端不需要直接调用服务端缓存函数
const data = await fetchWithTimeout(() => fetchData(), 5000) // 在 Client Component 中
```

### 4. 及时取消请求

```typescript
useEffect(() => {
  const controller = createCancellableRequest(url)
  
  fetchData()
  
  return () => {
    cancelRequest(url) // 清理
  }
}, [url])
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-15**: 添加请求管理器
- **2026-03-01**: 优化 HTML 净化逻辑
- **2026-02-20**: 添加缓存的 Server Actions
- **2026-02-01**: 初始版本，基础工具函数

## 统计信息

- **工具函数**: 15+
- **功能类别**: 7类
- **安全特性**: 2个 (XSS 防护)
- **最后更新**: 2026-03-29
