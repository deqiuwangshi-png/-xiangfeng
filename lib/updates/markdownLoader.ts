/**
 * Markdown文件加载器
 * 
 * 作用: 从文件系统加载和解析Markdown格式的更新日志文件
 * 
 * @exports loadUpdatesFromMarkdown
 * 
 * 使用说明:
 *   用于从content/updates目录加载Markdown格式的更新日志
 *   支持front matter元数据解析
 *   自动按月份分组和排序
 * 更新时间: 2026-02-20
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { UpdateType, VersionType, MonthlyUpdate, VersionInfo, UpdateItem } from '@/types/user/updates'

/**
 * Markdown文件front matter元数据接口
 * 
 * @interface MarkdownFrontMatter
 * @description Markdown文件的front matter元数据结构
 */
interface MarkdownFrontMatter {
  /** 版本号（如 V2.5.0） */
  version: string
  /** 版本标题 */
  title: string
  /** 发布日期（格式：YYYY-MM-DD） */
  date: string
  /** 版本类型（major/minor/patch） */
  versionType: VersionType
  /** 更新分类（逗号分隔，如 new,improved） */
  categories: string
}

function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const match = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) {
    throw new Error(`日期格式无效: ${dateStr}，期望 YYYY-M-D 或 YYYY-MM-DD`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return { year, month, day };
}

function toDisplayDate(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  return `${year}年${month}月${day}日`;
}

function toSortableTime(displayDate: string): number {
  const match = displayDate.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if (!match) return 0;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(year, month - 1, day).getTime();
}

/**
 * 解析Markdown文件内容
 * 
 * @function parseMarkdownFile
 * @param {string} content - Markdown文件内容
 * @returns {VersionInfo} 解析后的版本信息
 * @throws {Error} 当front matter缺失或格式错误时抛出异常
 * 
 * @description
 * 解析Markdown文件并提取版本信息：
 * 1. 使用gray-matter解析front matter
 * 2. 验证必需的元数据字段
 * 3. 解析Markdown内容中的更新条目
 * 
 * @example
 * const versionInfo = parseMarkdownFile(markdownContent)
 */
function parseMarkdownFile(content: string): VersionInfo {
  const { data, content: markdownBody } = matter(content)
  
  const frontMatter = data as MarkdownFrontMatter
  
  if (!frontMatter.version || !frontMatter.title || !frontMatter.date) {
    throw new Error(`Markdown文件缺少必需的front matter字段: version, title, date`)
  }
  
  const formattedDate = toDisplayDate(frontMatter.date)
  
  const categories: UpdateType[] = frontMatter.categories
    ? frontMatter.categories.split(',').map((c: string) => c.trim() as UpdateType)
    : []
  
  const updates: UpdateItem[] = parseMarkdownUpdates(markdownBody)
  
  return {
    version: frontMatter.version,
    title: frontMatter.title,
    date: formattedDate,
    versionType: frontMatter.versionType || VersionType.PATCH,
    categories,
    updates
  }
}

/**
 * 解析Markdown内容中的更新条目
 * 
 * @function parseMarkdownUpdates
 * @param {string} markdownBody - Markdown正文内容
 * @returns {UpdateItem[]} 更新条目数组
 * 
 * @description
 * 从Markdown正文中提取更新条目：
 * - 识别二级标题（##）作为更新类型
 * - 提取列表项（-）作为更新描述
 * - 支持的标题：新功能、改进优化、问题修复
 * 
 * @example
 * const updates = parseMarkdownUpdates(markdownBody)
 */
function parseMarkdownUpdates(markdownBody: string): UpdateItem[] {
  const updates: UpdateItem[] = []
  const lines = markdownBody.split('\n')
  
  let currentType: UpdateType | null = null
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.startsWith('## ')) {
      const header = trimmedLine.replace('## ', '').trim()
      
      if (header === '新功能') {
        currentType = UpdateType.NEW
      } else if (header === '改进优化') {
        currentType = UpdateType.IMPROVED
      } else if (header === '问题修复') {
        currentType = UpdateType.FIXED
      } else {
        currentType = null
      }
    } else if (trimmedLine.startsWith('- ') && currentType) {
      const description = trimmedLine.replace('- ', '').trim()
      if (description) {
        updates.push({
          type: currentType,
          description
        })
      }
    }
  }
  
  return updates
}

/**
 * 从文件系统加载所有更新日志
 * 
 * @function loadUpdatesFromMarkdown
 * @returns {MonthlyUpdate[]} 按月份分组的更新日志
 * 
 * @description
 * 从content/updates目录加载所有Markdown文件：
 * 1. 读取目录下所有.md文件
 * 2. 按文件名排序（按日期倒序）
 * 3. 解析每个Markdown文件
 * 4. 按月份分组
 * 5. 按日期倒序排序
 * 
 * @example
 * const updates = loadUpdatesFromMarkdown()
 */
export function loadUpdatesFromMarkdown(): MonthlyUpdate[] {
  const updatesDir = path.join(process.cwd(), 'content')
  
  if (!fs.existsSync(updatesDir)) {
    return []
  }
  
  const files = fs.readdirSync(updatesDir)
  const markdownFiles = files.filter(file => file.endsWith('.md'))
  
  const versions: VersionInfo[] = []
  
  for (const file of markdownFiles) {
    const filePath = path.join(updatesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    try {
      const versionInfo = parseMarkdownFile(content)
      versions.push(versionInfo)
    } catch (error) {
      console.error(`解析文件 ${file} 失败:`, error)
    }
  }
  
  versions.sort((a, b) => {
    return toSortableTime(b.date) - toSortableTime(a.date)
  })
  
  const monthlyUpdates = groupUpdatesByMonth(versions)
  
  return monthlyUpdates
}

/**
 * 按月份分组更新日志
 * 
 * @function groupUpdatesByMonth
 * @param {VersionInfo[]} versions - 版本信息数组
 * @returns {MonthlyUpdate[]} 按月份分组的更新日志
 * 
 * @description
 * 将版本信息按月份分组：
 * - 每个月份创建一个MonthlyUpdate对象
 * - 按年份和月份倒序排序
 * 
 * @example
 * const monthly = groupUpdatesByMonth(versions)
 */
function groupUpdatesByMonth(versions: VersionInfo[]): MonthlyUpdate[] {
  const monthMap = new Map<string, VersionInfo[]>()
  
  for (const version of versions) {
    const match = version.date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/)
    const year = match ? Number(match[1]) : 0
    const month = match ? Number(match[2]) : 0
    
    const key = `${year}-${month}`
    
    if (!monthMap.has(key)) {
      monthMap.set(key, [])
    }
    
    monthMap.get(key)!.push(version)
  }
  
  const monthlyUpdates: MonthlyUpdate[] = []
  
  for (const [key, versions] of monthMap.entries()) {
    const [year, month] = key.split('-').map(Number)
    
    monthlyUpdates.push({
      year,
      month,
      versions
    })
  }
  
  monthlyUpdates.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    return b.month - a.month
  })
  
  return monthlyUpdates
}

/**
 * 获取最新版本号
 * 
 * @function getLatestVersionFromMarkdown
 * @returns {string | null} 最新版本号
 * 
 * @description
 * 从所有Markdown文件中获取最新版本号
 * 
 * @example
 * const latestVersion = getLatestVersionFromMarkdown()
 */
export function getLatestVersionFromMarkdown(): string | null {
  const updates = loadUpdatesFromMarkdown()
  
  if (updates.length === 0 || updates[0].versions.length === 0) {
    return null
  }
  
  return updates[0].versions[0].version
}
