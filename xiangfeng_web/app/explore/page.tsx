/**
 * 探索页面组件
 * 基于官网探索.html设计
 */

'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Search, Clock, MessageSquare, Users, Heart, Star, Plus, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'publish'>('explore');
  const [activePath, setActivePath] = useState('recommended');

  // 切换标签
  const handleTabChange = (tabName: 'home' | 'explore' | 'publish') => {
    setActiveTab(tabName);
    // 这里可以添加页面切换逻辑，例如滚动到顶部或更新内容
    document.getElementById('main-scroll')?.scrollTo(0, 0);
  };

  // 选择探索路径
  const selectExplorePath = (path: string) => {
    setActivePath(path);
  };

  // 探索项目
  const exploreItem = (type: string, id: number) => {
    alert(`探索 ${type} ID: ${id}...`);
  };

  // 加载更多内容
  const loadMoreExplore = () => {
    alert('加载更多内容...');
  };

  // 搜索标签
  const searchTag = (tag: string) => {
    alert(`搜索标签: #${tag}`);
  };

  // 查看思考者
  const viewThinker = (id: number) => {
    alert(`查看思考者 ID: ${id}...`);
  };

  return (
    <div id="app-view" className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden view-transition">
      {/* 左侧边栏 */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主内容区域 */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar px-6 md:px-10 pt-8 pb-20 relative scroll-smooth" id="main-scroll">
        {/* 探索页面内容 */}
        <div id="tab-explore" className="max-w-4xl mx-auto fade-in-up">
          {/* 探索标题 */}
          <div className="mb-10">
            <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 mb-8">探索新内容</h1>

            {/* 搜索区域 */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-xf-primary" />
                <input
                  type="text"
                  placeholder="搜索话题、文章或思考者..."
                  className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-white border border-xf-bg/60 focus:border-xf-primary outline-none text-xf-dark text-layer-1"
                />
              </div>
            </div>

            {/* 探索路径 */}
            <div className="mb-8">
              <div className="explore-path-simple">
                <div
                  className={`path-node-simple ${activePath === 'recommended' ? 'active' : ''}`}
                  onClick={() => selectExplorePath('recommended')}
                >
                  为你推荐
                </div>
                <div
                  className={`path-node-simple ${activePath === 'trending' ? 'active' : ''}`}
                  onClick={() => selectExplorePath('trending')}
                >
                  热门趋势
                </div>
                <div
                  className={`path-node-simple ${activePath === 'editor' ? 'active' : ''}`}
                  onClick={() => selectExplorePath('editor')}
                >
                  编辑精选
                </div>
                <div
                  className={`path-node-simple ${activePath === 'new' ? 'active' : ''}`}
                  onClick={() => selectExplorePath('new')}
                >
                  新发现
                </div>
                <div
                  className={`path-node-simple ${activePath === 'following' ? 'active' : ''}`}
                  onClick={() => selectExplorePath('following')}
                >
                  关注动态
                </div>
              </div>
            </div>


          </div>

          {/* 探索内容网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 探索卡片 1 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('article', 1)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://api.dicebear.com/7.x/micah/svg?seed=Sophia&backgroundColor=e1e4ea"
                    alt="Sophia Chen"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                    unoptimized
                  />
                  <div>
                    <h4 className="font-bold text-xf-dark">Sophia Chen</h4>
                    <p className="text-sm text-xf-primary">哲学研究者 • 3小时前</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-xf-primary/10 text-xf-primary text-xs rounded-full font-medium">哲学</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                《倦怠社会》与现代性困境
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                韩炳哲在《倦怠社会》中提出了"功绩社会"的概念，指出现代社会将自我剥削包装成自我实现。这种"过度积极"的文化不仅导致心理疲惫...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    15分钟
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    24条评论
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    exploreItem('article', 1);
                  }}
                >
                  阅读文章
                </button>
              </div>
            </div>

            {/* 探索卡片 2 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('discussion', 1)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-xf-accent to-xf-primary flex items-center justify-center text-white text-sm font-bold">
                    哲
                  </div>
                  <div>
                    <h4 className="font-bold text-xf-dark">哲学沉思录社群</h4>
                    <p className="text-sm text-xf-primary">讨论社群 • 活跃中</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-xf-info/10 text-xf-info text-xs rounded-full font-medium">在线</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                存在主义与日常生活
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                社群成员正在探讨萨特、加缪的存在主义思想如何帮助我们面对现代社会的意义危机。从"存在先于本质"到"荒谬的应对"...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    8人参与
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    42条消息
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-xf-info hover:bg-xf-info/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={() => exploreItem('discussion', 1)}
                >
                  加入讨论
                </button>
              </div>
            </div>

            {/* 探索卡片 3 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('thinker', 1)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://api.dicebear.com/7.x/micah/svg?seed=Liam&backgroundColor=d2c3d5"
                    alt="Liam Zhang"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                    unoptimized
                  />
                  <div>
                    <h4 className="font-bold text-xf-dark">Liam Zhang</h4>
                    <p className="text-sm text-xf-primary">认知科学家 • 昨天活跃</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-xf-primary/10 text-xf-primary text-xs rounded-full font-medium">科学</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                注意力与认知科学
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                基于最新的认知科学研究，探讨注意力系统的运作机制，分享如何在数字干扰环境中训练"深度注意力"...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    12篇文章
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    456关注
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    exploreItem('thinker', 1);
                  }}
                >
                  关注思考者
                </button>
              </div>
            </div>

            {/* 探索卡片 4 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('article', 2)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://api.dicebear.com/7.x/micah/svg?seed=Alex&backgroundColor=f0e6ef"
                    alt="Alex Wang"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                    unoptimized
                  />
                  <div>
                    <h4 className="font-bold text-xf-dark">Alex Wang</h4>
                    <p className="text-sm text-xf-primary">心理学研究者 • 1天前</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-xf-primary/10 text-xf-primary text-xs rounded-full font-medium">心理学</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                正念冥想对焦虑缓解的实证研究
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                基于最新的心理学研究，探讨正念冥想如何影响大脑结构，以及其在焦虑管理中的应用效果...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    12分钟
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    89点赞
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    exploreItem('article', 2);
                  }}
                >
                  阅读文章
                </button>
              </div>
            </div>

            {/* 探索卡片 5 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('discussion', 2)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold">
                    科
                  </div>
                  <div>
                    <h4 className="font-bold text-xf-dark">科技伦理圈</h4>
                    <p className="text-sm text-xf-primary">热点讨论 • 趋势中</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full font-medium">热门</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                AI时代的人文关怀
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                在人工智能快速发展的背景下，如何确保技术进步不偏离人文价值，构建负责任的AI生态系统...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    32人参与
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    128条消息
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-500/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={() => exploreItem('discussion', 2)}
                >
                  加入讨论
                </button>
              </div>
            </div>

            {/* 探索卡片 6 */}
            <div className="card-bg rounded-2xl p-6 group cursor-pointer" onClick={() => exploreItem('community', 1)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white text-sm font-bold">
                    简
                  </div>
                  <div>
                    <h4 className="font-bold text-xf-dark">数字极简实践</h4>
                    <p className="text-sm text-xf-primary">生活方式社群 • 上周成立</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">新</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
                远离数字干扰，重获专注力
              </h3>
              <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
                分享数字极简的实践经验，探讨如何在信息过载的时代保持深度思考能力和内心平静...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-xf-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    203成员
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    4.8评分
                  </span>
                </div>
                <button
                  className="px-4 py-1.5 bg-green-500 hover:bg-green-500/90 text-white rounded-lg text-xs font-medium transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    exploreItem('community', 1);
                  }}
                >
                  加入社群
                </button>
              </div>
            </div>
          </div>

          {/* 加载更多 */}
          <div className="mt-12 text-center">
            <button
              className="px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all flex items-center gap-2 mx-auto"
              onClick={loadMoreExplore}
            >
              <Plus className="w-4 h-4" />
              加载更多内容
            </button>
          </div>

          {/* 探索提示 */}
          <div className="mt-12 p-5 bg-xf-light/50 rounded-xl border border-xf-bg/40">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-xf-dark text-sm mb-1">探索提示</h4>
                <p className="text-xs text-xf-primary">使用搜索功能或点击标签发现感兴趣的内容。关注你喜欢的思考者，系统会为你推荐更多相关内容。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 简化右侧边栏 - 可折叠 */}
      <aside
        className="hidden lg:flex w-[300px] flex-shrink-0 card-bg h-full p-6 pt-10 flex-col border-l border-xf-bg/50 backdrop-blur-sm"
        id="right-sidebar"
      >
        {/* 热门标签 */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-xf-primary mb-4 flex items-center gap-2">
            <span className="w-4 h-4">#</span>
            热门标签
          </h3>
          <div className="flex flex-wrap gap-2">
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('cognitive-science')}
            >
              #认知科学
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('existentialism')}
            >
              #存在主义
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('deep-writing')}
            >
              #深度写作
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('ai-ethics')}
            >
              #AI伦理
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('digital-minimalism')}
            >
              #数字极简
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('mindfulness')}
            >
              #正念冥想
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('philosophy')}
            >
              #哲学
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('psychology')}
            >
              #心理学
            </span>
            <span
              className="tag px-3 py-1.5 text-xs text-xf-dark font-medium cursor-pointer"
              onClick={() => searchTag('technology')}
            >
              #科技
            </span>
          </div>
        </div>

        {/* 推荐思考者 */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-xf-primary mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            推荐思考者
          </h3>
          <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 hover:bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => viewThinker(1)}>
                <Image
                  src="https://api.dicebear.com/7.x/micah/svg?seed=Taylor&backgroundColor=a5c1d6"
                  alt="Taylor"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                  unoptimized
                />
              <div className="flex-1">
                <h4 className="font-medium text-xf-dark text-sm">Taylor Liu</h4>
                <p className="text-xs text-xf-primary">科技伦理学者</p>
              </div>
              <button className="text-xs px-2 py-1 bg-xf-primary/10 text-xf-primary rounded">关注</button>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => viewThinker(2)}>
              <Image
                src="https://api.dicebear.com/7.x/micah/svg?seed=Jordan&backgroundColor=e1e4ea"
                alt="Jordan Lee"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                unoptimized
              />
              <div className="flex-1">
                <h4 className="font-medium text-xf-dark text-sm">Jordan Lee</h4>
                <p className="text-xs text-xf-primary">文学评论家</p>
              </div>
              <button className="text-xs px-2 py-1 bg-xf-primary/10 text-xf-primary rounded">关注</button>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-xf-light/50 rounded-xl cursor-pointer" onClick={() => viewThinker(3)}>
              <Image
                src="https://api.dicebear.com/7.x/micah/svg?seed=Riley&backgroundColor=d2c3d5"
                alt="Riley Zhang"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                unoptimized
              />
              <div className="flex-1">
                <h4 className="font-medium text-xf-dark text-sm">Riley Zhang</h4>
                <p className="text-xs text-xf-primary">社会学研究者</p>
              </div>
              <button className="text-xs px-2 py-1 bg-xf-primary/10 text-xf-primary rounded">关注</button>
            </div>
          </div>
        </div>

        {/* 探索统计 */}
        <div className="mt-auto p-4 bg-xf-light/50 rounded-xl">
          <h4 className="font-medium text-xf-dark text-sm mb-2">探索统计</h4>
          <div className="flex items-center justify-between text-xs text-xf-primary">
            <span>今日新内容</span>
            <span className="font-bold text-xf-accent">42</span>
          </div>
          <div className="flex items-center justify-between text-xs text-xf-primary mt-2">
            <span>本周活跃社群</span>
            <span className="font-bold text-xf-accent">18</span>
          </div>
          <div className="flex items-center justify-between text-xs text-xf-primary mt-2">
            <span>新加入思考者</span>
            <span className="font-bold text-xf-accent">7</span>
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

export default ExplorePage;