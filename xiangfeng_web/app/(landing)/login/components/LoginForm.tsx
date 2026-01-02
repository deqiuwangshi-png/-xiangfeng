/**
 * 登录表单组件
 * 基于登录注册页.html设计
 */

'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';
import { FormCheckbox } from './FormCheckbox';
import { AuthButton } from './AuthButton';

export function LoginForm() {
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
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        type="email"
        placeholder="请输入邮箱地址"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        icon="✉️"
      />
      
      <FormInput
        type="password"
        placeholder="请输入密码"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        icon="🔒"
      />

      <div className="flex items-center justify-between">
        <FormCheckbox
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          label="记住我"
        />
        <a href="#" className="text-sm text-xf-primary hover:text-xf-accent">
          忘记密码？
        </a>
      </div>

      <AuthButton type="submit" isLoading={isLoading} loadingText="登录中...">
        登录
      </AuthButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-xf-soft"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/80 text-xf-medium">或者</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center px-4 py-2 border border-xf-soft rounded-lg hover:bg-xf-light transition-colors"
        >
          <span className="text-sm">GitHub</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-2 border border-xf-soft rounded-lg hover:bg-xf-light transition-colors"
        >
          <span className="text-sm">Google</span>
        </button>
      </div>
    </form>
  );
}