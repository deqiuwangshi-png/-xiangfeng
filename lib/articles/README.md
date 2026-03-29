# 文章模块 (Articles Module)

## 概述

文章模块是项目的核心内容管理模块，提供完整的文章 CRUD、评论、点赞、收藏、浏览统计等功能。采用分层架构设计，严格区分查询操作和变更操作，确保代码可维护性和安全性。

## 核心特性

- **完整的文章生命周期**: 创建、编辑、发布、归档、删除
- **评论系统**: 支持一级评论和回复
- **互动功能**: 点赞、收藏、浏览统计
- **批量操作**: 批量删除文章
- **安全防护**: XSS 防护、敏感词过滤、权限验证、限流保护
- **性能优化**: 数据库触发器自动维护计数、异步缓存刷新

## 项目结构

```
lib/articles/
├── schema.ts                   # Zod 数据验证 Schema
├── actions/                    # Server Actions 目录
│   ├── index.ts               # Actions 统一导出
│   ├── crud.ts                # CRUD 操作统一导出
│   ├── query.ts               # 查询操作
│   ├── mutate.ts              # 增删改操作
│   ├── comment.ts             # 评论功能
│   ├── like.ts                # 点赞功能
│   ├── bookmark.ts            # 收藏功能
│   ├── view.ts                # 浏览统计
│   ├── batch.ts               # 批量操作
│   ├── _secure.ts             # 安全工具函数
│   └── utils.ts               # Action 工具函数
├── queries/                    # 服务端查询（Server Components 用）
│   ├── index.ts               # 查询统一导出
│   ├── article.ts             # 文章查询
│   └── comment.ts             # 评论查询
└── helpers/                    # 辅助函数
    ├── utils.ts               # 共享工具函数
    └── profile.ts             # 用户资料辅助
```

## 快速开始

### 统一导入（推荐）

```typescript
// 导入所有 Actions
import { 
  createArticle, 
  updateArticle, 
  deleteArticle,
  toggleArticleLike,
  toggleArticleBookmark,
  submitArticleComment
} from '@/lib/articles/actions'

// 导入服务端查询（Server Components 用）
import { 
  getArticleDetailById,
  getArticleComments 
} from '@/lib/articles/queries'
```

## 数据验证 Schema

### 创建文章 Schema

```typescript
import { CreateArticleSchema, ArticleTagsSchema } from '@/lib/articles/schema'

// 验证创建文章数据
const result = CreateArticleSchema.safeParse({
  title: '文章标题',
  content: '文章内容',
  status: 'published'
})
```

**验证规则**:
- 标题：1-100 字符
- 内容：1-50000 字符（约 5 万字）
- 状态：draft 或 published

### 标签 Schema

```typescript
// 验证标签
const result = ArticleTagsSchema.safeParse(['技术', '前端', 'React'])
```

**验证规则**:
- 最多 10 个标签
- 每个标签 1-20 字符
- 只允许字母、数字、中文、连字符、下划线

## Server Actions

### 1. 文章 CRUD

#### 创建文章 (createArticle)

**位置**: `actions/mutate.ts`

**功能**:
- 创建草稿或发布文章
- Zod 输入验证
- 内容净化（XSS 防护）
- 敏感词检测
- 速率限制（每小时 10 篇，每分钟 2 篇）

**使用示例**:
```typescript
const article = await createArticle({
  title: '文章标题',
  content: '文章内容...',
  status: 'published'
})
```

---

#### 更新文章 (updateArticle)

**位置**: `actions/mutate.ts`

**功能**:
- 更新文章标题、内容、状态、标签
- 所有权验证
- 内容净化

**使用示例**:
```typescript
const result = await updateArticle({
  id: 'article-id',
  title: '新标题',
  content: '新内容...'
})
```

---

#### 删除文章 (deleteArticle)

**位置**: `actions/mutate.ts`

**功能**:
- 删除文章及关联媒体
- 所有权验证
- 级联删除

**使用示例**:
```typescript
const result = await deleteArticle('article-id')
```

---

#### 批量删除 (batchDeleteArticles)

**位置**: `actions/batch.ts`

**功能**:
- 批量删除文章（最多 50 篇）
- 批量验证所有权
- 级联删除媒体资源
- 安全审计日志

**使用示例**:
```typescript
const result = await batchDeleteArticles(['id1', 'id2', 'id3'])
```

### 2. 查询操作

#### 获取文章列表 (getArticles)

**位置**: `actions/query.ts`

**功能**:
- 获取当前用户的文章列表
- 支持状态筛选
- 性能优化（不查询 content 字段）

**使用示例**:
```typescript
const articles = await getArticles('published')
```

---

#### 获取草稿列表 (fetchDrafts)

**位置**: `actions/query.ts`

**功能**:
- 获取草稿列表（SWR 缓存用）
- 性能优化（不查询 content 字段）

**使用示例**:
```typescript
const drafts = await fetchDrafts()
```

### 3. 评论功能

#### 提交评论 (submitArticleComment)

**位置**: `actions/comment.ts`

**功能**:
- 提交文章评论
- 支持回复（一级评论）
- 内容净化
- 速率限制（每分钟 10 条）
- 使用 `withAuth` 权限控制

**使用示例**:
```typescript
const result = await submitArticleComment(
  'article-id',
  '评论内容',
  'parent-comment-id' // 可选，回复时使用
)
```

---

#### 获取评论列表 (getArticleComments)

**位置**: `actions/comment.ts`

**功能**:
- 分页获取评论列表
- 包含作者信息和点赞状态

**使用示例**:
```typescript
const result = await getArticleComments('article-id', 1, 10)
```

---

#### 删除评论 (deleteComment)

**位置**: `actions/comment.ts`

**功能**:
- 删除自己的评论
- 所有权验证

**使用示例**:
```typescript
const result = await deleteComment('comment-id')
```

### 4. 点赞功能

#### 文章点赞 (toggleArticleLike)

**位置**: `actions/like.ts`

**功能**:
- 点赞/取消点赞
- 使用数据库唯一约束防重
- 触发器自动维护 like_count
- 使用 `withAuth` 权限控制

**使用示例**:
```typescript
const result = await toggleArticleLike('article-id')
```

---

#### 评论点赞 (toggleCommentLike)

**位置**: `actions/like.ts`

**功能**:
- 评论点赞/取消点赞

**使用示例**:
```typescript
const result = await toggleCommentLike('comment-id')
```

### 5. 收藏功能

#### 文章收藏 (toggleArticleBookmark)

**位置**: `actions/bookmark.ts`

**功能**:
- 收藏/取消收藏
- 使用插入-冲突模式减少查询
- 触发器自动维护 favorite_count
- 使用 `withAuth` 权限控制

**使用示例**:
```typescript
const result = await toggleArticleBookmark('article-id')
```

### 6. 浏览统计

#### 增加浏览量 (incrementArticleView)

**位置**: `actions/view.ts`

**功能**:
- 增加文章浏览量
- Cookie 防重复计数（24 小时）
- 仅对已发布文章计数
- UUID 格式验证

**使用示例**:
```typescript
const result = await incrementArticleView('article-id')
```

## 服务端查询（Server Components）

### 获取文章详情

```typescript
import { getArticleDetailById } from '@/lib/articles/queries/article'

const article = await getArticleDetailById('article-id')
```

**返回数据**:
- 文章完整信息
- 作者信息（用户名、头像、简介）
- 当前用户点赞/收藏状态
- 阅读时间、统计数据

### 获取评论列表

```typescript
import { getArticleComments } from '@/lib/articles/queries/comment'

const comments = await getArticleComments('article-id')
```

**安全特性**:
- 仅返回当前用户的点赞状态（布尔值）
- 不暴露点赞用户 ID 列表

## 安全特性

### 1. 输入验证

所有输入都经过 Zod 验证：

```typescript
const validationResult = CreateArticleSchema.safeParse(data)
if (!validationResult.success) {
  throw new Error('输入数据无效')
}
```

### 2. 内容净化

使用 DOMPurify 净化富文本内容：

```typescript
import { sanitizeRichText, sanitizePlainText } from '@/lib/utils/purify'

const safeContent = sanitizeRichText(content)
```

### 3. 权限验证

使用 `withAuth` 包装器统一权限控制：

```typescript
export const submitArticleComment = withAuth(
  async (articleId, content) => {
    // 已认证用户才能执行
  }
)
```

### 4. 所有权验证

```typescript
import { verifyArticleOwnership, verifyCommentOwnership } from '@/lib/articles/actions/_secure'

const isOwner = await verifyArticleOwnership(articleId, userId)
```

### 5. 限流保护

```typescript
import { checkServerRateLimit } from '@/lib/security/rateLimitServer'

const rateLimit = checkServerRateLimit(`create:${user.id}:hourly`, {
  maxAttempts: 10,
  windowMs: 60 * 60 * 1000
})
```

### 6. 敏感词检测

```typescript
import { validateArticleContent } from '@/lib/security/contentFilter'

const validation = validateArticleContent(title, content)
if (!validation.valid) {
  throw new Error(`内容审核未通过: ${validation.errors.join('; ')}`)
}
```

## 性能优化

### 1. 数据库触发器

使用 PostgreSQL 触发器自动维护计数：

```sql
-- 自动更新 like_count
CREATE TRIGGER update_article_like_count
AFTER INSERT OR DELETE ON article_likes
FOR EACH ROW EXECUTE FUNCTION update_article_like_count();
```

### 2. 异步缓存刷新

```typescript
import { revalidatePathsAsync } from '@/lib/articles/actions/utils'

// 异步刷新缓存，不阻塞主流程
revalidatePathsAsync(['/home', `/article/${articleId}`])
```

### 3. 选择性字段查询

```typescript
// 不查询 content 字段，减少数据传输
const { data } = await supabase
  .from('articles')
  .select('id, title, excerpt, status, created_at')
```

### 4. 批量操作

```typescript
// 批量查询点赞状态
const { data: likesData } = await supabase
  .from('article_likes')
  .select('article_id')
  .eq('user_id', currentUserId)
  .in('article_id', articleIds)
```

## 关联文档

### 相关组件

- [文章详情组件文档](../../components/article/README.md) - 文章展示、评论列表
- [发布页面组件文档](../../components/publish/README.md) - 文章编辑器
- [草稿组件文档](../../components/drafts/README.md) - 草稿管理

### 相关类型

- `@/types` - 文章、评论相关类型定义
- `@/types/drafts` - 草稿相关类型

### 相关服务

- `@/lib/auth/permissions` - 权限控制
- `@/lib/auth/withPermission` - 权限包装器
- `@/lib/supabase/server` - Supabase 服务端客户端
- `@/lib/security/rateLimitServer` - 服务端限流
- `@/lib/security/contentFilter` - 内容过滤
- `@/lib/utils/purify` - 内容净化

### 相关 Hooks

- `@/hooks/useArticle` - 文章数据获取
- `@/hooks/useComments` - 评论数据获取
- `@/hooks/useLike` - 点赞状态管理
- `@/hooks/useBookmark` - 收藏状态管理

## 工具函数

### UUID 验证

```typescript
import { isValidUUID } from '@/lib/articles/helpers/utils'

if (!isValidUUID(articleId)) {
  throw new Error('无效的文章ID')
}
```

### 用户资料检查

```typescript
import { ensureUserProfile } from '@/lib/articles/helpers/profile'

const profileCreated = await ensureUserProfile(user.id, user.email)
```

## 最佳实践

### 1. 始终验证输入

```typescript
const validation = CreateArticleSchema.safeParse(data)
if (!validation.success) {
  throw new Error(validation.error.issues[0]?.message)
}
```

### 2. 使用权限包装器

```typescript
export const myAction = withAuth(async (params) => {
  // 已认证用户才能执行
})
```

### 3. 净化用户内容

```typescript
const safeContent = sanitizeRichText(rawContent)
```

### 4. 异步刷新缓存

```typescript
// 不要等待缓存刷新
revalidatePathsAsync(paths)
```

### 5. 错误处理

```typescript
try {
  // 操作
} catch (err) {
  console.error('操作失败:', err)
  throw new Error('操作失败，请稍后重试')
}
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-15**: 添加批量删除功能
- **2026-03-10**: 优化评论查询性能
- **2026-03-01**: 添加敏感词检测
- **2026-02-20**: 初始版本，基础 CRUD 功能

## 统计信息

- **Server Actions**: 15+
- **查询函数**: 8+
- **Schema**: 5个
- **安全特性**: 6类
- **最后更新**: 2026-03-29
