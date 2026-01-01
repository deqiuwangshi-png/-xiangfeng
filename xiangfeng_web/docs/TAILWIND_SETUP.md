# Tailwind CSS 本地化配置指南

## 📋 概述
本指南说明如何将Tailwind CSS从CDN迁移到本地构建，以提升性能和开发体验。

## 🚀 快速开始

### 1. 安装依赖
项目已配置Tailwind CSS v4，确保依赖已安装：
```bash
cd d:\My_xiangmu\Next_web\xiangfeng_web
npm install
```

### 2. 文件结构
```
src/
├── styles/
│   └── globals.css          # 全局样式文件
├── app/                     # Next.js App Router目录
│   ├── layout.tsx          # 根布局文件
│   └── globals.css         # 应用全局样式（可选）
└── components/              # React组件目录

tailwind.config.ts           # Tailwind配置文件
postcss.config.mjs          # PostCSS配置文件
```

### 3. 配置说明

#### tailwind.config.ts
包含以下自定义配置：
- **颜色系统**: 使用项目专属的`xf`颜色体系
- **字体配置**: 集成Noto Sans SC和Noto Serif SC
- **动画效果**: 自定义淡入、上浮、浮动等动画
- **响应式**: 移动端优先的响应式设计
- **工具类**: 玻璃拟态、文字阴影等效果

#### src/styles/globals.css
包含三层样式结构：
- **@layer base**: 基础样式重置和优化
- **@layer components**: 可复用的组件样式
- **@layer utilities**: 工具类样式扩展

### 4. 使用方法

#### 在Next.js中使用
在`app/layout.tsx`或页面组件中导入样式：
```typescript
import '@/styles/globals.css'
// 或者
import '../styles/globals.css'
```

#### 基本使用示例
```tsx
// 基础样式
<div className="bg-xf-bg text-xf-dark p-4">
  基础内容
</div>

// 自定义组件样式
<button className="btn-primary">
  主要按钮
</button>

// 玻璃拟态效果
<div className="glass p-6 rounded-xl">
  玻璃拟态卡片
</div>

// 动画效果
<div className="animate-fade-in delay-200">
  延迟淡入动画
</div>
```

### 5. 自定义样式类

#### 按钮样式
- `.btn-primary`: 主要按钮样式
- `.btn-secondary`: 次要按钮样式

#### 卡片样式
- `.card`: 基础卡片样式
- `.card-hover`: 悬停效果卡片

#### 表单样式
- `.form-input`: 统一的输入框样式

#### 文本样式
- `.text-gradient`: 渐变文字效果
- `.text-shadow`: 文字阴影效果

#### 特殊效果
- `.glass`: 玻璃拟态效果
- `.glass-dark`: 深色玻璃拟态
- `.bg-gradient-xf`: 项目专属渐变背景

### 6. 动画系统

#### 预定义动画
- `animate-fade-in`: 淡入动画（0.5s）
- `animate-slide-up`: 上滑动画（0.6s）
- `animate-float`: 浮动动画（3s循环）
- `animate-pulse-slow`: 慢速脉冲动画（3s循环）

#### 动画延迟
- `delay-100` 到 `delay-500`: 100ms到500ms的延迟

### 7. 响应式工具

#### 显示/隐藏
- `.mobile-hidden`: 移动端隐藏，桌面端显示
- `.desktop-hidden`: 移动端显示，桌面端隐藏

### 8. 性能优化

#### 构建优化
- Next.js会自动处理CSS压缩和优化
- Tailwind CSS v4包含自动前缀添加
- 只打包实际使用的样式类

#### 开发建议
1. 使用Tailwind的实用类而非自定义CSS
2. 避免深层嵌套的选择器
3. 利用响应式前缀而非媒体查询
4. 使用主题配置保持一致性

### 9. 浏览器兼容性

#### 支持范围
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- 移动端现代浏览器

#### 特殊功能降级
- 玻璃拟态效果在不支持`backdrop-filter`的浏览器中回退到半透明背景
- CSS Grid和Flexbox布局提供优雅降级

### 10. 调试和故障排除

#### 常见问题
1. **样式不生效**: 检查CSS文件是否正确导入
2. **构建错误**: 确认Tailwind配置文件语法正确
3. **样式冲突**: 检查样式导入顺序

#### 调试工具
- 浏览器开发者工具查看计算样式
- Tailwind CSS IntelliSense插件（VS Code）
- 使用`npm run dev`查看实时效果

### 11. 更新和维护

#### 更新Tailwind CSS
```bash
npm update tailwindcss @tailwindcss/postcss
```

#### 添加新样式
1. 在`tailwind.config.ts`中扩展主题
2. 在`globals.css`中添加自定义组件类
3. 遵循现有的命名约定

#### 版本控制
- 配置文件纳入版本控制
- 避免提交生成的CSS文件
- 记录重大样式变更

## 📚 相关资源
- [Tailwind CSS v4文档](https://tailwindcss.com/docs)
- [Next.js样式指南](https://nextjs.org/docs/app/building-your-application/styling)
- [PostCSS文档](https://postcss.org/)

## 🔧 技术支持
如遇到配置问题，请检查：
1. Node.js版本（推荐18+）
2. 依赖包完整性
3. 配置文件语法
4. Next.js版本兼容性