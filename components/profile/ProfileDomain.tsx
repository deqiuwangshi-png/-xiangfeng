/**
 * 领域贡献区域组件
 * 
 * 作用: 显示用户的领域贡献信息
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 * 
 * @returns {JSX.Element} 领域贡献区域组件
 * 
 * 更新时间: 2026-02-20
 */

import { Brain, PenTool, Compass } from 'lucide-react'

/**
 * 领域接口
 * 
 * @interface Domain
 * @property {string} title - 领域标题
 * @property {string} description - 领域描述
 * @property {string} articles - 文章数量
 * @property {string} views - 阅读次数
 * @property {React.ElementType} icon - 领域图标组件
 * @property {string} iconType - 图标类型（thinking/writing/philosophy）
 */
interface Domain {
  title: string
  description: string
  articles: string
  views: string
  icon: React.ElementType
  iconType: 'thinking' | 'writing' | 'philosophy'
}

/**
 * 领域数据配置
 * 
 * @constant domainsData
 * @description 定义用户领域贡献
 */
const domainsData: Domain[] = [
  {
    title: '深度思考',
    description: '探索思维的本质，分析现代社会的认知模式，揭示潜藏的思维陷阱。',
    articles: '42 篇文章',
    views: '1.2k 次阅读',
    icon: Brain,
    iconType: 'thinking'
  },
  {
    title: '内容创作',
    description: '专注于高质量的长文创作，系统化梳理复杂概念，构建知识体系。',
    articles: '36 篇文章',
    views: '2.1k 次阅读',
    icon: PenTool,
    iconType: 'writing'
  },
  {
    title: '哲学探讨',
    description: '从现象学到存在主义，探索哲学在现代生活中的实践意义和应用价值。',
    articles: '28 篇文章',
    views: '856 次阅读',
    icon: Compass,
    iconType: 'philosophy'
  }
]

/**
 * 领域贡献区域组件
 * 
 * @function ProfileDomain
 * @returns {JSX.Element} 领域贡献区域组件
 * 
 * @description
 * 提供领域贡献区域的完整功能，包括：
 * - 领域卡片列表
 * - 领域卡片（图标、标题、描述、统计数据）
 * 
 * @layout
 * - 使用 grid 布局
 * - 响应式设计（移动端1列，桌面端3列）
 * - 所有间距完全复制原型数值
 */
export function ProfileDomain() {
  return (
    <div id="profile-domain-section" className="hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {domainsData.map((domain, index) => (
            <div key={index} className="domain-card">
              <div className={`domain-icon ${domain.iconType}`}>
                <domain.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-xf-dark mb-3">{domain.title}</h3>
              <p className="text-sm text-xf-medium mb-4">{domain.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-xf-primary">{domain.articles}</span>
                <span className="text-xs font-medium text-xf-success">{domain.views}</span>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}
