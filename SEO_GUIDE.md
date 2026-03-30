# 相逢平台 SEO 优化完整方案

> 参考字节系产品（扣子 Coze、飞书等）SEO 规范设计

## 📋 目录

1. [SEO 规范体系](#一-seo-规范体系)
2. [技术实现](#二-技术实现)
3. [页面配置示例](#三-页面配置示例)
4. [结构化数据](#四-结构化数据)
5. [社交分享优化](#五-社交分享优化)
6. [站点地图配置](#六-站点地图配置)
7. [最佳实践](#七-最佳实践)

---

## 一、SEO 规范体系

### 1.1 标题规范（Title）

| 页面类型 | 格式 | 示例 |
|---------|------|------|
| 首页 | `品牌名 - 核心价值主张 \| 定位` | 相逢 - 深度思考者社区 \| 长文创作与知识分享平台 |
| 文章详情 | `文章标题 \| 作者名 - 品牌名` | 如何构建知识体系 \| 张三 - 相逢 |
| 用户主页 | `用户名 - 简介摘要 \| 品牌名` | 张三 - 深度思考者、技术博主 - 相逢 |
| 列表页 | `页面名称 - 品牌名` | 热门文章 - 相逢 |
| 功能页 | `功能名称 - 品牌名` | 创作中心 - 相逢 |
| 后台页面 | `功能名称 - 品牌名` | 草稿箱 - 相逢（noindex）|

### 1.2 描述规范（Description）

- **长度**：120-160 字符（中文约 60-80 字）
- **格式**：核心卖点 + 功能介绍 + 行动号召
- **示例**：
  ```
  相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。
  打破认知边界，构建思维网络与知识经济生态。
  ```

### 1.3 关键词规范（Keywords）

- **数量**：5-10 个核心关键词
- **原则**：从通用到具体，覆盖用户搜索意图
- **优先级**：品牌词 > 行业词 > 长尾词

### 1.4 页面索引策略

| 页面类型 | 索引 | 跟踪 | 优先级 | 更新频率 | Sitemap |
|---------|------|------|--------|----------|---------|
| 首页 | ✓ | ✓ | 1.0 | daily | ✓ |
| 文章详情 | ✓ | ✓ | 0.8 | weekly | ✓ |
| 用户主页 | ✓ | ✓ | 0.6 | weekly | ✓ |
| 列表页 | ✓ | ✓ | 0.7 | daily | ✓ |
| 营销页 | ✓ | ✓ | 0.6 | monthly | ✓ |
| 法律页 | ✓ | ✓ | 0.3 | yearly | ✓ |
| 认证页面 | ✗ | ✗ | 0 | never | ✗ |
| 后台页面 | ✗ | ✗ | 0 | never | ✗ |

---

## 二、技术实现

### 2.1 核心文件结构

```
lib/seo/
├── config.ts      # SEO 全局配置和策略
├── metadata.ts    # Next.js Metadata 生成器
├── schema.ts      # Schema.org 结构化数据
├── social.ts      # 社交分享工具
└── index.ts       # 统一导出

components/seo/
├── StructuredData.tsx   # 结构化数据组件
├── SocialShare.tsx      # 社交分享组件
└── index.ts             # 统一导出
```

### 2.2 快速使用

#### 首页配置
```typescript
import { generateHomeMetadata } from '@/lib/seo';

export const metadata = generateHomeMetadata();
```

#### 文章页面配置
```typescript
import { generateArticleMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const article = await getArticle(params.id);
  
  return generateArticleMetadata({
    title: article.title,
    description: article.summary,
    path: `/article/${article.id}`,
    author: article.author.name,
    publishedAt: article.publishedAt,
    tags: article.tags,
  });
}
```

#### 用户主页配置
```typescript
import { generateProfileMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const profile = await getProfile(params.userId);
  
  return generateProfileMetadata({
    title: profile.name,
    description: profile.bio,
    path: `/profile/${profile.id}`,
    articleCount: profile.articleCount,
  });
}
```

#### 后台页面配置（noindex）
```typescript
import { generateAdminMetadata } from '@/lib/seo';

export const metadata = generateAdminMetadata('草稿箱');
```

---

## 三、页面配置示例

### 3.1 文章详情页完整示例

```typescript
import type { Metadata } from 'next';
import { generateArticleMetadata } from '@/lib/seo';
import { generateArticleSchema, toJsonLd } from '@/lib/seo/schema';
import { ArticleStructuredData } from '@/components/seo';
import Script from 'next/script';

// 1. 生成 Metadata
export async function generateMetadata({ params }): Promise<Metadata> {
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

// 2. 页面组件
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.id);
  
  return (
    <>
      {/* 3. 添加结构化数据 */}
      <ArticleStructuredData
        title={article.title}
        description={article.summary}
        url={`https://www.xiangfeng.site/article/${article.id}`}
        authorName={article.author.name}
        publishedAt={article.publishedAt}
        tags={article.tags}
      />
      
      {/* 页面内容 */}
      <article>
        <h1>{article.title}</h1>
        {/* ... */}
      </article>
    </>
  );
}
```

### 3.2 用户主页完整示例

```typescript
import type { Metadata } from 'next';
import { generateProfileMetadata } from '@/lib/seo';
import { ProfileStructuredData } from '@/components/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const profile = await getProfile(params.userId);
  
  return generateProfileMetadata({
    title: profile.name,
    description: profile.bio,
    path: `/profile/${profile.id}`,
    avatar: profile.avatar,
    articleCount: profile.articleCount,
  });
}

export default async function ProfilePage({ params }) {
  const profile = await getProfile(params.userId);
  
  return (
    <>
      <ProfileStructuredData
        name={profile.name}
        url={`https://www.xiangfeng.site/profile/${profile.id}`}
        description={profile.bio}
        image={profile.avatar}
        articleCount={profile.articleCount}
      />
      
      {/* 页面内容 */}
      <main>{/* ... */}</main>
    </>
  );
}
```

---

## 四、结构化数据

### 4.1 支持的 Schema 类型

| Schema 类型 | 用途 | 适用页面 |
|------------|------|---------|
| WebSite | 网站信息 | 所有页面 |
| Organization | 组织信息 | 所有页面 |
| Article | 文章信息 | 文章详情页 |
| ProfilePage | 个人主页 | 用户主页 |
| BreadcrumbList | 面包屑导航 | 所有页面 |
| FAQPage | FAQ 页面 | 帮助中心 |

### 4.2 使用方式

```typescript
import { 
  WebsiteStructuredData,
  ArticleStructuredData,
  ProfileStructuredData,
  BreadcrumbStructuredData 
} from '@/components/seo';

// 在页面中使用
<head>
  <WebsiteStructuredData />
  <ArticleStructuredData {...articleData} />
  <BreadcrumbStructuredData items={breadcrumbItems} />
</head>
```

---

## 五、社交分享优化

### 5.1 Open Graph 配置

```typescript
openGraph: {
  type: 'article',        // website | article | profile
  locale: 'zh_CN',
  url: 'https://www.xiangfeng.site/article/123',
  siteName: '相逢 Xiangfeng',
  title: '文章标题',
  description: '文章描述',
  images: [{
    url: 'https://www.xiangfeng.site/og-image.svg',
    width: 1200,
    height: 630,
    alt: '图片说明',
  }],
  // Article 特有
  publishedTime: '2026-03-25T08:00:00Z',
  modifiedTime: '2026-03-28T10:30:00Z',
  authors: ['作者名'],
  section: '分类',
  tags: ['标签1', '标签2'],
}
```

### 5.2 Twitter Card 配置

```typescript
twitter: {
  card: 'summary_large_image',
  site: '@xiangfeng',
  creator: '@xiangfeng',
  title: '页面标题',
  description: '页面描述',
  images: ['https://www.xiangfeng.site/og-image.svg'],
}
```

### 5.3 社交分享组件

```typescript
import { SocialShare } from '@/components/seo';

// 使用社交分享组件
<SocialShare
  url="https://www.xiangfeng.site/article/123"
  title="文章标题"
  description="文章描述"
  platforms={['twitter', 'weibo', 'telegram']}
/>
```

---

## 六、站点地图配置

### 6.1 Sitemap 配置

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { PAGE_SEO_STRATEGIES } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site';
  
  // 静态页面
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: PAGE_SEO_STRATEGIES.home.changeFrequency,
      priority: PAGE_SEO_STRATEGIES.home.priority,
    },
    // ...
  ];
  
  // 动态页面（文章、用户）
  const dynamicPages = await fetchDynamicPages();
  
  return [...staticPages, ...dynamicPages];
}
```

### 6.2 Robots.txt 配置

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

---

## 七、最佳实践

### 7.1 必须遵循的原则

1. **每个页面都必须设置独立的 Metadata**
   - 不要依赖全局默认配置
   - 动态页面使用 `generateMetadata`

2. **后台和认证页面必须设置 noindex**
   ```typescript
   robots: {
     index: false,
     follow: false,
   }
   ```

3. **文章页面必须包含完整信息**
   - 标题、描述、作者、发布时间
   - 标签、字数统计
   - 结构化数据标记

4. **用户主页必须包含统计信息**
   - 文章数量
   - 个人简介
   - 头像图片

### 7.2 图片优化

- 使用语义化的 `alt` 属性
- 文章封面图尺寸：1200 x 630（OG 标准）
- 用户头像：支持多种尺寸

### 7.3 语义化标签

```html
<!-- 正确的标题层级 -->
<h1>页面主标题（唯一）</h1>
<h2>章节标题</h2>
<h3>小节标题</h3>

<!-- 文章使用 article 标签 -->
<article>
  <header>
    <h1>文章标题</h1>
    <author>作者信息</author>
  </header>
  <main>文章内容</main>
</article>
```

### 7.4 性能优化

- 使用 Next.js Image 组件优化图片
- 关键 CSS 内联
- 延迟加载非关键资源

### 7.5 监控与维护

- 定期检查搜索引擎收录情况
- 监控核心页面排名变化
- 使用 Google Search Console 和百度站长平台

---

## 八、参考资源

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org 文档](https://schema.org/)
- [Open Graph 协议](https://ogp.me/)
- [Google SEO 指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [百度搜索优化指南](https://ziyuan.baidu.com/college/courseinfo?id=267&page=1)

---

*文档版本：v1.0*  
*最后更新：2026-03-30*
