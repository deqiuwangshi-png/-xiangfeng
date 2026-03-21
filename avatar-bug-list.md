# 用户头像统一性检查（BUG清单 + 方案 + 涉及文件）

日期：2026-03-20

## BUG 1：头像兜底策略不统一（有的页面显示默认 Dicebear，有的页面显示首字母）
- 现象
  - `getUserDisplayInfo` 在无头像时会 fallback 到 `getAvtUrl(user.id)`，即默认 Dicebear 头像。
  - `UserProfileSection` 在无头像时不生成默认头像，直接交给 `AvatarPlaceholder` 显示首字母。
- 影响
  - 同一用户在不同页面可能出现“图像头像/首字母头像”切换，不满足“全局统一头像”。
- 方案
  1. 统一头像决策入口：所有 UI 组件改用同一个 helper（建议 `getUserDisplayInfo` 或新增 `resolveAvatarUrl(user, profile)`）。
  2. 明确规则：无 `avatar_url` 时，统一回退 `getAvtUrl(user.id)`（不是首字母）。
- 文件
  - `lib/user/getUserDisplayInfo.ts`
  - `components/user/UserProfileSection.tsx`
  - `components/ui/AvatarPlaceholder.tsx`

## BUG 2：用户可保存任意头像 URL，可能导致跨页面加载失败
- 现象
  - `updateProfile` 对 `avatar_url` 未做来源白名单/格式校验，允许任意 URL 入库。
  - `next/image` 仅允许 `dicebear.com` / `*.supabase.co` / `*.supabase.in`，其他域名会在页面渲染时失败。
- 影响
  - 头像在“可保存但不可显示”的状态下出现破图/回退，形成非确定性体验。
- 方案
  1. 在服务端 `updateProfile` 增加 URL 校验（仅允许 Dicebear + Supabase Storage）。
  2. 对非法 URL 自动替换为 `getAvtUrl(user.id)` 并提示用户。
- 文件
  - `lib/user/updateProfile.ts`
  - `next.config.ts`
  - `components/ui/AvatarPlaceholder.tsx`

## BUG 3：注册后头像写入存在“双写不同步”窗口
- 现象
  - 注册时分别写 `profiles.avatar_url` 与 `auth.user_metadata.avatar_url`。
  - 其中一个写入失败不会回滚另一个写入。
- 影响
  - 某些组件读 profile、某些组件读 metadata 时会出现头像不一致。
- 方案
  1. 将 `profiles.avatar_url` 设为唯一真源（SSOT），前端统一只读 profile。
  2. metadata 仅做冗余缓存时，增加定时/登录时一致性修复任务。
- 文件
  - `lib/auth/actions/register.ts`
  - `components/user/UserProfileSection.tsx`
  - `lib/user/getUserDisplayInfo.ts`

## BUG 4：文章/评论作者头像存在“空值即首字母”的分叉策略
- 现象
  - 文章和评论查询在 `avatar_url` 为空时返回 `undefined`，最终由 `AvatarPlaceholder` 显示首字母。
  - 这与“全局统一头像为固定默认图”的目标冲突。
- 影响
  - 内容系统里作者头像表现不一致，尤其老数据（未补头像）会大量出现首字母。
- 方案
  1. 在查询映射层统一兜底：`avatar = avatar_url || getAvtUrl(user_id)`。
  2. 或在展示层统一处理（推荐查询层，避免各组件重复逻辑）。
- 文件
  - `lib/articles/queries/article.ts`
  - `lib/articles/queries/comment.ts`
  - `lib/articles/actions/query.ts`

## BUG 5：存在“修复脚本”但未纳入自动流程，历史脏数据会长期存在
- 现象
  - 项目有 `fixAllUserAvatars` / `checkAvatarConsistency`，但未接入定时任务或管理后台入口。
- 影响
  - 历史用户头像不一致问题无法自动收敛，需要人工触发。
- 方案
  1. 增加管理员入口（仅 admin）触发一次性修复。
  2. 增加定时校验任务（每日）并输出修复统计。
- 文件
  - `lib/user/actions/fixAvatars.ts`

## BUG 6：营销页使用独立头像风格，和主站用户头像规范不一致
- 现象
  - `CreatorsSection` 使用 `notionists` 风格，而系统头像规范是 `micah`。
- 影响
  - 视觉层“头像规范不统一”，虽然不是账户数据错误，但用户感知上不一致。
- 方案
  1. 若营销页也需统一，改为同一风格（micah + 同背景色规范）。
  2. 若保留差异，需在设计规范里明确“营销头像不属于用户头像体系”。
- 文件
  - `components/marketing/CreatorsSection.tsx`
  - `lib/utils/getAvtUrl.ts`

---

## 建议落地顺序（高 -> 低）
1. BUG 1 + BUG 2（直接影响线上头像一致性与可用性）
2. BUG 3 + BUG 4（统一数据源与内容系统展示）
3. BUG 5 + BUG 6（治理与设计规范完善）
