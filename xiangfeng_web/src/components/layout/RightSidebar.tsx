'use client';

import { Sparkles, Users, Hash, ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';

/**
 * 右侧边栏组件
 * 显示活动广场、关注统计和深度探索内容
 */
export default function RightSidebar() {
  return (
    <aside className="w-[320px] flex-shrink-0 card-bg h-full p-8 pt-12 hidden xl:flex flex-col border-l border-[var(--color-xf-bg)]/50 backdrop-blur-sm" id="right-sidebar">
      {/* 活动广场 */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-[var(--color-xf-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          活动广场
        </h3>
        {/* 直播活动 */}
        <div className="card-bg rounded-[1.5rem] p-5 shadow-soft border border-transparent hover:border-[var(--color-xf-primary)]/30 transition-all cursor-pointer mb-4 group hover:shadow-elevated">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[var(--color-xf-accent)]/15 text-[var(--color-xf-accent)] px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide">LIVE 今晚</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--color-xf-primary)] opacity-0 group-hover:opacity-100 transition" />
          </div>
          <h4 className="font-bold text-[var(--color-xf-dark)] text-sm mb-1 leading-snug group-hover:text-[var(--color-xf-accent)] transition text-layer-1">与产品经理聊聊&quot;改变&quot;</h4>
          <p className="text-xs text-[var(--color-xf-primary)] font-medium">嘉宾：Gemini AI · 20:00 开始</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-xf-info)] font-medium">
            <Clock className="w-3 h-3" />
            <span className="font-mono">19:30 准备入场</span>
          </div>
        </div>
        {/* 线下活动 */}
        <div className="card-bg rounded-[1.5rem] p-5 shadow-soft border border-transparent hover:border-[var(--color-xf-primary)]/30 transition-all cursor-pointer group hover:shadow-elevated">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[var(--color-xf-info)]/15 text-[var(--color-xf-info)] px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide">线下·上海</span>
          </div>
          <h4 className="font-bold text-[var(--color-xf-dark)] text-sm mb-1 leading-snug group-hover:text-[var(--color-xf-info)] transition text-layer-1">周末读书会：静默的力量</h4>
          <p className="text-xs text-[var(--color-xf-primary)] font-medium">12月20日 · 安福路</p>
        </div>
      </div>

      {/* 关注统计 */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-[var(--color-xf-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users className="w-4 h-4" />
          关注统计
        </h3>
        <div className="space-y-3">
          <div className="bg-[var(--color-xf-light)]/60 rounded-xl p-4">
            <h4 className="font-medium text-[var(--color-xf-dark)] text-sm mb-1">互相关注</h4>
            <div className="flex items-center gap-2 mt-2">
              <Image 
                src="https://api.dicebear.com/7.x/micah/svg?seed=Alice&backgroundColor=e1e4ea" 
                alt="Alice"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full" 
              />
              <Image 
                src="https://api.dicebear.com/7.x/micah/svg?seed=Bob&backgroundColor=d2c3d5" 
                alt="Bob"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full" 
              />
              <Image 
                src="https://api.dicebear.com/7.x/micah/svg?seed=Charlie&backgroundColor=a5c1d6" 
                alt="Charlie"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full" 
              />
              <div className="w-8 h-8 rounded-full bg-[var(--color-xf-bg)] flex items-center justify-center text-xs text-[var(--color-xf-primary)] font-bold">+12</div>
            </div>
          </div>
          <div className="bg-[var(--color-xf-light)]/60 rounded-xl p-4">
            <h4 className="font-medium text-[var(--color-xf-dark)] text-sm mb-1">共同兴趣</h4>
            <p className="text-xs text-[var(--color-xf-medium)]">与 85% 的关注者有相似兴趣</p>
          </div>
        </div>
      </div>

      {/* 深度探索 */}
      <div>
        <h3 className="text-xs font-bold text-[var(--color-xf-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          深度探索
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <span className="tag px-4 py-2 bg-white shadow-sm rounded-full text-xs text-[var(--color-xf-dark)] font-medium hover:scale-105 active:scale-95 cursor-pointer transition-all">#认知觉醒</span>
          <span className="tag px-4 py-2 bg-white shadow-sm rounded-full text-xs text-[var(--color-xf-dark)] font-medium hover:scale-105 active:scale-95 cursor-pointer transition-all">#极简主义</span>
          <span className="tag px-4 py-2 bg-white shadow-sm rounded-full text-xs text-[var(--color-xf-dark)] font-medium hover:scale-105 active:scale-95 cursor-pointer transition-all">#存在主义</span>
          <span className="tag px-4 py-2 bg-white shadow-sm rounded-full text-xs text-[var(--color-xf-dark)] font-medium hover:scale-105 active:scale-95 cursor-pointer transition-all">#AIGC与伦理</span>
          <span className="tag px-4 py-2 bg-white shadow-sm rounded-full text-xs text-[var(--color-xf-dark)] font-medium hover:scale-105 active:scale-95 cursor-pointer transition-all">#美学生活</span>
        </div>
      </div>
    </aside>
  );
}
