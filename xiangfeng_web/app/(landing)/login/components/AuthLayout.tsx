/**
 * 认证页面布局组件
 * 基于登录注册页.html设计
 * 包含左侧品牌展示区域和右侧表单区域
 */

import React from 'react';
import { AnimatedBackground } from './AnimatedBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="w-full h-screen flex transition-opacity duration-500 absolute inset-0 z-50 bg-xf-light view-transition">
      {/* 左侧品牌展示区域 - 仅在大屏幕显示 */}
      <div className="hidden lg:flex w-5/12 relative overflow-hidden items-center justify-center p-12 bg-gradient-to-br from-xf-accent/10 to-xf-primary/5">
        <AnimatedBackground />
        
        <div className="relative z-10 text-center fade-in-up">
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-2xl rotate-12 opacity-90 shadow-glow"></div>
          <h1 className="font-serif text-5xl mb-6 text-xf-accent font-bold tracking-wider text-layer-1">相逢</h1>
          <p className="font-serif text-2xl mb-8 text-xf-primary font-medium text-layer-1">不止相遇，更是改变</p>
          <div className="inline-block border-t border-xf-surface/40 pt-8 mt-4">
            <p className="text-lg text-xf-dark/80 font-light italic">"最终的目标不是看到，而是改变。"</p>
          </div>
        </div>
      </div>
      
      {/* 右侧表单区域 */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* 移动端品牌展示 */}
          <div className="text-center mb-12 lg:hidden">
            <h2 className="font-serif text-3xl text-xf-accent font-bold text-layer-1">相逢</h2>
            <p className="text-xf-primary mt-2 font-medium">开启你的深度之旅</p>
          </div>
          
          {/* 表单卡片 */}
          <div className="card-bg rounded-[2rem] p-10 px-12 relative overflow-hidden shadow-deep">
            {/* 顶部渐变边框 */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-xf-soft via-xf-primary to-xf-accent opacity-70"></div>
            
            {/* 标题 */}
            <h2 className="text-2xl font-serif text-xf-accent font-bold mb-8 text-center text-layer-1">{title}</h2>
            
            {/* 表单内容 */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}