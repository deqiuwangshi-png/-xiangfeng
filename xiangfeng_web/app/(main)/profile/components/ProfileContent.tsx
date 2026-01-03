/**
 * 个人资料内容组件
 * 显示用户的最新文章
 */

import React from 'react';
import { BookOpen, Brain, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';

interface ArticleItem {
  /** 文章ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章分类 */
  category: string;
  /** 发布时间 */
  publishDate: string;
  /** 文章标签 */
  tags: string[];
  /** 获赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 文章类型图标 */
  icon: React.ReactNode;
  /** 文章类型背景色 */
  bgColor: string;
}

interface ProfileContentProps {
  /** 文章列表 */
  articles: ArticleItem[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({ articles }) => {
  return (
    <div className="space-y-8">
      {/* 最新文章 */}
      <div>
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <article key={article.id} className="card-bg rounded-[2rem] p-6 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${article.bgColor} flex items-center justify-center text-white`}>
                  {article.icon}
                </div>
                <div>
                  <span className="text-sm font-bold text-[var(--color-xf-dark)] block">{article.category}</span>
                  <span className="text-xs text-[var(--color-xf-medium)] font-medium">发布于 {article.publishDate}</span>
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-xf-dark)] mb-3 group-hover:text-[var(--color-xf-accent)] transition-colors leading-tight text-layer-1">
                {article.title}
              </h3>
              <p className="text-[var(--color-xf-dark)]/70 leading-relaxed mb-4 font-normal line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-xf-bg)]/50">
                <div className="flex gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag px-3 py-1 bg-[var(--color-xf-light)] text-[var(--color-xf-info)] text-xs rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-[var(--color-xf-medium)] text-sm font-medium">
                  <span className="flex items-center gap-1 hover:text-[var(--color-xf-info)] transition">
                    <ThumbsUp className="w-4 h-4" />
                    {article.likes}
                  </span>
                  <span className="flex items-center gap-1 hover:text-[var(--color-xf-info)] transition">
                    <MessageSquare className="w-4 h-4" />
                    {article.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      {/* 最近活动 */}
      <div>
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">最近活动</h2>
        <div className="space-y-4">
          <div className="card-bg rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-xf-warning)]/20 to-[var(--color-xf-warning)]/5 flex items-center justify-center text-[var(--color-xf-warning)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[var(--color-xf-dark)] text-layer-1">参与了"现象学入门工作坊"</h4>
              <p className="text-sm text-[var(--color-xf-medium)]">12月20日 · 与 Sophia Chen 等 142 人一起</p>
            </div>
            <span className="text-xs text-[var(--color-xf-info)] font-medium bg-[var(--color-xf-info)]/10 px-3 py-1 rounded-full">已参与</span>
          </div>
          
          <div className="card-bg rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-xf-success)]/20 to-[var(--color-xf-success)]/5 flex items-center justify-center text-[var(--color-xf-success)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[var(--color-xf-dark)] text-layer-1">在"哲学沉思录社群"中发表了观点</h4>
              <p className="text-sm text-[var(--color-xf-medium)]">12月18日 · 关于"存在主义与现代焦虑"的讨论</p>
            </div>
            <span className="text-xs text-[var(--color-xf-info)] font-medium bg-[var(--color-xf-info)]/10 px-3 py-1 rounded-full">32 条回复</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ProfileContent 组件的默认文章数据
 */
export const defaultArticles: ArticleItem[] = [
  {
    id: '1',
    title: '为什么我们总是陷入"忙碌的陷阱"？',
    excerpt: '在现代社会，忙碌似乎成了一种荣誉勋章。但这种持续的紧绷感，是否正在剥夺我们深度思考的能力？本文试图从韩炳哲的《倦怠社会》出发，探讨如何重建我们的...',
    category: '深度思考系列',
    publishDate: '2天前',
    tags: ['深度思考', '生活方式'],
    likes: 124,
    comments: 32,
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-[var(--color-xf-accent)] to-[var(--color-xf-primary)]'
  },
  {
    id: '2',
    title: '注意力经济时代的认知对抗',
    excerpt: '在这个信息过载的时代，我们的注意力成了最宝贵的资源。本文探讨如何在算法推荐的信息茧房中保持独立思考，重建自己的认知主权...',
    category: '认知科学笔记',
    publishDate: '5天前',
    tags: ['认知科学', '注意力管理'],
    likes: 89,
    comments: 15,
    icon: <Brain className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-[var(--color-xf-info)] to-[var(--color-xf-soft)]'
  }
];

export default ProfileContent;
