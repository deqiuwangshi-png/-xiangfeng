# 发布页面组件化架构

## 概述

发布页面采用 Next.js 组件化架构，将功能拆分为多个独立的、可复用的组件，确保职责明确、统一分类和分工合理。

## 项目结构

### 页面文件

```
app/(main)/publish/
└── page.tsx                    # 发布页面 Server Component
```

### 组件文件

```
components/publish/
├── index.ts                    # 组件索引文件（统一导出）
├── README.md                   # 组件文档
├── PublishPageClient.tsx       # 发布页面 Client Component
├── _header/                    # 头部组件目录
│   └── EditorHeader.tsx        # 编辑器头部组件
├── _core/                      # 核心组件目录
│   ├── EditorCard.tsx          # 编辑器卡片组件
│   └── DynamicEditor.tsx       # 动态编辑器组件（主组件）
├── _inputs/                    # 输入组件目录
│   └── TitleInput.tsx          # 标题输入组件
├── _toolbar/                   # 工具栏组件目录
│   ├── EditorToolbar.tsx       # 编辑器工具栏组件
│   ├── ToolbarButton.tsx       # 工具栏按钮组件
│   ├── editorCommands.ts       # 统一命令执行器
│   ├── BubbleMenu.tsx          # 浮动气泡菜单组件
│   └── SlashMenu.tsx           # 斜杠命令菜单组件
├── _skeleton/                  # 骨架屏组件目录
│   └── EditorSkeleton.tsx      # 编辑器骨架屏组件
├── _blocks/                    # 节点视图组件目录
│   └── ParaNodeView.tsx        # 段落节点视图组件
```

### 相关 Hooks

```
hooks/publish/
├── useEditorState.ts           # 编辑器状态管理 Hook
├── useEditorActions.ts         # 编辑器操作 Hook
├── useAutoSave.ts              # 自动保存 Hook
└── useTipTapEditor.ts          # TipTap 编辑器 Hook
```

### 相关工具文件

```
lib/
├── upload/
│   ├── img.ts                  # 图片上传工具
│   ├── editorImage.ts          # 编辑器图片上传工具（带即时反馈）
│   └── avatar.ts               # 头像上传工具
├── articles/
│   ├── schema.ts               # 文章数据验证 Schema
│   └── actions/
│       ├── crud.ts             # 文章 CRUD 操作统一导出
│       ├── mutate.ts           # 文章增删改操作
│       ├── query.ts            # 文章查询操作
│       └── batch.ts            # 文章批量操作
└── drafts/
    └── draftService.ts         # 草稿服务
```

## 组件说明

### 页面组件

#### 1. PublishPage（发布页面 Server Component）

**位置**: `app/(main)/publish/page.tsx`

**职责**: 发布页面的服务端组件入口

**功能**:

- 用户身份验证检查
- 未登录状态显示登录引导
- 使用 Suspense 提供优雅的加载状态
- 支持编辑模式（通过 URL 参数 `edit` 获取草稿 ID）

**使用示例**:

```tsx
// 访问 /publish 创建新文章
// 访问 /publish?edit=xxx 编辑草稿
```

#### 2. PublishPageClient（发布页面 Client Component）

**位置**: `components/publish/PublishPageClient.tsx`

**职责**: 发布页面的客户端组件，封装动态导入逻辑

**功能**:

- 动态导入 DynamicEditor 组件（ssr: false）
- 读取 URL 参数 `edit` 获取草稿数据
- 加载草稿数据并传递给编辑器
- 显示骨架屏优化感知性能

**使用示例**:

```tsx
<Suspense fallback={<EditorSkeleton />}>
  <PublishPageClient />
</Suspense>
```

### 编辑器组件

### 4. EditorHeader（编辑器头部组件）

**位置**: `_header/EditorHeader.tsx`

**职责**: 提供编辑器的顶部导航栏

**功能**:

- 保存草稿按钮
- 发布按钮
- 专注模式切换按钮
- 保存状态显示

**使用示例**:

```tsx
<EditorHeader
  onSaveDraft={saveDraft}
  onPublish={publishContent}
  isSaving={isSaving}
  isPublishing={isPublishing}
  isFullscreen={isFullscreen}
  onToggleFullscreen={toggleFullscreen}
/>
```

### 5. EditorCard（编辑器卡片组件）

**位置**: `_core/EditorCard.tsx`

**职责**: 提供编辑器的主要卡片容器

**功能**:

- 顶部装饰条
- 标题输入
- TipTap 富文本内容编辑器
- 字符计数
- 专注模式支持

**使用示例**:

```tsx
<EditorCard
  title={title}
  onTitleChange={handleTitleChange}
  titleLength={titleLength}
  contentLength={contentLength}
  editor={editor}
  isMounted={isMounted}
  isFocusMode={isFocusMode}
/>
```

### 6. TitleInput（标题输入组件）

**位置**: `_inputs/TitleInput.tsx`

**职责**: 提供文章标题输入功能

**功能**:

- 自动调整高度的文本域
- 最多100字限制
- 字数提示
- 瑞士设计风格（无边框）

**使用示例**:

```tsx
<TitleInput
  value={title}
  onChange={handleTitleChange}
/>
```

### 7. 字符计数（已内联）

- 字符计数能力已内联到 `EditorCard.tsx`，不再维护独立文件。

### 8. EditorToolbar（编辑器工具栏组件）

**位置**: `_toolbar/EditorToolbar.tsx`

**职责**: 提供编辑器的格式化工具栏

**功能**:

- 格式化工具组（加粗、斜体、下划线）
- 标题级别选择（H1-H5）
- 插入工具组（引用、代码、列表）
- 编辑工具组（分割线、清除格式、撤销、重做）
- 折叠/展开功能

**使用示例**:

```tsx
<EditorToolbar
  editor={editor}
  onFocusTitle={focusTitle}
  onToggleFullscreen={toggleFullscreen}
  onToggleToolbar={toggleToolbar}
  isCollapsed={isToolbarCollapsed}
/>
```

### 9. ToolbarButton（工具栏按钮组件）

**位置**: `_toolbar/ToolbarButton.tsx`

**职责**: 提供工具栏的单个按钮功能

**功能**:

- 显示图标
- 工具提示（Tooltip）
- 激活状态样式
- 悬停效果
- 支持两种尺寸（sm/md）

**使用示例**:

```tsx
<ToolbarButton
  icon={Bold}
  tooltip="加粗"
  onClick={() => handleFormatText('bold')}
  isActive={editor?.isActive('bold')}
  size="md"
/>
```

### 10. 标题选择（已内联）

- 标题级别下拉选择已内联到 `EditorToolbar.tsx`，避免额外文件分散。

### 11. BubbleMenu（浮动气泡菜单组件）

**位置**: `_toolbar/BubbleMenu.tsx`

**职责**: 选中文本时在光标附近显示格式化工具栏

**功能**:

- 加粗、斜体、下划线
- 标题转换（H1-H3）
- 引用、代码
- 列表（有序/无序）
- 清除格式
- 文字颜色选择器

**使用示例**:

```tsx
<BubbleMenu editor={editor} />
```

### 12. SlashMenu（斜杠命令菜单组件）

**位置**: `_toolbar/SlashMenu.tsx`

**职责**: 输入 `/` 时唤起的命令菜单

**功能**:

- 快速插入格式化命令
- 支持键盘导航（上下箭头选择，回车确认）
- 图片上传功能
- 模糊搜索匹配

**使用示例**:

```tsx
<SlashMenu
  editor={editor}
  onUploadStart={() => setIsUploading(true)}
  onUploadEnd={() => setIsUploading(false)}
/>
```

### 13. DynamicEditor（动态编辑器组件）

**位置**: `_core/DynamicEditor.tsx`

**职责**: 发布页面的主编辑器组件

**功能**:

- 整合所有子组件
- 状态管理（单一状态源：标题、内容、草稿ID、发布状态、保存状态）
- 自动保存（防抖触发，默认 3 秒）
- 草稿编辑模式支持
- TipTap 编辑器集成

**使用示例**:

```tsx
<DynamicEditor
  initialTitle=""
  initialContent=""
  draftId={null}
/>
```

### 14. EditorSkeleton（编辑器骨架屏组件）

**位置**: `_skeleton/EditorSkeleton.tsx`

**职责**: 在动态导入加载期间显示，优化感知性能

**功能**:

- 模拟编辑器的完整布局结构
- 减少布局偏移（CLS）
- 动画脉冲效果

**使用示例**:

```tsx
<EditorSkeleton />
```

### 15. 拖拽手柄（已内联）

- 拖拽手柄已内联到 `ParaNodeView.tsx`，保持节点拖拽能力不变。

### 16. ParaNodeView（段落节点视图组件）

**位置**: `_blocks/ParaNodeView.tsx`

**职责**: TipTap 段落节点的自定义视图

**功能**:

- 自定义段落渲染
- 拖拽手柄控制排序
- 悬停显示拖拽手柄
- 选中状态显示

**使用示例**:

```tsx
// 在 TipTap 扩展配置中使用
NodeViewRenderer(ParaNodeView)
```

## 自定义 Hooks

### 1. useEditorState

**位置**: `@/hooks/publish/useEditorState.ts`

**职责**: 管理编辑器状态

**导入方式**:

```typescript
// 方式一：从统一入口导入
import { useEditorState } from '@/hooks';

// 方式二：从分类路径导入
import { useEditorState } from '@/hooks/publish/useEditorState';
```

**功能**:

- 标题和内容状态
- 字数统计
- 全屏模式切换
- 加载状态管理

### 2. useEditorActions

**位置**: `@/hooks/publish/useEditorActions.ts`

**职责**: 提供编辑器操作

**导入方式**:

```typescript
// 方式一：从统一入口导入
import { useEditorActions } from '@/hooks';

// 方式二：从分类路径导入
import { useEditorActions } from '@/hooks/publish/useEditorActions';
```

**功能**:

- 保存草稿
- 发布文章
- 状态更新

### 3. useAutoSave

**位置**: `@/hooks/publish/useAutoSave.ts`

**职责**: 自动保存功能

**导入方式**:

```typescript
// 方式一：从统一入口导入
import { useAutoSave } from '@/hooks';

// 方式二：从分类路径导入
import { useAutoSave } from '@/hooks/publish/useAutoSave';
```

**功能**:

- 防抖自动保存（默认 3 秒）
- 离开页面前保存
- 防抖处理

### 4. useTipTapEditor

**位置**: `@/hooks/publish/useTipTapEditor.ts`

**导入方式**:

```typescript
// 方式一：从统一入口导入
import { useTipTapEditor } from '@/hooks';

// 方式二：从分类路径导入
import { useTipTapEditor } from '@/hooks/publish/useTipTapEditor';
```

## 工具函数

### 1. uploadImage（图片上传工具）

**位置**: `lib/upload/img.ts`

**职责**: 处理编辑器内图片的上传、验证和 URL 生成

**功能**:

- 图片文件验证（类型、大小）
- 上传到 Supabase Storage
- 生成 Public URL
- 粘贴上传支持

**使用示例**:

```typescript
const url = await uploadImage(file)
editor.chain().focus().setImage({ src: url }).run()
```

### 2. uploadEditorImage（编辑器图片上传工具 - 带即时反馈）

**位置**: `lib/upload/editorImage.ts`

**职责**: 处理编辑器内图片的上传，支持 Blob 预览和 temp 状态追踪

**功能**:

- 立即插入本地 Blob 预览图
- 后台上传并替换为真实 URL
- 自动创建 media 表 temp 记录
- 支持上传进度追踪

**使用示例**:

```typescript
const result = await uploadEditorImage(file, {
  onProgress: (progress) => console.log(progress)
})
```

### 3. 文章 CRUD 操作

**位置**: `lib/articles/actions/`

**文件说明**:

- `crud.ts` - 统一导出所有文章操作函数
- `mutate.ts` - 文章增删改操作（createArticle, updateArticle, deleteArticle）
- `query.ts` - 文章查询操作（getArticles, getArticleById 等）
- `batch.ts` - 文章批量操作（batchDeleteArticles）

**使用示例**:

```typescript
// 创建文章
const article = await createArticle({ title, content, status: 'published' })

// 查询文章
const articles = await getArticles({ page: 1, limit: 10 })

// 更新文章
await updateArticle({ id, title, content })

// 删除文章
await deleteArticle(id)
```

### 4. 文章数据验证 Schema

**位置**: `lib/articles/schema.ts`

**职责**: 使用 Zod 定义文章数据的验证规则

**Schema 列表**:

- `CreateArticleSchema` - 创建文章数据验证
- `UpdateArticleSchema` - 更新文章数据验证
- `ArticleTagsSchema` - 文章标签验证
- `CommentSchema` - 评论数据验证
- `ArticleStatusSchema` - 文章状态枚举

**安全特性**:

- 标题长度限制：1-100字符
- 内容长度限制：1-50000字符（约5万字）
- 标签数量限制：最多10个
- 自动去除首尾空白
- 净化 HTML 标签

## 组件层次结构

### 页面层次结构

```
PublishPage (Server Component)
└── Suspense
    └── PublishPageClient (Client Component)
        └── DynamicEditor (动态编辑器主组件)
            ├── EditorHeader (编辑器头部)
            ├── EditorCard (编辑器卡片)
            │   ├── TitleInput (标题输入)
            │   └── EditorContent (TipTap 编辑器内容，含内联字符计数)
            ├── BubbleMenu (浮动气泡菜单)
            ├── SlashMenu (斜杠命令菜单)
            └── EditorToolbar (编辑器工具栏)
                └── ToolbarButton (工具栏按钮，含内联标题选择) × N
```

### TipTap 节点视图层次结构

```
EditorContent
├── ParaNodeView (段落节点，含内联拖拽手柄)
└── 其他 TipTap 节点...
```

## 设计原则

### 1. 职责明确

- 每个组件只负责一个特定的功能
- 组件之间通过 props 进行通信
- 避免组件之间的直接依赖

### 2. 统一分类

- 所有发布页面组件存放在 `components/publish/` 目录下
- 按功能分类到子目录（`_header/`, `_core/`, `_inputs/`, `_toolbar/`, `_skeleton/`, `_blocks/`）
- Hooks 统一存放在 `hooks/` 目录

### 3. 分工合理

- **原子组件**: ToolbarButton、TitleInput
- **组合组件**: EditorCard、EditorToolbar、BubbleMenu、SlashMenu
- **布局组件**: EditorHeader
- **页面组件**: DynamicEditor
- **节点视图**: ParaNodeView
- **骨架屏**: EditorSkeleton

### 4. 可复用性

- 组件设计遵循单一职责原则
- 通过 props 实现灵活性
- 支持 ref 转发

### 5. 可维护性

- 完整的 TypeScript 类型定义
- 详细的函数注释
- 清晰的代码结构

## 样式管理

### 全局样式

- 位置: `app/globals.css`
- 内容: 颜色变量、主题变量、全局样式

### 域特定样式

- 位置: `styles/domains/app.css`
- 内容: 应用页面（包括发布页面）的共享样式
- 包含: 动画、布局、交互效果

### 组件样式

- 位置: 组件文件内部
- 方式: 使用 Tailwind CSS v4 工具类
- 原则: 遵循瑞士设计风格，简洁无装饰

## 技术规范

### Tailwind CSS v4

- 使用 `bg-linear-`* 替代 `bg-gradient-*`
- 使用项目定义的颜色变量（`--color-xf-*`）
- 严禁自定义颜色值

### TypeScript

- 严格模式
- 完整的类型定义
- 函数级注释

### React

- 函数组件
- Hooks（useState、useEffect、useRef、useCallback、useMemo）
- Props 接口定义
- forwardRef 支持

## 数据流

```
用户输入
  ↓
DynamicEditor (状态管理)
  ↓
子组件 (通过 props 传递)
  ↓
事件处理
  ↓
DynamicEditor (更新状态)
  ↓
子组件 (重新渲染)
```

## 性能优化

1. **动态导入**: DynamicEditor 使用动态导入，减少首屏加载时间
2. **骨架屏**: EditorSkeleton 提供加载状态，优化感知性能
3. **组件拆分**: 避免不必要的重渲染
4. **状态管理**: 合理划分状态，减少不必要的更新
5. **事件处理**: 使用 useCallback 优化事件处理函数
6. **样式优化**: 使用 Tailwind CSS v4 工具类，避免自定义样式

## 命令执行规范（去重）

- 编辑器命令统一由 `components/publish/_toolbar/editorCommands.ts` 执行。
- `EditorToolbar`、`BubbleMenu`、`SlashMenu` 只负责 UI 入口，不重复维护命令执行逻辑。
- 新增命令时先更新统一命令执行器，再按需接入菜单入口。

## 更新时间

2026-04-15