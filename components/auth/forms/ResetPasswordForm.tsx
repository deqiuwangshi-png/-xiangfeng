/* eslint-disable react-hooks/immutability */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthToast } from '@/hooks/auth/useAuthToast';
import { createClient } from '@/lib/supabase/client';
import { resetPassword } from '@/lib/auth/client';
import { validatePassword } from '@/lib/security/passwordPolicy';
import { PasswordInput } from '@/components/auth/ui/PasswordInput';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess, showLoading, dismiss } = useAuthToast();

  // ========== 状态 ==========
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pageState, setPageState] = useState<'checking' | 'error' | 'form'>('checking');
  const [errorInfo, setErrorInfo] = useState<{code: string; message: string} | null>(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {

    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDesc = searchParams.get('error_description');

    if (error) {
      // 有错误参数 → 直接显示错误，不需要检查 session
      setErrorInfo({
        code: errorCode || 'unknown',
        message: decodeURIComponent(errorDesc || '验证失败')
      });
      setPageState('error');
      return;
    }

    // 2. 无错误参数 → 检查 session（成功流程）

    checkSession();
  }, [searchParams]);

  async function checkSession() {
    const supabase = createClient();
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
          setPageState('form');
        }
      }
    );

    // 立即检查现有 session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setPageState('form');
    } else {
      // 给 Supabase 1秒时间从 hash 恢复（成功时 token 在 #hash 中）
      setTimeout(async () => {
        const { data: { session: s } } = await supabase.auth.getSession();
        setPageState(s ? 'form' : 'error');
        if (!s) {
          setErrorInfo({
            code: 'no_session',
            message: '无法验证身份，请重新申请密码重置'
          });
        }
      }, 1000);
    }

    return () => subscription.unsubscribe();
  }

  // ========== 提交处理 ==========
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const pwd = formData.get('password') as string;
    const confirmPwd = formData.get('confirmPassword') as string;

    // 验证密码...
    const check = validatePassword(pwd);
    if (!check.valid) {
      showError(check.message || '密码不符合安全要求');
      setIsLoading(false);
      return;
    }
    if (pwd !== confirmPwd) {
      showError('两次输入的密码不一致');
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

  // ========== 渲染 ==========
  
  // 1. 检查中
  if (pageState === 'checking') {
    return (
      <div className="space-y-6">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // 2. 错误状态（核心修复：显示具体错误）
  if (pageState === 'error' && errorInfo) {
    const isExpired = errorInfo.code === 'otp_expired';
    
    return (
      <div className="text-center space-y-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          isExpired ? 'bg-orange-100' : 'bg-red-100'
        }`}>
          <span className="text-2xl">{isExpired ? '⏰' : '⚠️'}</span>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {isExpired ? '链接已过期' : '验证失败'}
          </h3>
          <p className="text-gray-600 mt-2">
            {isExpired 
              ? '密码重置链接有效期为1小时，请重新申请' 
              : errorInfo.message}
          </p>
          {isExpired && (
            <p className="text-sm text-gray-500 mt-2">
              提示：邮件发送后请及时查收，避免链接过期
            </p>
          )}
        </div>
        
        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
        >
          重新申请
        </button>
      </div>
    );
  }

  // 3. 成功状态
  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">密码重置成功</h3>
          <p className="text-gray-600 mt-2">请使用新密码登录</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
        >
          去登录
        </button>
      </div>
    );
  }

  // 4. 表单状态
  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">新密码</label>
        <PasswordInput
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入新密码"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">确认密码</label>
        <PasswordInput
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="请再次输入新密码"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
      >
        {isLoading ? '处理中...' : '重置密码'}
      </button>
    </form>
  );
}