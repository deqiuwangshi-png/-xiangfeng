# 反馈系统库 (lib/feedback)

## 目录结构

```
lib/feedback/
├── README.md           # 本文档
├── actions/            # Server Actions 目录
│   ├── index.ts        # Server Actions 统一导出
│   ├── auth.ts         # 用户认证相关
│   ├── query.ts        # 查询反馈列表
│   ├── submit.ts       # 提交反馈
│   ├── replies.ts      # 评论回复
│   ├── upload.ts       # 附件上传
│   └── delete.ts       # 删除附件
├── storage.ts          # 本地存储管理（Client）
└── utils.ts            # 工具函数
```

## 概述

本模块提供完整的用户反馈系统功能，包括反馈提交、追踪、查询、评论回复和附件管理。系统采用飞书多维表格作为数据存储后端，支持匿名和登录用户提交反馈。

## 核心功能

### 1. 反馈提交 (actions/submit.ts)

**submitFeedback**

提交用户反馈到飞书多维表格。

```typescript
import { submitFeedback } from '@/lib/feedback/actions';

const result = await submitFeedback({
  type: 'bug',           // 'bug' | 'suggestion' | 'ui' | 'other'
  description: '问题描述...',
  attachments: ['token1', 'token2'], // 可选，附件token列表
});

if (result.success) {
  console.log('追踪ID:', result.trackingId);
}
```

**数据验证规则：**
- `type`: 必填，必须是预定义类型之一
- `description`: 必填，1-5000字符
- `attachments`: 可选，最多10个附件

### 2. 反馈查询 (actions/query.ts)

**getFeedbacksByTrackingIds**

根据追踪ID列表获取用户反馈。

```typescript
import { getFeedbacksByTrackingIds } from '@/lib/feedback/actions';

const result = await getFeedbacksByTrackingIds(['FB-XXX', 'FB-YYY']);

if (result.success) {
  result.data.forEach(feedback => {
    console.log(feedback.type, feedback.status);
  });
}
```

**安全特性：**
- 追踪ID格式校验（防止枚举攻击）
- 归属校验（确保只能查看自己的反馈）
- 支持匿名用户（通过追踪ID）和登录用户（通过邮箱）双重匹配

**其他查询函数：**

| 函数名 | 描述 |
|--------|------|
| `getAnnouncements` | 获取公告列表 |
| `getFeedbackStatistics` | 获取反馈统计信息 |
| `getFAQs` | 获取常见问题列表 |

### 3. 评论回复 (actions/replies.ts)

**getFeedbackReplies**

获取反馈的评论列表。

```typescript
import { getFeedbackReplies } from '@/lib/feedback/actions';

const result = await getFeedbackReplies('record_id');

if (result.success) {
  result.data.forEach(reply => {
    console.log(reply.author, reply.content, reply.isOfficial);
  });
}
```

**submitReply**

提交评论到反馈。

```typescript
import { submitReply } from '@/lib/feedback/actions';

const result = await submitReply('record_id', '评论内容');

if (result.success) {
  console.log('评论已提交');
}
```

### 4. 附件上传 (actions/upload.ts)

**uploadFeedbackAttachment**

上传单个附件到飞书。

```typescript
import { uploadFeedbackAttachment } from '@/lib/feedback/actions';

const formData = new FormData();
formData.append('file', file);

const result = await uploadFeedbackAttachment(formData);

if (result.success) {
  console.log('文件Token:', result.fileToken);
}
```

**上传限制：**
- 文件大小：最大 10MB
- 文件类型：仅支持图片（PNG, JPG, JPEG, GIF, WEBP）
- MIME 类型校验（防止修改扩展名绕过）

**uploadFeedbackFiles**

批量上传附件（并行上传优化）。

```typescript
import { uploadFeedbackFiles } from '@/lib/feedback/actions';

const files = [
  { id: '1', file: file1 },
  { id: '2', file: file2 },
];

const results = await uploadFeedbackFiles(files);
```

### 5. 附件删除 (actions/delete.ts)

**deleteFeedbackAttachment**

删除反馈附件（带权限校验）。

```typescript
import { deleteFeedbackAttachment } from '@/lib/feedback/actions';

const result = await deleteFeedbackAttachment(
  'https://.../file.png',
  'feedback_id'
);
```

**安全校验：**
- 用户登录状态验证
- 反馈归属校验（只能删除自己的附件）
- 附件归属校验（确保附件属于指定反馈）

### 6. 本地存储管理 (storage.ts)

用于在浏览器本地保存用户提交的反馈追踪ID列表。

```typescript
import { 
  getTrackingIds, 
  addTrackingId, 
  removeTrackingId,
  clearTrackingIds 
} from '@/lib/feedback/storage';

// 获取所有追踪ID
const ids = getTrackingIds();

// 添加追踪ID
addTrackingId('FB-XXX');

// 移除追踪ID
removeTrackingId('FB-XXX');

// 清空所有追踪ID
clearTrackingIds();
```

**注意：** 此模块为 Client 端代码，只能在浏览器环境使用。

### 7. 工具函数 (utils.ts)

**generateTrackingId**

生成加密安全的追踪ID。

```typescript
import { generateTrackingId } from '@/lib/feedback/utils';

const trackingId = generateTrackingId();
// 格式: FB-<时间戳Base36>-<16位随机字符串>
// 示例: FB-LZ2WJ9CJ-A7B3D9F2H4J6K8M1
```

**安全特性：**
- 使用 `crypto.getRandomValues` 生成加密安全随机数
- 16位随机字符串提供 62^16 的熵
- 几乎不可猜测，防止枚举攻击

**isValidTrackingId**

验证追踪ID格式。

```typescript
import { isValidTrackingId } from '@/lib/feedback/utils';

const isValid = isValidTrackingId('FB-LZ2WJ9CJ-A7B3D9F2H4J6K8M1');
// 返回: true
```

## 安全设计

### 1. 追踪ID安全

- **格式校验**：严格的正则表达式验证
- **归属校验**：多维度匹配（追踪ID + 邮箱）
- **不可预测**：加密安全的随机字符串

### 2. 权限控制

- **登录验证**：敏感操作需要登录
- **归属验证**：只能操作自己的反馈和附件
- **URL校验**：附件删除时验证文件归属

### 3. 数据验证

- **Zod 校验**：提交数据严格验证
- **类型检查**：TypeScript 类型安全
- **大小限制**：文件大小和数量限制

## 使用示例

### 完整反馈提交流程

```typescript
import { submitFeedback, uploadFeedbackFiles } from '@/lib/feedback/actions';
import { addTrackingId } from '@/lib/feedback/storage';

async function handleSubmit(formData: FormData, files: File[]) {
  // 1. 上传附件
  const uploadResults = await uploadFeedbackFiles(
    files.map((file, index) => ({ id: String(index), file }))
  );
  
  const attachments = uploadResults
    .filter(r => r.success)
    .map(r => r.fileToken!);
  
  // 2. 提交反馈
  const result = await submitFeedback({
    type: formData.get('type') as string,
    description: formData.get('description') as string,
    attachments,
  });
  
  // 3. 保存追踪ID
  if (result.success && result.trackingId) {
    addTrackingId(result.trackingId);
  }
  
  return result;
}
```

### 查询用户反馈列表

```typescript
import { getFeedbacksByTrackingIds } from '@/lib/feedback/actions';
import { getTrackingIds } from '@/lib/feedback/storage';

async function loadUserFeedbacks() {
  // 获取本地保存的追踪ID
  const trackingIds = getTrackingIds();
  
  if (trackingIds.length === 0) {
    return [];
  }
  
  // 查询反馈列表
  const result = await getFeedbacksByTrackingIds(trackingIds);
  
  if (result.success) {
    return result.data;
  }
  
  return [];
}
```

## 数据流

```
用户提交反馈
    │
    ▼
[Client] 上传附件 → 飞书 Drive API
    │
    ▼
[Client] 提交反馈数据
    │
    ▼
[Server Action] 数据验证 (Zod)
    │
    ▼
[Server Action] 生成追踪ID
    │
    ▼
[Server Action] 写入飞书多维表格
    │
    ▼
[Client] 保存追踪ID到 localStorage
```

## 依赖模块

- [飞书库](../feishu/README.md) - 飞书 API 调用
- [Supabase库](../supabase/README.md) - 用户认证和评论存储
- [类型定义](../../types/README.md) - Feedback 相关类型
- [消息常量](../messages/README.md) - 反馈相关消息文本

## 类型定义

主要类型定义位于 `types/feedback.ts`：

```typescript
interface Feedback {
  id: string;
  type: 'bug' | 'suggestion' | 'ui' | 'other';
  description: string;
  status: 'pending' | 'processing' | 'resolved';
  trackingId: string;
  createdAt: string;
  // ...
}

interface FeedbackInput {
  type: Feedback['type'];
  description: string;
  attachments?: string[];
}

interface FeedbackSubmitResult {
  success: boolean;
  trackingId?: string;
  error?: string;
}
```

## 注意事项

1. **Client/Server 分离**：`storage.ts` 是 Client 端代码，不能在 Server Actions 中使用
2. **文件大小限制**：上传前在 Client 端做好文件大小检查
3. **错误处理**：所有 Server Actions 都返回统一格式的结果对象
4. **追踪ID保存**：提交成功后务必保存追踪ID，否则无法查询反馈
