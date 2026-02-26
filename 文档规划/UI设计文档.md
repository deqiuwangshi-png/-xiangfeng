# 相逢 (Xiangfeng) UI/UX 设计文档

## 一、设计系统概述

### 1.1 设计理念
相逢项目采用现代、简洁、优雅的设计理念，注重用户体验和视觉美感的平衡。设计系统基于以下核心原则：

- **一致性**: 统一的设计语言和交互模式
- **可用性**: 直观的用户界面和流畅的交互体验
- **可访问性**: 支持多种设备和用户需求
- **可扩展性**: 灵活的设计系统支持未来功能扩展
- **品牌性**: 体现相逢平台的独特品牌个性

### 1.2 设计目标
1. 创建现代化的视觉设计语言
2. 建立统一的交互规范和组件标准
3. 确保跨设备的一致用户体验
4. 提升用户参与度和满意度
5. 支持快速迭代和功能扩展

## 二、视觉设计系统

### 2.1 色彩系统

#### 主色调
```css
:root {
  --xf-bg: #E1E4EA;           /* 背景色 - 柔和的灰蓝色 */
  --xf-surface: #D2C3D5;       /* 表面色 - 温暖的紫色 */
  --xf-primary: #6A5B8A;       /* 主色调 - 深紫色 */
  --xf-accent: #3A3C6E;       /* 强调色 - 深蓝色 */
  --xf-info: #4A6FA5;         /* 信息色 - 天蓝色 */
  --xf-soft: #A5C1D6;         /* 柔和色 - 浅蓝色 */
  --xf-dark: #25263D;         /* 深色 - 深海军蓝 */
  --xf-light: #F7F9FC;        /* 浅色 - 冷白色 */
  --xf-medium: #8C8EA9;       /* 中等色 - 中性灰 */
  --xf-success: #4CAF50;      /* 成功色 - 绿色 */
  --xf-warning: #FF9800;      /* 警告色 - 橙色 */
  --xf-error: #F44336;        /* 错误色 - 红色 */
}
```

#### 色彩应用规范
- **背景色**: 用于页面和组件的背景
- **表面色**: 用于卡片、面板等表面元素
- **主色调**: 用于主要按钮、链接、品牌元素
- **强调色**: 用于重要操作和关键信息
- **状态色**: 用于表示成功、警告、错误等状态

### 2.2 字体系统

#### 字体选择
- **标题字体**: Noto Serif SC（衬线字体）
  - 用于页面标题、重要标题、品牌展示
  - 特点：优雅、传统、有文化底蕴
  
- **正文字体**: Noto Sans SC（无衬线字体）
  - 用于正文内容、界面元素、功能说明
  - 特点：现代、清晰、易读性强

#### 字体层级
```css
/* 标题层级 */
.xf-heading-1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.xf-heading-2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.xf-heading-3 { font-size: 1.5rem; font-weight: 500; line-height: 1.4; }

/* 正文层级 */
.xf-text-large { font-size: 1.125rem; line-height: 1.6; }
.xf-text-base { font-size: 1rem; line-height: 1.6; }
.xf-text-small { font-size: 0.875rem; line-height: 1.5; }
.xf-text-tiny { font-size: 0.75rem; line-height: 1.4; }
```

### 2.3 间距系统

基于 8px 网格系统，确保视觉一致性和节奏感：

```css
/* 间距系统 */
.xf-spacing-xs { margin: 4px; padding: 4px; }
.xf-spacing-sm { margin: 8px; padding: 8px; }
.xf-spacing-md { margin: 16px; padding: 16px; }
.xf-spacing-lg { margin: 24px; padding: 24px; }
.xf-spacing-xl { margin: 32px; padding: 32px; }
.xf-spacing-2xl { margin: 48px; padding: 48px; }
.xf-spacing-3xl { margin: 64px; padding: 64px; }

/* 圆角系统 */
.xf-radius-sm { border-radius: 4px; }
.xf-radius-md { border-radius: 8px; }
.xf-radius-lg { border-radius: 16px; }
.xf-radius-xl { border-radius: 24px; }
.xf-radius-full { border-radius: 50%; }
```

## 三、响应式设计架构

### 3.1 断点设计

采用移动端优先的响应式设计策略：

```css
/* 断点定义 */
@media (min-width: 640px) { /* sm: 平板竖屏 */ }
@media (min-width: 768px) { /* md: 平板横屏 */ }
@media (min-width: 1024px) { /* lg: 小屏桌面 */ }
@media (min-width: 1280px) { /* xl: 大屏桌面 */ }
@media (min-width: 1536px) { /* 2xl: 超大屏 */ }
```

### 3.2 组件响应式策略

#### 布局适配
- **移动端** (默认): 单列布局，垂直堆叠
- **平板端** (sm): 双列布局，侧边栏模式
- **桌面端** (lg): 多列布局，充分利用屏幕空间

#### 交互适配
- **移动端**: 触摸优先，大按钮，手势操作
- **平板端**: 触摸+指针混合，适中的交互元素
- **桌面端**: 指针优先，精细的悬停效果和快捷键

### 3.3 内容适配

#### 文本内容
- **移动端**: 精简内容，重点突出
- **平板端**: 适中内容，平衡展示
- **桌面端**: 丰富内容，完整展示

#### 图片媒体
- **移动端**: 响应式图片，懒加载优化
- **平板端**: 高质量图片，渐进式加载
- **桌面端**: 超高清图片，预加载策略

## 四、组件设计规范

### 4.1 导航组件

#### 主导航
```typescript
interface NavigationProps {
  items: NavigationItem[];
  variant: 'horizontal' | 'vertical';
  showIcons: boolean;
  responsive: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: NavigationItem[];
}
```

#### 面包屑导航
```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator: string;
  showHome: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}
```

### 4.2 内容展示组件

#### 文章卡片
```typescript
interface ArticleCardProps {
  article: Article;
  variant: 'compact' | 'standard' | 'featured';
  showImage: boolean;
  showExcerpt: boolean;
  showMetadata: boolean;
  onLike?: (articleId: string) => void;
  onBookmark?: (articleId: string) => void;
}
```

#### 用户头像
```typescript
interface AvatarProps {
  src: string;
  alt: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  shape: 'circle' | 'rounded' | 'square';
  showStatus: boolean;
  online?: boolean;
  badge?: number;
}
```

### 4.3 交互组件

#### 按钮组件
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  shape: 'rectangle' | 'rounded' | 'circle';
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
  icon?: React.ReactNode;
  iconPosition: 'left' | 'right';
  onClick?: (event: React.MouseEvent) => void;
}
```

#### 表单组件
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  size: 'sm' | 'md' | 'lg';
  variant: 'outline' | 'filled' | 'flushed';
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  required: boolean;
  disabled: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

## 五、交互设计模式

### 5.1 状态管理

#### 加载状态
```typescript
interface LoadingState {
  skeleton: boolean;      // 骨架屏
  spinner: boolean;       // 加载动画
  progress: boolean;      // 进度条
  shimmer: boolean;       // 闪光效果
}
```

#### 空状态
```typescript
interface EmptyState {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 5.2 反馈机制

#### 操作反馈
```typescript
interface FeedbackOptions {
  toast: boolean;       // 轻量提示
  modal: boolean;       // 模态确认
  inline: boolean;      // 内联反馈
  sound: boolean;       // 声音反馈
  haptic: boolean;      // 触觉反馈
}
```

#### 错误处理
```typescript
interface ErrorState {
  type: 'network' | 'validation' | 'permission' | 'unknown';
  title: string;
  message: string;
  actions: ErrorAction[];
}

interface ErrorAction {
  label: string;
  type: 'retry' | 'dismiss' | 'help' | 'report';
  onClick: () => void;
}
```

## 六、动效设计

### 6.1 过渡动效

#### 页面过渡
```css
/* 页面切换动画 */
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}
```

#### 组件过渡
```css
/* 组件显示/隐藏 */
.component-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.component-transition:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 6.2 微交互

#### 按钮交互
```css
/* 按钮点击效果 */
.button-interaction {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.button-interaction:active {
  transform: scale(0.98);
}

.button-interaction::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}
```

## 七、可访问性设计

### 7.1 无障碍支持

#### 键盘导航
```typescript
interface KeyboardNavigation {
  tabIndex: number;
  focusVisible: boolean;
  keyboardShortcuts: Record<string, () => void>;
  skipLinks: SkipLink[];
}

interface SkipLink {
  id: string;
  label: string;
  target: string;
}
```

#### 屏幕阅读器
```typescript
interface ScreenReaderSupport {
  ariaLabels: Record<string, string>;
  ariaDescriptions: Record<string, string>;
  liveRegions: LiveRegion[];
  roleDefinitions: Record<string, string>;
}

interface LiveRegion {
  id: string;
  role: 'status' | 'alert' | 'log';
  ariaLive: 'off' | 'polite' | 'assertive';
}
```

### 7.2 高对比度支持

#### 色彩对比
- **正常文本**: 对比度 ≥ 4.5:1
- **大文本**: 对比度 ≥ 3:1
- **交互元素**: 对比度 ≥ 4.5:1

#### 暗色模式
```css
/* 暗色模式变量 */
@media (prefers-color-scheme: dark) {
  :root {
    --xf-bg: #1a1a1a;
    --xf-surface: #2a2a2a;
    --xf-text: #ffffff;
    --xf-text-secondary: #b0b0b0;
  }
}
```

## 八、性能优化

### 8.1 加载性能

#### 图片优化
```typescript
interface ImageOptimization {
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  sizes: number[];
  quality: number;
  placeholder: 'blur' | 'dominantColor' | 'empty';
  loading: 'lazy' | 'eager';
}
```

#### 字体优化
```css
/* 字体加载优化 */
@font-face {
  font-family: 'Noto Sans SC';
  font-display: swap;
  src: url('/fonts/NotoSansSC.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;
}
```

### 8.2 渲染性能

#### CSS优化
```css
/* 使用CSS containment */
.component {
  contain: layout style paint;
}

/* 使用will-change优化 */
.animated-element {
  will-change: transform, opacity;
}
```

#### JavaScript优化
```typescript
interface PerformanceOptimization {
  codeSplitting: boolean;
  lazyLoading: boolean;
  virtualScrolling: boolean;
  memoization: boolean;
  debouncing: boolean;
}
```

## 九、设计工具和资源

### 9.1 设计工具

#### Figma设计系统
- **组件库**: 可复用的UI组件
- **样式库**: 颜色、字体、效果样式
- **设计令牌**: 统一的设计变量
- **原型交互**: 可交互的原型设计

#### 开发工具
- **Storybook**: 组件开发和文档
- **Chromatic**: 视觉回归测试
- **Figma Plugin**: 设计到开发的桥梁

### 9.2 设计资源

#### 图标系统
- **图标库**: 统一风格的图标集合
- **自定义图标**: 品牌特色图标
- **动画图标**: 微交互动画图标

#### 插画系统
- **品牌插画**: 体现品牌特色的插画
- **功能插画**: 说明性插画
- **空状态插画**: 空状态页面的装饰插画

## 十、实施和维护

### 10.1 实施策略

#### 分阶段实施
1. **第一阶段**: 基础设计系统（颜色、字体、间距）
2. **第二阶段**: 核心组件库（按钮、输入框、卡片）
3. **第三阶段**: 复杂组件（导航、表单、数据展示）
4. **第四阶段**: 页面模板和布局系统

#### 团队协作
- **设计师**: 负责视觉设计和交互设计
- **前端开发**: 负责组件实现和交互逻辑
- **产品经理**: 负责需求分析和用户体验

### 10.2 维护更新

#### 版本管理
```typescript
interface DesignSystemVersion {
  version: string;
  changes: DesignChange[];
  migrationGuide: string;
  breakingChanges: string[];
}

interface DesignChange {
  type: 'addition' | 'modification' | 'removal';
  component: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}
```

#### 文档维护
- **设计文档**: 定期更新设计规范
- **组件文档**: 维护组件API和使用示例
- **最佳实践**: 收集和分享最佳实践案例

## 附录：项目架构中的UI/UX设计规范

以下内容为从项目架构文档中迁移的UI/UX设计规范，作为本设计文档的补充参考：

### 设计系统

#### 色彩系统
```css
:root {
  --xf-bg: #E1E4EA;           /* 背景色 */
  --xf-surface: #D2C3D5;       /* 表面色 */
  --xf-primary: #6A5B8A;       /* 主色调 */
  --xf-accent: #3A3C6E;       /* 强调色 */
  --xf-info: #4A6FA5;         /* 信息色 */
  --xf-soft: #A5C1D6;         /* 柔和色 */
  --xf-dark: #25263D;         /* 深色 */
  --xf-light: #F7F9FC;        /* 浅色 */
  --xf-medium: #8C8EA9;       /* 中等色 */
  --xf-success: #4CAF50;      /* 成功色 */
  --xf-warning: #FF9800;      /* 警告色 */
}
```

#### 字体系统
- **标题字体**：Noto Serif SC（衬线字体，用于标题和重要内容）
- **正文字体**：Noto Sans SC（无衬线字体，用于正文和界面元素）

#### 间距系统
```css
/* 基于8px网格系统 */
.xf-spacing-xs { margin: 4px; }
.xf-spacing-sm { margin: 8px; }
.xf-spacing-md { margin: 16px; }
.xf-spacing-lg { margin: 24px; }
.xf-spacing-xl { margin: 32px; }
```

### 响应式设计

#### 断点设计
```css
/* 移动端优先 */
@media (min-width: 640px) { /* sm: 平板竖屏 */ }
@media (min-width: 768px) { /* md: 平板横屏 */ }
@media (min-width: 1024px) { /* lg: 小屏桌面 */ }
@media (min-width: 1280px) { /* xl: 大屏桌面 */ }
```

#### 组件响应式策略
- **移动端**：单列布局，简化交互
- **平板端**：双列布局，增强功能展示
- **桌面端**：多列布局，充分利用屏幕空间

## 总结

本UI/UX设计文档为相逢项目提供了完整的设计系统和规范，涵盖了视觉设计、交互设计、响应式设计、组件规范等各个方面。通过统一的设计语言和规范，确保产品在不同平台和设备上都能提供一致、优秀的用户体验。

设计系统的建立是一个持续演进的过程，需要根据实际使用情况和用户反馈不断优化和完善。我们将持续关注设计趋势和技术发展，确保相逢的设计系统始终保持现代性和竞争力。