# SEO 组件目录

## 目录结构

```
components/seo/
├── README.md           # 本文档
├── index.ts            # 组件统一导出
├── SocialShare.tsx     # 社交分享组件
└── StructuredData.tsx  # 结构化数据组件
```

## 概述

本目录包含项目的 SEO（搜索引擎优化）相关组件，包括结构化数据标记（Schema.org）和社交分享功能。这些组件有助于提升网站在搜索引擎中的排名和社交媒体上的传播效果。

## 组件说明

### 1. 结构化数据组件 (StructuredData.tsx)

为搜索引擎提供丰富的结构化数据，增强搜索结果展示（富媒体摘要）。

#### WebsiteStructuredData

网站结构化数据，定义网站基本信息和搜索功能。

```tsx
import { WebsiteStructuredData } from '@/components/seo';

// 在根布局中使用
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <WebsiteStructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**生成的 Schema 类型：** `WebSite`

**包含字段：**
- 网站名称和描述
- 网站 URL
- 站内搜索功能
- 发布者信息

#### ArticleStructuredData

文章结构化数据，增强文章在搜索结果中的展示。

```tsx
import { ArticleStructuredData } from '@/components/seo';

function ArticlePage({ article }) {
  return (
    <>
      <ArticleStructuredData
        title={article.title}
        description={article.summary}
        url={`https://www.xiangfeng.site/article/${article.id}`}
        authorName={article.author.name}
        authorUrl={`https://www.xiangfeng.site/user/${article.author.id}`}
        publishedAt={article.created_at}
        modifiedAt={article.updated_at}
        tags={article.tags}
        wordCount={article.wordCount}
      />
      <article>{/* 文章内容 */}</article>
    </>
  );
}
```

**生成的 Schema 类型：** `Article`

**包含字段：**
- 文章标题和描述
- 作者信息（Person）
- 发布和修改时间
- 关键词标签
- 字数统计
- 封面图片

#### BreadcrumbStructuredData

面包屑导航结构化数据，在搜索结果中显示面包屑路径。

```tsx
import { BreadcrumbStructuredData } from '@/components/seo';

function ArticlePage({ article }) {
  const breadcrumbItems = [
    { name: '首页', url: 'https://www.xiangfeng.site' },
    { name: '文章', url: 'https://www.xiangfeng.site/articles' },
    { name: article.title, url: `https://www.xiangfeng.site/article/${article.id}` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {/* 页面内容 */}
    </>
  );
}
```

**生成的 Schema 类型：** `BreadcrumbList`

#### OrganizationStructuredData

组织结构化数据，定义网站所属组织信息。

```tsx
import { OrganizationStructuredData } from '@/components/seo';

// 通常在网站首页或关于页面使用
export default function HomePage() {
  return (
    <>
      <OrganizationStructuredData />
      {/* 页面内容 */}
    </>
  );
}
```

**生成的 Schema 类型：** `Organization`

**包含字段：**
- 组织名称和别名
- 网站 URL 和 Logo
- 社交媒体链接
- 联系方式

#### FAQStructuredData

FAQ 页面结构化数据，在搜索结果中显示问答片段。

```tsx
import { FAQStructuredData } from '@/components/seo';

const faqs = [
  {
    question: '如何发布文章？',
    answer: '登录后点击右上角的"发布"按钮，即可进入文章编辑页面。',
  },
  {
    question: '积分有什么用？',
    answer: '积分可以用于兑换商品、打赏文章等。',
  },
];

function FAQPage() {
  return (
    <>
      <FAQStructuredData faqs={faqs} />
      {/* FAQ 内容 */}
    </>
  );
}
```

**生成的 Schema 类型：** `FAQPage`

#### ProfileStructuredData

个人资料结构化数据，增强用户主页在搜索结果中的展示。

```tsx
import { ProfileStructuredData } from '@/components/seo';

function ProfilePage({ user }) {
  return (
    <>
      <ProfileStructuredData
        name={user.username}
        url={`https://www.xiangfeng.site/user/${user.id}`}
        description={user.bio}
        image={user.avatar}
        articleCount={user.articleCount}
      />
      {/* 个人资料内容 */}
    </>
  );
}
```

**生成的 Schema 类型：** `ProfilePage`

**包含字段：**
- 用户名称和简介
- 头像图片
- 文章数量统计

### 2. 社交分享组件 (SocialShare.tsx)

提供多平台社交分享功能，增强内容传播。

#### SocialShare

可展开的社交分享按钮组。

```tsx
import { SocialShare } from '@/components/seo';

function ArticleActions({ article }) {
  return (
    <SocialShare
      url={`https://www.xiangfeng.site/article/${article.id}`}
      title={article.title}
      description={article.summary}
      size="md"
      showCopyLink={true}
      platforms={['twitter', 'weibo', 'telegram']}
    />
  );
}
```

**Props：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `url` | string | 必填 | 分享链接 |
| `title` | string | 必填 | 分享标题 |
| `description` | string | - | 分享描述 |
| `className` | string | '' | 自定义样式类名 |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | 按钮大小 |
| `showCopyLink` | boolean | true | 是否显示复制链接按钮 |
| `platforms` | string[] | ['twitter', 'weibo', 'telegram'] | 要显示的平台 |

**支持的平台：**

| 平台 | 标识符 | 图标颜色 |
|------|--------|----------|
| Twitter | `twitter` | #1DA1F2 |
| Facebook | `facebook` | #4267B2 |
| LinkedIn | `linkedin` | #0077b5 |
| 微博 | `weibo` | #E6162D |
| Telegram | `telegram` | #0088cc |

**特性：**
- 点击主按钮展开/收起分享选项
- 平滑的展开动画
- 复制链接功能（带成功提示）
- 响应式按钮大小
- 无障碍支持（ARIA 标签）

#### InlineSocialShare

内联社交分享组件，适合嵌入文章底部。

```tsx
import { InlineSocialShare } from '@/components/seo';

function ArticleFooter({ article }) {
  return (
    <InlineSocialShare
      url={`https://www.xiangfeng.site/article/${article.id}`}
      title={article.title}
      className="mt-8"
    />
  );
}
```

**Props：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `url` | string | 必填 | 分享链接 |
| `title` | string | 必填 | 分享标题 |
| `className` | string | '' | 自定义样式类名 |

**特性：**
- 水平排列的分享按钮
- 固定显示 Twitter、微博、Telegram
- 复制链接按钮带文字标签
- 适合文章底部固定展示

## 使用最佳实践

### 1. 结构化数据使用原则

**每个页面至少包含：**
- `WebsiteStructuredData`（在根布局中全局添加）
- 页面特定类型的结构化数据

**文章页面推荐组合：**
```tsx
<>
  <ArticleStructuredData {...articleData} />
  <BreadcrumbStructuredData items={breadcrumbItems} />
  <OrganizationStructuredData />
</>
```

**用户主页推荐组合：**
```tsx
<>
  <ProfileStructuredData {...profileData} />
  <BreadcrumbStructuredData items={breadcrumbItems} />
</>
```

### 2. 社交分享放置位置

**文章页面：**
- 文章头部：使用 `SocialShare`（紧凑，可展开）
- 文章底部：使用 `InlineSocialShare`（醒目，固定显示）

**列表页面：**
- 每个卡片使用 `SocialShare`，设置 `size="sm"`

### 3. URL 规范

**始终使用完整 URL：**
```tsx
// ✅ 正确
url={`https://www.xiangfeng.site/article/${article.id}`}

// ❌ 错误
url={`/article/${article.id}`}
```

### 4. 性能优化

- 结构化数据组件使用 `next/script` 的 `Script` 组件
- 社交分享组件使用 `'use client'` 指令，仅在客户端渲染
- 避免在列表中渲染大量结构化数据（每页只渲染当前项）

## SEO 效果验证

### 1. 结构化数据测试

使用 Google 的富媒体测试工具验证：
- 访问：https://search.google.com/test/rich-results
- 输入页面 URL 或粘贴 HTML
- 检查是否成功识别结构化数据

### 2. 社交分享预览

使用以下工具预览社交分享效果：
- Twitter Card Validator：https://cards-dev.twitter.com/validator
- Facebook Sharing Debugger：https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector：https://www.linkedin.com/post-inspector/

## 相关模块

- [文章组件](../article/README.md) - 文章页面使用 SEO 组件
- [用户组件](../profile/README.md) - 用户主页使用 SEO 组件
- [更新日志组件](../updates/README.md) - 更新页面使用 SEO 组件
- [类型定义](../../types/README.md) - SEO 相关类型定义
