# 设置中心组件化架构

## 概述

设置中心模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、可维护的用户设置管理系统。支持账户设置、隐私安全、通知、外观主题、内容偏好、高级设置等功能。

## 项目结构

### 页面文件

```
app/(main)/settings/
├── page.tsx                    # 设置页面主入口
```

### 组件文件

```
components/settings/
├── _layout/                    # 布局组件
│   ├── SettingsLayout.tsx      # 设置页面主布局
│   ├── SettingsNav.tsx         # 左侧导航菜单
│   ├── SettingsSection.tsx     # 设置区块容器
│   └── SettingItem.tsx         # 单个设置项
├── _forms/                     # 表单组件
│   ├── EditProfileForm.tsx     # 编辑个人资料表单
│   ├── ChangeEmailForm.tsx     # 更换邮箱表单
│   ├── SecuritySettingsForm.tsx # 安全设置表单
│   └── LinkedAccountsForm.tsx  # 关联账号表单
├── _dialogs/                   # 对话框组件
│   └── LoginHistoryDialog.tsx  # 登录历史对话框
├── _ui/                        # UI 组件
│   ├── ToggleSwitch.tsx        # 开关组件
│   ├── SettingsBtn.tsx         # 设置按钮
│   └── ColorPreview.tsx        # 颜色预览
├── _danger/                    # 危险操作组件
│   ├── DangerZone.tsx          # 危险区域容器
│   ├── DeactivateAccountCard.tsx # 停用账号卡片
│   └── DeleteAccountCard.tsx   # 删除账号卡片
├── account/                    # 账户设置
│   ├── AccountSection.tsx      # 账户设置区块（视图路由）
│   ├── AccountList.tsx         # 账户设置列表
├── sections/                   # 其他设置区块
│   ├── PrivacySection.tsx      # 隐私与安全设置
│   ├── NotificationsSection.tsx # 通知设置
│   ├── AppearanceSection.tsx   # 外观与主题设置
│   └── AdvancedSection.tsx     # 高级设置
└── content/                    # 内容偏好设置
    ├── ContentSection.tsx      # 内容偏好主组件
    └── ContentLanguage.tsx     # 内容语言选择
```

## 组件说明

### 布局组件

#### 1. SettingsLayout（设置页面主布局）

**位置**: `_layout/SettingsLayout.tsx`

**职责**: 设置页面主布局，管理标签页切换和上下文数据共享

**功能**:
- 标签页状态管理（account, privacy, notifications, appearance, content, advanced）
- URL 查询参数同步（主视图 `tab` + 账户子视图 `view`）
- 浏览器前进/后退支持
- SettingsContext 数据共享

**使用示例**:
```tsx
<SettingsLayout userData={userData} userSettings={userSettings}>
  {/* 子组件通过 useSettings() 获取数据 */}
</SettingsLayout>
```

#### 2. SettingsNav（设置导航组件）

**位置**: `_layout/SettingsNav.tsx`

**职责**: 显示设置导航菜单并处理导航项点击

**功能**:
- 6个设置分类导航
- 激活状态高亮
- 图标显示

**导航项**:
- 账户设置 (account)
- 隐私与安全 (privacy)
- 通知 (notifications)
- 外观与主题 (appearance)
- 内容偏好 (content)
- 高级设置 (advanced)

**使用示例**:
```tsx
<SettingsNav activeTab="account" onTabChange={handleTabChange} />
```

#### 3. SettingsSection（设置区块组件）

**位置**: `_layout/SettingsSection.tsx`

**职责**: 显示设置区块并管理区块显示/隐藏

**功能**:
- 区块标题
- 卡片式布局
- 显示/隐藏控制

**使用示例**:
```tsx
<SettingsSection id="settings-account" title="账户设置">
  {/* 设置内容 */}
</SettingsSection>
```

#### 4. SettingItem（设置项组件）

**位置**: `_layout/SettingItem.tsx`

**职责**: 显示单个设置项并支持不同类型的设置项

**功能**:
- 标签和描述
- 控件位置控制（left/right）
- 多种控件类型支持（button, toggle, select）

**使用示例**:
```tsx
<SettingItem
  label="个人资料"
  description="更新你的个人信息和头像"
  controlType="button"
  control={<SettingsBtn onClick={onEdit}>编辑</SettingsBtn>}
/>
```

### 表单组件

#### 5. EditProfileForm（编辑个人资料表单）

**位置**: `_forms/EditProfileForm.tsx`

**职责**: 编辑用户个人资料，包括头像、用户名、邮箱、简介、位置

**功能**:
- 头像上传和预览
- 表单字段验证
- XSS 安全防护
- 实时错误提示

**安全特性**:
- 客户端实时 XSS 检测
- 头像上传安全检查
- 旧头像自动清理

**使用示例**:
```tsx
<EditProfileForm
  initialData={userData}
  onCancel={handleCancel}
  onSave={handleSave}
/>
```

#### 6. ChangeEmailForm（更换邮箱表单）

**位置**: `_forms/ChangeEmailForm.tsx`

**职责**: 更换用户邮箱地址，发送验证邮件

**功能**:
- 邮箱格式验证
- 新旧邮箱对比检查
- 验证邮件发送
- 成功状态显示

**使用示例**:
```tsx
<ChangeEmailForm
  currentEmail={userData?.email}
  onCancel={handleCancel}
  onSave={handleSave}
/>
```

#### 7. SecuritySettingsForm（安全设置表单）

**位置**: `_forms/SecuritySettingsForm.tsx`

**职责**: 修改用户密码

**功能**:
- 密码强度验证
- 密码显示/隐藏切换
- 两次密码一致性检查
- 修改后自动登出

**使用示例**:
```tsx
<SecuritySettingsForm onCancel={handleCancel} onSave={handleSave} />
```

#### 8. LinkedAccountsForm（关联账号表单）

**位置**: `_forms/LinkedAccountsForm.tsx`

**职责**: 管理第三方账号关联（GitHub, Google 等）

**功能**:
- 已关联账号列表
- 绑定新账号
- 解绑账号
- OAuth 回调处理

**使用示例**:
```tsx
<LinkedAccountsForm onCancel={handleCancel} onSave={handleSave} />
```

### 账户设置组件

#### 9. AccountSection（账户设置区块）

**位置**: `account/AccountSection.tsx`

**职责**: 账户设置页面的视图路由器，负责基于 URL 的视图切换

**功能**:
- 视图状态管理（list, editProfile, security, changeEmail, linkedAccounts）
- 通过 URL `?tab=account&view=...` 驱动视图
- 表单组件懒加载
- 骨架屏加载状态

**视图模式**:
- `list`: 账户设置列表
- `editProfile`: 编辑个人资料
- `security`: 安全设置
- `changeEmail`: 更换邮箱
- `linkedAccounts`: 关联账号

**使用示例**:
```tsx
<AccountSection
  userData={userData}
  viewMode={accountView}
  onViewChange={handleAccountViewChange}
/>
```

#### 10. AccountList（账户设置列表）

**位置**: `account/AccountList.tsx`

**职责**: 渲染账户设置选项列表

**功能**:
- 个人资料编辑入口
- 安全设置入口
- 邮箱更换入口
- 关联账号管理入口

**使用示例**:
```tsx
<AccountList
  email={userData?.email}
  onEditProfile={toEditProfile}
  onSecurity={toSecurity}
  onChangeEmail={toChangeEmail}
  onLinkedAccounts={toLinkedAccounts}
/>
```

### 设置区块组件

#### 12. PrivacySection（隐私与安全设置）

**位置**: `sections/PrivacySection.tsx`

**职责**: 显示隐私与安全设置相关选项

**功能**:
- 个人资料可见性设置（public, followers, private）
- 登录历史查看
- 实时保存
- 失败回滚

**使用示例**:
```tsx
<PrivacySection />
```

#### 13. NotificationsSection（通知设置）

**位置**: `sections/NotificationsSection.tsx`

**职责**: 显示通知设置相关选项

**功能**:
- 7种通知类型开关
  - 邮件通知
  - 新关注者通知
  - 评论通知
  - 点赞通知
  - 提及通知
  - 系统通知
  - 成就通知
- 乐观更新
- 失败回滚

**使用示例**:
```tsx
<NotificationsSection />
```

#### 14. AppearanceSection（外观与主题设置）

**位置**: `sections/AppearanceSection.tsx`

**职责**: 显示外观与主题设置相关选项

**功能**:
- 主题模式选择（light, dark, auto）
- 主题背景选择
- 实时主题应用
- localStorage 缓存
- 服务端持久化

**使用示例**:
```tsx
<AppearanceSection />
```

#### 15. ContentSection（内容偏好设置）

**位置**: `content/ContentSection.tsx`

**职责**: 内容偏好设置主组件

**功能**:
- 内容语言选择
- 预留其他内容偏好设置

**使用示例**:
```tsx
<ContentSection />
```

### UI 组件

#### 16. ToggleSwitch（开关组件）

**位置**: `_ui/ToggleSwitch.tsx`

**职责**: 显示开关控件并处理开关状态切换

**功能**:
- 开关状态显示
- 状态变化回调
- Server Action 集成
- 错误处理和回滚
- 加载状态

**使用示例**:
```tsx
<ToggleSwitch
  checked={settings.email}
  onChange={handleToggle}
/>
```

#### 17. SettingsBtn（设置按钮）

**位置**: `_ui/SettingsBtn.tsx`

**职责**: 设置页面专用按钮

**功能**:
- 统一按钮样式
- 点击事件处理

**使用示例**:
```tsx
<SettingsBtn onClick={handleClick}>编辑</SettingsBtn>
```

#### 18. ColorPreview（颜色预览）

**位置**: `_ui/ColorPreview.tsx`

**职责**: 主题背景颜色预览

**功能**:
- 颜色预览显示
- 选中状态

**使用示例**:
```tsx
<ColorPreview color="#f5f5f5" isSelected={true} />
```

### 危险操作组件

#### 19. DangerZone（危险区域容器）

**位置**: `_danger/DangerZone.tsx`

**职责**: 危险操作区域容器

**功能**:
- 视觉警示样式
- 危险操作分组

**使用示例**:
```tsx
<DangerZone>
  <DeactivateAccountCard />
  <DeleteAccountCard />
</DangerZone>
```

#### 20. DeactivateAccountCard（停用账号卡片）

**位置**: `_danger/DeactivateAccountCard.tsx`

**职责**: 账号停用功能

**功能**:
- 账号停用确认
- 数据保留说明
- 重新激活说明

#### 21. DeleteAccountCard（删除账号卡片）

**位置**: `_danger/DeleteAccountCard.tsx`

**职责**: 账号删除功能

**功能**:
- 账号删除确认
- 数据删除警告
- 不可逆操作提示

### 对话框组件

#### 22. LoginHistoryDialog（登录历史对话框）

**位置**: `_dialogs/LoginHistoryDialog.tsx`

**职责**: 显示用户登录历史记录

**功能**:
- 登录记录列表
- 设备信息
- 地理位置
- 时间显示

**使用示例**:
```tsx
<LoginHistoryDialog open={showDialog} onClose={handleClose} />
```

## 页面组件

### 设置页面主入口

**位置**: `app/(main)/settings/page.tsx`

**职责**: 设置页面入口，获取用户数据并传递给客户端组件

**功能**:
- 用户身份验证
- 并行数据获取（隐私、通知、外观、内容设置）
- 默认设置降级
- 数据传递给 SettingsLayout

**数据获取**:
- 用户资料
- 隐私设置
- 通知设置
- 外观设置
- 内容设置

## 组件层次结构

```
SettingsPage (Server Component)
├── SettingsLayout (Client)
│   ├── SettingsNav (Client)
│   └── 设置区块 (根据 activeTab 切换)
│       ├── AccountSection (Client)
│       │   ├── AccountList (Client)
│       │   ├── EditProfileForm (Client, 懒加载)
│       │   ├── SecuritySettingsForm (Client, 懒加载)
│       │   ├── ChangeEmailForm (Client, 懒加载)
│       │   └── LinkedAccountsForm (Client, 懒加载)
│       ├── PrivacySection (Client)
│       │   └── LoginHistoryDialog (Client)
│       ├── NotificationsSection (Client)
│       ├── AppearanceSection (Client)
│       ├── ContentSection (Client)
│       │   └── ContentLanguage (Client)
│       └── AdvancedSection (Client)
│           └── DangerZone (Client)
│               ├── DeactivateAccountCard (Client)
│               └── DeleteAccountCard (Client)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面入口、数据获取、默认设置
- **Client Component**: 交互逻辑、状态管理、表单处理
- **Context**: 跨组件数据共享

### 2. 性能优化
- 表单组件懒加载
- 骨架屏优化感知性能
- 并行数据获取
- 乐观更新

### 3. 状态管理
- 使用 Context 共享服务端数据
- 页面视图以 URL 查询参数为唯一真源（`tab` / `view`）
- 保存失败时回滚状态
- 使用 useTransition 处理异步操作

### 5. 导入规范（防冗余）
- `components/settings` 目录**内部**禁止 `@/components/settings` 桶文件自引用导入
- 目录内部统一使用相对路径导入（如 `../_layout/SettingsSection`）
- `components/settings/index.ts` 仅供目录**外部**使用

### 4. 用户体验
- 即时反馈
- 清晰的加载状态
- 友好的错误提示
- 表单验证和错误处理

## 数据流

```
Server Component (获取初始数据)
  ↓
SettingsLayout (通过 Context 共享数据)
  ↓
各设置区块组件 (从 Context 获取数据)
  ↓
用户交互
  ↓
本地状态更新 (乐观更新)
  ↓
Server Action 调用
  ↓
服务端保存
  ↓
成功: 保持新状态
失败: 回滚到旧状态
```

## 安全特性

### 1. XSS 防护
- 客户端实时 XSS 检测
- 危险代码模式识别
- 即时阻止可疑输入

### 2. 表单安全
- 输入验证
- 密码强度检查
- CSRF 防护（通过 Server Actions）

### 3. 账号安全
- 敏感操作确认
- 密码修改后自动登出
- 登录历史查看

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 卡片式布局
- 圆角设计

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 主色调：xf-primary
- 强调色：xf-accent

### 响应式设计
- 桌面端：左侧导航 + 右侧内容
- 移动端：汉堡菜单 + 全屏内容

## 更新时间

2026-04-15
