# hooks vs lib 职责边界清单

目的：明确 `hooks` 与 `lib` 的分层边界，逐项判断是否偏移，降低“同业务多处实现”的维护风险。

## 判定标准（统一口径）

- `hooks`（UI/交互层）
  - 应放：`useState/useEffect` 状态编排、页面交互流程、SWR 组合、Toast/导航等前端副作用。
  - 不应放：数据库读写规则、权限校验规则、核心业务规则（可复用且与 React 生命周期无关）。
- `lib`（领域/数据层）
  - 应放：领域服务、Server Actions、查询函数、校验规则、纯函数工具、缓存 key 规范。
  - 不应放：依赖 React Hook 生命周期的逻辑、组件级 UI 交互细节。

偏移等级说明：
- `无`：职责匹配
- `轻微`：可优化但不影响分层正确性
- `中等`：边界开始模糊，建议近期收敛
- `高`：明显跨层，建议优先修复

---

## A. hooks 目录清单（按子目录）

| 目录 | 应放哪层 | 现在在哪层 | 是否偏移 | 说明 |
| --- | --- | --- | --- | --- |
| `hooks/auth` | UI/交互层（消费认证上下文，封装登录态操作） | hooks 调用 `lib/auth/client` + `AuthProvider` | 无 | `useAuth` 主要做客户端编排，未下沉业务规则。 |
| `hooks/article` | UI/交互层（点赞/评论/浏览交互编排） | hooks 调用 `lib/articles/actions/*` | 无 | 形态健康：状态与提示在 hooks，数据变更在 lib。 |
| `hooks/publish` | UI/编辑器交互层（编辑器状态、自动保存、提示） | hooks 调用 `lib/articles/*`、`lib/utils/json` | 轻微 | `useEditorState` 里重导出 `isContentEmpty`，可读性一般，建议由 `lib` 直接导入使用。 |
| `hooks/drafts` | UI列表交互层（筛选/分页/批量选择） | hooks + `lib/drafts/draftService` + `lib/articles/actions` | 无 | 分工合理：UI编排在 hooks，纯数据处理在 lib service。 |
| `hooks/settings` | UI表单层（乐观更新、表单状态） | hooks 调用 `lib/settings/actions/*`、`lib/security/*` | 轻微 | 逻辑基本正确；建议后续统一通过 `lib/settings/actions` 聚合入口导入。 |
| `hooks/notification` | UI缓存/订阅层 | hooks 调用 `lib/notifications/actions` | 无 | 符合边界。 |
| `hooks/navigation` | UI导航层 | hooks 内实现防抖/快速导航 | 无 | 纯前端交互逻辑。 |
| `hooks/updates` | UI筛选/搜索层 | hooks 调用 `lib/updates/updateService` | 无 | 标准“状态层 + 纯服务层”。 |
| `hooks/*` 通用（`useDebounce`、`useSWRQuery`、`useOptimisticMutation`） | UI通用层 | hooks 依赖 `lib/cache/keys` | 无 | 依赖方向正确。 |
| `hooks/README.md` | 文档层（应反映现状） | 与实际目录不一致 | 中等 | 存在已不存在分组/示例路径，容易造成“看起来重复实现”的误判。 |

---

## B. lib 目录清单（按子目录）

| 目录 | 应放哪层 | 现在在哪层 | 是否偏移 | 说明 |
| --- | --- | --- | --- | --- |
| `lib/auth` | 领域/认证层（server/client 入口、权限、安全） | lib（未反向依赖 hooks） | 无 | 职责清晰，作为认证单一入口合理。 |
| `lib/articles` | 内容领域层（actions/queries/schema/validators） | lib | 无 | 边界清晰。 |
| `lib/settings` | 设置领域层（actions/constants/utils/queries） | lib | 无 | 职责清晰。 |
| `lib/drafts` | 领域纯服务层（筛选/分页/选择判定） | lib（被 hooks 消费） | 无 | 纯函数聚合，适合作为共享服务。 |
| `lib/updates` | 领域纯服务 + 数据加载层 | lib | 无 | 与 hooks 配合关系良好。 |
| `lib/notifications` | 领域数据层 | lib | 无 | 被 hooks 作为数据源消费。 |
| `lib/rewards` | 领域层（actions/queries） | lib | 无 | 当前使用方式符合分层。 |
| `lib/cache` | 基础设施层（key/依赖规则） | lib | 无 | 被 hooks 引用合理。 |
| `lib/security` | 安全规则层 | lib | 无 | 只暴露能力，不承载 UI 生命周期。 |
| `lib/utils` | 通用工具层 | lib | 轻微 | README 有 React Hook 示例痕迹，建议移到 hooks 文档，避免边界歧义。 |
| `lib/*/README.md` | 文档层 | 存在少量历史示例偏移 | 轻微 | 代码层边界基本正确，文档一致性有提升空间。 |

---

## C. 重点偏移项（需优先治理）

1. `hooks/README.md` 文档漂移（`中等`）
   - 现象：描述了当前目录中不存在或已变更的分组/文件。
   - 风险：团队误判为“重复业务实现”，新代码放置容易跑偏。
   - 建议：按真实目录重写文档，并给出“什么时候放 hooks / 什么时候放 lib”的判定清单。

2. `hooks/settings/*` 导入路径分散（`轻微`）
   - 现象：既有从 `lib/settings/actions/privacy`、`notifications` 的点状导入，也有聚合入口。
   - 风险：后期重构时改动面扩大。
   - 建议：统一从 `lib/settings/actions` 聚合导入（除非有 tree-shaking 明确收益依据）。

3. `hooks/publish/useEditorState.ts` 的工具重导出（`轻微`）
   - 现象：从 hooks 层 re-export `lib/utils/json` 的 `isContentEmpty`。
   - 风险：让调用方误以为此工具是 hooks 语义，弱化层次边界。
   - 建议：调用方直接从 `lib/utils/json` 导入；hooks 仅暴露 Hook API。

---

## D. 当前总评

- 代码层面：`hooks -> lib` 依赖方向总体健康，**未发现明显“双套业务核心逻辑”**。
- 主要问题：边界认知成本来自文档漂移，而非代码结构本身。
- 结论：当前属于“分层可用 + 文档需收敛”的状态。

---

## E. 后续落地建议（按优先级）

1. **P0**：修订 `hooks/README.md` 为“现状即文档”，删除过期目录/示例。  
2. **P1**：新增一条仓库规则：`hooks` 禁止定义跨页面复用业务规则，`lib` 禁止引入 React 生命周期。  
3. **P1**：统一 settings 域导入路径，减少分散引用。  
4. **P2**：为 `auth`、`drafts`、`publish` 各补一张 1 页职责图（输入/输出/边界）。  
5. **P2**：把该清单加入 onboarding 索引，作为新人放置代码的判定依据。  
