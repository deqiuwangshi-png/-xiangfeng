'use client';

/**
 * 注册表单组件
 * @module components/auth/RegisterForm
 */

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { register } from '@/lib/auth/client';
import { PasswordInput } from '@/components/auth/ui/PasswordInput';
import { PwdStrength } from '@/components/auth/ui/PwdStrength';
import { OAuthButtons } from '@/components/auth/ui/OAuthButtons';
import { validatePassword } from '@/lib/security/passwordPolicy';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValidation = validatePassword(password);

  const getPasswordStrengthColor = () => {
    const { score } = passwordValidation;
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message || '密码不符合安全要求');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('注册中...');

    try {
      const normalizedUsername = email.split('@')[0].replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 20) || `user${Date.now().toString().slice(-6)}`;
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);
      formData.set('username', normalizedUsername);
      const result = await register(formData);
      toast.dismiss(toastId);

      if (!result.success) {
        toast.error(result.error || '注册失败，请重试');
        setIsLoading(false);
        return;
      }

      toast.success('验证邮件已发送，请检查邮箱');
      setIsSuccess(true);
    } catch {
      toast.dismiss(toastId);
      toast.error('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-xf-primary mb-4">验证邮件已发送</h3>
        <p className="text-xf-medium mb-2">请检查您的邮箱：</p>
        <p className="text-xf-dark font-medium mb-8">{email}</p>

        <div className="mt-6">
          <Link
            href="/login"
            className="w-full flex items-center justify-center bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
          >
            已验证，返回登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <OAuthButtons disabled={isLoading} dividerText="或使用邮箱注册" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
            placeholder="邮箱"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            required
            disabled={isLoading}
            minLength={8}
          />
          <PwdStrength
            validation={passwordValidation}
            strengthColor={getPasswordStrengthColor()}
          />
        </div>

        <div>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="确认密码"
            required
            disabled={isLoading}
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg text-lg tracking-wide disabled:opacity-50"
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>

      <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
        <span className="text-xf-primary">已有账号?</span>
        <Link href="/login" className="hover:text-xf-accent transition font-medium text-xf-info">
          立即登录 →
        </Link>
      </div>
    </>
  );
}
