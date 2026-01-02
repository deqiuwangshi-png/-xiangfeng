/**
 * 登录表单组件
 * 基于登录注册页.html设计
 */

'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录逻辑
    setTimeout(() => {
      setIsLoading(false);
      console.log('登录数据:', formData);
      alert('登录成功！在实际应用中这里会跳转到主应用页面。');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 邮箱输入框 */}
      <div>
        <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">账号</label>
        <input
          type="email"
          className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      
      {/* 密码输入框 */}
      <div>
        <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">密码</label>
        <input
          type="password"
          className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      
      {/* 记住我和忘记密码 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox w-4 h-4 rounded border-xf-bg bg-xf-light checked:bg-xf-accent checked:border-xf-accent transition-all"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          />
          <span>记住我</span>
        </label>
        <a href="#" className="text-xf-info hover:text-xf-accent transition font-medium">忘记密码?</a>
      </div>
      
      {/* 登录按钮 */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
        disabled={isLoading}
      >
        {isLoading ? <span className="loading-dots">登录中</span> : '登 录'}
      </button>
      
      {/* 注册引导 */}
      <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
        <span className="text-xf-primary">新用户?</span>
        <a href="#" className="hover:text-xf-accent transition font-medium text-xf-info" onClick={onSwitchToRegister}>
          注册新账号 →
        </a>
      </div>
    </form>
  );
}