# 头像维护手册（开发者版）

本文档用于指导后续开发者维护头像功能，目标是：稳定、安全、可追踪。

## 1. 先理解“为什么这样设计”

1. 主数据源只有一个：`profiles.avatar_url`

- 大白话：页面展示头像时，最终以 `profiles` 表为准，避免多处写多处读造成“头像不一致”。

1. `user_metadata.avatar_url` 只是兼容兜底

- 大白话：有些旧组件还会读 metadata，但它不是“真相”，只是备用。

1. 上传和保存分两步

- 大白话：先把图片传到存储拿到 URL（可预览），再点击“保存”才写入用户资料。

1. Storage 操作使用管理员客户端，但必须先鉴权并校验归属

- 大白话：上传绕过 RLS 抖动问题，但我们自己做“你只能操作你自己的目录”安全门槛。

## 2. 头像链路总览（从用户点击到页面更新）

1. 用户选择文件（设置页）

- 入口：`components/settings/_forms/EditProfileForm.tsx`

1. 前端 Hook 接收文件并调用上传

- 入口：`hooks/settings/useProfileForm.ts` 的 `uploadAvatar(file)`

1. 服务端验证并上传到 Storage

- 入口：`lib/upload/actions.ts` 的 `uploadAvatarAction(formData)`
- 做的事：鉴权、类型/大小/Magic Bytes 校验、生成路径、上传、返回 URL

1. 前端显示临时预览

- 写入 `formData.avatar_url`

1. 用户点击“保存”

- 调用 `updateProfile`
- 入口：`lib/user/updateProfile.ts`
- 结果：写 `profiles.avatar_url`，并异步同步 metadata

1. 全局 UI 同步

- 事件：`user-profile-updated`
- 监听：`components/providers/AuthProvider.tsx`

## 3. 关键约束（改代码前必看）

1. 文件路径规则必须是：`{userId}/xxx.ext`

- 原因：策略和归属校验都依赖第一层目录是用户 ID。

1. 删除头像必须校验 ownerFolder

- 已实现：`deleteAvatarAction` 内 `ownerFolder === user.id`。

1. 空头像约定统一为 `''`（空字符串）

- 原因：前端事件与展示组件已按该约定实现。

1. 日志只能“开发环境 + 脱敏”

- 原因：生产环境避免泄露用户信息并减少噪音。

## 4. 将来要改头像，按这套步骤走

1. **改前端选择行为**（比如支持新格式）

- 文件：`EditProfileForm.tsx` 的 `accept` 属性  
- 同步修改：`lib/upload/actions.ts` 的 `allowedTypes` 和 Magic Bytes 校验  
- 大白话：前后端都要改，只改一边会“看着能选，实际上传失败”。

1. **改上传策略**（大小、bucket、命名）

- 文件：`lib/upload/actions.ts`  
- 检查点：  
  - `UPLOAD_CONFIG`  
  - `generateAvatarFileName`  
  - 归属校验逻辑是否仍成立

1. **改保存字段**（如扩展头像元信息）

- 文件：`lib/user/updateProfile.ts`、`types/user/settings.ts`  
- 要求：`profiles` 仍是唯一主源。

1. **改展示规则**（默认图、回退策略）

- 文件：`components/ui/UserAvt.tsx`、`lib/user/avatar.ts`  
- 要求：保持统一入口，不要在业务组件里散落头像判断逻辑。

1. **改同步机制**（跨组件即时更新）

- 文件：`useProfileForm.ts`（dispatch）和 `AuthProvider.tsx`（listener）  
- 注意：处理空值时不能用 `||` 吞掉 `''`。

## 5. 常见故障排查（按顺序）

1. 前端报“头像上传失败，请稍后重试”

- 先看服务端日志中的 `[avatar-upload][storage-upload-failed]`

1. 如果是 RLS 403

- 检查是否真在操作 `touxiang` 桶  
- 检查 `fileName` 第一层目录是否等于当前 `user.id`

1. 如果上传成功但刷新后头像没变

- 可能没点保存（只上传了临时预览）  
- 检查 `updateProfile` 是否成功写入 `profiles.avatar_url`

1. 如果清空头像后仍显示旧图

- 检查 `AuthProvider` 是否按“字段是否存在”更新，而非 `detail.avatar_url || prev`

## 6. 安全清单（上线前自查）

1. 不在客户端导入 `createAdminClient`  
2. 不输出原始文件名、完整 userId、token/cookie  
3. 删除逻辑必须校验目录归属  
4. 只允许白名单类型和大小  
5. 头像 URL 展示必须走 `normalizeAvatarUrl`

## 7. 改动后的最小回归测试

1. 上传 png 成功并预览  
2. 点击保存后刷新，头像保持  
3. 清空头像后保存，刷新显示首字母  
4. A 用户不能删除 B 用户头像路径  
5. 生产模式下不出现调试日志