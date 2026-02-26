/**
 * 注册表单组件
 * 基于登录注册页.html设计
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟注册逻辑
    setTimeout(() => {
      setIsLoading(false);
      console.log('注册数据:', formData);
      router.push('/home');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 邮箱输入框 */}
      <div>
        <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">邮箱</label>
        <input
          type="email"
          className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      
      {/* 用户名输入框 */}
      <div>
        <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">用户名</label>
        <input
          type="text"
          className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
          placeholder="选择用户名"
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
      
      {/* 确认密码输入框 */}
      <div>
        <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">确认密码</label>
        <input
          type="password"
          className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
          placeholder="••••••••"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>
      
      {/* 服务条款复选框 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox w-4 h-4 rounded border-xf-bg bg-xf-light checked:bg-xf-accent checked:border-xf-accent transition-all"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            required
          />
          <span>我已阅读并同意服务条款</span>
        </label>
      </div>
      
      {/* 注册按钮 */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
        disabled={isLoading}
      >
        {isLoading ? <span className="loading-dots">注册中</span> : '注册'}
      </button>
      
      {/* 登录引导 */}
      <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
        <span className="text-xf-primary">已有账号?</span>
        <a href="#" className="hover:text-xf-accent transition font-medium text-xf-info" onClick={onSwitchToLogin}>
          立即登录 →
        </a>
      </div>
    </form>
  );
}