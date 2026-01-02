/**
 * 注册表单组件
 * 基于登录注册页.html设计
 */

'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';
import { FormCheckbox } from './FormCheckbox';
import { AuthButton } from './AuthButton';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('密码不匹配');
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert('请同意服务条款');
      return;
    }

    setIsLoading(true);
    
    // 模拟注册逻辑
    setTimeout(() => {
      setIsLoading(false);
      console.log('注册数据:', formData);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        type="text"
        placeholder="请输入用户名"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        icon="👤"
      />
      
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
      
      <FormInput
        type="password"
        placeholder="请确认密码"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
        icon="🔐"
      />

      <FormCheckbox
        checked={formData.agreeToTerms}
        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
        label={
          <span>
            我已阅读并同意
            <a href="/terms" className="text-xf-primary hover:text-xf-accent mx-1">
              服务条款
            </a>
            和
            <a href="/privacy" className="text-xf-primary hover:text-xf-accent mx-1">
              隐私政策
            </a>
          </span>
        }
      />

      <AuthButton type="submit" isLoading={isLoading} loadingText="注册中...">
        注册
      </AuthButton>
    </form>
  );
}