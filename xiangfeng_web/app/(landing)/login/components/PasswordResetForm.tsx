'use client';

import { useState } from 'react';

interface PasswordResetFormProps {
  onBack: () => void;
}

/**
 * 密码重置表单组件
 * 处理用户密码重置请求
 */
export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟密码重置逻辑
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log('密码重置请求:', email);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-lg font-semibold text-xf-dark">重置邮件已发送</h3>
        <p className="text-xf-medium text-sm">
          我们已经向 {email} 发送了密码重置链接，请检查您的邮箱
        </p>
        <button
          onClick={onBack}
          className="text-xf-primary hover:text-xf-accent text-sm"
        >
          返回登录
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-xf-dark mb-2">重置密码</h3>
        <p className="text-xf-medium text-sm">输入您的邮箱地址，我们将发送重置链接</p>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xf-medium">
          ✉️
        </div>
        <input
          type="email"
          placeholder="请输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="
            w-full pl-12 pr-4 py-3 border border-xf-border rounded-lg 
            focus:ring-2 focus:ring-xf-primary focus:border-transparent
            transition-all duration-200 bg-white/50 backdrop-blur-sm
            placeholder:text-xf-medium text-xf-dark
          "
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white
          transition-all duration-200 transform hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-xf-primary focus:ring-offset-2
          ${isLoading 
            ? 'bg-xf-medium cursor-not-allowed' 
            : 'bg-gradient-to-r from-xf-primary to-xf-secondary hover:shadow-lg'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>发送中...</span>
          </div>
        ) : (
          '发送重置链接'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-xf-primary hover:text-xf-accent text-sm"
      >
        返回登录
      </button>
    </form>
  );
}