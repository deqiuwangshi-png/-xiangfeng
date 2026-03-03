'use client';

/**
 * 密码重置页面
 * @module app/(auth)/reset-password/page
 * @description 用户通过邮件链接重置密码
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validatePassword, type PasswordValidationResult } from '@/lib/security/passwordPolicy';
import { useAuthError } from '@/lib/auth/useAuthError';
import { REGISTER_ERRORS, RESET_PASSWORD_ERRORS } from '@/lib/auth/errorMessages';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { PasswordInput } from '@/components/auth/PasswordInput';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);
  const { error, handleSupabaseError, clearError, setError } = useAuthError();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session || sessionError) {
        setIsValidLink(false);
        setError(RESET_PASSWORD_ERRORS.LINK_EXPIRED);
      }
    };

    checkSession();
  }, [setError]);

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (value.length > 0) {
      const result = validatePassword(value);
      setPasswordValidation(result);
    } else {
      setPasswordValidation(null);
    }
  }

  async function handleResetPassword(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }

    if (password !== confirmPassword) {
      setError(REGISTER_ERRORS.PASSWORD_MISMATCH);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      setIsSuccess(true);
    } catch (err) {
      handleSupabaseError(err, 'reset-password');
      if (err instanceof Error && err.message.includes('Session expired')) {
        setIsValidLink(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToLogin() {
    router.push('/login');
  }

  if (!isValidLink && error) {
    return (
      <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
        <BrandSection />
        <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
          <div className="w-full max-w-md">
            <MobileBrandTitle />
            <FormCard title="链接已失效">
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-xf-primary">{error}</p>
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
                >
                  返回登录
                </button>
              </div>
            </FormCard>
          </div>
        </div>
      </section>
    );
  }

  const passwordStrengthHelper = passwordValidation ? (
    <>
      <div className="flex items-center gap-2 text-xs">
        <span className={
          passwordValidation.strength === 'strong' ? 'text-green-500' : 
          passwordValidation.strength === 'medium' ? 'text-yellow-500' : 
          'text-red-500'
        }>
          密码强度: {passwordValidation.strength === 'strong' ? '强' : passwordValidation.strength === 'medium' ? '中' : '弱'}
        </span>
      </div>
      {!passwordValidation.valid && (
        <p className="text-red-500 text-xs mt-1">{passwordValidation.message}</p>
      )}
    </>
  ) : null;

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title={isSuccess ? '重置成功' : '设置新密码'}>
            {!isSuccess ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center text-xf-medium text-sm mb-4">
                  请设置您的新密码，密码需要包含大小写字母、数字和特殊字符。
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <PasswordInput
                  label="新密码"
                  id="new-password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="•••••••"
                  required
                  disabled={isLoading}
                  minLength={8}
                  helper={passwordStrengthHelper}
                />

                <PasswordInput
                  label="确认密码"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="•••••••"
                  required
                  disabled={isLoading}
                  minLength={8}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <span className="loading-dots">重置中</span> : '重置密码'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-xf-primary font-medium">
                    密码重置成功！
                  </p>
                  <p className="text-xf-medium text-sm">
                    您的密码已更新，请使用新密码登录。
                  </p>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
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
