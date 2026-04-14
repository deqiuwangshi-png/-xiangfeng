# 认证组件化架构

## 概述

认证模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现安全、高性能的用户认证系统。包含登录、注册、密码重置、OAuth 登录等功能。

## 项目结构

### 页面文件

```
app/(auth)/
├── layout.tsx                  # 认证页面布局
├── login/
│   └── page.tsx                # 登录页面
├── register/
│   └── page.tsx                # 注册页面
├── forgot-password/
│   └── page.tsx                # 忘记密码页面
└── reset-password/
│   └── page.tsx                # 重置密码页面
```

### 组件文件

```
components/auth/
├── guards/                     # 认证守卫组件
│   ├── AuthGuard.tsx           # 认证守卫组件
│   └── ProtectedAction.tsx     # 受保护操作组件
├── prompts/                    # 认证提示组件
│   ├── AuthRequiredContent.tsx # 需要认证内容组件
│   └── UnauthenticatedPrompt.tsx # 未认证提示组件
├── forms/                      # 表单组件
│   ├── LoginForm.tsx           # 登录表单组件
│   ├── RegisterForm.tsx        # 注册表单组件
│   ├── ForgotPasswordForm.tsx  # 忘记密码表单组件
│   └── ResetPasswordForm.tsx   # 重置密码表单组件
├── ui/                         # UI 基础组件
│   ├── BrandSection.tsx        # 品牌区域组件
│   ├── MobileBrandTitle.tsx    # 移动端品牌标题组件
│   ├── FormCard.tsx            # 表单卡片组件
│   ├── PasswordInput.tsx       # 密码输入组件
│   ├── PwdStrength.tsx         # 密码强度指示器组件
│   └── OAuthButtons.tsx        # 第三方登录按钮组组件
├── actions/                    # 操作按钮组件
│   └── LogoutButton.tsx        # 退出登录按钮组件
├── index.ts                    # 统一导出入口
└── README.md                   # 组件文档
```

### 相关工具文件

```
lib/auth/
├── index.ts                    # 认证模块统一入口
├── actions/
│   ├── login.ts                # 登录 Server Action
│   ├── register.ts             # 注册 Server Action
│   ├── logout.ts               # 退出登录 Server Action
│   ├── forgot-password.ts      # 忘记密码 Server Action
│   ├── reset-password.ts       # 重置密码 Server Action
│   ├── change-password.ts      # 修改密码 Server Action
│   └── oauth.ts                # OAuth 登录处理
├── permissions.ts              # 权限控制
├── utils.ts                    # 认证工具函数
├── messages/                   # 消息常量（已迁移到 lib/messages）
├── redir.ts                    # 重定向处理
└── loginHistory.ts             # 登录历史记录
```

## 组件说明

### 布局与守卫组件

#### 1. AuthGuard（认证守卫组件）

**位置**: `guards/AuthGuard.tsx`

**职责**: 统一处理认证状态，控制布局和内容的显示

**功能**:
- 已登录：显示完整布局和内容（侧边栏 + 主内容区）
- 未登录：显示布局框架，内容区由子组件控制
- 保持侧边栏和导航可见
- 支持桌面端和移动端布局

**使用示例**:
```tsx
<AuthGuard user={user} profile={profile}>
  <PageContent />
</AuthGuard>
```

#### 2. AuthRequiredContent（需要认证内容组件）

**位置**: `prompts/AuthRequiredContent.tsx`

**职责**: 通用未登录占位组件，居中显示登录引导

**功能**:
- 简洁设计，居中显示
- 显示锁定图标和登录提示
- 提供登录和注册按钮
- 保留当前页面URL，登录后可返回

**使用示例**:
```tsx
<AuthRequiredContent
  title="需要登录"
  description="登录后即可访问此页面"
/>
```

### 品牌与布局组件

#### 3. BrandSection（品牌区域组件）

**位置**: `ui/BrandSection.tsx`

**职责**: 显示品牌Logo、标题、副标题和引言

**功能**:
- 桌面端显示（lg:flex）
- 背景装饰光晕效果
- 品牌Logo和标语展示

**使用示例**:
```tsx
<BrandSection />
```

#### 4. MobileBrandTitle（移动端品牌标题组件）

**位置**: `ui/MobileBrandTitle.tsx`

**职责**: 在移动端显示品牌标题和副标题

**功能**:
- 仅在移动端显示（lg:hidden）
- 显示品牌名称和副标题

**使用示例**:
```tsx
<MobileBrandTitle />
```

#### 5. FormCard（表单卡片组件）

**位置**: `ui/FormCard.tsx`

**职责**: 提供表单卡片的容器和装饰

**功能**:
- 卡片容器样式
- 顶部装饰条
- 卡片标题

**使用示例**:
```tsx
<FormCard title="欢迎回来">
  <LoginForm />
</FormCard>
```

### 表单组件

#### 6. LoginForm（登录表单组件）

**位置**: `forms/LoginForm.tsx`

**职责**: 登录表单逻辑和交互

**功能**:
- 表单状态管理
- 限流控制（防止暴力破解）
- 登录响应篡改防护（S-06）
- 跳转前二次 Session 验证
- 记住我功能

**安全特性**:
- 限流检查（checkRateLimit）
- Session 二次验证
- 安全的重定向处理

**使用示例**:
```tsx
<LoginForm />
```

#### 7. RegisterForm（注册表单组件）

**位置**: `forms/RegisterForm.tsx`

**职责**: 注册表单逻辑和交互

**功能**:
- 表单状态管理
- 密码强度校验
- 提交处理
- 成功状态（验证邮件发送）

**使用示例**:
```tsx
<RegisterForm />
```

#### 8. ForgotPasswordForm（忘记密码表单组件）

**位置**: `forms/ForgotPasswordForm.tsx`

**职责**: 忘记密码表单逻辑和交互

**功能**:
- 邮箱输入
- 重置链接发送
- 成功状态

**使用示例**:
```tsx
<ForgotPasswordForm />
```

#### 9. ResetPasswordForm（重置密码表单组件）

**位置**: `forms/ResetPasswordForm.tsx`

**职责**: 重置密码表单逻辑和交互

**功能**:
- Session 检查
- 错误状态处理
- 密码验证
- 密码重置

**使用示例**:
```tsx
<ResetPasswordForm />
```

### 输入组件

#### 10. PasswordInput（密码输入组件）

**位置**: `ui/PasswordInput.tsx`

**职责**: 带可见性切换的密码输入框

**功能**:
- 密码可见性切换
- 错误状态显示
- 辅助内容显示
- 自动完成支持

**使用示例**:
```tsx
<PasswordInput
  label="密码"
  placeholder="请输入密码"
  error={errors.password}
  autoComplete="current-password"
/>
```

#### 11. PwdStrength（密码强度指示器组件）

**位置**: `ui/PwdStrength.tsx`

**职责**: 显示密码强度等级和验证提示

**功能**:
- 可视化进度条
- 强度等级显示（强/中/弱）
- 验证要求清单
- 得分显示

**使用示例**:
```tsx
<PwdStrength
  validation={passwordValidation}
  strengthColor={getPasswordStrengthColor()}
/>
```

### OAuth 组件

#### 12. OAuthButtons（第三方登录按钮组组件）

**位置**: `ui/OAuthButtons.tsx`

**职责**: 展示第三方登录图标按钮

**功能**:
- GitHub OAuth 登录
- Google OAuth 登录（预留）
- OAuth 回调劫持防护（S-07）
- 硬编码站点 URL

**安全特性**:
- 使用环境变量硬编码域名
- 防止 X-Forwarded-Host 伪造
- 防止子域名接管攻击

**使用示例**:
```tsx
<OAuthButtons
  disabled={isLoading}
  dividerText="或使用邮箱登录"
  redirectTo="/home"
/>
```

### 操作组件

#### 13. LogoutButton（退出登录按钮组件）

**位置**: `actions/LogoutButton.tsx`

**职责**: 可复用的退出登录按钮

**功能**:
- 内置退出逻辑
- 加载状态管理
- 多种样式变体（default/danger/ghost）
- 多种尺寸（sm/md/lg）

**使用示例**:
```tsx
<LogoutButton
  variant="danger"
  size="md"
  label="退出登录"
  onSuccess={() => console.log('已退出')}
/>
```

#### 14. ProtectedAction（受保护操作组件）

**位置**: `guards/ProtectedAction.tsx`

**职责**: 包装需要认证的操作按钮/组件

**功能**:
- 认证状态检查
- 未登录时显示登录提示或跳转
- 支持弹窗模式和跳转模式
- 支持自定义登录提示

**使用示例**:
```tsx
<ProtectedAction actionName="点赞" onAction={handleLike}>
  <button className="like-btn">点赞</button>
</ProtectedAction>
```

## 页面组件

### 登录页面

**位置**: `app/(auth)/login/page.tsx`

**职责**: 登录页面入口

**结构**:
- BrandSection（品牌区域）
- MobileBrandTitle（移动端品牌标题）
- FormCard（表单卡片）
- LoginForm（登录表单，Client Component）

**性能优化**:
- 使用 Suspense 包裹 LoginForm
- 骨架屏优化感知性能

### 注册页面

**位置**: `app/(auth)/register/page.tsx`

**职责**: 注册页面入口

**结构**:
- BrandSection（品牌区域）
- MobileBrandTitle（移动端品牌标题）
- FormCard（表单卡片）
- RegisterForm（注册表单，Client Component）

### 忘记密码页面

**位置**: `app/(auth)/forgot-password/page.tsx`

**职责**: 忘记密码页面入口

### 重置密码页面

**位置**: `app/(auth)/reset-password/page.tsx`

**职责**: 重置密码页面入口

## 认证模块（lib/auth）

### Server Actions

#### login
- 处理用户登录
- 限流检查
- Session 管理

#### register
- 处理用户注册
- 邮箱验证发送

#### logout
- 处理用户退出
- Session 清除
- 登录历史记录

#### forgotPassword
- 发送密码重置邮件

#### resetPassword
- 重置用户密码

#### changePassword
- 修改用户密码

### 权限控制

#### permissions.ts
- 用户角色定义
- 权限检查函数
- 操作权限映射

### 工具函数

#### utils.ts
- 认证相关工具函数
- Session 验证
- Token 处理

#### messages/auth.ts
- 统一消息常量（已迁移到 lib/messages）
- 包含错误和成功消息
- Supabase 错误转换

#### redir.ts
- 安全的重定向处理
- 重定向 URL 验证

## 组件层次结构

```
AuthLayout
├── LoginPage / RegisterPage / ForgotPasswordPage / ResetPasswordPage (Server Component)
│   ├── BrandSection
│   ├── MobileBrandTitle
│   └── FormCard
│       └── Suspense
│           └── LoginForm / RegisterForm / ForgotPasswordForm / ResetPasswordForm (Client Component)
│               ├── OAuthButtons
│               ├── PasswordInput
│               └── PwdStrength (RegisterForm only)
│
AuthGuard (布局守卫)
├── Sidebar (已登录)
└── Main Content
    └── AuthRequiredContent (未登录时显示)
        └── ProtectedAction (需要认证的操作)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面结构、品牌展示、布局
- **Client Component**: 表单逻辑、交互处理、状态管理
- **Server Actions**: 数据操作、认证逻辑、安全验证

### 2. 安全优先
- 限流控制防止暴力破解
- Session 二次验证防止响应篡改
- OAuth 回调劫持防护
- 安全的重定向处理
- 密码强度校验

### 3. 性能优化
- Server Component 优先渲染
- Suspense 优化感知性能
- 骨架屏减少等待焦虑
- Client Component 按需加载

### 4. 用户体验
- 响应式设计（桌面端/移动端）
- 清晰的错误提示
- 加载状态反馈
- 记住登录状态

## 数据流

```
用户输入
  ↓
Client Component（表单验证）
  ↓
Server Action（安全验证）
  ↓
Supabase Auth（认证服务）
  ↓
Session 创建
  ↓
页面跳转
  ↓
AuthGuard（布局更新）
```

## 安全特性

### S-06: 登录响应篡改防护
- 跳转前进行二次 Session 验证
- 防止 Burp Suite 等工具篡改响应包绕过登录

### S-07: OAuth 回调劫持防护
- 使用环境变量硬编码域名
- 替代动态的 window.location.origin
- 防止 X-Forwarded-Host 伪造和子域名接管攻击

### 限流控制
- 基于客户端标识的限流
- 可配置的限流策略
- 友好的限流提示

### 密码安全
- 密码强度校验
- 密码复杂度要求
- 密码历史检查

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 简洁的表单设计
- 品牌光晕装饰效果

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 主色调：xf-primary
- 背景色：xf-light

## 导入方式

### 方式一：统一入口导入（推荐）

```tsx
import { 
  AuthGuard, 
  AuthRequiredContent,
  LoginForm,
  BrandSection,
  LogoutButton 
} from '@/components/auth';
```

### 方式二：分类路径导入

```tsx
// Guards
import { AuthGuard } from '@/components/auth/guards/AuthGuard';
import { AuthRequiredContent } from '@/components/auth/prompts/AuthRequiredContent';

// Forms
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { RegisterForm } from '@/components/auth/forms/RegisterForm';

// UI
import { BrandSection } from '@/components/auth/ui/BrandSection';
import { PasswordInput } from '@/components/auth/ui/PasswordInput';

// Actions
import { LogoutButton } from '@/components/auth/actions/LogoutButton';
```

## 更新时间

2026-03-29
