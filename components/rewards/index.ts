/**
 * 福利中心组件统一出口
 * @module components/rewards
 * @description 福利中心页面所有组件的统一导出
 */

export { RwClient } from './RwClient'

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

/**
 * 积分商城相关组件
 * @module components/rewards/shop
 */
export { ShopGrid } from './shop/ShopGrid'
export { ShopClient } from './shop/ShopClient'
export { ShopFull } from './shop/ShopFull'
export { ShopNav } from './shop/ShopNav'

/**
 * 我的福利相关组件
 * @module components/rewards/my
 */
export { MyRw } from './my/MyRw'
export { RwCenter } from './my/RwCenter'
export { RwRecord } from './my/RwRecord'
export { PtRecord } from './my/PtRecord'

/**
 * 福利中心 Hooks 统一出口
 * @module components/rewards/hooks
 */
export { useSignIn, usePoints, useTasks, useShop } from './hooks'
