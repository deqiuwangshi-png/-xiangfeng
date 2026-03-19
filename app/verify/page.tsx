'use client';

/**
 * 验证页面 - 处理 Supabase 邮件链接
 * @module app/verify/page
 * @description 处理各种验证链接（重置密码、邮箱验证等）
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * 验证处理组件
 * @function VerifyHandler
 * @description 实际的验证逻辑处理
 */
function VerifyHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('正在处理...');

  useEffect(() => {
    // @安全边界 V-01: 确保在客户端执行
    if (typeof window === 'undefined') return;

    const handleVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      // @安全边界 V-02: 参数校验
      if (!token || !type) {
        setMessage('链接无效，缺少必要参数');
        return;
      }

      // @安全边界 V-03: 验证类型白名单
      const validTypes = ['recovery', 'signup', 'email_change', 'magiclink'];
      if (!validTypes.includes(type)) {
        setMessage('无效的验证类型');
        return;
      }

      try {
        const supabase = createClient();

        switch (type) {
          case 'recovery': {
            // 密码重置 - 验证 token 并跳转到重置页面
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery',
            });

            if (error) {
              console.error('[Verify] Recovery error:', error);
              setMessage('链接已过期或无效，请重新申请重置密码');
              return;
            }

            // @安全边界 V-04: 验证成功后跳转
            setMessage('验证成功，正在跳转...');
            router.push('/reset-password');
            break;
          }

          case 'signup': {
            // 邮箱验证
            const { error: signupError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'signup',
            });

            if (signupError) {
              console.error('[Verify] Signup error:', signupError);
              setMessage('验证失败：' + signupError.message);
              return;
            }

            setMessage('验证成功！即将跳转到登录页面...');
            setTimeout(() => router.push('/login'), 2000);
            break;
          }

          case 'email_change': {
            // 邮箱变更验证
            const { error: emailError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email_change',
            });

            if (emailError) {
              console.error('[Verify] Email change error:', emailError);
              setMessage('验证失败：' + emailError.message);
              return;
            }

            setMessage('邮箱修改成功！即将跳转到登录页面...');
            setTimeout(() => router.push('/login'), 2000);
            break;
          }

          case 'magiclink': {
            // Magic Link 登录
            const { error: magicError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'magiclink',
            });

            if (magicError) {
              console.error('[Verify] Magic link error:', magicError);
              setMessage('登录链接已过期或无效');
              return;
            }

            setMessage('登录成功！正在跳转...');
            router.push('/home');
            break;
          }

          default:
            setMessage('未知的验证类型');
        }
      } catch (err) {
        // @安全边界 V-05: 错误处理
        console.error('[Verify] Unexpected error:', err);
        setMessage('验证过程中发生错误，请稍后重试');
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-xf-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-xf-primary mx-auto mb-4" />
        <p className="text-xf-medium">{message}</p>
      </div>
    </div>
  );
}

/**
 * 验证页面组件
 * @function VerifyPage
 * @description 使用 Suspense 包裹，避免 SSR 问题
 */
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-xf-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-xf-primary mx-auto mb-4" />
          <p className="text-xf-medium">正在加载...</p>
        </div>
      </div>
    }>
      <VerifyHandler />
    </Suspense>
  );
}
