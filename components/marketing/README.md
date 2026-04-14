# 营销页面组件化架构

## 概述

营销页面模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、SEO 友好的着陆页。包含 Hero 区域、特色功能、运作流程、创作者展示、生态经济、CTA 等多个区块。

## 项目结构

### 页面文件

```
app/(marketing)/
├── layout.tsx                  # 营销页面布局
└── page.tsx                    # 首页（着陆页）
```

### 组件文件

```
components/marketing/
├── HeroSection.tsx             # Hero 首屏区域
├── FeaturesSection.tsx         # 特色功能区
├── HowItWorksSection.tsx       # 如何运作区
├── CreatorsSection.tsx         # 创作者展示区
├── EconomySection.tsx          # 生态经济区
├── CTASection.tsx              # 行动号召区
├── Navbar.tsx                  # 导航栏
├── Footer.tsx                  # 页脚
└── RevealOnScrollClient.tsx    # 滚动显示动画（客户端）
```

## 组件说明

### 核心区块组件

#### 1. HeroSection（Hero 首屏区域）

**位置**: `HeroSection.tsx`

**职责**: 首屏关键内容展示，LCP 优化

**功能**:
- 品牌标语展示
- 主标题和副标题
- CTA 按钮
- UI 预览展示
- 背景装饰动画

**性能优化**:
- Server Component 服务端渲染
- LCP 关键内容直接渲染
- 动画部分分离到 RevealOnScrollClient
- CSS 动画无需 JavaScript

**使用示例**:
```tsx
<HeroSection />
```

#### 2. FeaturesSection（特色功能区）

**位置**: `FeaturesSection.tsx`

**职责**: 展示平台三大核心特色功能

**功能**:
- 长文栖息地：沉浸式阅读体验
- 兴趣社群与互动：深度社交
- 生态共建：价值共创

**特色数据**:
- 图标、标题、描述、标签
- 颜色主题（info、primary、accent）

**使用示例**:
```tsx
<FeaturesSection />
```

#### 3. HowItWorksSection（如何运作区）

**位置**: `HowItWorksSection.tsx`

**职责**: 三步流程展示

**功能**:
- 注册与探索
- 创造与连接
- 成长与共赢

**步骤数据**:
- 编号、标题、描述、颜色

**响应式设计**:
- 桌面端：横向三列 + 连接线
- 移动端：垂直布局 + 连接线

**使用示例**:
```tsx
<HowItWorksSection />
```

#### 4. CreatorsSection（创作者展示区）

**位置**: `CreatorsSection.tsx`

**职责**: 展示精选创作者和平台数据

**功能**:
- 创作者列表（头像、姓名、角色、标签、引言）
- 统计数据（认证创作者、月度收益、累计订阅、满意度）
- 支持计划（创作基金、推广资源、协作网络）

**创作者数据**:
- Sophie Chen：哲学研究者
- Alex Wang：产品设计师

**统计数据**:
- 500+ 认证创作者
- ¥28w+ 月度创作收益
- 1w+ 累计订阅
- 94% 创作者满意度

**使用示例**:
```tsx
<CreatorsSection />
```

#### 5. EconomySection（生态经济区）

**位置**: `EconomySection.tsx`

**职责**: 展示价值驱动的生态经济模型

**功能**:
- 经济特性（价值创造、生态循环、长期主义）
- 创作者权益对比
- 读者权益对比
- CTA 按钮

**权益对比**:
- 创作者：内容价值指数、生态贡献认证、协作项目分成
- 读者：免费阅读、订阅专栏、参与评估

**使用示例**:
```tsx
<EconomySection />
```

#### 6. CTASection（行动号召区）

**位置**: `CTASection.tsx`

**职责**: 最终转化区域

**功能**:
- 标题和描述
- 立即加入按钮
- 了解更多按钮

**使用示例**:
```tsx
<CTASection />
```

### 布局组件

#### 7. Navbar（导航栏）

**位置**: `Navbar.tsx`

**职责**: 响应式导航栏

**功能**:
- Logo
- 导航链接（特色功能、如何运作、生态创作者、生态经济）
- 登录按钮
- 滚动阴影效果

**导航项**:
- 特色功能: `#features`
- 如何运作: `#how-it-works`
- 生态创作者: `#creators`
- 生态经济: `#economy`

**性能优化**:
- 使用 Link 组件替代 router.push
- 启用自动预加载

**使用示例**:
```tsx
<Navbar />
```

#### 8. Footer（页脚）

**位置**: `Footer.tsx`

**职责**: 页面底部信息

**功能**:
- Logo 和简介
- 社交链接（GitHub）
- 关于产品链接
- 支持帮助链接
- 版权信息

**使用示例**:
```tsx
<Footer />
```

### 动画组件

#### 9. RevealOnScrollClient（滚动显示动画客户端组件）

**位置**: `RevealOnScrollClient.tsx`

**职责**: 当元素进入视口时触发动画显示

**功能**:
- IntersectionObserver 检测
- 进入视口时添加 active 类
- 动画触发后取消观察（性能优化）
- 支持延迟动画

**使用示例**:
```tsx
<RevealOnScrollClient delay={100}>
  <div>内容</div>
</RevealOnScrollClient>
```



## 页面组件

### 首页（着陆页）

**位置**: `app/(marketing)/page.tsx`

**职责**: 营销页面主入口，组合所有区块组件

**SEO 优化**:
- 完整的元数据（title、description、keywords）
- Open Graph 标签
- Twitter Card
- 规范链接
- 机器人控制

**组件组合**:
```tsx
<HeroSection />
<FeaturesSection />
<HowItWorksSection />
<CreatorsSection />
<EconomySection />
<CTASection />
```

### 营销布局

**位置**: `app/(marketing)/layout.tsx`

**职责**: 营销页面布局，包含导航和页脚

**结构**:
```tsx
<div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

## 组件层次结构

```
MarketingLayout (Server Component)
├── Navbar (Client)
├── main
│   └── HomePage (Server Component)
│       ├── HeroSection (Server)
│       │   └── RevealOnScrollClient (Client)
│       ├── FeaturesSection (Server)
│       │   └── RevealOnScrollClient (Client) x3
│       ├── HowItWorksSection (Server)
│       │   └── RevealOnScrollClient (Client) x4
│       ├── CreatorsSection (Server)
│       │   └── RevealOnScrollClient (Client) x3
│       ├── EconomySection (Server)
│       │   └── RevealOnScrollClient (Client) x5
│       └── CTASection (Server)
│           └── RevealOnScrollClient (Client)
└── Footer (Server)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面结构、静态内容、SEO 关键内容
- **Client Component**: 交互逻辑、动画效果、滚动监听
- **性能优先**: LCP 关键内容服务端渲染

### 2. 性能优化
- Server Component 优先渲染
- 动画延迟加载（RevealOnScrollClient）
- CSS 动画无需 JavaScript
- IntersectionObserver 性能优化

### 3. SEO 优化
- 完整的元数据
- 语义化 HTML
- 服务端渲染关键内容
- Open Graph 和 Twitter Card

### 4. 响应式设计
- 移动端优先
- 断点：sm (640px)、lg (1024px)
- 触摸区域优化
- 文字大小适配

## 性能优化策略

### LCP 优化
- Hero 内容服务端直接渲染
- 关键 CSS 内联
- 图片优化（Next.js Image）
- 字体优化

### 动画优化
- CSS 动画优先
- IntersectionObserver 延迟触发
- 动画完成后取消观察
- will-change 属性

### 代码分割
- 动画组件分离
- 按需加载
- 减少客户端 JS 体积

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 卡片式布局
- 圆角设计（rounded-2xl、rounded-3xl）
- 毛玻璃效果（backdrop-blur）

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 主色调：xf-primary
- 强调色：xf-accent、xf-info
- 背景色：xf-light、xf-surface

### 动画效果
- 滚动显示动画（reveal）
- 悬浮效果（hover:-translate-y-1）
- 脉冲动画（animate-pulse）
- 浮动动画（animate-float）

## 响应式断点

- **移动端**: < 640px（默认）
- **平板端**: 640px - 1024px（sm）
- **桌面端**: >= 1024px（lg）

## SEO 关键词

- 知识社区、深度思考、长文创作
- 创作者经济、认知网络、Web3社交
- 优质内容、知识变现、思维碰撞
- 深度文章、独立思考、知识图谱

## 更新时间

2026-03-29
