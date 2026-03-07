# 图标库使用文档

## 概述

本项目采用统一的图标管理体系，所有图标通过 `components/icons` 模块集中管理和导出。

## 快速开始

### 基本使用

```typescript
// 推荐方式：从统一入口导入
import { Trash2, X, Loader2, Home, Heart } from '@/components/icons'

// 使用图标
<button>
  <Trash2 className="w-4 h-4" />
  删除
</button>
```

## 图标分类

### 1. 通用图标 (common.ts)

高频使用的通用图标。

```typescript
import { Trash2, X, Check, CheckSquare, CheckCheck, AlertTriangle, Bell, Loader2, Loader } from '@/components/icons'
```

| 图标 | 用途 |
|------|------|
| Trash2 | 删除操作 |
| X | 关闭/取消 |
| Check | 确认/完成 |
| CheckSquare | 勾选框 |
| CheckCheck | 已读/已完成 |
| AlertTriangle | 警告提示 |
| Bell | 通知提醒 |
| Loader2 | 加载动画 |
| Loader | 加载状态 |

### 2. 编辑器图标 (editor.ts)

TipTap 编辑器工具栏专用图标。

```typescript
import { Bold, Italic, Underline, Heading, Quote, Code, Link, List, ListOrdered, Minus, Eraser, Undo, Redo, ArrowUpToLine, Maximize, ChevronDown, Save, Send } from '@/components/icons'
```

**文本格式化**：Bold, Italic, Underline, Heading  
**插入元素**：Quote, Code, Link, List, ListOrdered, Minus  
**操作功能**：Eraser, Undo, Redo  
**布局控制**：ArrowUpToLine, Maximize, ChevronDown  
**文件操作**：Save, Send

### 3. 导航图标 (navigation.ts)

导航相关图标。

```typescript
import { Home, RefreshCw, GitMerge, Edit3, FolderOpen, BellRing, Gift } from '@/components/icons'
```

| 图标 | 用途 |
|------|------|
| Home | 首页导航 |
| RefreshCw | 刷新/同步 |
| GitMerge | 版本/更新 |
| Edit3 | 编辑/创作 |
| FolderOpen | 文件夹/文章管理 |
| BellRing | 通知提醒 |
| Gift | 奖励/收益 |

### 4. 文章页图标 (article.ts)

文章详情页相关图标。

```typescript
import { Clock, Eye, Heart, MessageCircle, Share2, Share, Bookmark, Link, CornerUpLeft, Send } from '@/components/icons'
```

| 图标 | 用途 |
|------|------|
| Clock | 发布时间 |
| Eye | 阅读量 |
| Heart | 点赞 |
| MessageCircle | 评论 |
| Share2, Share | 分享 |
| Bookmark | 收藏 |
| Link | 链接 |
| CornerUpLeft | 回复 |
| Send | 发送评论 |

### 5. 反馈页图标 (feedback.ts)

产品反馈页面相关图标。

```typescript
import { HelpCircle, Edit3, ChevronDown, ChevronRight, MessageSquare, CheckCircle, Clock, Bug, Lightbulb, Palette, UploadCloud, Lock, Check, Copy, Calendar, Tag, FileText, Mail, User } from '@/components/icons'
```

**反馈类型**：Bug, Lightbulb, Palette, HelpCircle  
**状态标识**：CheckCircle, Clock, Check  
**操作图标**：Edit3, ChevronDown, ChevronRight, MessageSquare  
**表单元素**：UploadCloud, Lock, Copy  
**信息展示**：Calendar, Tag, FileText, Mail, User

### 6. 设置页图标 (settings.ts)

设置页面相关图标。

```typescript
import { User, Lock, Bell, Palette, Filter, Settings2, ArrowLeft, Camera, Mail, FileText, MapPin, Shield, CheckCircle, AlertCircle, Key, Eye, EyeOff, Link2, Github, MessageCircle, CheckCircle2, Circle, LogOut } from '@/components/icons'
```

**导航分类**：User, Lock, Bell, Palette, Filter, Settings2  
**表单操作**：ArrowLeft, Camera, Mail, FileText, MapPin  
**安全相关**：Shield, Key, Eye, EyeOff  
**状态标识**：CheckCircle, AlertCircle, CheckCircle2, Circle  
**第三方**：Link2, Github, MessageCircle  
**操作**：LogOut

### 7. 个人中心图标 (profile.ts)

个人中心页面相关图标。

```typescript
import { MessageSquare, UserPlus, UserCheck, MapPin, Star, Calendar, Link } from '@/components/icons'
```

| 图标 | 用途 |
|------|------|
| MessageSquare | 私信 |
| UserPlus | 关注 |
| UserCheck | 已关注 |
| MapPin | 位置 |
| Star | 收藏/评分 |
| Calendar | 加入时间 |
| Link | 外部链接 |

### 8. 收益中心图标 (earnings.ts)

收益中心页面相关图标。

```typescript
import { Wallet, TrendingUp, Award, Calendar, DollarSign, RefreshCw, Plus, Users, FileText, Heart } from '@/components/icons'
```

| 图标 | 用途 |
|------|------|
| Wallet | 钱包/总收益 |
| TrendingUp | 趋势/增长 |
| Award | 成就/奖励 |
| Calendar | 时间筛选 |
| DollarSign | 金额 |
| RefreshCw | 刷新数据 |
| Plus | 新增收益 |
| Users | 用户相关 |
| FileText | 文章收益 |
| Heart | 点赞收益 |

## 最佳实践

### 1. 优先使用统一入口

```typescript
// ✅ 推荐
import { Home, User, Settings } from '@/components/icons'

// ❌ 不推荐
import { Home } from 'lucide-react'
import { User } from 'lucide-react'
```

### 2. 按需导入

```typescript
// ✅ 推荐：只导入需要的图标
import { Trash2, X } from '@/components/icons'

// ❌ 不推荐：导入整个库
import * as Icons from '@/components/icons'
```

### 3. 图标命名规范

- 使用 PascalCase 命名（与 Lucide 保持一致）
- 别名导入时使用有意义的名称

```typescript
// 别名示例
import { Link as LinkIcon } from '@/components/icons'
```

### 4. 图标尺寸规范

```typescript
// 按钮内图标
<Trash2 className="w-4 h-4" />

// 页面标题图标
<Bell className="w-6 h-6" />

// 大图标展示
<HelpCircle className="w-10 h-10" />
```

## 新增图标流程

### 1. 确定图标分类

根据图标用途，确定应添加到哪个分类文件：
- 通用图标 → `common.ts`
- 编辑器图标 → `editor.ts`
- 导航图标 → `navigation.ts`
- 文章页图标 → `article.ts`
- 反馈页图标 → `feedback.ts`
- 设置页图标 → `settings.ts`
- 个人中心图标 → `profile.ts`
- 收益中心图标 → `earnings.ts`

### 2. 添加图标到对应文件

```typescript
// components/icons/common.ts
export {
  // ... 现有图标
  NewIcon,  // 新增图标
} from 'lucide-react'
```

### 3. 验证导入

```typescript
// 测试导入
import { NewIcon } from '@/components/icons'
```

## 文件结构

```
components/icons/
├── index.ts          # 统一出口，导出所有分类
├── common.ts         # 高频通用图标
├── editor.ts         # 编辑器专用图标
├── navigation.ts     # 导航图标
├── article.ts        # 文章页图标
├── feedback.ts       # 反馈页图标
├── settings.ts       # 设置页图标
├── profile.ts        # 个人中心图标
├── earnings.ts       # 收益中心图标
└── README.md         # 本文档
```

## 维护说明

- 所有图标均从 `lucide-react` 导出
- 分类文件只包含导出语句，不包含业务逻辑
- 新增分类时需要更新 `index.ts` 的导出语句
- 定期审查未使用的图标，保持库精简

## 统计信息

- **总图标数**: 95个
- **分类数**: 8个
- **已优化文件**: 55个
- **最后更新**: 2026-03-08
