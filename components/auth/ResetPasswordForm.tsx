'use client';

/**
 * 重置密码表单组件
 * @module components/auth/ResetPasswordForm
 * @description 重置密码表单逻辑和交互（包含 session 检查、成功/错误状态）
 * @性能优化 P1: 从 page.tsx 分离，使页面主体支持 SSR
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToast } from '@/hooks/useAuthToast';
import { createClient } from '@/lib/supabase/client';
import { resetPassword, REGISTER_ERRORS } from '@/lib/auth';
import { validatePassword } from '@/lib/security/passwordPolicy';
import { PasswordInput } from '@/components/auth/PasswordInput';

/**
 * 重置密码表单组件
 * @function ResetPasswordForm
 * @returns {JSX.Element} 重置密码表单、成功页面或错误页面
 * @description
 * 包含 session 检查、表单状态管理、提交处理、成功/错误状态
 * 作为 Client Component 独立出来，使页面主体可 SSR
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showError, showSuccess, showLoading, dismiss } = useAuthToast();

  {/*
    @修复 U-04: 修复重置密码链接快速过期问题
    - 使用 onAuthStateChange 监听 recovery 事件
    - 添加 URL hash 解析作为备用方案
    - 增加重试机制，处理时序问题
    - 添加调试日志便于排查问题
  */}
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      {/* 首先尝试从 URL hash 恢复 session */}
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        {/* URL 中有 token，等待 Supabase 自动处理 */}
        console.log('[ResetPassword] 检测到 URL token，等待恢复 session...');

        {/* 订阅认证状态变化 */}
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('[ResetPassword] Auth state changed:', event);
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
              if (session) {
                console.log('[ResetPassword] Session 恢复成功');
                setIsValidLink(true);
                setIsChecking(false);
              }
            }
          }
        );

        {/* 同时尝试直接获取 session */}
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('[ResetPassword] 直接获取 session 成功');
          setIsValidLink(true);
          setIsChecking(false);
          subscription.unsubscribe();
          return;
        }

        {/* 延迟再次检查，处理时序问题 */}
        const timeoutId = setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          if (delayedSession) {
            console.log('[ResetPassword] 延迟检查 session 成功');
            setIsValidLink(true);
          } else {
            console.log('[ResetPassword] Session 恢复失败');
            setIsValidLink(false);
            showError('链接已过期或无效，请重新申请', 'validation');
          }
          setIsChecking(false);
          subscription.unsubscribe();
        }, 500);

        return () => {
          clearTimeout(timeoutId);
          subscription.unsubscribe();
        };
      } else {
        {/* 没有 token，检查现有 session */}
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsValidLink(false);
          showError('链接已过期或无效，请重新申请', 'validation');
        }
        setIsChecking(false);
      }
    };

    checkSession();
  }, [showError]);

  /**
   * 处理表单提交
   * @param {FormData} formData - 表单数据
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    const pwd = formData.get('password') as string;
    const confirmPwd = formData.get('confirmPassword') as string;

    {/* 本地验证 */}
    const check = validatePassword(pwd);
    if (!check.valid) {
      showError(check.message ?? '密码不符合安全要求', 'validation');
      setIsLoading(false);
      return;
    }

    if (pwd !== confirmPwd) {
      showError(REGISTER_ERRORS.PASSWORD_MISMATCH, 'validation');
      setIsLoading(false);
      return;
    }

    const toastId = showLoading('处理中...');
    const result = await resetPassword(formData);

    dismiss(toastId);

    if (!result.success) {
      showError(result.error || '重置失败');
      setIsLoading(false);
      return;
    }

    showSuccess('密码重置成功');
    setIsSuccess(true);
    setIsLoading(false);
  }

  {/* 检查中状态 - 显示骨架屏 */}
  if (isChecking) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-14 w-full bg-gray-300 rounded-2xl animate-pulse" />
      </div>
    );
  }

  {/*
    @修复 U-02: 链接无效状态只返回内容，不返回布局
    - 页面已包含 BrandSection、MobileBrandTitle、FormCard
    - 避免布局重复嵌套
  */}
  if (!isValidLink) {
    return (
      <>
        <div className="text-center text-red-600 mb-6">链接已过期或无效，请重新申请</div>
        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
        >
          重新申请
        </button>
      </>
    );
  }

  {/* 成功状态 */}
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xf-medium">密码重置成功，请使用新密码登录</p>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
        >
          前往登录
        </button>
      </div>
    );
  }

  {/* 表单状态 */}
  return (
    <form action={handleSubmit} className="space-y-6">
      <PasswordInput
        label="新密码"
        name="password"
        placeholder="•••••••"
        required
        disabled={isLoading}
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        label="确认密码"
        name="confirmPassword"
        placeholder="•••••••"
        required
        disabled={isLoading}
        minLength={8}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {isLoading ? <span className="loading-dots">处理中</span> : '重置密码'}
      </button>
    </form>
  );
}
