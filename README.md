# 相逢 —— 深度思考者的精神家园

> 在嘈杂的信息流中寻找深度连接。打破认知边界，构建属于你的思维网络，与志同道合者共创价值。  
> **不止相遇，更是改变。**

![Product Preview 1](https://github.com/user-attachments/assets/2d86f1a2-7766-47e9-a329-22d791eaeffb)
![Product Preview 2](https://github.com/user-attachments/assets/b15e69ac-9b09-4ac9-b5b7-82cb7ea79f21)

---

## 📌 项目简介

**相逢** 是一个以“深度思考”为核心的社区实验产品。  
在这里，用户可以发布长文、管理草稿、接收消息通知、获得奖励，并与其他思考者建立有意义的连接。

本项目目前处于**早期实验阶段**，代码结构和功能仍在剧烈演进中。  
它不是稳定可用的成品，而是探索 Next.js + Supabase 全栈能力、文档驱动开发模式、以及 AI 辅助编程边界的“活样本”。

---

## 🧩 开发历程

- **首次构想**：2025年11月  
- **重构次数**：5 次完整框架重构 + 1 次页面完善（截至2026年3月）  
- **重构原因**：早期 AI 生成的代码存在较多隐藏问题（“埋雷”），导致项目频繁崩溃。从第6次迭代开始，基础页面趋于稳定。  
- **当前阶段**：功能可用但漏洞较多，适合作为学习参考，不建议直接用于生产环境。

> 本项目属于**实验性产品**，随着代码量增加，本地 AI 模型已无法一次性处理全部逻辑，存在冗余和潜在崩溃风险。**请视为参考项目而非成品。**

---

## 🛠 技术栈

| 类别         | 技术                               |
| ------------ | ---------------------------------- |
| 框架         | Next.js 16 (App Router, Turbopack) |
| 后端数据库   | Supabase (PostgreSQL + Auth + RLS) |
| 样式         | CSS Modules / Tailwind (按实际)     |
| 辅助工具     | Trae (AI 辅助)                     |
| 模型         | CLM-5、Kimi2.5                             |
| 开发模式     | **文档驱动开发**                    |

### 文档驱动开发包含以下规范

- 产品需求文档
- UI 设计文档
- 安装与部署文档
- 技术规格文档
- API 文档
- 数据库文档
- 开发规范手册
- 错误规避库

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm / bun
- Supabase 项目（本地或云端）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 安装依赖
npm install

# 配置环境变量
# 复制 .env.local.example 为 .env.local，并填入 Supabase 凭据

# 启动开发服务器
npm run dev