'use client'

/**
 * 积分等级组件
 * @module components/rewards/overview/PtLevel
 * @description 显示用户当前积分等级和升级进度
 */

import { TrendingUp } from '@/components/icons'
import type { LevelConfig } from '@/types/rewards'

/**
 * 积分等级Props
 * @interface PtLevelProps
 */
interface PtLevelProps {
  /** 累计获得积分 */
  totalEarned: number
}

/**
 * 12级认知探索体系配置
 * @constant levelConfigs
 */
const levelConfigs: LevelConfig[] = [
  { level: 1, name: '边界旅人', minPoints: 0, maxPoints: 499, dailyBonus: 0, taskBonus: 0, description: '站在认知边界外张望' },
  { level: 2, name: '渡口行者', minPoints: 500, maxPoints: 1499, dailyBonus: 1, taskBonus: 3, description: '在相逢渡口相遇' },
  { level: 3, name: '跨界渡客', minPoints: 1500, maxPoints: 3999, dailyBonus: 2, taskBonus: 6, description: '第一次跨越学科之河' },
  { level: 4, name: '脉络测绘师', minPoints: 4000, maxPoints: 9999, dailyBonus: 3, taskBonus: 9, description: '绘制知识地图' },
  { level: 5, name: '深度潜航员', minPoints: 10000, maxPoints: 24999, dailyBonus: 4, taskBonus: 12, description: '潜入问题深处' },
  { level: 6, name: '联结建筑师', minPoints: 25000, maxPoints: 59999, dailyBonus: 5, taskBonus: 15, description: '构建跨领域连接' },
  { level: 7, name: '迷雾破译者', minPoints: 60000, maxPoints: 139999, dailyBonus: 6, taskBonus: 18, description: '穿透复杂性的迷雾' },
  { level: 8, name: '范式探险家', minPoints: 140000, maxPoints: 299999, dailyBonus: 7, taskBonus: 21, description: '探索新的思维范式' },
  { level: 9, name: '认知策展人', minPoints: 300000, maxPoints: 599999, dailyBonus: 8, taskBonus: 24, description: '筛选、组织、呈现深度内容' },
  { level: 10, name: '思想炼金师', minPoints: 600000, maxPoints: 1199999, dailyBonus: 10, taskBonus: 28, description: '转化知识为智慧' },
  { level: 11, name: '边界重塑者', minPoints: 1200000, maxPoints: 2499999, dailyBonus: 12, taskBonus: 32, description: '重新定义学科边界' },
  { level: 12, name: '改变发生者', minPoints: 2500000, maxPoints: null, dailyBonus: 15, taskBonus: 40, description: '不仅是思考，更是行动与改变' },
]

/**
 * 获取当前等级配置
 * @param {number} totalEarned - 累计获得积分
 * @returns {LevelConfig} 当前等级配置
 */
function getCurrentLevel(totalEarned: number): LevelConfig {
  for (let i = levelConfigs.length - 1; i >= 0; i--) {
    if (totalEarned >= levelConfigs[i].minPoints) {
      return levelConfigs[i]
    }
  }
  return levelConfigs[0]
}

/**
 * 获取下一等级配置
 * @param {number} totalEarned - 累计获得积分
 * @returns {LevelConfig | null} 下一等级配置
 */
function getNextLevel(totalEarned: number): LevelConfig | null {
  const currentLevel = getCurrentLevel(totalEarned)
  const nextLevelIndex = currentLevel.level
  if (nextLevelIndex < levelConfigs.length) {
    return levelConfigs[nextLevelIndex]
  }
  return null
}

/**
 * 计算等级进度
 * @param {number} totalEarned - 累计获得积分
 * @returns {number} 进度百分比 (0-100)
 */
function calculateProgress(totalEarned: number): number {
  const currentLevel = getCurrentLevel(totalEarned)
  const nextLevel = getNextLevel(totalEarned)
  
  if (!nextLevel) return 100
  
  const levelRange = nextLevel.minPoints - currentLevel.minPoints
  const progressInLevel = totalEarned - currentLevel.minPoints
  return Math.min(Math.max((progressInLevel / levelRange) * 100, 0), 100)
}

/**
 * 积分等级组件
 * @param {PtLevelProps} props - 组件属性
 * @returns {JSX.Element} 积分等级卡片
 */
export function PtLevel({ totalEarned }: PtLevelProps) {
  const currentLevel = getCurrentLevel(totalEarned)
  const nextLevel = getNextLevel(totalEarned)
  const progress = calculateProgress(totalEarned)
  
  const needPoints = nextLevel ? nextLevel.minPoints - totalEarned : 0

  return (
    <div className="card-bg rounded-2xl p-6 flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-5 h-5 text-xf-primary" />
        <span className="font-medium">积分等级 · {currentLevel.name}</span>
      </div>
      <div className="text-xs text-xf-medium mb-2">{currentLevel.description}</div>
      <div className="w-full bg-xf-bg h-2 rounded-full mt-1">
        <div
          className="bg-xf-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {nextLevel ? (
        <p className="text-xs text-xf-primary mt-3">
          距离下一等级「{nextLevel.name}」还差{needPoints}分
        </p>
      ) : (
        <p className="text-xs text-xf-success mt-3">🎉 恭喜您已达到最高等级！</p>
      )}
      <div className="flex gap-4 mt-2">
        <p className="text-xs text-xf-medium">签到加成: +{currentLevel.dailyBonus}</p>
        <p className="text-xs text-xf-medium">任务加成: +{currentLevel.taskBonus}%</p>
      </div>
    </div>
  )
}
