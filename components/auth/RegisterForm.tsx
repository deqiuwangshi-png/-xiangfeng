'use client';

/**
 * 注册表单组件
 * @module components/auth/RegisterForm
 * @description 注册表单逻辑和交互（包含成功状态）
 * @性能优化 P1: 从 page.tsx 分离，使页面主体支持 SSR
 */

import Link from 'next/link';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PwdStrength } from '@/components/auth/PwdStrength';

/**
 * 注册表单组件
 * @function RegisterForm
 * @returns {JSX.Element} 注册表单或成功页面
 * @description
 * 包含表单状态管理、密码强度校验、提交处理、成功状态
 * 作为 Client Component 独立出来，使页面主体可 SSR
 */
export function RegisterForm() {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    passwordValidation,
    updateField,
    submitForm,
    getPasswordStrengthColor,
  } = useRegisterForm();

  /**
   * 处理表单提交
   * @param {React.FormEvent<HTMLFormElement>} event - 表单提交事件
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitForm();
  }

  {/*
    @修复 U-02: 成功状态只返回内容，不返回布局
    - 页面已包含 BrandSection、MobileBrandTitle、FormCard
    - 避免布局重复嵌套
  */}
  if (isSuccess) {
    return (
      <div className="text-center py-8">
        {/* 成功图标 */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 成功标题 */}
        <h3 className="text-xl font-semibold text-xf-primary mb-4">
          验证邮件已发送
        </h3>

        {/* 邮箱地址 */}
        <p className="text-xf-medium mb-2">请检查您的邮箱：</p>
        <p className="text-xf-dark font-medium mb-8">{formData.email}</p>

        {/* 已验证，返回登录按钮 */}
        <div className="mt-6">
          <Link
            href="/login"
            className="w-full flex items-center justify-center bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
          >
            已验证，返回登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 邮箱字段 */}
        <div>
          <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">
            邮箱
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* 用户名字段 */}
        <div>
          <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">
            用户名
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => updateField('username', e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
            placeholder="选择用户名"
            required
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-red-500 text-xs">{errors.username}</p>
          )}
        </div>

        {/* 密码字段 */}
        <div>
          <PasswordInput
            label={
              <>
                密码
                {passwordValidation && (
                  <span className={`ml-2 text-sm ${getPasswordStrengthColor()}`}>
                    ({passwordValidation.strength === 'strong' ? '强' :
                      passwordValidation.strength === 'medium' ? '中' : '弱'})
                  </span>
                )}
              </>
            }
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={8}
          />
          <PwdStrength
            validation={passwordValidation}
            strengthColor={getPasswordStrengthColor()}
          />
          {errors.password && (
            <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* 确认密码字段 */}
        <div>
          <PasswordInput
            label="确认密码"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={8}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 服务条款 */}
        <div>
          <label className="flex items-center gap-2 text-sm text-xf-medium cursor-pointer">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => updateField('terms', e.target.checked)}
              disabled={isLoading}
            />
            <span>
              同意
              <a href="/terms" target="_blank" className="text-xf-info hover:underline">
                服务条款
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-red-500 text-xs">{errors.terms}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="loading-dots">注册中</span> : '注册'}
        </button>
      </form>

      {/* 登录链接 */}
      <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
        <span className="text-xf-primary">已有账号?</span>
        <Link
          href="/login"
          className="hover:text-xf-accent transition font-medium text-xf-info"
        >
          立即登录 →
        </Link>
      </div>
    </>
  );
}
