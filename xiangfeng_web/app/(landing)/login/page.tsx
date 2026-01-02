/**
 * 登录注册页面
 * 基于登录注册页.html设计
 * 包含登录和注册两个视图，支持平滑切换
 */

'use client';

import { useState, useEffect } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [isSystemReady, setIsSystemReady] = useState(false);

  // 模拟系统就绪状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSystemReady(true);
      
      // 2秒后隐藏系统就绪提示
      const hideTimer = setTimeout(() => {
        setIsSystemReady(false);
      }, 2000);
      
      return () => clearTimeout(hideTimer);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // 为自定义复选框添加样式
  useEffect(() => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          this.style.backgroundImage = `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpolyline points="20 6 9 17 4 12"%3E%3C/polyline%3E%3C/svg%3E')`;
          this.style.backgroundSize = '12px';
          this.style.backgroundPosition = 'center';
          this.style.backgroundRepeat = 'no-repeat';
        } else {
          this.style.backgroundImage = '';
        }
      });
    });
  }, []);

  // 切换视图 - 实现平滑过渡效果
  const switchView = (viewId: 'login' | 'register') => {
    setCurrentView(viewId);
  };

  return (
    <>
      {/* 系统状态指示器 */}
      <div 
        id="system-status" 
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md text-xs text-xf-accent py-2.5 px-4 rounded-full shadow-soft border border-xf-bg/60 transition-opacity duration-300 pointer-events-none z-50 ${isSystemReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-medium">系统就绪</span>
        </div>
      </div>

      {/* 登录视图 */}
      {currentView === 'login' && (
        <AuthLayout title="欢迎回来">
          <LoginForm onSwitchToRegister={() => switchView('register')} />
        </AuthLayout>
      )}

      {/* 注册视图 */}
      {currentView === 'register' && (
        <AuthLayout title="创建账号">
          <RegisterForm onSwitchToLogin={() => switchView('login')} />
        </AuthLayout>
      )}
    </>
  );
}