# 文章详情组件化架构

## 概述

文章详情模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、安全的文章阅读体验。包含文章展示、评论系统、互动功能、内容保护等特性。

## 项目结构

### 页面文件

```
app/(content)/article/[id]/
└── page.tsx                    # 文章详情页面
```

### 组件文件

```
components/article/
├── content/                    # 内容展示组件
│   ├── ArticleContent.tsx      # 文章内容展示组件
│   ├── ArticleHeader.tsx       # 文章头部组件
│   ├── ProtectedArticleContent.tsx # 受保护的文章内容组件
│   └── ContentProtection.tsx   # 内容保护组件
├── actions/                    # 交互操作组件
│   ├── ArtAct.tsx              # 文章操作按钮组件
│   ├── MoreActions.tsx         # 更多操作菜单组件
│   ├── ReportBtn.tsx           # 举报按钮组件
│   └── ReportMdl.tsx           # 举报弹窗组件
├── ui/                         # UI 基础组件
│   ├── AuthorAvatar.tsx        # 作者头像组件
│   ├── ReadingProgress.tsx     # 阅读进度组件
│   └── ArticlePaywall.tsx      # 文章预览墙组件
├── tracking/                   # 追踪统计组件
│   └── ViewTracker.tsx         # 浏览量追踪组件
├── skeletons/                  # 骨架屏组件
│   ├── ArticleSkeleton.tsx     # 文章骨架屏
│   └── CommentSkeleton.tsx     # 评论骨架屏
├── comments/                   # 评论系统组件
│   ├── index.ts                # 评论模块导出
│   ├── CommentPanel.tsx        # 评论面板容器
│   ├── CommentList.tsx         # 评论列表
│   ├── CommentCard.tsx         # 评论卡片
│   ├── CommentCardActions.tsx  # 评论卡片操作
│   ├── CommentForm.tsx         # 评论表单
│   └── LoginPrompt.tsx         # 登录提示
├── rw/                         # 打赏组件
│   ├── RwMd.tsx                # 打赏弹窗
│   ├── PtRw.tsx                # 积分打赏面板
│   ├── AdRw.tsx                # 广告打赏面板
│   └── TabBtn.tsx              # 选项卡按钮
├── index.ts                    # 统一导出入口
└── README.md                   # 组件文档
```

## 组件说明

### 核心展示组件

#### 1. ArticleContent（文章内容展示组件）

**位置**: `content/ArticleContent.tsx`

**职责**: 安全渲染文章内容

**功能**:
- 使用 DOMPurify 净化 HTML 内容
- useMemo 缓存净化结果避免重复计算
- 防止 XSS 攻击

**性能优化**:
- P1: 使用 useMemo 缓存 sanitizeRichText 结果
- 避免父组件状态更新时重复净化

**使用示例**:
```tsx
<ArticleContent content={article.content} />
```

#### 2. ArticleHeader（文章头部组件）

**位置**: `content/ArticleHeader.tsx`

**职责**: 显示文章标题、作者、发布时间和浏览量

**功能**:
- Server Component 服务端渲染
- 格式化发布时间（带时间段）
- 作者名称 HTML 转义防止 XSS

**安全特性**:
- 所有用户生成内容都经过 escapeHtml 转义

**使用示例**:
```tsx
<ArticleHeader article={article} />
```

#### 3. ProtectedArticleContent（受保护的文章内容组件）

**位置**: `content/ProtectedArticleContent.tsx`

**职责**: 集成内容保护的文章内容展示

**功能**:
- 包装文章内容
- 应用防复制保护
- 支持配置开关
- 可通过环境变量控制

**使用示例**:
```tsx
<ProtectedArticleContent content={article.content} />
```

### 互动操作组件

#### 4. ArtAct（文章操作按钮组件）

**位置**: `actions/ArtAct.tsx`

**职责**: 提供文章点赞、评论、分享、收藏、打赏功能

**功能**:
- 点赞（乐观更新）
- 收藏
- 评论入口
- 打赏入口
- 作者头像和关注

**交互**:
- 点赞：乐观更新 UI，失败回滚
- 收藏：切换收藏状态
- 打赏：打开打赏弹窗

**使用示例**:
```tsx
<ArtAct
  articleId={article.id}
  authorId={article.author_id}
  authorName={article.author.name}
  authorAvatar={article.author.avatar}
  currentUser={currentUser}
  initialLikeCount={article.like_count}
  initialCommentCount={article.comment_count}
  initialLiked={isLiked}
  initialBookmarked={isBookmarked}
/>
```

#### 5. AuthorAvatar（作者头像组件）

**位置**: `ui/AuthorAvatar.tsx`

**职责**: 显示作者头像，带关注功能按钮

**功能**:
- 显示作者头像
- 点击跳转到作者主页（已登录）
- 关注/取消关注按钮
- 未登录提示

**安全特性**:
- 匿名用户无法点击头像跳转
- 匿名用户无法关注作者

**使用示例**:
```tsx
<AuthorAvatar
  authorId={article.author_id}
  authorName={article.author.name}
  authorAvatar={article.author.avatar}
  currentUser={currentUser}
/>
```

#### 6. MoreActions（更多操作菜单组件）

**位置**: `actions/MoreActions.tsx`

**职责**: 分享、收藏、举报的聚合菜单

**功能**:
- 分享（复制链接）
- 收藏
- 举报
- 点击外部关闭

**使用示例**:
```tsx
<MoreActions
  articleId={article.id}
  authorId={article.author_id}
  currentUser={currentUser}
  initialBookmarked={isBookmarked}
  onBookmark={handleBookmark}
/>
```

### 内容保护组件

#### 7. ContentProtection（内容保护组件）

**位置**: `content/ContentProtection.tsx`

**职责**: 文章内容的防复制保护包装组件

**功能**:
- 包装文章内容区域
- 应用防复制保护
- 支持配置开关
- 排除评论区等交互区域

**使用示例**:
```tsx
<ContentProtection enabled={true} excludeSelectors={['.comment-section']}>
  <article>文章内容</article>
</ContentProtection>
```

#### 8. ArticlePaywall（文章预览墙组件）

**位置**: `ui/ArticlePaywall.tsx`

**职责**: 匿名用户浏览文章时显示部分内容，引导登录

**功能**:
- 显示文章预览（默认35%）
- 渐变过渡引导登录
- 根据文章主题生成文案
- 社区规模社交证明

**设计原则**:
- 不阻断用户阅读体验
- 渐变过渡自然引导
- 文案结合文章主题

**使用示例**:
```tsx
<ArticlePaywall
  content={article.content}
  articleTitle={article.title}
  tags={article.tags}
  previewRatio={0.35}
/>
```

### 阅读体验组件

#### 9. ReadingProgress（阅读进度组件）

**位置**: `ui/ReadingProgress.tsx`

**职责**: 显示文章阅读进度条，检测阅读任务

**功能**:
- 实时计算滚动进度
- 使用 RAF 节流优化性能
- 最小变化阈值减少渲染
- 滚动超过50%触发阅读任务检测

**性能优化**:
- requestAnimationFrame 节流
- 1% 变化阈值
- GPU 加速

**使用示例**:
```tsx
<ReadingProgress articleId={article.id} />
```

#### 10. ViewTracker（浏览量追踪组件）

**位置**: `tracking/ViewTracker.tsx`

**职责**: 在文章详情页自动统计浏览量

**功能**:
- 页面加载后自动统计
- sessionStorage + cookie 双重防刷
- 延迟 3 秒后触发

**使用示例**:
```tsx
<ViewTracker articleId={article.id} />
```

### 举报组件

#### 11. ReportBtn（举报按钮组件）

**位置**: `actions/ReportBtn.tsx`

**职责**: 文章举报功能入口按钮

**功能**:
- 举报按钮
- 未登录提示
- 打开举报弹窗

**使用示例**:
```tsx
<ReportBtn
  articleId={article.id}
  authorId={article.author_id}
  currentUser={currentUser}
/>
```

#### 12. ReportMdl（举报弹窗组件）

**位置**: `actions/ReportMdl.tsx`

**职责**: 文章举报弹窗

**功能**:
- 选择举报类型
- 填写举报原因
- 提交举报请求

**举报类型**:
- 抄袭
- 违规内容
- 虚假信息
- 侵权
- 其他

**使用示例**:
```tsx
<ReportMdl
  articleId={article.id}
  authorId={article.author_id}
  onClose={() => setShowModal(false)}
/>
```

### 评论系统组件

#### 13. CommentPanel（评论面板容器组件）

**位置**: `comments/CommentPanel.tsx`

**职责**: 组合所有评论相关子组件，管理面板状态

**功能**:
- 评论列表展示
- 评论表单
- 登录提示
- 加载更多
- 面板开关动画

**使用示例**:
```tsx
<CommentPanel
  articleId={article.id}
  initialComments={comments}
  initialTotalCount={totalCount}
  currentUser={currentUser}
/>
```

#### 14. CommentList（评论列表组件）

**位置**: `comments/CommentList.tsx`

**职责**: 评论列表展示

**功能**:
- 评论卡片列表
- 空状态提示
- 加载更多按钮

**使用示例**:
```tsx
<CommentList
  comments={comments}
  hasMore={hasMore}
  loadingMore={loadingMore}
  onLoadMore={loadMore}
  onLike={toggleLike}
  onDelete={deleteComment}
  currentUser={currentUser}
/>
```

#### 15. CommentCard（评论卡片组件）

**位置**: `comments/CommentCard.tsx`

**职责**: 单条评论展示

**功能**:
- 作者头像和名称
- 评论内容
- 发布时间
- 点赞、删除操作
- 认证徽章

**安全特性**:
- 用户生成内容 HTML 转义
- 防止 XSS 攻击

**使用示例**:
```tsx
<CommentCard
  comment={comment}
  onLike={toggleLike}
  onDelete={deleteComment}
  currentUser={currentUser}
/>
```

#### 16. CommentForm（评论表单组件）

**位置**: `comments/CommentForm.tsx`

**职责**: 评论输入和提交

**功能**:
- 评论输入框
- 提交按钮
- 字数限制
- 提交状态

### 打赏组件

#### 17. RwMd（打赏弹窗组件）

**位置**: `rw/RwMd.tsx`

**职责**: 文章打赏功能弹窗

**功能**:
- 积分打赏
- 广告打赏（预留）
- 选项卡切换

**使用示例**:
```tsx
<RwMd
  articleId={article.id}
  authorId={article.author_id}
  onClose={() => setShowModal(false)}
  onSuccess={() => console.log('打赏成功')}
/>
```

#### 18. PtRw（积分打赏面板）

**位置**: `rw/PtRw.tsx`

**职责**: 积分打赏选项面板

**功能**:
- 积分余额显示
- 积分选项（10/50/100/500）
- 打赏提交
- 防重放攻击（nonce）

**使用示例**:
```tsx
<PtRw
  articleId={article.id}
  authorId={article.author_id}
  onSuccess={() => console.log('打赏成功')}
/>
```

### 骨架屏组件

#### 19. ArticleSkeleton（文章骨架屏）

**位置**: `skeletons/ArticleSkeleton.tsx`

**职责**: 文章加载状态骨架屏

#### 20. CommentSkeleton（评论骨架屏）

**位置**: `skeletons/CommentSkeleton.tsx`

**职责**: 评论加载状态骨架屏

## 自定义 Hooks

### useComments（评论管理 Hook）

**位置**: `hooks/useComments.ts`

**功能**:
- 评论列表管理
- 加载更多
- 添加评论
- 点赞评论
- 删除评论

### useCommentSubmit（评论提交 Hook）

**位置**: `hooks/useCommentSub.ts`

**功能**:
- 评论提交
- 提交状态
- 错误处理

## 页面组件

### 文章详情页面

**位置**: `app/(content)/article/[id]/page.tsx`

**职责**: 文章详情页面入口

**功能**:
- SEO 元数据生成
- 文章数据获取
- 评论数据获取
- 结构化数据（Schema.org）
- 缓存优化

**安全特性**:
- S1: userId 由服务端内部获取，不依赖客户端传入

**组件组合**:
```
ArticlePage (Server Component)
├── ArticleStructuredData
├── BreadcrumbStructuredData
├── ReadingProgress
├── ViewTracker
├── ArticleHeader
├── ProtectedArticleContent / ArticlePaywall
├── ArtAct
└── CommentPanel
```

## 组件层次结构

```
ArticlePage (Server Component)
├── SEO 组件
│   ├── ArticleStructuredData
│   └── BreadcrumbStructuredData
├── ReadingProgress (Client)
├── ViewTracker (Client)
├── ArticleHeader (Server)
├── ProtectedArticleContent (Client)
│   └── ContentProtection
├── ArticlePaywall (Client, 未登录时)
├── ArtAct (Client)
│   ├── AuthorAvatar
│   ├── RwMd
│   │   ├── PtRw
│   │   └── AdRw
│   └── MoreActions
│       └── ReportMdl
└── CommentPanel (Client)
    ├── CommentList
    │   └── CommentCard
    │       └── CommentCardActions
    ├── CommentForm
    └── LoginPrompt
```

## 设计原则

### 1. 职责分离
- **Server Component**: 文章头部、SEO、数据获取
- **Client Component**: 交互逻辑、状态管理、评论系统
- **混合使用**: 文章内容（Server 渲染 + Client 保护）

### 2. 安全优先
- 所有用户生成内容 HTML 转义
- DOMPurify 净化 HTML
- 内容防复制保护
- 防刷机制（浏览量、点赞）

### 3. 性能优化
- Server Component 优先渲染
- useMemo 缓存计算
- RAF 节流滚动事件
- 骨架屏优化感知性能
- 数据缓存（cache）

### 4. 用户体验
- 乐观更新（点赞）
- 阅读进度指示
- 渐进式内容展示（预览墙）
- 流畅的动画过渡

## 安全特性

### XSS 防护
- `escapeHtml`: 转义 HTML 特殊字符
- `sanitizeRichText`: DOMPurify 净化富文本
- 所有用户输入都经过处理

### 内容保护
- 防复制保护（右键、选择、复制）
- 可配置排除区域
- 环境变量控制开关

### 防刷机制
- 浏览量：sessionStorage + cookie 双重验证
- 点赞：乐观更新 + 服务端验证
- 打赏：nonce 防重放攻击

## 数据流

```
Server Component (获取文章数据)
  ↓
页面渲染 (Server + Client 组件)
  ↓
用户交互 (Client Component)
  ↓
Server Action / API 调用
  ↓
状态更新 (乐观更新)
  ↓
UI 更新
```

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 简洁的阅读界面
- 清晰的视觉层次

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 主色调：xf-primary
- 背景色：xf-light

## 导入方式

### 方式一：统一入口导入（推荐）

```tsx
import {
  ArticleContent,
  ArticleHeader,
  ArtAct,
  ReadingProgress,
  CommentPanel,
  RwMd,
} from '@/components/article';
```

### 方式二：分类路径导入

```tsx
// Content
import ArticleContent from '@/components/article/content/ArticleContent';
import ArticleHeader from '@/components/article/content/ArticleHeader';

// Actions
import ArtAct from '@/components/article/actions/ArtAct';
import MoreActions from '@/components/article/actions/MoreActions';

// UI
import AuthorAvatar from '@/components/article/ui/AuthorAvatar';
import ReadingProgress from '@/components/article/ui/ReadingProgress';

// Tracking
import { ViewTracker } from '@/components/article/tracking/ViewTracker';

// Skeletons
import ArticleSkeleton from '@/components/article/skeletons/ArticleSkeleton';

// Comments
import { CommentPanel } from '@/components/article/comments';

// RW
import { RwMd } from '@/components/article/rw/RwMd';
```

## 更新时间

2026-03-29
