# 发布页面组件化架构

## 概述

发布页面采用Next.js组件化架构，将功能拆分为多个独立的、可复用的组件，确保职责明确、统一分类和分工合理。

## 组件结构

```
components/publish/
├── index.ts                    # 组件索引文件
├── EditorHeader.tsx           # 编辑器头部组件
├── EditorCard.tsx             # 编辑器卡片组件
├── TitleInput.tsx             # 标题输入组件
├── ContentEditor.tsx          # 内容编辑器组件
├── CharacterCounter.tsx       # 字符计数组件
├── EditorToolbar.tsx          # 编辑器工具栏组件
└── ToolbarButton.tsx          # 工具栏按钮组件
```

## 组件说明

### 1. ToolbarButton（工具栏按钮组件）

**职责**: 提供工具栏的单个按钮功能

**功能**:
- 显示图标
- 工具提示（Tooltip）
- 激活状态样式
- 悬停效果

**使用示例**:
```tsx
<ToolbarButton
  icon={Bold}
  tooltip="加粗"
  onClick={() => onFormatText('bold')}
  title="加粗 (Ctrl+B)"
/>
```

### 2. EditorToolbar（编辑器工具栏组件）

**职责**: 提供编辑器的格式化工具栏

**功能**:
- 格式化工具组（加粗、斜体、下划线）
- 标题工具组（标题、引用、代码）
- 插入工具组（链接、图片、列表）
- 编辑工具组（分割线、清除格式、撤销、重做）
- 视图工具组（跳转标题、全屏、收起工具栏）
- 折叠/展开功能

**使用示例**:
```tsx
<EditorToolbar
  onFormatText={formatText}
  onInsertLink={insertLink}
  onInsertImage={insertImage}
  onInsertList={insertList}
  onClearFormatting={clearFormatting}
  onUndo={undoAction}
  onRedo={redoAction}
  onFocusTitle={focusTitle}
  onToggleFullscreen={toggleFullscreen}
  onToggleToolbar={toggleToolbar}
  isCollapsed={isToolbarCollapsed}
/>
```

### 3. TitleInput（标题输入组件）

**职责**: 提供文章标题输入功能

**功能**:
- 标题输入框
- 字符计数提示
- 底部装饰线动画
- 最多100字限制

**使用示例**:
```tsx
<TitleInput
  ref={titleRef}
  value={title}
  onChange={handleTitleChange}
/>
```

### 4. ContentEditor（内容编辑器组件）

**职责**: 提供文章内容编辑功能

**功能**:
- 内容文本域
- 左侧渐变装饰线
- 焦点背景高亮
- 隐藏滚动条
- 支持Markdown格式
- 最小高度60vh

**使用示例**:
```tsx
<ContentEditor
  ref={contentRef}
  value={content}
  onChange={handleContentChange}
/>
```

### 5. CharacterCounter（字符计数组件）

**职责**: 显示文章内容的字符计数

**功能**:
- 显示当前字符数
- 显示建议字数提示
- 根据字符数显示不同的颜色提示

**使用示例**:
```tsx
<CharacterCounter count={contentLength} />
```

### 6. EditorCard（编辑器卡片组件）

**职责**: 提供编辑器的主要卡片容器

**功能**:
- 顶部装饰条
- 标题输入
- 内容编辑器
- 字符计数
- 动画效果

**使用示例**:
```tsx
<EditorCard
  title={title}
  onTitleChange={handleTitleChange}
  titleRef={titleRef}
  content={content}
  onContentChange={handleContentChange}
  contentRef={contentRef}
  contentLength={contentLength}
/>
```

### 7. EditorHeader（编辑器头部组件）

**职责**: 提供编辑器的顶部导航栏

**功能**:
- 返回按钮
- 页面标题
- 保存草稿按钮
- 发布按钮
- 保存状态显示

**使用示例**:
```tsx
<EditorHeader
  onSaveDraft={saveDraft}
  onPublish={publishContent}
  isSaving={isSaving}
  isPublishing={isPublishing}
/>
```

## 主页面组件

### PublishPage（发布页面主组件）

**职责**: 协调所有子组件，管理编辑器状态

**功能**:
- 状态管理（标题、内容、字符计数、全屏模式、工具栏折叠等）
- 事件处理（保存草稿、发布、格式化等）
- 自动保存（每30秒）
- 组件协调

**使用示例**:
```tsx
export default function PublishPage() {
  const [editorState, setEditorState] = useState<EditorState>({
    title: '',
    content: '',
    contentLength: 0,
    isFullscreen: false,
    isToolbarCollapsed: false,
    isSaving: false,
    isPublishing: false,
  })

  // ... 事件处理函数

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
      <EditorHeader
        onSaveDraft={saveDraft}
        onPublish={publishContent}
        isSaving={editorState.isSaving}
        isPublishing={editorState.isPublishing}
      />
      <div className="max-w-[840px] mx-auto px-4 py-8 md:py-12 fade-in">
        <EditorCard
          title={editorState.title}
          onTitleChange={handleTitleChange}
          titleRef={titleRef}
          content={editorState.content}
          onContentChange={handleContentChange}
          contentRef={contentRef}
          contentLength={editorState.contentLength}
        />
      </div>
      <EditorToolbar
        onFormatText={formatText}
        onInsertLink={insertLink}
        onInsertImage={insertImage}
        onInsertList={insertList}
        onClearFormatting={clearFormatting}
        onUndo={undoAction}
        onRedo={redoAction}
        onFocusTitle={focusTitle}
        onToggleFullscreen={toggleFullscreen}
        onToggleToolbar={toggleToolbar}
        isCollapsed={editorState.isToolbarCollapsed}
      />
    </div>
  )
}
```

## 组件层次结构

```
PublishPage (主页面组件)
├── EditorHeader (编辑器头部)
├── EditorCard (编辑器卡片)
│   ├── TitleInput (标题输入)
│   ├── ContentEditor (内容编辑器)
│   └── CharacterCounter (字符计数)
└── EditorToolbar (编辑器工具栏)
    └── ToolbarButton (工具栏按钮) × 16
```

## 设计原则

### 1. 职责明确
- 每个组件只负责一个特定的功能
- 组件之间通过props进行通信
- 避免组件之间的直接依赖

### 2. 统一分类
- 所有发布页面组件存放在`components/publish/`目录下
- 样式文件存放在`styles/domains/app.css`
- 主页面组件存放在`app/(app)/publish/page.tsx`

### 3. 分工合理
- 原子组件：ToolbarButton、TitleInput、ContentEditor、CharacterCounter
- 组合组件：EditorCard、EditorToolbar
- 布局组件：EditorHeader
- 页面组件：PublishPage

### 4. 可复用性
- 组件设计遵循单一职责原则
- 通过props实现灵活性
- 支持ref转发

### 5. 可维护性
- 完整的TypeScript类型定义
- 详细的函数注释
- 清晰的代码结构

## 样式管理

### 全局样式
- 位置：`app/globals.css`
- 内容：颜色变量、主题变量、全局样式

### 域特定样式
- 位置：`styles/domains/app.css`
- 内容：应用页面（包括发布页面）的共享样式
- 包含：动画、布局、交互效果

### 组件样式
- 位置：组件文件内部
- 方式：使用Tailwind CSS v4工具类
- 原则：严格遵循HTML原型图样式

## 技术规范

### Tailwind CSS v4
- 使用`bg-linear-*`替代`bg-gradient-*`
- 使用项目定义的颜色变量（`--color-xf-*`）
- 严禁自定义颜色值

### TypeScript
- 严格模式
- 完整的类型定义
- 函数级注释

### React
- 函数组件
- Hooks（useState、useEffect、useRef）
- Props接口定义
- forwardRef支持

## 数据流

```
用户输入
  ↓
PublishPage (状态管理)
  ↓
子组件 (通过props传递)
  ↓
事件处理
  ↓
PublishPage (更新状态)
  ↓
子组件 (重新渲染)
```

## 性能优化

1. **组件拆分**: 避免不必要的重渲染
2. **状态管理**: 合理划分状态，减少不必要的更新
3. **事件处理**: 使用 useCallback 优化事件处理函数（待实现）
4. **样式优化**: 使用Tailwind CSS v4工具类，避免自定义样式

## 未来扩展

1. **格式化功能**: 实现实际的文本格式化逻辑
2. **图片上传**: 实现图片上传功能
3. **草稿管理**: 实现草稿的保存和加载
4. **发布功能**: 实现文章发布功能
5. **全屏模式**: 实现全屏编辑模式
6. **快捷键**: 实现快捷键支持

## 更新时间

2026-02-19
