# 路由鉴权矩阵（配置 vs 实际页面）

目的：校准 `config/navigation.ts` 与页面实现的一致性，避免“该拦未拦/误拦公开页”。

## 当前结论

- 已对齐：`/publish`、`/drafts`、`/inbox`、`/settings`、`/updates`、`/rewards`、`/profile` 需要登录。
- 已修正：`/profile/[userId]` 改为可匿名访问（公开资料），不再被 `/profile/*` 前缀误拦截。

## 规则来源

- 配置侧：`config/navigation.ts`
  - `AUTH_REQUIRED_ROUTE_PREFIXES`（前缀匹配）
  - `AUTH_REQUIRED_EXACT_ROUTES`（精确匹配）
- 执行侧：`app/(main)/layout.tsx`
  - `routeRequiresAuth(pathname)` 决定是否展示 `AuthRequiredContent`
- 页面侧：部分页面仍使用 `requireAuth()` 进行双保险

## 对照表

| 路由 | 页面文件 | 配置层要求登录 | 页面层要求登录 | 结果 |
| --- | --- | --- | --- | --- |
| `/home` | `app/(home)/home/page.tsx` | 否 | 否 | 公开访问 |
| `/publish` | `app/(main)/publish/page.tsx` | 是（前缀） | 间接（layout） | 需登录 |
| `/drafts` | `app/(main)/drafts/page.tsx` | 是（前缀） | 间接（layout） | 需登录 |
| `/inbox` | `app/(main)/inbox/page.tsx` | 是（前缀） | 是（`requireAuth()`） | 需登录 |
| `/settings` | `app/(main)/settings/page.tsx` | 是（前缀） | 是（`requireAuth()`） | 需登录 |
| `/updates` | `app/(main)/updates/page.tsx` | 是（前缀） | 否 | 需登录 |
| `/rewards` | `app/(main)/rewards/page.tsx` | 是（前缀） | 是（`requireAuth()`） | 需登录 |
| `/profile` | `app/(main)/profile/page.tsx` | 是（精确） | 是（`requireAuth()`） | 需登录 |
| `/profile/[userId]` | `app/(main)/profile/[userId]/page.tsx` | 否（不再命中） | 否（仅资料可见性检查） | 可匿名访问公开资料 |
| `/article/[id]` | `app/(content)/article/[id]/page.tsx` | 否 | 否 | 公开访问 |
| `/login` `/register` `/forgot-password` | `app/(auth)/*` | 不走 main layout | 中间件处理已登录重定向 | 未登录可访问 |

## 本次校准改动

1. 将 `config/navigation.ts` 的受保护路由拆分为：
   - 前缀路由：`/publish` `/drafts` `/inbox` `/settings` `/updates` `/rewards`
   - 精确路由：`/profile`
2. `routeRequiresAuth` 先判断精确路由，再判断前缀路由。

## 维护建议

1. 新增 `(main)` 路由时，先判定它是“精确保护”还是“前缀保护”。
2. 若存在“同前缀下既有公开页又有私有页”（如 `/profile` vs `/profile/[userId]`），优先使用精确匹配策略。
3. 每次新增页面后，更新本矩阵并做一次匿名访问回归。
