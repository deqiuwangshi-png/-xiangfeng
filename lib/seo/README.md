# SEO 工具库文档

## 概述

本 SEO 工具库提供了一套完整的搜索引擎优化解决方案，参考字节系产品（如扣子 Coze）的 SEO 规范设计。

## 目录结构

```
lib/seo/
├── config.ts      # SEO 全局配置和策略
├── metadata.ts    # Next.js Metadata 生成器
├── schema.ts      # Schema.org 结构化数据
├── social.ts      # 社交分享工具
└── index.ts       # 统一导出
```

## 核心功能

### 1. 全局配置 (config.ts)

- 站点基础信息配置
- 标题模板规范
- 默认 SEO 值
- 页面类型策略
- 路由映射规则

### 2. Metadata 生成 (metadata.ts)

- 基础页面 Metadata
- 文章页面 Metadata
- 用户主页 Metadata
- 后台页面 Metadata（noindex）
- 认证页面 Metadata（noindex）

### 3. 结构化数据 (schema.ts)

- WebSite Schema
- Article Schema
- Organization Schema
- BreadcrumbList Schema
- ProfilePage Schema
- FAQPage Schema

### 4. 社交分享 (social.ts)

- 多平台分享链接生成
- 社交卡片数据生成
- 原生分享 API 支持
- 分享统计事件

## 使用示例

### 基础页面

```typescript
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: '关于我们',
  description: '了解相逢团队的使命与愿景',
  path: '/about',
  pageType: 'marketing',
});
```

### 文章页面

```typescript
import { generateArticleMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const article = await getArticle(params.id);

  return generateArticleMetadata({
    title: article.title,
    description: article.summary,
    path: `/article/${article.id}`,
    author: article.author.name,
    authorUrl: `/profile/${article.author.id}`,
    publishedAt: article.publishedAt,
    modifiedAt: article.updatedAt,
    tags: article.tags,
    wordCount: article.wordCount,
  });
}
```

### 用户主页

```typescript
import { generateProfileMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const profile = await getProfile(params.userId);

  return generateProfileMetadata({
    title: profile.name,
    description: profile.bio,
    path: `/profile/${profile.id}`,
    avatar: profile.avatar,
    articleCount: profile.articleCount,
  });
}
```

### 后台页面（noindex）

```typescript
import { generateAdminMetadata } from '@/lib/seo';

export const metadata = generateAdminMetadata('创作中心');
```

## 页面 SEO 策略

| 页面类型 | 索引 | 跟踪 | 优先级 | 更新频率 | Sitemap |
|---------|------|------|--------|----------|---------|
| 首页 | ✓ | ✓ | 1.0 | daily | ✓ |
| 文章 | ✓ | ✓ | 0.8 | weekly | ✓ |
| 用户主页 | ✓ | ✓ | 0.6 | weekly | ✓ |
| 列表页 | ✓ | ✓ | 0.7 | daily | ✓ |
| 功能页 | ✓ | ✓ | 0.5 | monthly | ✓ |
| 营销页 | ✓ | ✓ | 0.6 | monthly | ✓ |
| 法律页 | ✓ | ✓ | 0.3 | yearly | ✓ |
| 认证页 | ✗ | ✗ | 0 | never | ✗ |
| 后台页 | ✗ | ✗ | 0 | never | ✗ |

## 标题模板

- **首页**: `相逢 Xiangfeng - 深度思考者社区 | 长文创作与知识分享平台`
- **文章页**: `文章标题 | 作者名 - 相逢`
- **用户主页**: `用户名 - 个人简介 | 相逢`
- **列表页**: `页面名称 - 相逢`
- **功能页**: `功能名称 - 相逢`

## 最佳实践

1. **每个页面都必须设置独立的 Metadata**
2. **文章页面必须包含作者信息和发布时间**
3. **用户主页必须包含文章数量统计**
4. **后台和认证页面必须设置 noindex**
5. **使用结构化数据增强搜索结果展示**
6. **确保所有公开页面都包含在 sitemap 中**
