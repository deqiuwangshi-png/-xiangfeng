# UI 组件库

## 概述

UI 组件库提供全站通用的基础 UI 组件，包括侧边栏导航、按钮、头像、图标容器等。所有组件遵循统一的设计规范，支持主题定制和响应式布局。

## 项目结构

```
components/ui/
├── index.ts              # 统一导出入口
├── Sidebar.tsx           # 侧边栏导航组件
├── IconBox.tsx           # 图标容器组件
├── PrimaryButton.tsx     # 主按钮组件
├── UserAvt.tsx           # 用户头像组件
├── FormActions.tsx       # 表单操作按钮组
└── README.md             # 本文档
```

## 组件说明

### 1. Sidebar（侧边栏导航）

**位置**: `Sidebar.tsx`

**职责**: 应用主导航侧边栏，负责导航和布局

**功能**:
- 显示用户资料区域（头像、下拉菜单）
- 显示主导航菜单（首页、发布、文章、通知、福利）
- 显示未读消息红点徽章
- 路由预加载优化
- 响应式设计（移动端简化，桌面端完整）

**导航项**:
| ID | 标签 | 图标 | 路径 |
|----|------|------|------|
| home | 首页 | Home | /home |
| publish | 发布 | Edit3 | /publish |
| draft | 文章 | FolderOpen | /drafts |
| inbox | 通知 | BellRing | /inbox |
| rewards | 福利 | Gift | /rewards |

**Props 接口**:
```typescript
interface SidebarProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
  user?: SupabaseUser | SimpleUser | null
  /** 用户资料（从profiles表获取，用于显示头像） */
  profile?: UserProfile | null
}
```

**性能优化**:
- 使用 `requestIdleCallback` 预加载关键路由
- 鼠标悬停时按需预加载
- 使用客户端缓存获取未读消息数量

**使用示例**:
```tsx
<Sidebar user={currentUser} profile={userProfile} />
```

---

### 2. IconBox（图标容器）

**位置**: `IconBox.tsx`

**职责**: 为设置页面提供统一的图标展示容器

**功能**:
- 提供统一的图标背景容器
- 支持多种颜色变体
- 替代渐变色背景，保持设计一致性

**Props 接口**:
```typescript
interface IconBoxProps {
  /** 图标内容 */
  children: ReactNode
  /** 颜色变体 */
  variant?: 'primary' | 'green' | 'blue'
  /** 额外的CSS类名 */
  className?: string
}
```

**颜色变体**:
| 变体 | 背景色 | 用途 |
|------|--------|------|
| primary | bg-xf-primary | 主要操作 |
| green | bg-green-500 | 成功/安全 |
| blue | bg-blue-500 | 信息/链接 |

**使用示例**:
```tsx
<IconBox variant="primary">
  <User className="w-5 h-5" />
</IconBox>

<IconBox variant="green">
  <Shield className="w-5 h-5" />
</IconBox>

<IconBox variant="blue">
  <Bell className="w-5 h-5" />
</IconBox>
```

---

### 3. PrimaryButton（主按钮）

**位置**: `PrimaryButton.tsx`

**职责**: 提供统一的主操作按钮样式

**功能**:
- 统一的主色调按钮样式
- 支持加载状态
- 支持全宽模式
- 悬停和点击动画效果

**Props 接口**:
```typescript
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮文本内容 */
  children: ReactNode
  /** 是否占满宽度 */
  fullWidth?: boolean
  /** 是否处于加载状态 */
  loading?: boolean
}
```

**样式特性**:
- 背景色：xf-primary
- 圆角：rounded-xl
- 阴影：shadow-md（悬停时 shadow-lg）
- 悬停效果：上移 0.5px
- 禁用状态：透明度 50%

**使用示例**:
```tsx
// 基础用法
<PrimaryButton>保存更改</PrimaryButton>

// 全宽模式
<PrimaryButton fullWidth>提交</PrimaryButton>

// 加载状态
<PrimaryButton loading>处理中...</PrimaryButton>

// 禁用状态
<PrimaryButton disabled>不可用</PrimaryButton>

// 作为提交按钮
<PrimaryButton type="submit">发布文章</PrimaryButton>
```

---

### 4. UserAvt（用户头像）

**位置**: `UserAvt.tsx`

**职责**: 统一显示用户头像，优先显示真实图片，失败时回退到首字母

**功能**:
- 优先显示用户上传的真实头像图片
- 图片加载失败时显示首字母占位符
- 不使用固定默认图（Dicebear），保持简洁
- 支持多种尺寸

**Props 接口**:
```typescript
interface UserAvtProps {
  /** 用户名（用于首字母显示和 alt 文本） */
  name: string
  /** 用户ID（用于标识） */
  userId?: string
  /** 头像URL（用户自定义头像，优先使用） */
  avatarUrl?: string | null
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 额外的CSS类名 */
  className?: string
}
```

**尺寸映射**:
| 尺寸 | 像素 | 文字大小 | 用途 |
|------|------|----------|------|
| xs | 24px | text-xs | 极小头像 |
| sm | 40px | text-sm | 列表项 |
| md | 64px | text-xl | 默认尺寸 |
| lg | 96px | text-3xl | 个人主页 |
| xl | 128px | text-4xl | 大头像展示 |

**显示逻辑**:
1. 有真实头像URL且图片未加载失败 → 显示图片
2. 无真实头像或图片加载失败 → 显示首字母占位符

**注意**: 自动排除 Dicebear 生成的头像URL

**使用示例**:
```tsx
// 基础用法（显示首字母）
<UserAvt name="张三" />

// 带真实头像
<UserAvt name="李四" avatarUrl="https://example.com/avatar.jpg" />

// 自定义尺寸
<UserAvt name="王五" size="sm" />
<UserAvt name="赵六" size="lg" avatarUrl="..." />
```

**别名导出**（向后兼容）:
- `UserAvatar` - 推荐使用 UserAvt
- `AvatarPlaceholder` - 已弃用，请使用 UserAvt

---

### 5. FormActions（表单操作按钮组）

**位置**: `FormActions.tsx`

**职责**: 提供统一的表单取消和提交按钮

**功能**:
- 取消按钮（白色背景，边框样式）
- 提交按钮（使用 PrimaryButton）
- 支持自定义按钮文本
- 可选的顶部边框

**Props 接口**:
```typescript
interface FormActionsProps {
  /** 取消回调函数 */
  onCancel: () => void
  /** 提交按钮加载状态 */
  loading?: boolean
  /** 提交按钮文本 */
  submitText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 是否显示顶部边框 */
  showBorder?: boolean
}
```

**默认配置**:
- submitText: "保存更改"
- cancelText: "取消"
- showBorder: true

**使用示例**:
```tsx
// 基础用法
<FormActions onCancel={() => setIsEditing(false)} />

// 自定义文本
<FormActions 
  onCancel={handleCancel}
  submitText="发布文章"
  cancelText="放弃编辑"
/>

// 加载状态
<FormActions 
  onCancel={handleCancel}
  loading={isSubmitting}
/>

// 无边框
<FormActions 
  onCancel={handleCancel}
  showBorder={false}
/>
```

## 统一导出

所有组件通过 `index.ts` 统一导出：

```typescript
// 推荐导入方式
import { 
  Sidebar, 
  IconBox, 
  PrimaryButton, 
  UserAvt, 
  FormActions 
} from '@/components/ui'

// 头像组件别名（向后兼容）
import { UserAvatar, AvatarPlaceholder } from '@/components/ui'
```

## 设计规范

### 颜色使用

- **主色调**: xf-primary（紫色系）
- **背景色**: xf-light（浅灰色）
- **边框色**: xf-surface/30（淡色边框）
- **强调色**: xf-accent（深紫色）

### 圆角规范

- 按钮：rounded-xl
- 头像：rounded-full
- 图标容器：rounded-xl
- 卡片：rounded-2xl

### 间距规范

- 按钮内边距：px-6 py-3
- 图标容器：w-10 h-10
- 表单项间距：gap-4

### 动画效果

- 按钮悬停：上移 0.5px + 阴影增强
- 图标悬停：scale-110
- 过渡时间：transition-all duration-300

## 响应式设计

### Sidebar 响应式

- **移动端** (< 1280px): 宽度 80px，仅显示图标
- **桌面端** (>= 1280px): 宽度 220px，显示图标 + 标签

### 其他组件

所有组件均支持通过 `className` 属性进行响应式定制。

## 性能优化

### Sidebar
- 使用 `requestIdleCallback` 预加载路由
- 鼠标悬停时按需预加载
- 使用客户端缓存减少请求

### UserAvt
- 图片使用 `loading="eager"` 优先加载
- 错误状态本地管理，避免重复请求

### PrimaryButton
- 禁用状态阻止重复提交
- 加载状态显示处理中提示

## 依赖关系

```
ui/
├── Sidebar
│   ├── @/components/icons
│   ├── @/components/user/UserProfileSection
│   └── @/hooks/useInboxCache
├── IconBox
│   └── (无依赖)
├── PrimaryButton
│   └── (无依赖)
├── UserAvt
│   └── next/image
├── FormActions
│   └── ./PrimaryButton
└── index.ts
    └── 统一导出所有组件
```

## 更新记录

- **2026-03-21**: 添加 FormActions 组件
- **2026-03-02**: 添加 IconBox、PrimaryButton 组件
- **2026-03-02**: 优化 UserAvt 组件，移除 Dicebear 依赖
- **2026-02**: 初始版本，包含 Sidebar、UserAvt

## 统计信息

- **组件总数**: 5个
- **客户端组件**: 4个（Sidebar、PrimaryButton、UserAvt、FormActions）
- **服务端组件**: 1个（IconBox）
- **最后更新**: 2026-03-29
