# 文章管理模块 BUG 清单（删除逻辑 + 动效体验）

日期：2026-03-20

## 先回答你的核心问题：当前删除逻辑是什么

1. **垃圾箱图标（单篇删除）**
   - 触发 `executeDeleteDrafts([id])`，调用 `deleteArticle(id)`。
   - 这是真删除（数据库 `articles` 直接 delete），不是“移入回收站”。

2. **批量删除（含全选后删除）**
   - 触发 `executeDeleteDrafts(ids, true)`，调用 `batchDeleteArticles(ids)`。
   - 同样是真删除，不存在回收站中间态。

3. **清空草稿**
   - `handleClearAllDrafts` 内部只筛选 `status === 'draft'` 后删除。
   - 设计上不会删除 `published/archived`。

---

## BUG 1：文章管理页存在明显悬停/动效，与你“不需要复杂动画”的要求冲突
- 现象
  - 卡片存在 `hover:shadow-elevated` + `hover:-translate-y-1.5`。
  - 容器存在 `fade-in` / `slide-in`。
  - 批量操作条、分页、弹窗按钮都有 `transition-all` / hover 动效。
- 影响
  - 与产品要求不一致；在低性能设备上可能导致交互抖动与视觉噪音。
- 方案
  1. 移除卡片位移动效与重阴影，保留基础边框变化即可。
  2. 去掉 `fade-in/slide-in` 这类页面级动效类。
  3. 统一为“无悬停动画，仅颜色即时变化”或全部静态。
- 文件
  - `components/drafts/card/DraftCard.tsx`
  - `components/drafts/core/DraftsContent.tsx`
  - `components/drafts/actions/BatchActionsBar.tsx`
  - `components/drafts/navigation/Pagination.tsx`
  - `components/drafts/actions/DeleteConfirmModal.tsx`

## BUG 2：批量删除后强制 `router.refresh()`，会导致页面短暂空白（你们测试已复现）
- 现象
  - 批量删除路径传入 `shouldRefresh = true`，删除成功后执行 `router.refresh()`。
- 影响
  - 页面整体重新请求 + RSC 重绘，产生短暂白屏。
- 方案
  1. 删除 `router.refresh()`，完全依赖 SWR `mutate` 乐观更新。
  2. 如需后端校验一致性，使用静默 revalidate，不阻塞当前 UI。
- 文件
  - `components/drafts/core/DraftsClient.tsx`
  - `components/drafts/hooks/useDrafts.ts`

## BUG 3：批量删除路径“乐观更新 + revalidate + refresh”叠加，抖动概率高
- 现象
  - 批量删除时 `mutate(..., { revalidate: true })` 已会回源。
  - 同时又 `router.refresh()`，双重刷新。
- 影响
  - 列表闪烁、短暂空状态、滚动位置丢失概率上升。
- 方案
  1. 二选一：仅 `mutate` 或仅 `refresh`，不要叠加。
  2. 建议保留 `mutate`，并在后台 `revalidate: false` + 手动轻量校验。
- 文件
  - `components/drafts/hooks/useDrafts.ts`

## BUG 4：`清空草稿`删除范围与当前筛选/搜索不一致，容易误解
- 现象
  - 按钮显示数量来自 `filteredDrafts`（受筛选/搜索影响）。
  - 真实删除来源是 `drafts.filter(status==='draft')`（全量草稿）。
- 影响
  - 用户可能以为“只清空当前筛选结果”，实际删除“全部草稿”。
- 方案
  1. 文案改为“清空全部草稿（N）”并明确全量范围。
  2. 或改成只删除当前筛选结果，二选一并与文案保持一致。
- 文件
  - `components/drafts/core/DraftsClient.tsx`
  - `components/drafts/hooks/useDrafts.ts`
  - `components/drafts/actions/DeleteConfirmModal.tsx`

## BUG 5：全选仅作用于“当前页”，和用户心理预期“全列表全选”不一致
- 现象
  - `handleSelectAll` 只基于 `paginatedDrafts` 选中当前页。
- 影响
  - 用户在多页场景批量删除时，可能误以为全部已选，实际只删一页。
- 方案
  1. 提供二级选择：先“选中本页”，再“选中全部筛选结果”。
  2. 在 UI 显示“当前仅选中本页 X 篇”。
- 文件
  - `components/drafts/hooks/useDrafts.ts`
  - `components/drafts/filter/SelectAllCheckbox.tsx`

## BUG 6：删除后分页校准时机靠旧闭包数据，可能出现一帧空态
- 现象
  - `calibratePage()` 依赖 `filteredDrafts` 当前闭包；在 `mutate` 异步完成前可能先按旧数据计算。
- 影响
  - 删除最后一条后，短暂看到空页再回跳（体感“闪白/闪空”）。
- 方案
  1. 在 `mutate` 完成后基于新列表计算页码。
  2. 或在 `setCurrentPage` 里用函数式更新并结合新总页数。
- 文件
  - `components/drafts/hooks/useDrafts.ts`

---

## 建议优先级
1. 先修 BUG 2 + BUG 3（直接解决“删除后短暂空白”）
2. 再修 BUG 1（去掉悬停动画，满足产品要求）
3. 最后修 BUG 4 + BUG 5 + BUG 6（语义一致性与交互细节）
