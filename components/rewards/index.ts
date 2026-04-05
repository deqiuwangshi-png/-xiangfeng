/**
 * 福利中心组件统一出口
 * @module components/rewards
 * @description 福利中心页面所有组件的统一导出
 */

export {
  SignCardSection,
  TaskBoardSection,
  ShopGridSection,
  MyRwSection,
} from './RwClient'

/**
 * 积分总览相关组件
 * @module components/rewards/overview
 */
export { PtOverview } from './overview/PtOverview'
export { PtLevel } from './overview/PtLevel'

/**
 * 签到相关组件
 * @module components/rewards/signin
 */
export { SignCard } from './signin/SignCard'

/**
 * 任务中心相关组件
 * @module components/rewards/tasks
 */
export { TaskBoard } from './tasks/TaskBoard'
export { TaskBoardServer } from './tasks/TaskBoardServer'
export { TasksHeader } from './tasks/TasksHeader'
export { TasksServerList } from './tasks/TasksServerList'
export { CategoryNavClient } from './tasks/CategoryNavClient'
export { TaskActionButton } from './tasks/TaskActionButton'

/**
 * 积分商城相关组件
 * @module components/rewards/shop
 */
export { ShopGrid } from './shop/ShopGrid'
export { ShopCategoryNav } from './shop/ShopCategoryNav'
export { ShopServerGrid } from './shop/ShopServerGrid'
export { ShopHeader } from './shop/ShopHeader'
export { ShopExchangeButton } from './shop/ShopExchangeButton'
export { default as ShopLoading } from './shop/ShopLoading'
export { default as ShopError } from './shop/ShopError'

/**
 * 我的福利相关组件
 * @module components/rewards/my
 */
export { MyRw } from './my/MyRw'
export { RwCenter } from './my/RwCenter'
export { RwRecord } from './my/RwRecord'
export { PtRecord } from './my/PtRecord'
export { MyRewardsHeader } from './my/MyRewardsHeader'
export { PtRecordServer } from './my/PtRecordServer'
export { RwRecordServer } from './my/RwRecordServer'
export { MyRewardsTabNav } from './my/MyRewardsTabNav'

/**
 * 福利中心 Hooks 统一出口
 * @module hooks/rewards
 * @description 福利中心 Hooks 已迁移至 hooks/rewards/ 目录
 * @deprecated 请直接从 @/hooks 导入
 */
export {
  useSignIn,
  usePoints,
  useTasks,
  useShop,
  useExchangeRecords,
} from '@/hooks'
