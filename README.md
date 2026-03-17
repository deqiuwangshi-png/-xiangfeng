# -相逢简介
在嘈杂的信息流中寻找深度连接。打破认知边界，构建属于你的思维网络，与志同道合者共创价值。 
深度思考者的精神家园 不止相遇 更是改变

# -产品页面
<img width="2239" height="1220" alt="image" src="https://github.com/user-attachments/assets/2d86f1a2-7766-47e9-a329-22d791eaeffb" />
<img width="2239" height="1217" alt="image" src="https://github.com/user-attachments/assets/b15e69ac-9b09-4ac9-b5b7-82cb7ea79f21" />
以上只是一部分作为演示

# -开发历程
本次项目采用Next+supabase为主，由AI帮我构建完善基本的框架页面，此仓库包含基本的技能、项目规则和相关文档，，耗时一周
宏观上这个相逢应该是从25年11月开始构建，每月一次就会重构，原因AI给出的代码埋雷太多了，容易崩溃，一直持续到26年2月份才会逐渐改善
在此期间，共计重构5次框架页面，第6次完善基本的页面，后续打算慢慢构建

# -工具搭配
以tare作为辅助工具，模型采用CLM-5，优先采用文档驱动开发，

## 文档驱动
列出产品需求文档、UI设计文档、安装与部署文档
技术规格文档、API文档、数据库文档
开发规范手册、错误规避库

# -感言
当前AI时代下，未来会出现人机协同生态开发的趋势



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 基于项目背景的安全与性能检查摘要（2026-03）

在确认问题前，先按本项目背景做审计前提：

- 该项目是「长期重构中的 Next.js + Supabase 社区产品」，当前阶段目标以“功能可用 + 风险收敛 + 逐步演进”为主，不是一次性做完所有企业级优化。
- 本次检查范围聚焦 `home / publish / drafts / inbox / rewards` 五个核心页面，重点看“是否存在高风险安全问题”“是否有明显性能瓶颈”“是否偏离 Next.js 主流实践”。

在以上背景下，当前结论如下：

- 架构方向总体合理：已采用 App Router、Server Components、Suspense、动态导入、Server Actions 与 Supabase 会话中间件，符合 Next.js 主流实践。
- 安全优先级最高的问题在消息通知模块：部分 Server Actions 基于外部参数执行查询/更新，建议在 Action 内统一以当前登录用户做资源归属校验，降低越权访问风险。
- 性能上最值得优先处理两点：
  - 发布页自动保存与跳转耦合，可能引入不必要导航与请求开销；
  - 文章管理页批量状态更新采用串行调用，数据量增大时延迟会明显上升。
- 建议执行顺序：先做通知模块鉴权与写回一致性，再优化发布页自动保存策略，最后推进批量接口与列表查询瘦身。
