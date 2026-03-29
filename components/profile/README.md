# 个人主页组件化架构

## 概述

个人主页采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、可维护的用户资料展示页面。

## 项目结构

### 页面文件

```
app/(main)/profile/
├── page.tsx                    # 当前用户个人主页（/profile）
└── [userId]/
    └── page.tsx                # 指定用户个人主页（/profile/[userId]）
```

### 组件文件

```
components/profile/
├── index.ts                    # 组件索引文件（统一导出）
├── README.md                   # 组件文档
├── ProfileHeader.tsx           # 个人资料头部组件
├── ProfileHeaderSkeleton.tsx   # 个人资料头部骨架屏
├── ProfileContent.tsx          # 用户内容列表组件
├── ProfileStats.tsx            # 数据统计组件
├── ProfileTabs.tsx             # 标签页切换组件
├── ProfileTabsContext.tsx      # 标签页状态管理 Context
├── ProfileTabContent.tsx       # 标签页内容包装组件
├── HeatMap.tsx                 # 灵感热力图组件（服务端）
└── HeatMapView.tsx             # 灵感热力图视图组件（客户端）
```

## 组件说明

### 页面组件

#### 1. ProfilePage（当前用户个人主页）

**位置**: `app/(main)/profile/page.tsx`

**职责**: 显示当前登录用户的个人主页

**功能**:
- 获取当前登录用户信息
- 未登录重定向到登录页
- 使用 Suspense 分离关键/非关键数据
- 并行获取用户资料和统计数据

**性能优化**:
- 使用 Suspense 分离 ProfileHeader 和 ProfileContent
- ProfileHeader 优先渲染（关键路径）
- ProfileContent 流式传输（非关键）
- 避免级联数据获取阻塞

**使用示例**:
```tsx
// 访问 /profile 查看自己的个人主页
```

#### 2. UserProfilePage（指定用户个人主页）

**位置**: `app/(main)/profile/[userId]/page.tsx`

**职责**: 显示指定用户的公开个人主页

**功能**:
- 支持查看任意用户的公开资料
- 用户资料可见性检查（private/followers/public）
- 与 `/profile` 页面保持一致的 UI
- 支持查看他人思想轨迹

**隐私安全**:
- `private`: 仅自己可见
- `followers`: 仅粉丝可见
- `public/community`: 所有人可见

**使用示例**:
```tsx
// 访问 /profile/[userId] 查看指定用户的个人主页
```

### UI 组件

#### 3. ProfileHeader（个人资料头部组件）

**位置**: `ProfileHeader.tsx`

**职责**: 显示用户的头像、用户名、简介和统计信息

**功能**:
- 用户头像显示（带认证边框）
- 用户名和认证标识
- 位置和加入时间信息
- 个人简介展示
- 关注/取消关注按钮
- 用户徽章展示

**安全特性**:
- 所有用户生成内容经过 HTML 转义
- 防止 XSS 攻击

**使用示例**:
```tsx
<ProfileHeader user={userData} stats={stats} />
```

#### 4. ProfileHeaderSkeleton（个人资料头部骨架屏）

**位置**: `ProfileHeaderSkeleton.tsx`

**职责**: 个人资料头部加载状态的骨架屏

**功能**:
- 头像区域圆形骨架
- 用户名和元信息行骨架
- 关注按钮骨架
- 个人简介骨架
- 统计信息骨架

**性能优化**:
- 使用 `animate-pulse` 实现呼吸动画效果
- 保持与真实组件相同的尺寸，避免布局偏移

**使用示例**:
```tsx
<Suspense fallback={<ProfileHeaderSkeleton />}>
  <ProfileHeaderData userId={user.id} />
</Suspense>
```

#### 5. ProfileContent（用户内容列表组件）

**位置**: `ProfileContent.tsx`

**职责**: 显示用户的文章列表

**功能**:
- 列表形式展示文章
- 标题、摘要、元信息
- 点赞数和评论数
- 发布时间显示
- 点击跳转到文章详情

**性能优化**:
- 提供骨架屏组件 `ProfileContentSkeleton`
- 支持 Suspense 流式传输

**使用示例**:
```tsx
<ProfileContent userId={userId} />
```

#### 6. ProfileStats（数据统计组件）

**位置**: `ProfileStats.tsx`

**职责**: 显示用户的数据统计信息

**功能**:
- 文章数量
- 关注者数量
- 获赞数量
- 节点数量（待开发）

**布局**:
- 使用 grid 布局
- 响应式设计（移动端2列，桌面端4列）

**使用示例**:
```tsx
<ProfileStats stats={stats} />
```

#### 7. ProfileTabs（标签页切换组件）

**位置**: `ProfileTabs.tsx`

**职责**: 提供极简风格的标签页切换

**功能**:
- 极简设计，不抢夺内容视觉焦点
- 使用文字颜色和下划线区分状态
- 支持自己/他人主页的不同标签文本
- 减少间距，让内容区更快露出

**标签页**:
- `content`: 我的内容/他的内容
- `thought`: 思想轨迹

**使用示例**:
```tsx
<ProfileTabs isOwnProfile={true} />
```

#### 8. ProfileTabsContext（标签页状态管理 Context）

**位置**: `ProfileTabsContext.tsx`

**职责**: 提供标签页切换的状态管理

**功能**:
- 管理当前激活的标签页状态
- 提供切换标签页的方法
- 替代 DOM 操作

**使用示例**:
```tsx
<ProfileTabsProvider defaultTab="content">
  <ProfileTabs />
  <ProfileTabContent tab="content">
    <ProfileContent />
  </ProfileTabContent>
</ProfileTabsProvider>
```

#### 9. ProfileTabContent（标签页内容包装组件）

**位置**: `ProfileTabContent.tsx`

**职责**: 根据当前激活的标签页条件渲染内容

**功能**:
- 当前标签页匹配时显示内容
- 不匹配时返回 null（不渲染）
- 支持包裹服务端组件作为 children

**使用示例**:
```tsx
<ProfileTabContent tab="content">
  <ProfileContent userId={userId} />
</ProfileTabContent>
<ProfileTabContent tab="thought">
  <HeatMap userId={userId} />
</ProfileTabContent>
```

#### 10. HeatMap（灵感热力图组件 - 服务端）

**位置**: `HeatMap.tsx`

**职责**: 负责从服务端获取热力图数据

**功能**:
- 从服务端获取热力图数据
- 将数据传递给 HeatMapView 客户端组件
- 不处理任何交互逻辑

**数据流**:
- 从 articles 表获取发布文章（深度3）
- 从 comments 表获取评论（深度1）
- 通过 `fetchThoughtHeatMap` Server Action 查询

**使用示例**:
```tsx
<HeatMap userId={userId} />
```

#### 11. HeatMapView（灵感热力图视图组件 - 客户端）

**位置**: `HeatMapView.tsx`

**职责**: 负责热力图的交互逻辑和展示

**功能**:
- 接收服务端传入的数据
- 处理翻页等交互逻辑
- 渲染热力图展示
- 思考深度颜色映射（静→燃）

**思考深度**:
- 0: 静（无记录）
- 1: 浅（浅思）
- 2: 沉（沉思）
- 3: 深（深思）
- 4: 悟（顿悟）
- 5: 燃（灵感爆发）

**使用示例**:
```tsx
<HeatMapView initialData={heatMapData} />
```

## 组件层次结构

```
ProfilePage / UserProfilePage (Server Component)
├── ProfileTabsProvider (Context Provider)
│   ├── Suspense (ProfileHeader)
│   │   └── ProfileHeader (Client Component)
│   │       ├── UserAvatar
│   │       ├── VerifyBadge
│   │       ├── UserBadges
│   │       └── ProfileStats
│   ├── ProfileTabs (Client Component)
│   ├── ProfileTabContent
│   │   └── Suspense (ProfileContent)
│   │       └── ProfileContent (Server Component)
│   │           └── ArticleListItem
│   └── ProfileTabContent
│       └── Suspense (HeatMap)
│           └── HeatMap (Server Component)
│               └── HeatMapView (Client Component)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 数据获取、权限检查
- **Client Component**: 交互逻辑、状态管理
- **骨架屏组件**: 加载状态优化

### 2. 性能优化
- 使用 Suspense 分离关键/非关键数据
- 并行数据获取减少 LCP 时间
- 骨架屏优化感知性能
- 避免级联数据获取阻塞

### 3. 状态管理
- 使用 Context 管理标签页状态
- 替代 DOM 操作，符合 React 最佳实践
- 支持条件渲染服务端组件

### 4. 安全考虑
- 用户生成内容 HTML 转义
- 防止 XSS 攻击
- 用户资料可见性检查

## 数据流

```
页面路由
  ↓
Server Component (获取数据、权限检查)
  ↓
Suspense (流式传输)
  ↓
Client Component (交互逻辑)
  ↓
Context Provider (状态管理)
  ↓
子组件 (通过 props/context 获取数据)
```

## 样式规范

### 设计风格
- 极简风格，不抢夺内容视觉焦点
- 瑞士设计风格，简洁无装饰
- 使用 Tailwind CSS v4 工具类

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 热力图使用暖色调渐变（琥珀色到赭石色）
- 避免程序员绿色系，营造人文/艺术氛围

## 更新时间

2026-03-29
