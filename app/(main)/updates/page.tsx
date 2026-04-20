/**
 * 更新日志页面（服务器组件）
 * @returns {JSX.Element} 更新日志页面
 * 更新时间: 2026-02-20
 */

import { UpdatesClient } from '@/components/updates'
import { loadUpdatesFromMarkdown, getLatestVersionFromMarkdown } from '@/lib/updates/markdownLoader'

export default function UpdatesPage() {
  const updates = loadUpdatesFromMarkdown()
  const latestVersion = getLatestVersionFromMarkdown()
  
  const updatesData = updates
  const currentVersion = latestVersion || '暂无版本'
  
  return <UpdatesClient initialUpdates={updatesData} latestVersion={currentVersion} />
}
