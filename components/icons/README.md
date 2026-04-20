# 图标库使用文档

## 概述

本项目采用统一的图标管理体系，所有图标通过 `components/icons` 模块集中管理和导出。基于 `lucide-react` 图标库，按功能模块分类组织，便于维护和按需导入。

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

### Logo 组件使用

```typescript
import { Logo } from '@/components/icons'

// 基础用法
<Logo />

// 自定义尺寸
<Logo size="lg" />

// 仅显示图标
<Logo showText={false} />

// 自定义样式
<Logo className="hover:scale-105 transition-transform" />
```

## 项目结构

```
components/icons/
├── index.ts          # 统一出口，导出所有分类
├── Logo.tsx          # 品牌 Logo 组件
├── common.ts         # 高频通用图标
├── editor.ts         # 编辑器专用图标
├── navigation.ts     # 导航图标
├── article.ts        # 文章页图标
├── feedback.ts       # 反馈页图标
├── settings.ts       # 设置页图标
├── profile.ts        # 个人中心图标
└── README.md         # 本文档
```

## 图标分类

### 1. 通用图标 (common.ts)

高频使用的通用图标，适用于各种场景。

```typescript
import {
  Trash2, X, Check, CheckSquare, CheckCheck, Power, Menu,
  LayoutGrid, List, Edit3, AlertTriangle, AlertCircle, Bell,
  Loader2, Loader, FileText, Image, File, Paperclip, Users, ThumbsUp
} from '@/components/icons'
```

| 图标 | 用途 | 说明 |
|------|------|------|
| Trash2 | 删除操作 | 垃圾桶图标，用于删除按钮 |
| X | 关闭/取消 | 叉号，用于关闭弹窗或取消操作 |
| Check | 确认/完成 | 对勾，表示确认状态 |
| CheckSquare | 勾选框 | 带方框的对勾，用于多选 |
| CheckCheck | 已读/已完成 | 双对勾，表示已读或已完成 |
| Power | 电源/退出 | 电源图标，用于退出登录 |
| Menu | 菜单 | 汉堡菜单，移动端导航 |
| LayoutGrid | 网格布局 | 九宫格，用于视图切换 |
| List | 列表布局 | 列表图标，用于视图切换 |
| Edit3 | 编辑 | 铅笔图标，用于编辑操作 |
| AlertTriangle | 警告提示 | 三角形警告，用于警告信息 |
| AlertCircle | 提示信息 | 圆形感叹号，用于提示 |
| Bell | 通知提醒 | 铃铛图标，用于通知中心 |
| Loader2 | 加载动画 | 旋转加载器，用于加载状态 |
| Loader | 加载状态 | 另一种加载动画 |
| FileText | 文本文件 | 文档图标，用于文章 |
| Image | 图片 | 图片图标，用于图片上传 |
| File | 文件 | 通用文件图标 |
| Paperclip | 附件 | 回形针，用于附件上传 |
| Users | 用户组 | 多个用户，用于社群 |
| ThumbsUp | 点赞 | 竖起大拇指，用于点赞 |

### 2. 编辑器图标 (editor.ts)

TipTap 编辑器工具栏专用图标。

```typescript
import {
  Bold, Italic, Underline, Heading, Heading1, Heading2, Heading3,
  Quote, Code, Link, List, ListOrdered, Minus, Eraser, Undo, Redo,
  ArrowUpToLine, Maximize, Minimize, ChevronDown, Save, Send,
  Image, AlignLeft, AlignCenter, AlignRight, Trash2, ImageOff, Table
} from '@/components/icons'
```

**文本格式化**：
- Bold - 粗体
- Italic - 斜体
- Underline - 下划线
- Heading/Heading1/Heading2/Heading3 - 标题层级

**插入元素**：
- Quote - 引用块
- Code - 代码块
- Link - 超链接
- List - 无序列表
- ListOrdered - 有序列表
- Minus - 分隔线
- Image - 插入图片
- Table - 插入表格

**对齐方式**：
- AlignLeft - 左对齐
- AlignCenter - 居中对齐
- AlignRight - 右对齐

**操作功能**：
- Eraser - 清除格式
- Undo - 撤销
- Redo - 重做
- Trash2 - 删除
- ImageOff - 图片失效

**布局控制**：
- ArrowUpToLine - 返回顶部
- Maximize - 全屏
- Minimize - 退出全屏
- ChevronDown - 展开/折叠

**文件操作**：
- Save - 保存
- Send - 发送/发布

### 3. 导航图标 (navigation.ts)

导航相关图标。

```typescript
import { Home, RefreshCw, GitMerge, Edit3, FolderOpen, BellRing, Gift } from '@/components/icons'
```

| 图标 | 用途 | 说明 |
|------|------|------|
| Home | 首页导航 | 主页图标 |
| RefreshCw | 刷新/同步 | 循环箭头，用于刷新 |
| GitMerge | 版本/更新 | 分支合并，用于更新日志 |
| Edit3 | 编辑/创作 | 创作中心入口 |
| FolderOpen | 文件夹/文章管理 | 草稿箱 |
| BellRing | 通知提醒 | 带铃声的铃铛 |
| Gift | 奖励/收益 | 福利中心 |

### 4. 文章页图标 (article.ts)

文章详情页相关图标。

```typescript
import {
  Clock, Eye, Heart, MessageCircle, Share2, Share, Bookmark,
  Link, CornerUpLeft, Send, Sparkles, Coins, Gift, Megaphone, X
} from '@/components/icons'
```

| 图标 | 用途 | 说明 |
|------|------|------|
| Clock | 发布时间 | 时钟，显示文章时间 |
| Eye | 阅读量 | 眼睛，显示阅读次数 |
| Heart | 点赞 | 爱心，点赞按钮 |
| MessageCircle | 评论 | 消息气泡，评论入口 |
| Share2 | 分享 | 分享图标（样式1） |
| Share | 分享 | 分享图标（样式2） |
| Bookmark | 收藏 | 书签，收藏文章 |
| Link | 链接 | 复制链接 |
| CornerUpLeft | 回复 | 回复评论 |
| Send | 发送评论 | 发送按钮 |
| Sparkles | 精彩评论 | 闪光，标记优质评论 |
| Coins | 打赏 | 金币，打赏功能 |
| Gift | 礼物 | 赠送礼物 |
| Megaphone | 举报 | 喇叭，举报内容 |
| X | 关闭 | 关闭弹窗 |

### 5. 反馈页图标 (feedback.ts)

产品反馈页面相关图标。

```typescript
import {
  HelpCircle, Edit3, ChevronDown, ChevronRight, MessageSquare,
  CheckCircle, Clock, Bug, Lightbulb, Palette, UploadCloud, File,
  Lock, Check, Copy, Calendar, Tag, FileText, Mail, User
} from '@/components/icons'
```

**反馈类型**：
- Bug - 功能故障
- Lightbulb - 产品建议
- Palette - 界面优化
- HelpCircle - 使用咨询

**状态标识**：
- CheckCircle - 已解决
- Clock - 处理中
- Check - 已完成

**操作图标**：
- Edit3 - 编辑反馈
- ChevronDown - 展开详情
- ChevronRight - 收起详情
- MessageSquare - 留言讨论

**表单元素**：
- UploadCloud - 上传附件
- Lock - 私密反馈
- Copy - 复制反馈ID

**信息展示**：
- Calendar - 提交时间
- Tag - 反馈标签
- FileText - 反馈详情
- Mail - 联系邮箱
- User - 用户信息

### 6. 设置页图标 (settings.ts)

设置页面相关图标。

```typescript
import {
  User, Lock, Bell, Palette, Filter, Settings2, ArrowLeft, Camera,
  Mail, FileText, MapPin, Shield, CheckCircle, AlertCircle, Key,
  Eye, EyeOff, Link2, Github, MessageCircle, CheckCircle2, Circle, LogOut
} from '@/components/icons'
```

**导航分类**：
- User - 个人资料
- Lock - 账号安全
- Bell - 消息通知
- Palette - 外观设置
- Filter - 内容偏好
- Settings2 - 高级设置

**表单操作**：
- ArrowLeft - 返回
- Camera - 更换头像
- Mail - 邮箱绑定
- FileText - 个人简介
- MapPin - 位置信息

**安全相关**：
- Shield - 安全中心
- Key - 密码修改
- Eye - 显示密码
- EyeOff - 隐藏密码

**第三方绑定**：
- Link2 - 绑定链接
- Github - GitHub 绑定
- MessageCircle - 微信绑定

**状态标识**：
- CheckCircle - 已验证
- AlertCircle - 待验证
- CheckCircle2 - 已绑定
- Circle - 未绑定

**操作**：
- LogOut - 退出登录

### 7. 个人中心图标 (profile.ts)

个人中心页面相关图标。

```typescript
import {
  MessageSquare, UserPlus, UserCheck, MapPin, Star, Calendar,
  Link, FileText, Users, ThumbsUp
} from '@/components/icons'
```

| 图标 | 用途 | 说明 |
|------|------|------|
| MessageSquare | 私信 | 发送私信 |
| UserPlus | 关注 | 关注用户 |
| UserCheck | 已关注 | 已关注状态 |
| MapPin | 位置 | 用户位置 |
| Star | 收藏/评分 | 收藏文章 |
| Calendar | 加入时间 | 注册时间 |
| Link | 外部链接 | 个人网站 |
| FileText | 文章数量 | 发布文章数 |
| Users | 粉丝数 | 关注者数量 |
| ThumbsUp | 获赞数 | 总点赞数 |

## Logo 组件

### 组件属性

```typescript
interface LogoProps {
  /** Logo 尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 是否显示文字 */
  showText?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
}
```

### 尺寸映射

| 尺寸 | Logo 大小 | 文字大小 | 间距 |
|------|-----------|----------|------|
| sm | 32px | text-lg | gap-2 |
| md | 48px | text-xl | gap-3 |
| lg | 64px | text-2xl | gap-4 |
| xl | 80px | text-3xl | gap-5 |

### 设计理念

**交汇之环设计**：
- **双环交织**：代表两个灵魂的相遇
- **中心光点**：象征相遇瞬间的火花
- **流动线条**：体现缘分的美妙流动
- **渐变色彩**：紫色到深蓝色的渐变，代表深度与思考

### 使用示例

```tsx
// 导航栏使用
<Logo size="sm" />

// 页脚使用
<Logo size="md" />

// 登录页使用
<Logo size="lg" />

// 仅图标
<Logo size="sm" showText={false} />

// 自定义样式
<Logo className="hover:scale-105 transition-transform duration-300" />
```

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

// 超大图标
<Logo size="xl" />
```

### 5. 图标颜色规范

```typescript
// 默认继承文字颜色
<Trash2 className="w-4 h-4 text-red-500" />

// 使用主题色
<Check className="w-4 h-4 text-xf-primary" />

// 禁用状态
<Trash2 className="w-4 h-4 text-slate-400" />
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

### 4. 更新文档

在本文档对应分类中添加新图标的说明。

## 技术细节

### 图标来源

所有图标均从 `lucide-react` 导出，保持与 Lucide 图标库同步。

```typescript
export { IconName } from 'lucide-react'
```

### 类型导出

统一导出 `LucideIcon` 类型：

```typescript
export type { LucideIcon } from 'lucide-react'
```

### Tree Shaking

由于采用命名导出方式，支持 Tree Shaking，只会打包实际使用的图标。

## 维护说明

- 所有图标均从 `lucide-react` 导出
- 分类文件只包含导出语句，不包含业务逻辑
- 新增分类时需要更新 `index.ts` 的导出语句
- 定期审查未使用的图标，保持库精简
- Logo 组件为自定义 SVG 组件，独立维护

## 统计信息

- **总图标数**: 120+
- **分类数**: 9个（8个图标分类 + 1个Logo组件）
- **依赖**: lucide-react
- **最后更新**: 2026-03-29

## 相关链接

- [Lucide Icons 官网](https://lucide.dev/)
- [Lucide React GitHub](https://github.com/lucide-icons/lucide)
