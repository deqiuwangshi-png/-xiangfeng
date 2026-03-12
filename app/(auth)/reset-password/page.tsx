'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToast } from '@/hooks/useAuthToast';
import { createClient } from '@/lib/supabase/client';
import { resetPassword, REGISTER_ERRORS } from '@/lib/auth';
import { validatePassword } from '@/lib/security/passwordPolicy';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { PasswordInput } from '@/components/auth/PasswordInput';

/**
 * 重置密码页面
 * @returns 重置密码页面组件
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showError, showSuccess, showLoading, dismiss } = useAuthToast();

  {/* 检查链接有效性 */}
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsValidLink(false);
        showError('链接已过期或无效，请重新申请', 'validation');
      }
    };

    checkSession();
  }, [showError]);

  /**
   * 处理表单提交
   * @param formData 表单数据
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    const pwd = formData.get('password') as string;
    const confirmPwd = formData.get('confirmPassword') as string;

    {/* 本地验证 */}
    const check = validatePassword(pwd);
    if (!check.valid) {
      showError(check.message, 'validation');
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

  if (!isValidLink) {
    return (
      <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
        <BrandSection />
        <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <MobileBrandTitle />
            <FormCard title="链接已过期">
              <div className="text-center text-red-600 mb-6">链接已过期或无效，请重新申请</div>
              <button
                onClick={() => router.push('/forgot-password')}
                className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
              >
                重新申请
              </button>
            </FormCard>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title={isSuccess ? '重置成功' : '设置新密码'}>
            {!isSuccess ? (
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
            ) : (
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
            )}
          </FormCard>
        </div>
      </div>
    </section>
  );
}
