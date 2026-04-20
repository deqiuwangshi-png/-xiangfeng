# 头像链路规范（现行）

## 目标

本页用于约束头像的存储、同步与展示规则，减少重复实现和状态漂移，保证维护成本可控。

## 唯一真源

- 主数据源：`profiles.avatar_url`
- 展示层默认只认 `profiles.avatar_url`
- `user_metadata.avatar_url` 仅作为兼容兜底字段，不作为主展示源

## 写入链路

1. 客户端上传头像文件：`useProfileForm.uploadAvatar`
2. 服务端上传存储：`uploadAvatarAction`（`lib/upload/actions.ts`）
3. 提交资料保存：`useProfileForm.submit -> updateProfile`
4. `updateProfile` 先写 `profiles.avatar_url`，再异步更新 `user_metadata.avatar_url`

> 设计意图：先确保主数据源成功，再做兼容同步，不阻塞主流程。

## 事件同步规则

- 前端保存成功后通过 `window.dispatchEvent('user-profile-updated')` 推送最新头像
- 事件监听方（`AuthProvider`）必须按“字段是否存在”更新，不能用 `||` 合并空值
- 允许 `avatar_url: ''` 表示“主动清空头像”

## 空值约定

- 前端态统一使用空字符串 `''` 表示无头像
- 渲染时统一通过 `normalizeAvatarUrl` 处理，空值会回退到首字母头像

## 展示规则

- 统一头像组件入口：`components/ui/UserAvt.tsx`
- 头像 URL 统一经过 `lib/user/avatar.ts` 的安全归一化
- `UserProfileSection` 中的头像读取策略：
  - 有 `profile`：只使用 `profile.avatar_url`
  - 无 `profile`：才回退 `user.user_metadata.avatar_url`

## 维护检查清单

- 新增头像展示时，是否复用 `UserAvt`
- 新增头像读取时，是否优先 `profiles.avatar_url`
- 新增同步逻辑时，是否保留空值清空语义
- 是否避免在上传链路输出调试型文件日志