# 反馈中心组件化架构

## 概述

反馈中心模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能的用户反馈系统。支持提交反馈、查看反馈记录、常见问题解答等功能，数据存储于飞书多维表格。

## 项目结构

### 页面文件

```
app/(main)/feedback/
├── page.tsx                    # 反馈页面主入口
```

### 组件文件

```
components/feedback/
├── FeedbackClient.tsx          # 反馈页面客户端组件
├── FeedbackTabs.tsx            # 标签页切换组件
├── FAQ.tsx                     # 常见问题组件
├── SubmitFeedback.tsx          # 提交反馈组件
├── hooks/                      # 自定义 Hooks
│   ├── useFeedbackForm.ts      # 反馈表单逻辑 Hook
│   └── useFeedbackReplies.ts   # 反馈回复逻辑 Hook
├── list/                       # 列表组件
│   ├── MyFeedback.tsx          # 我的反馈列表
│   ├── FeedbackCard.tsx        # 反馈卡片
│   ├── FeedbackCardActions.tsx # 反馈卡片交互
│   └── SuccessModal.tsx        # 成功提交弹窗
├── submit/                     # 提交表单组件
│   ├── TypeSelector.tsx        # 反馈类型选择器
│   ├── FileUploader.tsx        # 文件上传组件
│   ├── FileList.tsx            # 文件列表
│   ├── SubmitBtn.tsx           # 提交按钮
│   └── ContactInput.tsx        # 联系方式输入
├── reply/                      # 回复组件
│   ├── ReplyForm.tsx           # 回复表单
│   └── ReplyList.tsx           # 回复列表
└── modal/                      # 弹窗组件
    ├── DetailDlg.tsx           # 反馈详情弹窗
    └── Toast.tsx               # Toast 轻提示
```

## 组件说明

### 核心容器组件

#### 1. FeedbackClient（反馈页面客户端组件）

**位置**: `FeedbackClient.tsx`

**职责**: 反馈页面主客户端组件，管理标签页切换和数据加载

**功能**:
- 标签页切换（提交反馈/我的反馈/常见问题）
- 反馈列表加载（从飞书多维表格查询）
- 提交成功回调处理
- Toast 提示显示
- 追踪 ID 本地存储管理

**标签页**:
- `submit`: 提交反馈
- `my`: 我的反馈
- `faq`: 常见问题

**懒加载优化**:
- SubmitFeedback、MyFeedback、FAQ 组件懒加载
- 减少初始加载时间

**使用示例**:
```tsx
<FeedbackClient />
```

### 标签页组件

#### 2. FeedbackTabs（标签页切换组件）

**位置**: `FeedbackTabs.tsx`

**职责**: 反馈页面标签页切换

**功能**:
- 3个标签页切换
- 激活状态样式
- 横向滚动支持

**使用示例**:
```tsx
<FeedbackTabs activeTab="submit" onTabChange={handleTabChange} />
```

#### 3. FAQ（常见问题组件）

**位置**: `FAQ.tsx`

**职责**: 常见问题列表展示

**功能**:
- FAQ 列表展示
- 点击交互（预留）
- 服务端渲染

**使用示例**:
```tsx
<FAQ />
```

### 提交反馈组件

#### 4. SubmitFeedback（提交反馈组件）

**位置**: `SubmitFeedback.tsx`

**职责**: 反馈表单主组件，纯视图组件

**功能**:
- 反馈类型选择
- 详细描述输入
- 文件上传
- 表单提交

**逻辑分离**:
- 视图逻辑：SubmitFeedback 组件
- 业务逻辑：useFeedbackForm Hook

**使用示例**:
```tsx
<SubmitFeedback onSubmit={handleFeedbackSubmit} />
```

#### 5. TypeSelector（反馈类型选择器）

**位置**: `submit/TypeSelector.tsx`

**职责**: 反馈类型选择

**功能**:
- 4种反馈类型：问题反馈、功能建议、界面优化、其他反馈
- 图标显示
- 选中状态样式（莫兰迪紫边框）
- 点击切换/取消选择

**反馈类型**:
- `bug`: 问题反馈（红色）
- `suggestion`: 功能建议（黄色）
- `ui`: 界面优化（蓝色）
- `other`: 其他反馈（主色）

**使用示例**:
```tsx
<TypeSelector selectedType={selectedType} onChange={setSelectedType} />
```

#### 6. FileUploader（文件上传组件）

**位置**: `submit/FileUploader.tsx`

**职责**: 文件选择和验证

**功能**:
- 文件选择
- 文件类型验证（仅图片：png, jpg, jpeg, gif, webp）
- 文件大小验证（最大 10MB）
- 文件数量限制（最多 5 个）
- 错误提示（toast）
- 文件列表展示

**注意**: 文件仅在提交时才上传至飞书，避免资源浪费

**使用示例**:
```tsx
<FileUploader files={uploadedFiles} onFilesChange={setUploadedFiles} />
```

### 我的反馈组件

#### 7. MyFeedback（我的反馈列表组件）

**位置**: `list/MyFeedback.tsx`

**职责**: 展示用户提交的反馈列表

**功能**:
- 反馈卡片列表
- 点击查看详情
- 详情弹窗懒加载
- 加载占位符

**使用示例**:
```tsx
<MyFeedback feedbackItems={feedbackItems} />
```

#### 8. FeedbackCard（反馈卡片组件）

**位置**: `list/FeedbackCard.tsx`

**职责**: 单条反馈信息展示

**功能**:
- 状态显示（待处理/处理中/已处理）
- 描述内容（最多 3 行）
- 日期显示
- 附件数量
- 回复数量/已修复标识
- 服务端渲染内容

**状态样式**:
- `pending`: 黄色（待处理）
- `processing`: 蓝色（处理中）
- `completed`: 绿色（已处理）

**使用示例**:
```tsx
<FeedbackCard item={feedbackItem} onClick={handleOpenDetail} />
```

#### 9. FeedbackCardActions（反馈卡片交互组件）

**位置**: `list/FeedbackCardActions.tsx`

**职责**: 反馈卡片点击交互

**功能**:
- 点击事件处理
- 包裹服务端渲染的内容

**使用示例**:
```tsx
<FeedbackCardActions item={item} onClick={onClick}>
  <FeedbackCardContent item={item} />
</FeedbackCardActions>
```

### 回复组件

#### 10. ReplyForm（回复表单组件）

**位置**: `reply/ReplyForm.tsx`

**职责**: 提交新评论

**功能**:
- 回复内容输入
- 提交按钮
- 加载状态
- 错误提示

**使用示例**:
```tsx
<ReplyForm
  onSubmit={submitNewReply}
  isSubmitting={isSubmitting}
  submitError={submitError}
/>
```

#### 11. ReplyList（回复列表组件）

**位置**: `reply/ReplyList.tsx`

**职责**: 展示评论列表

**功能**:
- 评论列表展示
- 官方标识
- 加载状态
- 空状态提示

**使用示例**:
```tsx
<ReplyList replies={replies} isLoading={isLoading} />
```

### 弹窗组件

#### 12. DetailDlg（反馈详情弹窗组件）

**位置**: `modal/DetailDlg.tsx`

**职责**: 展示反馈详情和评论交互

**功能**:
- 反馈详情展示
- 状态标签
- 评论列表
- 回复表单
- ESC 键关闭
- 遮罩层点击关闭
- 滚动锁定

**使用示例**:
```tsx
<FeedbackDetailModal
  feedback={selectedFeedback}
  isOpen={isModalOpen}
  onClose={handleCloseDetail}
/>
```

#### 13. Toast（Toast 轻提示组件）

**位置**: `modal/Toast.tsx`

**职责**: 显示操作成功/失败的轻量提示

**功能**:
- 成功图标
- 提示消息
- 追踪 ID 显示
- 复制追踪 ID
- 自动关闭（默认 5 秒）
- 入场/退场动画

**使用示例**:
```tsx
<Toast
  message="反馈提交成功！"
  trackingId="FB-123456"
  onClose={() => setShowToast(false)}
  duration={5000}
/>
```

#### 14. SuccessModal（成功提交弹窗组件）

**位置**: `list/SuccessModal.tsx`

**职责**: 反馈提交成功后的确认弹窗

**功能**:
- 成功图标
- 追踪 ID 显示
- 返回继续反馈
- 查看我的反馈
- 入场动画

**使用示例**:
```tsx
<SuccessModal
  trackingId={trackingId}
  onClose={handleClose}
  onViewMyFeedback={handleViewMyFeedback}
/>
```

## 自定义 Hooks

### useFeedbackForm（反馈表单逻辑 Hook）

**位置**: `hooks/useFeedbackForm.ts`

**职责**: 管理反馈表单状态、验证和提交逻辑

**功能**:
- 表单状态管理（类型、描述、文件）
- 表单验证
- 文件上传（提交时）
- 提交处理
- 错误处理
- 表单重置

**使用示例**:
```tsx
const {
  selectedType,
  setSelectedType,
  description,
  setDescription,
  uploadedFiles,
  setUploadedFiles,
  isSubmitting,
  submitError,
  handleSubmit,
} = useFeedbackForm({ onSubmitSuccess: onSubmit });
```

### useFeedbackReplies（反馈回复逻辑 Hook）

**位置**: `hooks/useFeedbackReplies.ts`

**职责**: 管理反馈回复的加载和提交

**功能**:
- 回复列表加载
- 新回复提交
- 加载状态
- 提交状态
- 错误处理

**使用示例**:
```tsx
const {
  replies,
  isLoading,
  isSubmitting,
  submitError,
  loadReplies,
  submitNewReply,
} = useFeedbackReplies({ pageId: feedback?.pageId || '' });
```

## 页面组件

### 反馈页面主入口

**位置**: `app/(main)/feedback/page.tsx`

**职责**: 反馈页面入口，服务端渲染静态内容

**功能**:
- 页面标题
- 反馈帮助链接
- 渲染 FeedbackClient

**优化说明**: 改为 Server Component，提取客户端逻辑到 FeedbackClient

**使用示例**:
```tsx
// Server Component
export default function FeedbackPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1>反馈帮助</h1>
      <FeedbackClient />
    </div>
  );
}
```

## 组件层次结构

```
FeedbackPage (Server Component)
└── FeedbackClient (Client)
    ├── FeedbackTabs (Client)
    ├── SubmitFeedback (Client, 懒加载)
    │   ├── TypeSelector (Client)
    │   ├── FileUploader (Client)
    │   │   └── FileList (Client)
    │   └── SubmitBtn (Client)
    ├── MyFeedback (Client, 懒加载)
    │   ├── FeedbackCard (Server + Client)
    │   │   └── FeedbackCardActions (Client)
    │   └── FeedbackDetailModal (Client, 懒加载)
    │       ├── ReplyList (Client)
    │       └── ReplyForm (Client)
    ├── FAQ (Server, 懒加载)
    └── Toast (Client)
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面结构、静态内容、卡片内容渲染
- **Client Component**: 交互逻辑、状态管理、表单处理
- **Hooks**: 业务逻辑、数据获取、状态管理

### 2. 性能优化
- 组件懒加载减少初始加载时间
- 服务端渲染卡片内容
- 文件延迟上传（提交时才上传）
- 追踪 ID 本地存储

### 3. 状态管理
- 使用 useState 管理本地状态
- 使用自定义 Hooks 管理复杂逻辑
- 单一数据源原则

### 4. 用户体验
- 即时反馈
- 清晰的加载状态
- 友好的错误提示
- 追踪 ID 复制功能

## 数据流

```
用户填写表单
  ↓
本地验证
  ↓
提交时上传文件至飞书
  ↓
提交反馈数据至飞书多维表格
  ↓
生成追踪 ID
  ↓
保存追踪 ID 到本地存储
  ↓
显示成功提示
  ↓
预加载反馈列表

查看我的反馈
  ↓
从本地存储获取追踪 ID 列表
  ↓
查询飞书多维表格
  ↓
展示反馈列表
  ↓
点击查看详情
  ↓
加载评论列表
  ↓
可提交新评论
```

## 飞书集成

### 数据存储
- **反馈数据**: 飞书多维表格
- **文件存储**: 飞书云文档

### API 接口
- `submitFeedback`: 提交反馈
- `uploadFeedbackFiles`: 上传文件
- `getFeedbacksByTrackingIds`: 根据追踪 ID 查询反馈
- `getFeedbackReplies`: 获取评论列表
- `submitFeedbackReply`: 提交评论

## 追踪 ID 机制

### 生成规则
- 格式：`FB-{timestamp}-{random}`
- 示例：`FB-1712345678901-a1b2c3d4`

### 存储方式
- 使用 localStorage 存储追踪 ID 列表
- 用户可在"我的反馈"中查看所有提交的反馈

### 用途
- 用户跟踪反馈处理进度
- 系统查询反馈记录
- 关联评论和回复

## 文件上传策略

### 延迟上传
- 文件选择后仅做本地验证
- 实际文件上传延迟到表单提交时
- 避免资源浪费

### 验证规则
- 文件类型：仅图片（png, jpg, jpeg, gif, webp）
- 文件大小：最大 10MB
- 文件数量：最多 5 个

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 卡片式布局
- 圆角设计

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 反馈类型颜色：error（红）、warning（黄）、info（蓝）、primary（主色）
- 选中状态：莫兰迪紫边框

### 响应式设计
- 移动端优化
- 标签页横向滚动
- 按钮和文字大小适配

## 更新时间

2026-03-29
