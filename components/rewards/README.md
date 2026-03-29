# 福利中心组件化架构

## 概述

福利中心模块采用 Next.js 组件化架构，结合 Server Component 和 Client Component，实现高性能、可维护的积分系统。包含签到、任务中心、积分商城、兑换记录等功能。

## 项目结构

### 页面文件

```
app/(main)/rewards/
├── page.tsx                    # 福利中心主页面
├── tasks/
│   └── page.tsx                # 任务中心页面
├── shop/
│   ├── page.tsx                # 积分商城页面
│   ├── loading.tsx             # 商城加载状态
│   └── error.tsx               # 商城错误处理
└── my/
    └── page.tsx                # 我的兑换/历史记录页面
```

### 组件文件

```
components/rewards/
├── index.ts                    # 组件统一导出
├── README.md                   # 组件文档
├── RwClient.tsx                # 客户端组件集合
├── overview/                   # 积分总览组件
│   ├── PtOverview.tsx          # 积分总览卡片
│   └── PtLevel.tsx             # 积分等级卡片
├── signin/                     # 签到组件
│   └── SignCard.tsx            # 签到卡片
├── tasks/                      # 任务中心组件
│   ├── TaskBoard.tsx           # 任务中心面板
│   ├── TasksHeader.tsx         # 任务中心头部
│   ├── TasksServerList.tsx     # 服务端任务列表
│   ├── CategoryNavClient.tsx   # 分类导航（URL参数版）
│   └── TaskActionButton.tsx    # 任务操作按钮
├── shop/                       # 积分商城组件
│   ├── ShopGrid.tsx            # 商城网格（首页）
│   ├── ShopCategoryNav.tsx     # 分类导航（URL参数版）
│   ├── ShopServerGrid.tsx      # 服务端商城网格
│   ├── ShopHeader.tsx          # 商城头部
│   └── ShopExchangeButton.tsx  # 兑换按钮
├── my/                         # 我的兑换组件
│   ├── MyRw.tsx                # 我的兑换（首页预览）
│   ├── RwCenter.tsx            # 历史记录主组件
│   ├── RwRecord.tsx            # 兑换记录
│   ├── PtRecord.tsx            # 积分记录
│   ├── MyRewardsHeader.tsx     # 我的福利头部
│   ├── MyRewardsTabNav.tsx     # Tab导航
│   ├── PtRecordServer.tsx      # 积分记录（服务端）
│   ├── RwRecordServer.tsx      # 兑换记录（服务端）
│   ├── constants.ts            # 常量配置
│   └── utils.ts                # 工具函数
```

### 相关 Hooks

```
hooks/rewards/
├── usePoints.ts                # 积分管理 Hook
├── useSignIn.ts                # 签到管理 Hook
├── useTasks.ts                 # 任务管理 Hook
├── useShop.ts                  # 商城管理 Hook
└── useExchangeRecords.ts       # 兑换记录 Hook
```

## 组件说明

### 核心容器组件

#### 1. RwClient（客户端组件集合）

**位置**: `RwClient.tsx`

**职责**: 福利中心客户端组件，管理状态和交互

**功能**:
- 签到卡片区域
- 任务中心区域
- 兑换商城区域
- 我的兑换区域

**使用示例**:
```tsx
<SignCardSection />
<TaskBoardSection userPoints={pointsData.current} />
<ShopGridSection userPoints={pointsData.current} />
<MyRwSection />
```

### 积分总览组件

#### 2. PtOverview（积分总览组件）

**位置**: `overview/PtOverview.tsx`

**职责**: 显示用户当前积分、累计获得和已兑换积分

**功能**:
- Server Component 服务端渲染
- 当前积分显示
- 累计获得积分
- 已兑换积分

**使用示例**:
```tsx
<PtOverview
  points={1000}
  totalEarned={5000}
  totalSpent={4000}
/>
```

#### 3. PtLevel（积分等级组件）

**位置**: `overview/PtLevel.tsx`

**职责**: 显示用户当前积分等级和升级进度

**功能**:
- 12级认知探索体系
- 等级名称和描述
- 升级进度条
- 下一等级所需积分

**等级体系**:
1. 边界旅人 (0-499)
2. 渡口行者 (500-1499)
3. 跨界渡客 (1500-3999)
4. 脉络测绘师 (4000-9999)
5. 深度潜航员 (10000-24999)
6. 联结建筑师 (25000-59999)
7. 迷雾破译者 (60000-139999)
8. 范式探险家 (140000-299999)
9. 认知策展人 (300000-599999)
10. 思想炼金师 (600000-1199999)
11. 边界重塑者 (1200000-2499999)
12. 改变发生者 (2500000+)

**使用示例**:
```tsx
<PtLevel totalEarned={5000} />
```

### 签到组件

#### 4. SignCard（签到卡片组件）

**位置**: `signin/SignCard.tsx`

**职责**: 显示连续签到天数、今日签到按钮和7天日历预览

**功能**:
- 连续签到天数显示
- 7天日历预览
- 今日签到按钮
- 签到奖励配置

**使用示例**:
```tsx
<SignCard
  isSigned={false}
  signDays={3}
  rewardsConfig={rewardsConfig}
  isSigning={false}
  onSign={handleSignIn}
/>
```

### 任务中心组件

#### 5. TaskBoard（任务中心组件）

**位置**: `tasks/TaskBoard.tsx`

**职责**: 显示每日、每周、成就任务列表

**功能**:
- 任务列表展示
- 任务进度显示
- 领取奖励
- 接取任务

**使用示例**:
```tsx
<TaskBoard />
```

#### 6. TasksHeader（任务中心头部组件）

**位置**: `tasks/TasksHeader.tsx`

**职责**: 任务中心页面头部，服务端渲染静态内容

**功能**:
- 页面标题
- 返回链接
- 当前积分显示
- 今日状态卡片

**使用示例**:
```tsx
<TasksHeader currentPoints={1000} />
```

#### 7. TasksServerList（服务端任务列表组件）

**位置**: `tasks/TasksServerList.tsx`

**职责**: 服务端渲染任务列表

**功能**:
- 服务端获取任务数据
- 分类筛选
- 与 TaskActionButton 配合

**使用示例**:
```tsx
<TasksServerList tasks={tasks} />
```

#### 8. CategoryNavClient（分类导航组件）

**位置**: `tasks/CategoryNavClient.tsx`

**职责**: 任务分类导航，使用URL参数进行筛选

**功能**:
- 分类筛选
- URL参数同步
- 支持浏览器前进/后退

**使用示例**:
```tsx
<CategoryNavClient activeCategory={category} />
```

#### 9. TaskActionButton（任务操作按钮组件）

**位置**: `tasks/TasksHeader.tsx`

**职责**: 任务中心页面头部，服务端渲染静态内容

**功能**:
- 页面标题
- 返回链接
- 当前积分显示
- 今日状态卡片

**使用示例**:
```tsx
<TasksHeader currentPoints={1000} />
```

#### 9. TaskActionButton（任务操作按钮组件）

**位置**: `tasks/TaskActionButton.tsx`

**职责**: 处理任务接取、领取奖励等交互操作

**功能**:
- 接取任务
- 领取奖励
- 状态显示
- 加载状态

**使用示例**:
```tsx
<TaskActionButton
  taskId="task-123"
  status="completed"
  rewardPoints={10}
/>
```

### 积分商城组件

#### 10. ShopGrid（兑换商城组件）

**位置**: `shop/ShopGrid.tsx`

**职责**: 福利中心首页的兑换商城卡片组件

**功能**:
- 商品网格展示（前6个）
- 积分检查
- 兑换功能（预留）
- 加载状态

**使用示例**:
```tsx
<ShopGrid userPoints={1000} />
```

#### 11. ShopCategoryNav（分类导航组件）

**位置**: `shop/ShopCategoryNav.tsx`

**职责**: 积分商城分类导航，使用URL参数进行筛选

**功能**:
- 分类筛选
- URL参数同步
- 支持浏览器前进/后退

**使用示例**:
```tsx
<ShopCategoryNav activeCategory={category} />
```

#### 12. ShopServerGrid（服务端商城网格组件）

**位置**: `shop/ShopServerGrid.tsx`

**职责**: 服务端渲染商品列表

**功能**:
- 服务端获取数据
- 分类筛选
- 与ShopExchangeButton配合

**使用示例**:
```tsx
<ShopServerGrid category={category} userPoints={currentPoints} />
```

#### 13. ShopExchangeButton（商品兑换按钮组件）

**位置**: `shop/ShopExchangeButton.tsx`

**职责**: 处理商品兑换交互

**功能**:
- 积分检查
- 确认对话框
- 兑换处理
- 积分刷新

**使用示例**:
```tsx
<ShopExchangeButton
  itemId="item-123"
  itemName="商品名称"
  pointsCost={100}
  userPoints={1000}
  canAfford={true}
/>
```

### 我的兑换组件

#### 14. MyRw（我的兑换组件）

**位置**: `my/MyRw.tsx`

**职责**: 显示用户已兑换的物品列表（首页预览）

**功能**:
- 兑换记录列表
- 图标映射
- 状态显示
- 空状态处理

**使用示例**:
```tsx
<MyRw />
```

#### 15. RwCenter（历史记录主组件）

**位置**: `my/RwCenter.tsx`

**职责**: 管理积分记录和兑换记录的Tab切换

**功能**:
- Tab切换
- 积分记录
- 兑换记录
- 返回链接

**使用示例**:
```tsx
<RwCenter />
```

#### 16. PtRecord（积分记录组件）

**位置**: `my/PtRecord.tsx`

**职责**: 显示用户的积分获得和消耗记录，支持筛选和分页

**功能**:
- 积分记录列表
- 筛选（全部/获得/消耗）
- 分页
- 来源图标

**使用示例**:
```tsx
<PtRecord />
```

#### 17. RwRecord（兑换记录组件）

**位置**: `my/RwRecord.tsx`

**职责**: 显示用户的兑换记录

**功能**:
- 兑换记录列表
- 商品信息
- 兑换状态
- 分页

**使用示例**:
```tsx
<RwRecord />
```

## 自定义 Hooks

### usePoints（积分管理 Hook）

**位置**: `@/hooks/rewards/usePoints.ts`

**职责**: 管理用户积分总览和积分流水

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { usePoints } from '@/hooks';

// 方式二：从分类路径导入
import { usePoints } from '@/hooks/rewards/usePoints';
```

**功能**:
- 积分总览获取
- 积分流水获取
- 数据刷新
- 加载更多

**SWR 配置**:
- 积分总览：5分钟去重
- 积分流水：30秒去重

**使用示例**:
```tsx
const { overview, transactions, isLoading, refreshPoints } = usePoints()
```

### useSignIn（签到管理 Hook）

**位置**: `@/hooks/rewards/useSignIn.ts`

**职责**: 管理签到状态、签到操作和奖励配置

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { useSignIn } from '@/hooks';

// 方式二：从分类路径导入
import { useSignIn } from '@/hooks/rewards/useSignIn';
```

**功能**:
- 签到状态获取
- 签到操作
- 奖励配置获取
- 防重放攻击（nonce）

**使用示例**:
```tsx
const { isSigned, consecutiveDays, handleSignIn } = useSignIn()
```

### useTasks（任务管理 Hook）

**位置**: `@/hooks/rewards/useTasks.ts`

**职责**: 管理用户任务数据

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { useTasks } from '@/hooks';

// 方式二：从分类路径导入
import { useTasks } from '@/hooks/rewards/useTasks';
```

**功能**:
- 任务列表获取
- 领取奖励
- 接取任务
- 防止重复请求

**使用示例**:
```tsx
const { tasks, isLoading, claimReward, accept } = useTasks()
```

### useShop（商城管理 Hook）

**位置**: `@/hooks/rewards/useShop.ts`

**职责**: 管理积分商城商品数据

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { useShop } from '@/hooks';

// 方式二：从分类路径导入
import { useShop } from '@/hooks/rewards/useShop';
```

**功能**:
- 商品列表获取
- 商品兑换
- 分类筛选

**使用示例**:
```tsx
const { items, isLoading, exchange } = useShop()
```

### useExchangeRecords（兑换记录 Hook）

**位置**: `@/hooks/rewards/useExchangeRecords.ts`

**职责**: 管理用户兑换记录

**导入方式**:
```typescript
// 方式一：从统一入口导入
import { useExchangeRecords } from '@/hooks';

// 方式二：从分类路径导入
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords';
```

**功能**:
- 兑换记录获取
- 分页加载
- 状态筛选

**使用示例**:
```tsx
const { records, isLoading, loadMore } = useExchangeRecords()
```

## 页面组件

### 福利中心主页面

**位置**: `app/(main)/rewards/page.tsx`

**职责**: 福利中心主页面入口

**功能**:
- 用户身份验证
- 积分数据获取
- 组件组合渲染

**组件组合**:
```
RewardsPage (Server Component)
├── PtOverview (Server)
├── PtLevel (Server)
├── SignCardSection (Client)
├── TaskBoardSection (Client)
├── ShopGridSection (Client)
└── MyRwSection (Client)
```

### 任务中心页面

**位置**: `app/(main)/rewards/tasks/page.tsx`

**职责**: 任务中心页面入口

### 积分商城页面

**位置**: `app/(main)/rewards/shop/page.tsx`

**职责**: 积分商城页面入口

### 我的兑换页面

**位置**: `app/(main)/rewards/my/page.tsx`

**职责**: 我的兑换/历史记录页面入口

## 组件层次结构

```
RewardsPage (Server Component)
├── PtOverview (Server)
├── PtLevel (Server)
├── SignCardSection (Client)
│   └── SignCard
├── TaskBoardSection (Client)
│   └── TaskBoard
│       ├── TasksHeader
│       ├── CategoryNav
│       └── TaskList
│           └── TaskActionButton
├── ShopGridSection (Client)
│   └── ShopGrid
└── MyRwSection (Client)
    └── MyRw

TasksPage (Server Component)
├── TasksHeader (Server)
├── CategoryNavClient (Client)
├── TasksServerList (Server)
│   └── TaskActionButton (Client)
└── ...

ShopPage (Server Component)
├── ShopHeader (Server)
├── ShopCategoryNav (Client)
├── ShopServerGrid (Server)
│   └── ShopExchangeButton (Client)
└── ...

MyPage (Server Component)
└── RwCenter (Client)
    ├── PtRecord
    └── RwRecord
```

## 设计原则

### 1. 职责分离
- **Server Component**: 页面结构、静态内容、数据获取
- **Client Component**: 交互逻辑、状态管理、动态内容
- **Hooks**: 数据获取、状态管理、业务逻辑

### 2. 性能优化
- Server Component 优先渲染
- SWR 缓存优化
- 骨架屏优化感知性能
- 分页加载

### 3. 状态管理
- 使用 SWR 管理服务器状态
- 使用 useState 管理本地状态
- 单一数据源原则

### 4. 用户体验
- 流畅的动画过渡
- 清晰的加载状态
- 友好的错误提示
- 防重复提交

## 安全特性

### 防重放攻击
- 签到使用 nonce 令牌
- 打赏使用 nonce 令牌
- 兑换使用 nonce 令牌

### 积分安全
- 服务端验证积分充足
- 事务处理保证一致性
- 积分过期机制

## 数据流

```
Server Component (获取初始数据)
  ↓
Client Component (通过 Hooks 获取数据)
  ↓
SWR (缓存和重新验证)
  ↓
用户交互
  ↓
Server Action / API 调用
  ↓
SWR 重新验证
  ↓
UI 更新
```

## 样式规范

### 设计风格
- Swiss Style：浅灰色背景 + 深色文字
- 卡片式布局
- 圆角设计

### 颜色使用
- 使用项目定义的颜色变量（`--color-xf-*`）
- 主色调：xf-primary
- 强调色：xf-accent

## 更新时间

2026-03-29
