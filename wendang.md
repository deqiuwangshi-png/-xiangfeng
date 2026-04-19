# 相逢 - 技术文档

> 深度思考者的精神家园 - 技术架构与维护指南

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [项目结构](#3-项目结构)
4. [核心功能模块](#4-核心功能模块)
5. [架构设计](#5-架构设计)
6. [数据流与状态管理](#6-数据流与状态管理)
7. [安全机制](#7-安全机制)
8. [性能优化](#8-性能优化)
9. [开发规范](#9-开发规范)
10. [部署与运维](#10-部署与运维)
11. [故障排查](#11-故障排查)
12. [附录](#12-附录)

---

## 1. 项目概述

### 1.1 产品定位

**相逢** 是一个以"深度思考"为核心的社区实验产品，为深度思考者提供长文创作、知识分享和思维连接的平台。

### 1.2 核心功能

- **文章系统**: 长文创作、编辑、发布、草稿管理
- **评论互动**: 评论、点赞、收藏、分享
- **用户系统**: 注册、登录、OAuth、个人资料
- **通知系统**: 消息通知、收件箱
- **奖励系统**: 用户激励机制
- **内容保护**: 防复制、防爬虫

### 1.3 项目状态

- **当前阶段**: 早期实验阶段
- **重构次数**: 5次完整框架重构 + 1次页面完善
- **稳定性**: 功能可用但存在漏洞，适合学习参考

---

## 2. 技术栈

### 2.1 核心技术

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Next.js | 16.1.6 | App Router, Turbopack |
| 语言 | TypeScript | 5.x | 严格模式 |
| 样式 | Tailwind CSS | 4.x | 原子化CSS |
| 数据库 | Supabase | - | PostgreSQL + Auth + RLS |
| 状态管理 | Zustand | 5.x | 轻量级状态管理 |
| 数据获取 | SWR | 2.x | 缓存与乐观更新 |
| 编辑器 | TipTap | 3.x | 富文本编辑器 |
| 验证 | Zod | 4.x | 运行时类型验证 |

### 2.2 辅助工具

| 工具 | 用途 |
|------|------|
| lucide-react | 图标库 |
| sonner | Toast 通知 |
| clsx + tailwind-merge | 类名处理 |
| gray-matter | Markdown 解析 |
| DOMPurify | XSS 防护 |

---

## 3. 项目结构

### 3.1 目录概览

```
xf_02/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证路由组
│   ├── (content)/         # 内容路由组
│   ├── (main)/            # 主应用路由组
│   ├── (marketing)/       # 营销页面路由组
│   ├── api/               # API 路由
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── app/               # 应用级组件
│   ├── article/           # 文章相关组件
│   ├── auth/              # 认证相关组件
│   ├── drafts/            # 草稿相关组件
│   ├── home/              # 首页组件
│   ├── inbox/             # 通知组件
│   ├── marketing/         # 营销页面组件
│   ├── profile/           # 个人资料组件
│   ├── publish/           # 发布编辑器组件
│   ├── settings/          # 设置组件
│   ├── ui/                # 通用 UI 组件
│   └── providers/         # 全局 Provider
├── lib/                   # 业务逻辑层
│   ├── articles/          # 文章模块
│   ├── auth/              # 认证模块
│   ├── drafts/            # 草稿服务
│   ├── settings/          # 设置模块
│   ├── user/              # 用户模块
│   ├── cache/             # 缓存管理
│   ├── security/          # 安全工具
│   └── utils/             # 通用工具
├── hooks/                 # 自定义 Hooks
├── types/                 # TypeScript 类型
├── config/                # 配置文件
├── constants/             # 常量定义
├── stores/                # Zustand Store
├── styles/                # CSS 模块
└── content/               # 静态内容
```

### 3.2 路由结构

| 路由组 | 路径 | 说明 |
|--------|------|------|
| (auth) | /login, /register, /forgot-password, /reset-password | 认证页面 |
| (main) | /home, /publish, /drafts, /inbox, /profile, /settings, /rewards, /updates | 主应用页面 |
| (content) | /article/[id] | 文章详情页 |
| (marketing) | /, /about, /partners | 营销页面 |
| (legal) | /privacy, /terms | 法律页面 |

---

## 4. 核心功能模块

### 4.1 认证模块 (lib/auth)

#### 职责
- 用户登录、注册、退出
- OAuth 第三方登录 (GitHub)
- 密码重置、修改
- 权限控制
- 登录历史

#### 核心文件

```
lib/auth/
├── client.ts              # 客户端入口
├── server.ts              # 服务端入口
├── core/
│   ├── user.ts            # 用户获取
│   ├── permissions.ts     # 权限控制
│   ├── withPermission.ts  # 权限包装器
│   └── loginHistory.ts    # 登录历史
├── actions/               # Server Actions
│   ├── login.ts
│   ├── register.ts
│   ├── logout.ts
│   ├── oauth.ts
│   ├── forgot-password.ts
│   ├── reset-password.ts
│   └── change-password.ts
└── utils/                 # 工具函数
```

#### 使用方式

**客户端组件**:
```typescript
import { login, logout } from '@/lib/auth/client';
```

**服务端组件/Actions**:
```typescript
import { getCurrentUser, requireAuth } from '@/lib/auth/server';
```

### 4.2 文章模块 (lib/articles)

#### 职责
- 文章 CRUD 操作
- 评论系统
- 点赞、收藏
- 浏览统计
- 批量操作

#### 核心文件

```
lib/articles/
├── dto.ts                 # 数据映射
├── schema.ts              # Zod 验证
├── actions/
│   ├── index.ts           # 统一导出
│   ├── crud.ts            # CRUD 操作
│   ├── query.ts           # 查询操作
│   ├── mutate.ts          # 增删改
│   ├── comment.ts         # 评论
│   ├── like.ts            # 点赞
│   ├── bookmark.ts        # 收藏
│   ├── view.ts            # 浏览统计
│   ├── batch.ts           # 批量操作
│   └── _secure.ts         # 安全工具
└── queries/               # 服务端查询
    ├── index.ts
    ├── article.ts
    └── comment.ts
```

#### 数据验证规则

| 字段 | 规则 |
|------|------|
| 标题 | 1-100 字符 |
| 内容 | 1-50000 字符 |
| 标签 | 最多10个，每个1-20字符，只允许字母数字中文连字符 |
| 评论 | 1-500 字符 |

### 4.3 草稿模块 (lib/drafts)

#### 职责
- 草稿列表管理
- 草稿筛选、搜索
- 批量选择、删除
- 分页加载

#### 核心文件

```
lib/drafts/
└── draftService.ts        # 草稿服务

components/drafts/
├── core/
│   ├── DraftsClient.tsx   # 客户端容器
│   └── DraftsContent.tsx  # 内容组件
├── card/
│   ├── DraftCard.tsx      # 草稿卡片
│   └── DraftCardSkeleton.tsx
├── filter/
│   ├── FilterChips.tsx    # 筛选标签
│   ├── SearchBox.tsx      # 搜索框
│   └── SelectAllCheckbox.tsx
├── actions/
│   ├── BatchActionsBar.tsx
│   └── DeleteConfirmModal.tsx
└── ...
```

### 4.4 编辑器模块 (components/publish)

#### 职责
- 富文本编辑
- 自动保存
- 图片上传
- 工具栏操作

#### 核心组件

```
components/publish/
├── _core/
│   ├── DynamicEditor.tsx  # 动态编辑器
│   └── EditorCard.tsx     # 编辑器卡片
├── _toolbar/
│   ├── EditorToolbar.tsx  # 工具栏
│   ├── BubbleMenu.tsx     # 气泡菜单
│   └── SlashMenu.tsx      # 斜杠菜单
├── _header/
│   └── EditorHeader.tsx   # 编辑器头部
├── _inputs/
│   └── TitleInput.tsx     # 标题输入
└── PublishPageClient.tsx  # 发布页面客户端
```

### 4.5 设置模块 (lib/settings)

#### 职责
- 个人资料设置
- 账号安全设置
- 通知设置
- 隐私设置
- 外观设置

#### 核心文件

```
lib/settings/
├── actions/
│   ├── index.ts           # 统一导出
│   ├── appearance.ts      # 外观设置
│   ├── content.ts         # 内容设置
│   ├── linkedAccounts.ts  # 关联账号
│   ├── notifications.ts   # 通知设置
│   └── privacy.ts         # 隐私设置
├── constants/
│   ├── field-maps.ts      # 字段映射
│   └── index.ts
├── utils/
│   └── settings.ts        # 设置工具
├── queries.ts             # 查询函数
└── README.md
```

---

## 5. 架构设计

### 5.1 分层架构

```
┌─────────────────────────────────────────┐
│           表现层 (Presentation)          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Pages  │ │Components│ │  Hooks  │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
└───────┼───────────┼───────────┼────────┘
        │           │           │
        ▼           ▼           ▼
┌─────────────────────────────────────────┐
│           业务逻辑层 (Business)          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  lib/*  │ │ Server  │ │  Cache  │   │
│  │         │ │ Actions │ │         │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
└───────┼───────────┼───────────┼────────┘
        │           │           │
        ▼           ▼           ▼
┌─────────────────────────────────────────┐
│           数据层 (Data)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Supabase │ │   RLS   │ │  Triggers│   │
│  │         │ │Policies │ │         │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

### 5.2 组件架构

#### Server Component vs Client Component

| 类型 | 用途 | 示例 |
|------|------|------|
| Server Component | 数据获取、SEO、静态内容 | ArticleHeader, 页面布局 |
| Client Component | 交互逻辑、状态管理、浏览器API | LoginForm, 编辑器 |

#### 组件分类

```
components/
├── app/                   # 应用级组件
│   ├── AppShell.tsx       # 应用外壳
│   ├── ArticleCard.tsx    # 文章卡片
│   └── SearchBox.tsx      # 搜索框
├── article/               # 文章域组件
├── auth/                  # 认证域组件
├── drafts/                # 草稿域组件
├── profile/               # 个人资料域组件
├── publish/               # 发布域组件
├── settings/              # 设置域组件
└── ui/                    # 通用 UI 组件
```

### 5.3 路由鉴权矩阵

| 路由 | 配置层 | 页面层 | 结果 |
|------|--------|--------|------|
| /home | 公开 | 公开 | 无需登录 |
| /publish | 需登录 | 间接(layout) | 需登录 |
| /drafts | 需登录 | 间接(layout) | 需登录 |
| /inbox | 需登录 | 需登录 | 需登录 |
| /settings | 需登录 | 需登录 | 需登录 |
| /profile | 需登录 | 需登录 | 需登录 |
| /profile/[userId] | 公开 | 公开 | 可匿名访问 |
| /article/[id] | 公开 | 公开 | 无需登录 |

---

## 6. 数据流与状态管理

### 6.1 数据流模式

#### Server Actions 模式

```
User Action
    │
    ▼
Client Component
    │
    ▼
Server Action (lib/*/actions/*.ts)
    │
    ▼
Supabase (Database)
    │
    ▼
Response → SWR Revalidation → UI Update
```

#### SWR 缓存模式

```typescript
// 数据获取
const { data, error, mutate } = useSWR(
  cacheKey,
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  }
);

// 乐观更新
mutate(
  async (currentData) => {
    // 立即更新 UI
    const optimisticData = updateOptimistically(currentData);
    
    // 发送请求
    await serverAction();
    
    return optimisticData;
  },
  { rollbackOnError: true }
);
```

### 6.2 状态管理

#### Zustand Store

```
stores/
└── index.ts               # Store 统一入口
```

#### SWR 缓存键规范

```
lib/cache/
├── index.ts               # 缓存工具
└── keys.ts                # 缓存键定义
```

缓存键命名规范:
- `articles:list` - 文章列表
- `articles:detail:${id}` - 文章详情
- `drafts:list` - 草稿列表
- `user:profile:${id}` - 用户资料
- `notifications:list` - 通知列表

### 6.3 Hooks 与 Lib 边界

| 层级 | 职责 | 示例 |
|------|------|------|
| hooks | UI/交互层、状态编排、副作用 | useAuth, useDrafts, useEditorState |
| lib | 领域/数据层、Server Actions、校验规则 | lib/articles/actions, lib/auth/server |

---

## 7. 安全机制

### 7.1 认证安全

#### 登录限流
- IP + 邮箱组合限流
- 防止暴力破解
- 防止恶意锁账号

#### Session 管理
- `scope: 'global'` 退出
- 服务端会话失效
- Cookie 安全配置

#### 密码策略
- 最小8位字符
- 必须包含大小写字母和数字
- 密码强度检测

### 7.2 数据安全

#### 输入验证
- Zod Schema 验证
- 所有用户输入都经过验证
- 类型安全转换

#### XSS 防护
- DOMPurify 净化 HTML
- 用户内容转义输出
- CSP 内容安全策略

#### SQL 注入防护
- Supabase 参数化查询
- RLS 行级安全策略
- 禁止直接 SQL

### 7.3 内容安全策略 (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://vercel.live;
style-src 'self' 'unsafe-inline';
img-src 'self' https://*.supabase.co https://api.dicebear.com data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-ancestors 'none';
```

### 7.4 内容保护

- 防复制保护 (可选)
- 防爬虫机制
- 预览墙 (Paywall)

---

## 8. 性能优化

### 8.1 构建优化

#### Next.js 配置

```typescript
// next.config.ts
{
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true,
  }
}
```

### 8.2 图片优化

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
}
```

### 8.3 数据获取优化

#### SWR 配置
- 去重间隔: 5秒
- 聚焦时重新验证: 关闭
- 错误重试: 指数退避

#### 数据库优化
- 触发器自动维护计数
- 选择性字段查询 (不查 content)
- 索引优化

### 8.4 渲染优化

- Server Components 优先
- 动态导入大组件
- 骨架屏加载状态
- 虚拟列表 (长列表)

---

## 9. 开发规范

### 9.1 代码规范

#### 导入规范

```typescript
// ✅ 正确 - 使用路径别名
import { Button } from '@/components/ui/button';
import { login } from '@/lib/auth/client';

// ❌ 错误 - 相对路径超过两层
import { Button } from '../../../components/ui/button';
```

#### 文件命名
- 组件: PascalCase (e.g., `ArticleCard.tsx`)
- 工具: camelCase (e.g., `utils.ts`)
- 常量: UPPER_SNAKE_CASE (e.g., `MAX_COUNT`)
- 类型: PascalCase + 类型后缀 (e.g., `ArticleProps`)

### 9.2 类型规范

```typescript
// 类型定义在 types/ 目录
import type { Article, User } from '@/types';

// 组件 Props 接口
interface ArticleCardProps {
  article: Article;
  onClick?: (id: string) => void;
}
```

### 9.3 错误处理

```typescript
// Server Action 返回格式
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 使用示例
const result = await createArticle(data);
if (!result.success) {
  toast.error(result.error);
  return;
}
```

### 9.4 文档规范

- 每个模块必须包含 README.md
- 复杂函数添加 JSDoc 注释
- 关键决策记录在技术文档中

---

## 10. 部署与运维

### 10.1 环境变量

```bash
# 必需
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# 可选
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION=true
```

### 10.2 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 检查
npm run lint
npm run check:readme-sync
```

### 10.3 部署平台

- **推荐**: Vercel (原生支持 Next.js)
- **数据库**: Supabase (PostgreSQL)
- **CDN**: Vercel Edge Network

### 10.4 监控

- Vercel Analytics
- Vercel Speed Insights
- Supabase Dashboard

---

## 11. 故障排查

### 11.1 常见问题

#### 构建失败
```bash
# 检查类型错误
npx tsc --noEmit

# 检查 ESLint
npm run lint
```

#### 数据库连接失败
- 检查 Supabase URL 和 Key
- 检查 RLS 策略
- 检查网络连接

#### 认证问题
- 检查 Cookie 配置
- 检查 Session 过期时间
- 检查回调 URL 配置

### 11.2 调试技巧

#### 服务端调试
```typescript
// Server Action 中添加日志
console.log('[Server Action]', { userId, data });
```

#### 客户端调试
```typescript
// SWR 调试
const { data, error } = useSWR(key, fetcher, {
  onError: (err) => console.error('[SWR Error]', err),
});
```

### 11.3 性能分析

- 使用 Lighthouse 进行性能审计
- 使用 Chrome DevTools 分析渲染性能
- 使用 Vercel Analytics 监控 Core Web Vitals

---

## 12. 附录

### 12.1 术语表

| 术语 | 说明 |
|------|------|
| RLS | Row Level Security，行级安全策略 |
| CSP | Content Security Policy，内容安全策略 |
| SWR | Stale-While-Revalidate，缓存策略 |
| DTO | Data Transfer Object，数据传输对象 |
| OAuth | 开放授权协议 |
| XSS | Cross-Site Scripting，跨站脚本攻击 |

### 12.2 参考文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TipTap 文档](https://tiptap.dev/docs)

### 12.3 更新日志

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-04-18 | v1.0 | 技术文档初版 |

---

## 维护说明

本文档应与代码同步维护。当进行以下操作时，请更新本文档：

1. 新增/删除核心功能模块
2. 修改架构设计
3. 变更开发规范
4. 更新部署流程
5. 发现新的故障排查方法

**文档维护者**: 开发团队
**最后更新**: 2026-04-18
