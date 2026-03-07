# Article 组件目录文档

## 目录结构

`d:\My_xiangmu\xf_02\components\article` 目录包含文章详情页的所有组件，共计 **16 个文件**。

---

## 根目录文件（6个）

### 1. ArticleActions.tsx
**类型：** Client Component  
**含义：** 文章操作按钮组件  
**功能：**
- 文章点赞/取消点赞（使用 Server Action）
- 显示点赞数量
- 打开评论面板
- 显示评论数量
- 分享文章（微信、微博、复制链接）
- 收藏/取消收藏（使用 Server Action）
- 未登录状态提示

### 2. ArticleContent.tsx
**类型：** Server Component  
**含义：** 文章内容组件  
**功能：**
- 安全渲染文章 HTML 内容
- 使用 sanitizeHtml 净化 HTML，防止 XSS 攻击
- 只允许白名单内的标签和属性

### 3. ArticleHeader.tsx
**类型：** Server Component  
**含义：** 文章头部组件  
**功能：**
- 显示文章标题（大字号）
- 显示作者名称和简介
- 显示预估阅读时间

### 4. ArticleSkeleton.tsx
**类型：** Server Component  
**含义：** 文章加载骨架屏  
**功能：**
- 文章数据加载时的占位 UI
- 模拟标题和正文区域的加载效果
- 使用 animate-pulse 动画

### 5. CommentSkeleton.tsx
**类型：** Server Component  
**含义：** 评论加载骨架屏  
**功能：**
- 评论面板加载时的占位 UI
- 模拟评论列表和输入框的加载效果
- 用于 Suspense fallback

### 6. ReadingProgress.tsx
**类型：** Client Component  
**含义：** 阅读进度组件  
**功能：**
- 顶部固定进度条
- 实时计算页面滚动进度（0-100%）
- 使用 requestAnimationFrame 节流优化

---

## comments/ 子目录（10个文件）

### 7. CommentCard.tsx
**类型：** Client Component  
**含义：** 单条评论卡片组件  
**功能：**
- 展示单条评论内容
- 显示评论作者头像和名称
- 显示评论时间（使用 formatDistanceToNow）
- 评论点赞按钮

### 8. CommentForm.tsx
**类型：** Client Component  
**含义：** 评论输入表单组件  
**功能：**
- 评论输入框
- 提交按钮
- 登录状态检查

### 9. CommentList.tsx
**类型：** Server Component  
**含义：** 评论列表组件  
**功能：**
- 展示评论列表
- 处理加载更多
- 空状态提示

### 10. CommentPanel.tsx
**类型：** Client Component  
**含义：** 评论面板容器组件  
**功能：**
- 组合所有评论子组件
- 管理面板状态（打开/关闭）
- 集成 useComments 和 useCommentSubmit hooks

### 11. LoginPrompt.tsx
**类型：** Server Component  
**含义：** 登录提示组件  
**功能：**
- 未登录用户看到的提示
- 显示隐藏评论数量
- 引导用户登录

### 12. types.ts
**类型：** TypeScript 类型定义  
**含义：** 评论模块类型定义  
**内容：**
- Comment 接口
- CommentPanelProps、CommentCardProps 等 Props 接口
- MAX_COMMENTS_WITHOUT_LOGIN 常量

### 13. index.ts
**类型：** TypeScript 导出文件  
**含义：** 评论模块统一导出  
**功能：**
- 集中导出所有评论组件
- 集中导出 hooks 和工具函数
- 集中导出类型定义

---

## comments/_hooks/ 子目录（2个文件）

### 14. useComments.ts
**类型：** Client Hook  
**含义：** 评论数据管理 Hook  
**功能：**
- 管理评论列表状态
- 分页加载更多评论（使用 Server Action）
- 添加新评论（乐观更新）
- 切换评论点赞状态

### 15. useCommentSub.ts
**类型：** Client Hook  
**含义：** 评论提交 Hook  
**功能：**
- 处理评论提交逻辑
- 使用 submitArticleComment Server Action
- 错误处理和状态管理

---

## comments/utils/ 子目录（1个文件）

### 16. getInitials.ts
**类型：** Utility Function  
**含义：** 获取首字母工具函数  
**功能：**
- 从用户名获取前两个字符
- 用于头像占位显示

---

## 架构说明

### Server Components（服务端渲染）
- ArticleContent
- ArticleHeader
- ArticleSkeleton
- CommentSkeleton
- CommentList
- LoginPrompt

### Client Components（客户端交互）
- ArticleActions
- ReadingProgress
- CommentPanel
- CommentCard
- CommentForm

### 数据流
```
page.tsx (Server)
  ├── ArticleHeader (Server) ← 文章标题/作者
  ├── ArticleContent (Server) ← 文章内容
  ├── ArticleActions (Client) ← 点赞/收藏/分享
  └── CommentPanel (Client) ← 评论面板
       ├── useComments (Hook) ← 评论数据管理
       └── useCommentSub (Hook) ← 评论提交
```

### 命名规范
- 组件文件：PascalCase（如 ArticleActions.tsx）
- Hook 文件：camelCase（如 useComments.ts）
- 工具文件：camelCase（如 getInitials.ts）
- 私有目录：下划线前缀（如 _hooks/）
