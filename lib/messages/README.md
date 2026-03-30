# 消息常量库 (lib/messages)

## 目录结构

```
lib/messages/
├── README.md           # 本文档
├── index.ts            # 消息常量统一导出入口
├── auth.ts             # 认证相关消息
├── common.ts           # 通用消息常量
├── article.ts          # 文章相关消息
├── comment.ts          # 评论相关消息
└── user.ts             # 用户相关消息
```

## 概述

本模块统一管理应用中的所有提示消息常量，包括错误提示、成功提示、加载状态、确认对话框等。通过集中管理消息文本，确保用户体验的一致性和后续维护的便利性。

## 设计原则

1. **统一出口**：所有消息通过 `index.ts` 统一导出
2. **分类管理**：按业务模块划分消息文件
3. **常量定义**：使用 `as const` 确保类型安全
4. **向后兼容**：保留旧导出名称，平滑过渡

## 消息分类

### 1. 认证消息 (auth.ts)

管理用户认证流程中的所有提示消息。

**包含的消息常量：**

| 常量名 | 描述 | 消息类型 |
|--------|------|----------|
| `COMMON_ERRORS` | 通用错误消息 | 错误 |
| `LOGIN_MESSAGES` | 登录相关消息 | 错误/成功 |
| `REGISTER_MESSAGES` | 注册相关消息 | 错误/成功 |
| `RESET_PASSWORD_MESSAGES` | 密码重置消息 | 错误/成功 |
| `CHANGE_PASSWORD_MESSAGES` | 修改密码消息 | 错误/成功 |
| `LOGOUT_MESSAGES` | 退出登录消息 | 错误/成功 |
| `LOGIN_HISTORY_MESSAGES` | 登录历史消息 | 错误 |
| `AUTH_ERRORS` | 所有认证错误集合 | 错误 |

**使用示例：**

```typescript
import { LOGIN_MESSAGES, REGISTER_MESSAGES } from '@/lib/messages';

// 登录失败提示
toast.error(LOGIN_MESSAGES.INVALID_CREDENTIALS);
// 输出: '邮箱或密码错误，请检查后重试'

// 登录成功提示
toast.success(LOGIN_MESSAGES.SUCCESS);
// 输出: '登录成功'

// 注册邮箱已存在
toast.error(REGISTER_MESSAGES.EMAIL_ALREADY_REGISTERED);
// 输出: '该邮箱已被注册，请直接登录或使用其他邮箱'
```

**错误映射函数：**

```typescript
import { mapSupabaseError } from '@/lib/messages';

// 将 Supabase 错误转换为用户友好提示
const userMessage = mapSupabaseError(
  'Invalid login credentials',
  'login'
);
// 返回: '邮箱或密码错误，请检查后重试'
```

### 2. 通用消息 (common.ts)

管理应用中通用的提示消息。

**包含的消息常量：**

| 常量名 | 描述 | 示例消息 |
|--------|------|----------|
| `LOADING_MESSAGES` | 加载状态消息 | '加载中...'、'保存中...' |
| `SUCCESS_MESSAGES` | 成功操作消息 | '操作成功'、'保存成功' |
| `COMMON_ERRORS` | 通用错误消息 | '操作失败，请稍后重试' |
| `CONFIRM_MESSAGES` | 确认对话框消息 | '确定要删除吗？' |
| `VALIDATION_MESSAGES` | 表单验证消息 | '此项为必填项' |
| `EMPTY_MESSAGES` | 空状态消息 | '暂无内容'、'暂无文章' |

**使用示例：**

```typescript
import { 
  LOADING_MESSAGES, 
  SUCCESS_MESSAGES, 
  CONFIRM_MESSAGES 
} from '@/lib/messages';

// 显示加载状态
const loadingToast = toast.loading(LOADING_MESSAGES.SAVING);

// 操作成功
 toast.success(SUCCESS_MESSAGES.SAVED);

// 确认对话框
if (confirm(CONFIRM_MESSAGES.DELETE)) {
  // 执行删除
}
```

### 3. 文章消息 (article.ts)

管理文章发布、编辑、浏览相关的提示消息。

**包含的消息常量：**

| 常量名 | 描述 | 消息类型 |
|--------|------|----------|
| `ARTICLE_ERROR_MESSAGES` | 文章操作错误 | 获取失败、无权限等 |
| `ARTICLE_SUCCESS_MESSAGES` | 文章操作成功 | 发布成功、保存成功等 |
| `ARTICLE_INFO_MESSAGES` | 文章提示信息 | 字数统计、阅读时间等 |
| `ARTICLE_PAYWALL_MESSAGES` | 付费内容消息 | 购买提示、余额不足等 |
| `ARTICLE_INTERACTION_MESSAGES` | 文章互动消息 | 点赞、收藏、举报等 |

**使用示例：**

```typescript
import { 
  ARTICLE_ERROR_MESSAGES, 
  ARTICLE_SUCCESS_MESSAGES,
  ARTICLE_INTERACTION_MESSAGES 
} from '@/lib/messages';

// 文章不存在
toast.error(ARTICLE_ERROR_MESSAGES.NOT_FOUND);

// 发布成功
toast.success(ARTICLE_SUCCESS_MESSAGES.CREATE_SUCCESS);

// 点赞成功
toast.success(ARTICLE_INTERACTION_MESSAGES.LIKE_SUCCESS);
```

### 4. 评论消息 (comment.ts)

管理评论发布、编辑、删除相关的提示消息。

**包含的消息常量：**

| 常量名 | 描述 | 消息类型 |
|--------|------|----------|
| `COMMENT_ERROR_MESSAGES` | 评论操作错误 | 发布失败、无权限等 |
| `COMMENT_SUCCESS_MESSAGES` | 评论操作成功 | 发布成功、删除成功等 |
| `COMMENT_INFO_MESSAGES` | 评论提示信息 | 占位符、字数统计等 |
| `COMMENT_INTERACTION_MESSAGES` | 评论互动消息 | 点赞、举报等 |
| `COMMENT_LIST_MESSAGES` | 评论列表消息 | 加载更多、空状态等 |

**使用示例：**

```typescript
import { 
  COMMENT_ERROR_MESSAGES, 
  COMMENT_SUCCESS_MESSAGES,
  COMMENT_INFO_MESSAGES 
} from '@/lib/messages';

// 评论内容为空
toast.error(COMMENT_ERROR_MESSAGES.EMPTY_CONTENT);

// 评论发布成功
toast.success(COMMENT_SUCCESS_MESSAGES.CREATE_SUCCESS);

// 评论占位符
const placeholder = COMMENT_INFO_MESSAGES.PLACEHOLDER;
// 返回: '写下你的评论...'
```

### 5. 用户消息 (user.ts)

管理用户信息、关注、个人资料相关的提示消息。

**包含的消息常量：**

| 常量名 | 描述 | 消息类型 |
|--------|------|----------|
| `PROFILE_MESSAGES` | 用户资料消息 | 更新成功/失败、头像上传等 |
| `FOLLOW_MESSAGES` | 关注相关消息 | 关注成功/失败、取消关注等 |
| `USER_SETTINGS_MESSAGES` | 用户设置消息 | 设置更新、密码修改等 |
| `USER_SEARCH_MESSAGES` | 用户搜索消息 | 搜索失败、无结果等 |

**使用示例：**

```typescript
import { 
  PROFILE_MESSAGES, 
  FOLLOW_MESSAGES 
} from '@/lib/messages';

// 资料更新成功
toast.success(PROFILE_MESSAGES.UPDATE_SUCCESS);

// 关注成功
toast.success(FOLLOW_MESSAGES.FOLLOW_SUCCESS);

// 不能关注自己
toast.error(FOLLOW_MESSAGES.SELF_FOLLOW);
```

## 使用方式

### 推荐方式：统一入口导入

```typescript
import { 
  LOGIN_MESSAGES, 
  SUCCESS_MESSAGES, 
  ARTICLE_ERROR_MESSAGES 
} from '@/lib/messages';
```

### 按需导入（具体文件）

```typescript
import { LOGIN_MESSAGES } from '@/lib/messages/auth';
import { SUCCESS_MESSAGES } from '@/lib/messages/common';
```

## 消息常量结构

所有消息常量都使用 `as const` 定义，确保类型安全：

```typescript
export const LOGIN_MESSAGES = {
  // 错误消息
  INVALID_CREDENTIALS: '邮箱或密码错误，请检查后重试',
  EMAIL_NOT_CONFIRMED: '邮箱未验证，请检查邮箱并点击验证链接',
  // ...
  // 成功消息
  SUCCESS: '登录成功',
} as const;
```

类型推导结果：
- `LOGIN_MESSAGES.INVALID_CREDENTIALS` 类型为 `'邮箱或密码错误，请检查后重试'`
- 支持编辑器自动补全和类型检查

## 向后兼容

为了平滑过渡，保留了旧的导出名称（标记为 `@deprecated`）：

```typescript
/** @deprecated 使用 LOGIN_MESSAGES 替代 */
export { LOGIN_MESSAGES as LOGIN_ERRORS } from './auth';
```

建议新项目直接使用新的常量名称。

## 扩展指南

添加新的消息常量时，请遵循以下规范：

1. **文件选择**：根据业务模块选择对应的文件
2. **命名规范**：使用大写下划线命名法（SNAKE_CASE）
3. **常量命名**：以 `_MESSAGES` 或 `_ERRORS` 结尾
4. **消息分类**：区分错误、成功、提示等不同类型
5. **添加注释**：为每个消息添加 JSDoc 注释

**示例：**

```typescript
/**
 * 支付相关消息
 */
export const PAYMENT_MESSAGES = {
  // 错误
  INSUFFICIENT_BALANCE: '余额不足',
  PAYMENT_FAILED: '支付失败',
  // 成功
  PAYMENT_SUCCESS: '支付成功',
} as const;
```

## 相关模块

- [认证库](../auth/README.md) - 认证消息的使用场景
- [文章库](../articles/README.md) - 文章消息的使用场景
- [用户库](../user/README.md) - 用户消息的使用场景
- [类型定义](../../types/README.md) - 相关的类型定义
