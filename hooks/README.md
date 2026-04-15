# Hooks 目录说明（按现状）

本文件描述 `hooks/` 当前真实结构、导入方式与分层边界。  
口径与 `HOOKS_LIB_BOUNDARY_CHECKLIST.md` 保持一致。

---

## 目录结构（当前）

```text
hooks/
├── README.md
├── index.ts
├── auth/
│   ├── index.ts
│   └── useAuth.ts
├── article/
│   ├── useArticleActions.ts
│   ├── useArticleToast.ts
│   ├── useArticleView.ts
│   ├── useComments.ts
│   ├── useCommentSub.ts
│   └── useContentProtection.ts
├── drafts/
│   ├── useDrafts.ts
│   └── useDraftsToast.ts
├── navigation/
│   ├── useDelayNav.ts
│   └── useFastNav.ts
├── notification/
│   └── useInboxCache.ts
├── publish/
│   ├── useAutoSave.ts
│   ├── useEditorActions.ts
│   ├── useEditorState.ts
│   ├── useEditorToast.ts
│   └── useTipTapEditor.ts
├── settings/
│   ├── useNotificationSettings.ts
│   ├── usePrivacySettings.ts
│   └── useProfileForm.ts
├── updates/
│   └── useUpdates.ts
├── useDebounce.ts
├── useOptimisticMutation.ts
└── useSWRQuery.ts
```

---

## 这层放什么

`hooks` 是 **UI/交互编排层**，负责：

- React 状态管理（`useState`/`useMemo`/`useEffect`）
- 页面交互流程（按钮动作、表单流程、导航与 toast）
- SWR 调用编排、乐观更新
- 调用 `lib/*` 暴露的领域能力

不负责：

- 核心业务规则定义
- 数据库读写规则定义
- 权限与安全策略定义

这些应放在 `lib/*`。

---

## 导入规范

### 推荐：统一入口导入

```ts
import { useAuth, useDrafts, useUpdates } from '@/hooks'
```

### 可选：按子目录导入

```ts
import { useAuth } from '@/hooks/auth'
import { useComments } from '@/hooks/article/useComments'
import { usePrivacySettings } from '@/hooks/settings/usePrivacySettings'
```

### 不推荐：深层相对路径

```ts
import { useAuth } from '../../../hooks/auth/useAuth'
```

---

## 各子目录职责

### `auth/`

- `useAuth`：消费 `AuthProvider` 上下文，封装登录/退出/刷新用户动作
- 依赖：`@/lib/auth/client`、`@/lib/supabase/client`

### `article/`

- `useArticleActions`：点赞/收藏的乐观更新编排
- `useComments`：评论列表加载、删除、点赞交互
- `useCommentSub`：评论提交流程
- `useArticleView`：文章浏览量交互
- `useContentProtection`：前端内容保护行为
- `useArticleToast`：文章模块消息提示

### `drafts/`

- `useDrafts`：草稿列表筛选、分页、选择、批量操作编排
- `useDraftsToast`：草稿模块提示
- 依赖：`@/lib/drafts/draftService` 与 `@/lib/articles/actions/*`

### `navigation/`

- `useFastNav`：快速导航交互
- `useDelayNav`：延迟/防抖导航交互

### `notification/`

- `useInboxCache`：通知缓存与同步编排
- 依赖：`@/lib/notifications/actions`

### `publish/`

- `useEditorState`：编辑器页面状态
- `useEditorActions`：保存/发布动作编排
- `useAutoSave`：自动保存流程
- `useTipTapEditor`：TipTap 编辑器集成
- `useEditorToast`：发布模块提示

### `settings/`

- `useProfileForm`：资料编辑表单与头像处理编排
- `usePrivacySettings`：隐私设置乐观更新
- `useNotificationSettings`：通知设置乐观更新
- 建议：优先通过 `@/lib/settings/actions` 聚合入口导入设置动作

### `updates/`

- `useUpdates`：更新日志筛选与搜索状态编排
- 依赖：`@/lib/updates/updateService`

### 根级通用 hooks

- `useDebounce`：通用防抖
- `useOptimisticMutation`：乐观更新通用模板
- `useSWRQuery`：SWR 查询封装

---

## 与 lib 的边界约定

### 允许

- hooks 调用 `lib/actions`、`lib/queries`、`lib/services`
- hooks 使用 `lib/cache/keys`、`lib/utils/*`

### 禁止

- 在 hooks 中新增可复用的领域规则（应下沉到 `lib`）
- 在 `lib` 中引入 React 生命周期或依赖 `@/hooks/*`

---

## 维护清单（新增 hook 时）

1. 文件名必须 `useXxx.ts`，并与导出函数同名。  
2. 明确它是“UI 编排”还是“领域逻辑”；若是后者放 `lib`。  
3. 将可复用纯函数下沉到 `lib/*`。  
4. 在 `hooks/index.ts`（或对应子目录 `index.ts`）补导出。  
5. 同步更新本文档，保证“现状即文档”。  

---

## 相关文档

- `HOOKS_LIB_BOUNDARY_CHECKLIST.md`
- `lib/auth/README.md`
- `lib/articles/README.md`
- `lib/settings/README.md`
