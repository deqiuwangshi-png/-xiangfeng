# 飞书多维表格模块 (Feishu Module)

## 概述

飞书模块提供与飞书开放平台 API 的集成能力，主要用于将用户反馈数据同步到飞书多维表格。模块采用分层架构设计，包含认证、请求、数据转换等完整功能链。

## 核心特性

- **完整的 OAuth 认证**: 自动获取和缓存 tenant_access_token
- **多维表格操作**: 创建记录、更新状态、查询记录
- **文件上传**: 支持附件上传到飞书云文档
- **数据映射**: 系统数据与飞书字段的双向转换
- **类型安全**: 完整的 TypeScript 类型定义

## 项目结构

```
lib/feishu/
├── index.ts                    # 统一导出入口（类型和非 Server Action）
├── api.ts                      # Server Actions 导出入口
├── config.ts                   # 配置常量
├── types.ts                    # 类型定义
├── base.ts                     # Base ID 管理
├── auth.ts                     # 访问令牌管理
├── client.ts                   # HTTP 客户端封装
├── record.ts                   # 记录 CRUD 操作
├── file.ts                     # 文件上传
└── transform.ts                # 数据转换逻辑
```

## 环境配置

在项目根目录创建 `.env.local` 文件，配置以下环境变量：

```bash
# 飞书应用配置
FEISHU_APP_ID=cli_xxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_BASE_ID=basXXXXXXXXXXXX
```

### 配置项说明

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| `FEISHU_APP_ID` | 飞书应用 ID | 飞书开放平台 → 应用详情 |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | 飞书开放平台 → 应用详情 → 凭证 |
| `FEISHU_BASE_ID` | 多维表格 Base ID | 打开多维表格 → 复制链接 → 提取 bas 开头的字符串 |

## 快速开始

### 导入 Server Actions

```typescript
import { 
  createFeishuFeedback,
  updateFeishuFeedbackStatus,
  queryFeishuFeedbacks,
  uploadFileToFeishu,
  testFeishuConnection
} from '@/lib/feishu/api'
```

### 导入类型和工具函数

```typescript
import { 
  FeishuFeedbackData,
  FeedbackItem,
  FEISHU_CONFIG,
  FIELD_MAPPING,
  getAccessToken,
  feishuRequest
} from '@/lib/feishu'
```

## 核心功能

### 1. 认证管理 (auth.ts)

#### 获取访问令牌

```typescript
import { getAccessToken, clearTokenCache } from '@/lib/feishu'

// 获取令牌（自动缓存）
const token = await getAccessToken()

// 清除缓存（测试用）
await clearTokenCache()
```

**特性**:
- 自动缓存令牌（提前 5 分钟过期）
- 使用 `tenant_access_token` 进行应用级认证
- 错误处理和日志记录

---

### 2. HTTP 客户端 (client.ts)

#### 发送 API 请求

```typescript
import { feishuRequest, feishuRequestWithFormData } from '@/lib/feishu'

// JSON 请求
const result = await feishuRequest('/bitable/v1/apps/{app_token}/tables', {
  method: 'GET'
})

// FormData 请求（文件上传）
const result = await feishuRequestWithFormData('/drive/v1/medias/upload_all', formData)
```

**特性**:
- 自动添加认证头
- 统一错误处理
- 支持查询参数
- 完整的类型支持

---

### 3. 记录操作 (record.ts)

#### 创建反馈记录

```typescript
import { createFeishuFeedback } from '@/lib/feishu/api'

const result = await createFeishuFeedback({
  type: 'bug',
  description: '发现了一个 Bug',
  userId: 'user-123',
  userEmail: 'user@example.com',
  status: 'pending',
  attachments: ['file_token_1', 'file_token_2'],
  trackingId: 'track-123'
})

if (result.success) {
  console.log('记录ID:', result.recordId)
} else {
  console.error('错误:', result.error)
}
```

#### 更新记录状态

```typescript
import { updateFeishuFeedbackStatus } from '@/lib/feishu/api'

const result = await updateFeishuFeedbackStatus('record_id', 'completed')
```

#### 查询反馈记录

```typescript
import { queryFeishuFeedbacks } from '@/lib/feishu/api'

const result = await queryFeishuFeedbacks({
  pageSize: 20,
  filter: {
    field: '状态',
    operator: 'is',
    value: '待处理'
  }
})

if (result.success) {
  console.log('记录数:', result.total)
  console.log('数据:', result.items)
}
```

#### 测试连接

```typescript
import { testFeishuConnection } from '@/lib/feishu/api'

const result = await testFeishuConnection()
if (result.success) {
  console.log('表格名称:', result.tableName)
}
```

---

### 4. 文件上传 (file.ts)

#### 上传文件

```typescript
import { uploadFileToFeishu } from '@/lib/feishu/api'

const fileInput = document.getElementById('file') as HTMLInputElement
const file = fileInput.files?.[0]

if (file) {
  const result = await uploadFileToFeishu(file)
  if (result.success) {
    console.log('文件 Token:', result.fileToken)
  }
}
```

**特性**:
- 验证文件有效性
- 自动获取 Base ID 作为 parent_node
- 使用飞书云文档素材上传接口
- 返回 file_token 用于关联记录

---

### 5. 数据转换 (transform.ts)

#### 提取字段值

```typescript
import { extractFieldValue, extractAttachments } from '@/lib/feishu'

// 从飞书字段中提取文本
const text = await extractFieldValue(record.fields['描述'])

// 提取附件列表
const attachments = await extractAttachments(record.fields['附件'])
```

#### 类型/状态映射

```typescript
import { 
  getFeishuTypeOption, 
  getFeishuStatusOption,
  getSystemStatus 
} from '@/lib/feishu'

// 系统类型 -> 飞书选项
const feishuType = await getFeishuTypeOption('bug') // 'Bug反馈'

// 系统状态 -> 飞书选项
const feishuStatus = await getFeishuStatusOption('pending') // '待处理'

// 飞书选项 -> 系统状态
const systemStatus = await getSystemStatus('已完成') // 'completed'
```

#### 记录转换

```typescript
import { convertFeishuRecordToFeedbackItem } from '@/lib/feishu'

const feedbackItem = await convertFeishuRecordToFeedbackItem(feishuRecord)
```

## 配置常量

### FEISHU_CONFIG

```typescript
import { FEISHU_CONFIG } from '@/lib/feishu'

// 应用配置
FEISHU_CONFIG.APP_ID        // 应用 ID
FEISHU_CONFIG.APP_SECRET    // 应用密钥
FEISHU_CONFIG.BASE_ID       // 多维表格 Base ID
FEISHU_CONFIG.TABLE_ID      // 表格 ID
FEISHU_CONFIG.API_BASE      // API 基础地址
```

### 字段映射 (FIELD_MAPPING)

```typescript
import { FIELD_MAPPING } from '@/lib/feishu'

FIELD_MAPPING.TRACKING_ID   // '追踪ID'
FIELD_MAPPING.TYPE          // '反馈类型'
FIELD_MAPPING.DESCRIPTION   // '描述'
FIELD_MAPPING.USER_ID       // '用户ID'
FIELD_MAPPING.USER_EMAIL    // '用户邮箱'
FIELD_MAPPING.STATUS        // '状态'
FIELD_MAPPING.CREATED_AT    // '提交时间'
FIELD_MAPPING.ATTACHMENTS   // '附件'
```

### 类型映射 (TYPE_MAPPING)

```typescript
import { TYPE_MAPPING } from '@/lib/feishu'

TYPE_MAPPING.bug        // 'Bug反馈'
TYPE_MAPPING.suggestion // '功能改进'
TYPE_MAPPING.ui         // '界面优化'
TYPE_MAPPING.other      // '其他'
```

### 状态映射 (STATUS_MAPPING)

```typescript
import { STATUS_MAPPING } from '@/lib/feishu'

STATUS_MAPPING.pending    // '待处理'
STATUS_MAPPING.processing // '处理中'
STATUS_MAPPING.completed  // '已完成'
```

## 类型定义

### FeishuFeedbackData

```typescript
interface FeishuFeedbackData {
  type: FeedbackType           // 反馈类型
  description: string          // 描述
  userId?: string              // 用户ID
  userEmail?: string           // 用户邮箱
  status?: FeedbackStatus      // 状态
  attachments?: string[]       // 附件 file_token 数组
  trackingId?: string          // 追踪ID
}
```

### FeedbackItem

```typescript
interface FeedbackItem {
  id: string                   // 记录ID
  userId: string               // 用户ID
  userEmail: string            // 用户邮箱
  trackingId: string           // 追踪ID
  description: string          // 描述
  date: string                 // 提交日期
  status: FeedbackStatus       // 状态
  statusText: string           // 状态文本
  pageId: string               // 页面ID
  attachments?: Attachment[]   // 附件列表
}
```

### ApiResponse

```typescript
interface ApiResponse<T = unknown> {
  code: number                 // 错误码，0 表示成功
  msg: string                  // 错误消息
  data?: T                     // 响应数据
}
```

## 使用流程

### 完整的反馈提交流程

```typescript
import { uploadFileToFeishu, createFeishuFeedback } from '@/lib/feishu/api'

async function submitFeedback(formData: FormData) {
  // 1. 获取表单数据
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const files = formData.getAll('attachments') as File[]

  // 2. 上传附件
  const attachmentTokens: string[] = []
  for (const file of files) {
    const result = await uploadFileToFeishu(file)
    if (result.success && result.fileToken) {
      attachmentTokens.push(result.fileToken)
    }
  }

  // 3. 创建反馈记录
  const result = await createFeishuFeedback({
    type: type as FeedbackType,
    description,
    userId: currentUser.id,
    userEmail: currentUser.email,
    status: 'pending',
    attachments: attachmentTokens,
    trackingId: generateTrackingId()
  })

  return result
}
```

## 关联文档

### 相关组件

- [反馈中心组件文档](../../components/feedback/README.md) - 反馈提交表单、反馈列表

### 相关类型

- `@/types/feedback` - 反馈相关类型定义

### 相关服务

- `@/lib/supabase/server` - Supabase 服务端客户端（用于获取当前用户信息）

### 飞书官方文档

- [飞书开放平台](https://open.feishu.cn/)
- [多维表格 API](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)
- [云文档素材上传](https://open.feishu.cn/document/server-docs/docs/drive-v1/media/upload_all)
- [获取 tenant_access_token](https://open.feishu.cn/document/server-docs/docs/authentication-management/access-token/get_tenant_access_token)

## 最佳实践

### 1. 错误处理

```typescript
try {
  const result = await createFeishuFeedback(data)
  if (!result.success) {
    console.error('创建失败:', result.error)
    // 显示用户友好的错误消息
  }
} catch (error) {
  console.error('请求异常:', error)
}
```

### 2. 批量上传文件

```typescript
// 并行上传多个文件
const uploadPromises = files.map(file => uploadFileToFeishu(file))
const results = await Promise.all(uploadPromises)

const tokens = results
  .filter(r => r.success)
  .map(r => r.fileToken!)
```

### 3. 令牌缓存管理

```typescript
// 正常情况下不需要手动管理缓存
// 令牌会自动缓存并在过期前刷新

// 仅在测试或调试时需要清除缓存
await clearTokenCache()
```

## 故障排除

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `未配置 FEISHU_BASE_ID` | 环境变量未设置 | 检查 `.env.local` 文件 |
| `获取飞书访问令牌失败` | App ID 或 Secret 错误 | 检查应用凭证 |
| `飞书API错误` | API 调用参数错误 | 检查请求参数和权限 |
| `文件为空或无效` | 文件未正确选择 | 验证文件输入 |

### 调试模式

```typescript
// 启用详细日志
console.log('当前配置:', FEISHU_CONFIG)

// 测试连接
const result = await testFeishuConnection()
console.log('连接测试结果:', result)
```

## 更新记录

- **2026-03-29**: 完善文档，添加关联文档链接
- **2026-03-15**: 添加文件上传功能
- **2026-03-01**: 优化数据转换逻辑
- **2026-02-20**: 初始版本，基础 CRUD 功能

## 统计信息

- **Server Actions**: 5个
- **工具函数**: 10+
- **类型定义**: 8个
- **配置常量**: 4组
- **最后更新**: 2026-03-29
