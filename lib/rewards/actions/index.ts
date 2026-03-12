/**
 * 福利中心 Actions 统一导出
 * @module lib/rewards/actions
 */

// 积分系统
export {
  getUserPointsOverview,
  getPointTransactions,
  getExpiringPoints,
  addPoints,
  deductPoints,
} from './points'

// 签到系统
export {
  getTodaySignInStatus,
  performSignIn,
  getSignInHistory,
  getSignInRewardsConfig,
  getSignInNonce,
} from './signin'

// 任务系统
export {
  getTasks,
  getUserTaskProgress,
  updateTaskProgress,
  claimTaskReward,
  acceptTask,
  getTaskCenterData,
  checkReadArticleTask,
  checkPublishArticleTask,
  checkPublishIdeaTask,
  checkLikeArticleTask,
  checkCommentArticleTask,
  checkFollowUserTask,
  checkCollectArticleTask,
} from './tasks'

// 商城系统
export {
  getShopItems,
  getShopItemDetail,
  exchangeItem,
  getExchangeRecords,
  getExchangeDetail,
  useCoupon,
  checkCanExchange,
} from './shop'

// 打赏系统
export {
  rewardArticle,
  getRewardNonce,
  getArticleRewardStats,
  getArticleRewards,
} from './reward'
