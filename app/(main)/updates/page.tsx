/**
 * 更新日志页面（服务器组件）
 * @returns {JSX.Element} 更新日志页面
 * 更新时间: 2026-02-20
 */

import { UpdatesClient } from '@/components/updates'
import { loadUpdatesFromMarkdown, getLatestVersionFromMarkdown } from '@/lib/updates/markdownLoader'
import { MOCK_UPDATES } from '@/constants/updates'

/**
 * 更新日志页面
 * 
 * @function UpdatesPage
 * @returns {JSX.Element} 更新日志页面
 * 
 * @description
 * 服务器组件，负责：
 * - 从Markdown文件系统读取更新日志数据
 * - 将数据传递给客户端组件进行渲染
 * - 支持静态生成（SSG）
 * 
 * @features
 * - 服务器端数据获取
 * - 静态生成支持
 * - SEO友好
 * - 快速加载
 * 
 * @data
 * - 从content/updates目录读取Markdown文件
 * - 按日期倒序排序
 * - 按月份分组
 */
export default function UpdatesPage() {
  const updates = loadUpdatesFromMarkdown()
  const latestVersion = getLatestVersionFromMarkdown()
  
  const updatesData = updates.length > 0 ? updates : MOCK_UPDATES
  const currentVersion = latestVersion || 'V2.5.0'
  
  return <UpdatesClient initialUpdates={updatesData} latestVersion={currentVersion} />
}
