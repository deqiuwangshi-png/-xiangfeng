# 福利中心库 (lib/rewards)

## 目录结构

```
lib/rewards/
├── README.md           # 本文档
├── index.ts            # Actions 统一导出入口
├── points.ts           # 积分系统
├── signin.ts           # 签到系统
├── tasks.ts            # 任务系统
├── shop.ts             # 积分商城
└── reward.ts           # 文章打赏
```

## 概述

本模块提供完整的用户福利系统，包括积分管理、每日签到、任务系统、积分商城和文章打赏功能。所有操作通过 Server Actions 实现，确保数据安全和并发控制。

## 核心功能

### 1. 积分系统 (points.ts)

管理用户积分的查询、增加和扣除。

**getUserPointsOverview**

获取用户积分总览。

```typescript
import { getUserPointsOverview } from '@/lib/rewards';

const overview = await getUserPointsOverview();
// 返回: { user_id, current_points, total_earned, total_spent, ... }
```

**getPointTransactions**

获取积分流水记录。

```typescript
import { getPointTransactions } from '@/lib/rewards';

const transactions = await getPointTransactions({ limit: 20, offset: 0 });
// 返回: PointTransaction[]
```

**getExpiringPoints**

获取即将过期的积分数量（7天内）。

```typescript
import { getExpiringPoints } from '@/lib/rewards';

const expiring = await getExpiringPoints();
// 返回: number
```

**addPoints / deductPoints**

内部使用的积分增减函数（带原子性保护）。

```typescript
import { addPoints, deductPoints } from '@/lib/rewards';

// 增加积分
await addPoints(userId, 100, 'task', '完成任务奖励');

// 扣除积分
await deductPoints(userId, 50, 'exchange', '兑换商品');
```

### 2. 签到系统 (signin.ts)

处理每日签到和连续签到奖励。

**getTodaySignInStatus**

获取今日签到状态。

```typescript
import { getTodaySignInStatus } from '@/lib/rewards';

const status = await getTodaySignInStatus();
// 返回: { hasSigned: boolean, consecutiveDays: number }
```

**getSignInNonce**

获取签到令牌（防重放攻击）。

```typescript
import { getSignInNonce } from '@/lib/rewards';

const { nonce } = await getSignInNonce();
```

**performSignIn**

执行每日签到。

```typescript
import { performSignIn } from '@/lib/rewards';

const result = await performSignIn(nonce);
// 返回: { 
//   success: boolean, 
//   points_earned: number, 
//   consecutive_days: number,
//   is_bonus_day: boolean,
//   current_points: number 
// }
```

**安全特性：**
- 令牌验证（防重放）
- 频率限制（每小时最多1次）
- 数据库级并发保护

**getSignInHistory**

获取签到历史记录。

```typescript
import { getSignInHistory } from '@/lib/rewards';

const history = await getSignInHistory(30); // 最近30天
// 返回: SignInRecord[]
```

**getSignInRewardsConfig**

获取连续签到奖励配置。

```typescript
import { getSignInRewardsConfig } from '@/lib/rewards';

const config = await getSignInRewardsConfig();
// 返回: [{ day: 1, points: 5, isBonus: false, bonusPoints: 0 }, ...]
```

### 3. 任务系统 (tasks.ts)

管理用户任务的查询、进度更新和奖励领取。

**getTasks**

获取任务列表（按分类筛选）。

```typescript
import { getTasks } from '@/lib/rewards';

const tasks = await getTasks('daily'); // 'daily' | 'weekly' | 'monthly' | 'event'
// 返回: Task[]
```

**getUserTaskProgress**

获取用户任务进度。

```typescript
import { getUserTaskProgress } from '@/lib/rewards';

const progress = await getUserTaskProgress('daily');
// 返回: TaskProgressResponse[]
```

**任务状态自动处理：**
- 过期任务自动重置
- 未登录用户返回默认状态
- 支持批量重置过期任务

**updateTaskProgress**

更新任务进度（自动检测触发）。

```typescript
import { updateTaskProgress } from '@/lib/rewards';

await updateTaskProgress('read_article', 1);
```

**支持的任务类型：**
- `read_article` - 阅读文章
- `publish_article` - 发布文章
- `publish_idea` - 发布想法
- `like_article` - 点赞文章
- `comment_article` - 评论文章
- `follow_user` - 关注用户
- `collect_article` - 收藏文章

**claimTaskReward**

领取任务奖励。

```typescript
import { claimTaskReward } from '@/lib/rewards';

const result = await claimTaskReward('task_id');
// 返回: { success: boolean, points?: number, error?: string }
```

**acceptTask**

接取任务。

```typescript
import { acceptTask } from '@/lib/rewards';

const result = await acceptTask('task_id');
// 返回: { success: boolean, error?: string }
```

**限制：**
- 最多同时接取5个任务
- 原子化接取（防止并发重复）

**getTaskCenterData**

获取任务中心数据（灵感任务页面）。

```typescript
import { getTaskCenterData } from '@/lib/rewards';

const data = await getTaskCenterData();
// 返回: { completedToday, totalToday, inspirationPoints, tasks }
```

**任务检测钩子**

在相关业务操作中自动调用：

```typescript
import { 
  checkReadArticleTask,
  checkPublishArticleTask,
  checkLikeArticleTask,
  checkCommentArticleTask,
  checkFollowUserTask,
  checkCollectArticleTask 
} from '@/lib/rewards';

// 在文章阅读完成后调用
await checkReadArticleTask();

// 在文章发布完成后调用
await checkPublishArticleTask();
```

### 4. 积分商城 (shop.ts)

管理商品查询和积分兑换。

**getShopItems**

获取商品列表。

```typescript
import { getShopItems } from '@/lib/rewards';

const items = await getShopItems({ category: 'coupon', activeOnly: true });
// 返回: ShopItem[]
```

**商品分类：**
- `coupon` - 优惠券
- `virtual` - 虚拟商品
- `physical` - 实物商品

**getShopItemDetail**

获取商品详情。

```typescript
import { getShopItemDetail } from '@/lib/rewards';

const item = await getShopItemDetail('item_id');
// 返回: ShopItem | null
```

**exchangeItem**

执行积分兑换。

```typescript
import { exchangeItem } from '@/lib/rewards';

const result = await exchangeItem({ item_id: 'xxx', quantity: 1 });
// 返回: { 
//   success: boolean, 
//   exchange_id: string,
//   points_spent: number,
//   remaining_points: number 
// }
```

**安全特性：**
- 服务端输入校验
- 库存检查和并发保护
- 原子性兑换操作

**getExchangeRecords**

获取用户兑换记录（含商品详情）。

```typescript
import { getExchangeRecords } from '@/lib/rewards';

const records = await getExchangeRecords({ limit: 20, offset: 0 });
// 返回: ExchangeRecordWithItem[]
```

**useCoupon**

使用卡券。

```typescript
import { useCoupon } from '@/lib/rewards';

const success = await useCoupon('exchange_id');
// 返回: boolean
```

**checkCanExchange**

检查用户是否可以兑换商品。

```typescript
import { checkCanExchange } from '@/lib/rewards';

const result = await checkCanExchange('item_id', 1);
// 返回: { canExchange: boolean, reason?: string }
```

**检查项：**
- 商品是否存在且上架
- 积分是否充足
- 是否超出每日限制
- 是否超出总兑换限制

### 5. 文章打赏 (reward.ts)

处理文章积分打赏功能。

**getRewardNonce**

获取打赏令牌（防重放攻击）。

```typescript
import { getRewardNonce } from '@/lib/rewards';

const { nonce } = await getRewardNonce();
```

**rewardArticle**

打赏文章。

```typescript
import { rewardArticle } from '@/lib/rewards';

const result = await rewardArticle({
  articleId: 'article_id',
  authorId: 'author_id',
  points: 50,
  nonce: 'nonce_string',
  message: '打赏留言（可选）',
});
// 返回: { success: boolean, points?: number, remainingPoints?: number, error?: string }
```

**限制：**
- 打赏金额：1-500积分
- 不能打赏给自己
- 令牌验证（防重放）

**getArticleRewardStats**

获取文章打赏统计。

```typescript
import { getArticleRewardStats } from '@/lib/rewards';

const stats = await getArticleRewardStats('article_id');
// 返回: { totalPoints: number, rewardCount: number }
```

**getArticleRewards**

获取文章打赏列表。

```typescript
import { getArticleRewards } from '@/lib/rewards';

const rewards = await getArticleRewards('article_id', { limit: 20, offset: 0 });
// 返回: [{ id, donorName, pointsAmount, message, createdAt }, ...]
```

## 安全设计

### 1. 防重放攻击

- 敏感操作使用一次性令牌（nonce）
- 令牌验证后失效
- 适用于签到、打赏等操作

### 2. 频率限制

- 签到：每小时最多1次
- 任务进度更新：每分钟最多5次
- 任务奖励领取：每分钟最多3次

### 3. 并发控制

- 数据库级原子操作（RPC函数）
- 唯一约束防止重复（任务接取）
- 乐观锁机制（积分兑换）

### 4. 输入校验

- 服务端参数校验
- 类型检查（TypeScript）
- 范围验证（积分数量、兑换数量）

## 使用示例

### 完整签到流程

```typescript
import { getSignInNonce, performSignIn } from '@/lib/rewards';

async function handleSignIn() {
  // 1. 获取令牌
  const { nonce } = await getSignInNonce();
  if (!nonce) {
    toast.error('请先登录');
    return;
  }
  
  // 2. 执行签到
  const result = await performSignIn(nonce);
  
  if (result.success) {
    toast.success(`签到成功，获得 ${result.points_earned} 积分`);
    // 更新UI显示
  } else {
    toast.error(result.error || '签到失败');
  }
}
```

### 任务进度检测

```typescript
import { checkReadArticleTask } from '@/lib/rewards';

// 在文章阅读完成后
async function onArticleRead(articleId: string) {
  // 记录阅读历史
  await recordReadHistory(articleId);
  
  // 检测任务进度
  await checkReadArticleTask();
}
```

### 积分兑换流程

```typescript
import { checkCanExchange, exchangeItem } from '@/lib/rewards';

async function handleExchange(itemId: string) {
  // 1. 预检查
  const check = await checkCanExchange(itemId, 1);
  if (!check.canExchange) {
    toast.error(check.reason);
    return;
  }
  
  // 2. 执行兑换
  const result = await exchangeItem({ item_id: itemId, quantity: 1 });
  
  if (result.success) {
    toast.success('兑换成功');
    // 刷新积分显示
  } else {
    toast.error('兑换失败');
  }
}
```

## 数据表结构

### 核心表

| 表名 | 描述 |
|------|------|
| `user_points` | 用户积分表 |
| `point_transactions` | 积分流水表 |
| `point_expiration` | 积分过期表 |
| `sign_in_records` | 签到记录表 |
| `sign_in_rewards` | 签到奖励配置表 |
| `tasks` | 任务定义表 |
| `user_task_records` | 用户任务记录表 |
| `shop_items` | 商城商品表 |
| `exchange_records` | 兑换记录表 |
| `article_rewards` | 文章打赏记录表 |

### 视图

| 视图名 | 描述 |
|--------|------|
| `user_points_overview` | 用户积分总览视图 |

## 依赖模块

- [Supabase库](../supabase/README.md) - 数据库操作
- [安全库](../security/README.md) - 频率限制、令牌生成
- [类型定义](../../types/README.md) - Rewards 相关类型
- [消息常量](../messages/README.md) - 积分相关消息文本

## 类型定义

主要类型定义位于 `types/rewards.ts`：

```typescript
interface UserPointsOverview {
  user_id: string;
  current_points: number;
  total_earned: number;
  total_spent: number;
  consecutive_days: number;
}

interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend';
  source: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'event';
  task_type: string;
  target_count: number;
  reward_points: number;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  points_price: number;
  category: string;
  stock: number;
  is_active: boolean;
}
```

## 注意事项

1. **所有函数都是 Server Actions**：只能在服务端调用，不能直接在客户端使用
2. **频率限制**：注意各操作的频率限制，避免触发限制
3. **错误处理**：所有函数都返回统一格式的结果对象，包含 `success` 字段
4. **并发安全**：积分操作使用数据库级原子函数，确保并发安全
5. **过期处理**：积分和任务都有过期机制，系统会自动处理
