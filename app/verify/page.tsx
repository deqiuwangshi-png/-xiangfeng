'use client';

/**
 * 验证页面 - 处理 Supabase 邮件链接
 * @module app/verify/page
 * @description 处理各种验证链接（重置密码、邮箱验证等）
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * 验证页面组件
 * @function VerifyPage
 * @description 解析 URL 参数，处理不同类型的验证请求
 */
export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('正在处理...');

  useEffect(() => {
    const handleVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const supabase = createClient();

      if (!token || !type) {
        setMessage('链接无效');
        return;
      }

      try {
        switch (type) {
          case 'recovery':
            // 密码重置 - 验证 token 并跳转到重置页面
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery',
            });

            if (error) {
              setMessage('链接已过期或无效');
              return;
            }

            // 验证成功，跳转到重置密码页面
            router.push('/reset-password');
            break;

          case 'signup':
            // 邮箱验证
            const { error: signupError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'signup',
            });

            if (signupError) {
              setMessage('验证失败：' + signupError.message);
              return;
            }

            setMessage('验证成功！即将跳转到登录页面...');
            setTimeout(() => router.push('/login'), 2000);
            break;

          case 'email_change':
            // 邮箱变更验证
            const { error: emailError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email_change',
            });

            if (emailError) {
              setMessage('验证失败：' + emailError.message);
              return;
            }

            setMessage('邮箱修改成功！即将跳转到登录页面...');
            setTimeout(() => router.push('/login'), 2000);
            break;

          default:
            setMessage('未知的验证类型');
        }
      } catch (err) {
        console.error('验证失败:', err);
        setMessage('验证过程中发生错误');
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
