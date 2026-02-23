/**
 * 我的内容区域组件
 * 
 * 作用: 显示用户的最新文章列表
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 * 
 * 设计原则:
 * - HTML原型文件是唯一真理数据来源
 * - 严格遵循原型中的所有样式和布局
 * - 不得自行修改或"优化"原型设计
 * - 所有间距完全复制原型数值
 * 
 * @returns {JSX.Element} 我的内容区域组件
 * 
 * 使用说明:
 *   - 使用 Server Component 渲染静态内容
 *   - 使用 lucide-react 图标组件
 *   - 所有间距完全复制原型数值
 * 
 * 更新时间: 2026-02-20
 */

import { BookOpen, Brain, ThumbsUp, MessageSquare as MessageIcon } from 'lucide-react'

/**
 * 文章接口
 * 
 * @interface Article
 * @property {string} series - 系列名称
 * @property {string} publishTime - 发布时间
 * @property {string} title - 文章标题
 * @property {string} summary - 文章摘要
 * @property {string[]} tags - 文章标签
 * @property {number} likes - 点赞数
 * @property {number} comments - 评论数
 * @property {React.ElementType} icon - 文章图标组件
 * @property {string} iconGradient - 图标背景渐变类
 */
interface Article {
  series: string
  publishTime: string
  title: string
  summary: string
  tags: string[]
  likes: number
  comments: number
  icon: React.ElementType
  iconGradient: string
}

/**
 * 文章数据配置
 * 
 * @constant articlesData
 * @description 定义用户最新文章
 */
const articlesData: Article[] = [
  {
    series: '深度思考系列',
    publishTime: '发布于 2天前',
    title: '为什么我们总是陷入"忙碌的陷阱"？',
    summary: '在现代社会，忙碌似乎成了一种荣誉勋章。但这种持续的紧绷感，是否正在剥夺我们深度思考的能力？本文试图从韩炳哲的《倦怠社会》出发，探讨如何重建我们的...',
    tags: ['#深度思考', '#生活方式'],
    likes: 124,
    comments: 32,
    icon: BookOpen,
    iconGradient: 'from-xf-accent to-xf-primary'
  },
  {
    series: '认知科学笔记',
    publishTime: '发布于 5天前',
    title: '注意力经济时代的认知对抗',
    summary: '在这个信息过载的时代，我们的注意力成了最宝贵的资源。本文探讨如何在算法推荐的信息茧房中保持独立思考，重建自己的认知主权...',
    tags: ['#认知科学', '#注意力管理'],
    likes: 89,
    comments: 15,
    icon: Brain,
    iconGradient: 'from-xf-info to-xf-soft'
  }
]

/**
 * 我的内容区域组件
 * 
 * @function ProfileContent
 * @returns {JSX.Element} 我的内容区域组件
 * 
 * @description
 * 提供我的内容区域的完整功能，包括：
 * - 最新文章标题
 * - 文章列表
 * - 文章卡片（系列、发布时间、标题、摘要、标签、互动数据）
 * 
 * @layout
 * - 使用 grid 布局
 * - 响应式设计（移动端1列，桌面端2列）
 * - 所有间距完全复制原型数值
 */
export function ProfileContent() {
  return (
    <div id="profile-content-section">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articlesData.map((article, index) => (
            <article
              key={index}
              className="card-bg rounded-4xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
            >
              {/* 文章头部 */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-linear-to-tr ${article.iconGradient} flex items-center justify-center text-white`}>
                  <article.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-xf-dark block">{article.series}</span>
                  <span className="text-xs text-xf-medium font-medium">{article.publishTime}</span>
                </div>
              </div>

              {/* 文章标题 */}
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3 group-hover:text-xf-accent transition-colors leading-tight text-layer-1">
                {article.title}
              </h3>

              {/* 文章摘要 */}
              <p className="text-xf-dark/70 leading-relaxed mb-4 font-normal line-clamp-3">
                {article.summary}
              </p>

              {/* 文章底部 */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-xf-bg/50">
                <div className="flex gap-2">
                  {article.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="tag px-3 py-1 bg-xf-light text-xf-info text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-xf-medium text-sm font-medium">
                  <span className="flex items-center gap-1 hover:text-xf-info transition">
                    <ThumbsUp className="w-4 h-4" />
                    {article.likes}
                  </span>
                  <span className="flex items-center gap-1 hover:text-xf-info transition">
                    <MessageIcon className="w-4 h-4" />
                    {article.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
    </div>
  )
}
