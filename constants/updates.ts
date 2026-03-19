/**
 * 更新日志常量定义
 *
 * 作用: 定义更新日志相关的常量
 *
 * @exports MOCK_UPDATES, UPDATE_TYPE_STYLES, VERSION_TAG_COLORS
 *
 * 使用说明:
 *   用于更新日志页面的常量配置
 *   包含模拟数据、样式配置等
 *   注意：不要在此文件中调用服务器端函数（如fs模块）
 *
 * 更新时间: 2026-02-20
 */

import { UpdateType, VersionType, MonthlyUpdate } from '@/types/updates'

/**
 * 模拟更新数据（备用数据）
 *
 * @constant MOCK_UPDATES
 * @description 模拟的更新日志数据，用于开发和测试
 */
export const MOCK_UPDATES: MonthlyUpdate[] = [
  {
    year: 2024,
    month: 11,
    versions: [
      {
        version: 'V2.5.0',
        title: '深度写作工具发布',
        date: '2024年11月28日',
        versionType: VersionType.MINOR,
        categories: [UpdateType.NEW, UpdateType.IMPROVED],
        updates: [
          {
            type: UpdateType.NEW,
            description: '新增AI辅助写作工具，支持思维导图式写作和结构建议'
          },
          {
            type: UpdateType.NEW,
            description: '新增社区投票系统，用户可以对功能建议进行投票'
          },
          {
            type: UpdateType.IMPROVED,
            description: '首页加载速度提升40%，大幅减少数据加载时间'
          }
        ]
      },
      {
        version: 'V2.4.2',
        title: '界面优化与体验改进',
        date: '2024年11月15日',
        versionType: VersionType.PATCH,
        categories: [UpdateType.IMPROVED, UpdateType.FIXED],
        updates: [
          {
            type: UpdateType.IMPROVED,
            description: '重新设计了文章卡片布局，优化阅读体验'
          },
          {
            type: UpdateType.FIXED,
            description: '修复通知系统偶尔重复推送的问题'
          }
        ]
      }
    ]
  },
  {
    year: 2024,
    month: 10,
    versions: [
      {
        version: 'V2.4.0',
        title: '知识图谱与协作功能',
        date: '2024年10月25日',
        versionType: VersionType.MINOR,
        categories: [UpdateType.NEW, UpdateType.IMPROVED],
        updates: [
          {
            type: UpdateType.NEW,
            description: '新增个人知识图谱功能，可视化展示知识关联'
          },
          {
            type: UpdateType.IMPROVED,
            description: '改进全局搜索算法，提升搜索准确性和响应速度'
          }
        ]
      },
      {
        version: 'V2.3.1',
        title: '移动端优化',
        date: '2024年10月12日',
        versionType: VersionType.PATCH,
        categories: [UpdateType.IMPROVED, UpdateType.FIXED],
        updates: [
          {
            type: UpdateType.IMPROVED,
            description: '全面优化移动端界面，提升触控体验和响应速度'
          },
          {
            type: UpdateType.FIXED,
            description: '修复移动端图片上传功能偶尔失败的问题'
          }
        ]
      }
    ]
  }
]

/**
 * 更新类型标签样式配置
 *
 * @constant UPDATE_TYPE_STYLES
 * @description 不同更新类型的标签样式
 */
export const UPDATE_TYPE_STYLES = {
  [UpdateType.NEW]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: '新功能'
  },
  [UpdateType.IMPROVED]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: '改进'
  },
  [UpdateType.FIXED]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    label: '修复'
  }
} as const

/**
 * 版本标签背景色配置
 *
 * @constant VERSION_TAG_COLORS
 * @description 不同版本类型的标签背景色
 */
export const VERSION_TAG_COLORS = {
  [VersionType.MAJOR]: 'bg-xf-accent',
  [VersionType.MINOR]: 'bg-xf-accent',
  [VersionType.PATCH]: 'bg-xf-primary'
} as const
