/**
 * 首页组件
 * 基于官网首页.html设计
 */

'use client';

import { useState } from 'react';
import Sidebar from '@/src/components/layout/Sidebar';
import { RefreshCw, Share2, Heart, MessageSquare, Clock, Eye, User } from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'publish'>('home');

  // 切换标签
  const handleTabChange = (tabName: 'home' | 'explore' | 'publish') => {
    setActiveTab(tabName);
    // 这里可以添加页面切换逻辑，例如滚动到顶部或更新内容
    document.getElementById('main-scroll')?.scrollTo(0, 0);
  };

  // 分享哲学感悟
  const sharePhilosophy = () => {
    alert('已复制哲学感悟到剪贴板');
  };

  // 刷新内容
  const refreshContent = () => {
    alert('正在刷新动态...');
    // 模拟刷新延迟
    setTimeout(() => {
      alert('已更新最新动态');
    }, 800);
  };

  // 加载更多内容
  const loadMore = () => {
    alert('加载更多内容...');
  };

  // 查看文章
  const readArticle = (id: number) => {
    alert(`正在加载文章 ID: ${id}...`);
  };

  // 加入讨论
  const joinDiscussion = (id: number) => {
    alert(`正在加入讨论 ID: ${id}...`);
  };

  // 探索标签
  const exploreTag = (tag: string) => {
    alert(`探索标签: #${tag}`);
  };

  return (
    <div id="app-view" className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden view-transition">
      {/* 左侧边栏 */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主内容区域 */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar px-6 md:px-10 pt-8 pb-20 relative scroll-smooth" id="main-scroll">
        {/* 首页内容 */}
        <div id="tab-home" className="max-w-4xl mx-auto fade-in-up">
          {/* 欢迎区域 */}
          <div className="mb-10">
            <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 mb-8">欢迎回来，梦话</h1>

            {/* 哲学文理卡片 */}
            <div className="philosophy-card rounded-2xl p-8 mb-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <i data-lucide="quote" className="w-8 h-8 text-xf-primary/40 flex-shrink-0 mt-1"></i>
                  <div>
                    <p className="philosophy-text text-2xl font-serif text-xf-accent font-medium leading-relaxed mb-6">
                      人生已过半，昨日依附青山。光阴如梭，岁月如歌，唯愿此心常在，与世长存。
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-xf-primary italic">—— 山中答问 · 禅意随想</p>
                      <button
                        className="text-xs px-4 py-2 bg-white/50 hover:bg-white/80 text-xf-primary rounded-full border border-xf-bg/60 transition-all"
                        onClick={sharePhilosophy}
                      >
                        <Share2 className="w-3 h-3 inline mr-1" />
                        分享感悟
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最新动态 */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-xf-accent font-bold text-layer-1">最新动态</h2>
              <button className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2" onClick={refreshContent}>
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>
            </div>

            <div className="space-y-8">
              {/* 动态 1 */}
              <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => readArticle(1)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/micah/svg?seed=Sophia&backgroundColor=E1E4EA"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold text-xf-dark">Sophia Chen</h4>
                      <p className="text-sm text-xf-primary">关注了你的文章 • 1小时前</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-xf-primary/10 text-xf-primary text-xs rounded-full font-medium">新动态</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                  Sophia 收藏了你的文章《深度思考的方法论》
                </h3>
                <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-2">
                  "这篇文章的思考框架非常有启发性，特别是关于第一性原理的应用部分。期待看到更多关于认知科学的内容！"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-xf-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      12人点赞
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      5条评论
                    </span>
                  </div>
                  <button
                    className="px-4 py-1.5 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-lg text-xs font-medium transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      readArticle(1);
                    }}
                  >
                    查看文章
                  </button>
                </div>
              </div>

              {/* 动态 2 */}
              <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => joinDiscussion(1)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-xf-accent to-xf-primary flex items-center justify-center text-white text-sm font-bold">
                      哲
                    </div>
                    <div>
                      <h4 className="font-bold text-xf-dark">哲学沉思录社群</h4>
                      <p className="text-sm text-xf-primary">你关注的社群有新讨论 • 3小时前</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-xf-info/10 text-xf-info text-xs rounded-full font-medium">8人在线</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                  哲学沉思录：存在主义与现代生活
                </h3>
                <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-2">
                  社群成员正在讨论如何将存在主义哲学应用于现代生活的焦虑管理。从"存在先于本质"到"荒谬的应对"，探讨这些哲学概念的实践意义...
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-xf-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      15人参与
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      28条消息
                    </span>
                  </div>
                  <button className="px-4 py-1.5 bg-xf-info hover:bg-xf-info/90 text-white rounded-lg text-xs font-medium transition-all">
                    加入讨论
                  </button>
                </div>
              </div>

              {/* 动态 3 */}
              <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => readArticle(2)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/micah/svg?seed=Liam&backgroundColor=D2C3D5"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold text-xf-dark">Liam Zhang</h4>
                      <p className="text-sm text-xf-primary">发表了新文章 • 5小时前</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-xf-info/10 text-xf-info text-xs rounded-full font-medium">新文章</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                  认知科学视角下的注意力管理
                </h3>
                <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-2">
                  基于最新的认知科学研究，探讨注意力系统的运作机制，分享如何在数字干扰环境中训练"深度注意力"。包括神经可塑性、注意力恢复理论等前沿概念...
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-xf-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      8分钟阅读
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      342阅读
                    </span>
                  </div>
                  <button
                    className="px-4 py-1.5 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-lg text-xs font-medium transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      readArticle(2);
                    }}
                  >
                    阅读全文
                  </button>
                </div>
              </div>
            </div>

            {/* 加载更多按钮 */}
            <div className="mt-12 text-center">
              <button
                className="px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all flex items-center gap-2 mx-auto"
                onClick={loadMore}
              >
                <span className="w-4 h-4 flex items-center justify-center">+</span>
                加载更多动态
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 简化右侧边栏 - 可折叠 */}
      <aside
        className="hidden lg:flex w-[300px] flex-shrink-0 card-bg h-full p-6 pt-10 flex-col border-l border-xf-bg/50 backdrop-blur-sm"
        id="right-sidebar"
      >
        {/* 个人状态 */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-xf-primary mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            个人状态
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-xf-dark">连续登录</span>
              <span className="text-sm font-bold text-xf-accent">7天</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-xf-dark">本月阅读</span>
              <span className="text-sm font-bold text-xf-accent">12篇</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-xf-dark">文章发表</span>
              <span className="text-sm font-bold text-xf-accent">3篇</span>
            </div>
          </div>
        </div>

        {/* 关注标签 */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-xf-primary mb-4 flex items-center gap-2">
            <span className="w-4 h-4">#</span>
            关注标签
          </h3>
          <div className="flex flex-wrap gap-2">
            <span
              className="tag px-3 py-1.5 bg-white shadow-sm rounded-full text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => exploreTag('cognitive-science')}
            >
              #认知科学
            </span>
            <span
              className="tag px-3 py-1.5 bg-white shadow-sm rounded-full text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => exploreTag('existentialism')}
            >
              #存在主义
            </span>
            <span
              className="tag px-3 py-1.5 bg-white shadow-sm rounded-full text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => exploreTag('deep-writing')}
            >
              #深度写作
            </span>
            <span
              className="tag px-3 py-1.5 bg-white shadow-sm rounded-full text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => exploreTag('ai-ethics')}
            >
              #AI伦理
            </span>
            <span
              className="tag px-3 py-1.5 bg-white shadow-sm rounded-full text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => exploreTag('digital-minimalism')}
            >
              #数字极简
            </span>
          </div>
        </div>

        {/* 最近访问 */}
        <div>
          <h3 className="text-sm font-bold text-xf-primary mb-4 flex items-center gap-2">
            <span className="w-4 h-4">⏰</span>
            最近访问
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => readArticle(5)}>
              <h4 className="font-medium text-xf-dark text-sm mb-1">《倦怠社会》阅读笔记</h4>
              <p className="text-xs text-xf-primary">昨天 • 上次读到第3章</p>
            </div>

            <div className="p-3 bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => joinDiscussion(2)}>
              <h4 className="font-medium text-xf-dark text-sm mb-1">哲学沉思录社群</h4>
              <p className="text-xs text-xf-primary">2天前 • 参与讨论</p>
            </div>

            <div className="p-3 bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => readArticle(6)}>
              <h4 className="font-medium text-xf-dark text-sm mb-1">注意力管理指南</h4>
              <p className="text-xs text-xf-primary">3天前 • 已收藏</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 移动端侧边栏切换按钮 */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center text-xf-primary"
        onClick={() => {
          const sidebar = document.getElementById('right-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('flex');
          }
        }}
      >
        <span className="w-5 h-5">☰</span>
      </button>
    </div>
  );
};

export default HomePage;