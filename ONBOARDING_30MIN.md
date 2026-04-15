# 30 分钟本地上手路线图

目标：30 分钟内完成本地可运行、理解主链路、明确首批可改动点。

## 0-5 分钟：环境准备

1. 安装依赖
  - `npm install`
2. 配置环境变量
  - 复制 `.env.local.example` 为 `.env.local`
  - 至少填写：
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL`（本地建议 `http://localhost:3000`）
3. 可选开关
  - `NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION=true`
  - `DISABLE_FORCE_HTTPS_REDIRECT=0`

## 5-10 分钟：启动顺序与基线检查

1. 启动开发服务
  - `npm run dev`
2. 基线检查（另开终端）
  - `npm run lint`
  - `npm run build`
3. 打开主页确认服务正常
  - `http://localhost:3000`

## 10-18 分钟：先看页面（按业务主链路）

1. 公开访问链路
  - `/`（营销首页）
  - `/home`（文章流，支持匿名浏览）
  - `/article/[id]`（文章详情）
2. 认证链路
  - `/login`
  - `/register`
  - `/forgot-password`
3. 登录后功能链路
  - `/publish`（发布）
  - `/drafts`（草稿）
  - `/inbox`（通知）
  - `/settings`（设置）
  - `/rewards`（积分与订阅）
  - `/profile`（当前用户主页）
  - `/profile/[userId]`（他人主页，公开资料可匿名）

## 18-25 分钟：先读文件（按理解优先级）

1. 工程入口与鉴权骨架
  - `README.md`
  - `package.json`
  - `proxy.ts`
  - `lib/supabase/middleware.ts`
  - `app/(main)/layout.tsx`
  - `config/navigation.ts`
2. 数据与认证
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `lib/auth/server.ts`
3. 关键业务页面
  - `app/(home)/home/page.tsx`
  - `app/(main)/publish/page.tsx`
  - `app/(main)/drafts/page.tsx`
  - `app/(main)/settings/page.tsx`
  - `app/(main)/profile/[userId]/page.tsx`

## 25-30 分钟：首批可改动点（低风险高收益）

1. 鉴权一致性
  - 先对照 `ROUTE_AUTH_MATRIX.md`，确保新增页面时同步更新路由规则。
2. 环境变量健壮性
  - 新增变量时同步更新 `.env.local.example` 和 `README.md`。
3. 错误与空态统一
  - 统一页面级 loading/empty/error 文案和组件样式。
4. 数据访问边界
  - 统一 `lib/*/actions` 与 `lib/*/queries` 的职责（写/读分离）。
5. 质量门禁
  - 本地保持 `lint + build` 全绿再提交。

## 附：环境变量与代码映射

- `NEXT_PUBLIC_SUPABASE_URL`
  - `lib/supabase/middleware.ts`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `lib/supabase/middleware.ts`
- `NEXT_PUBLIC_SITE_URL`
  - `components/auth/ui/OAuthButtons.tsx`
  - `lib/seo/config.ts`
  - `lib/user/updateEmail.ts`
- `NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION`
  - `constants/contentProtection.ts`
- `DISABLE_FORCE_HTTPS_REDIRECT`
  - `lib/supabase/middleware.ts`