'use client';

/**
 * 密码输入组件
 * @module components/auth/PasswordInput
 * @description 带可见性切换的密码输入框，用于认证系统
 */

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput Props 接口
 * @interface PasswordInputProps
 */
interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 输入框标签 */
  label?: React.ReactNode;
  /** 错误提示信息 */
  error?: string;
  /** 额外说明内容（如密码强度提示） */
  helper?: React.ReactNode;
}

/**
 * 密码输入组件
 * @function PasswordInput
 * @param {PasswordInputProps} props - 组件属性
 * @param {React.Ref<HTMLInputElement>} ref - 转发ref
 * @returns {JSX.Element} 密码输入组件
 * 
 * @example
 * <PasswordInput
 *   label="密码"
 *   placeholder="请输入密码"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helper, className = '', disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    /**
     * 切换密码可见性
     */
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={className}>
        {label && (
          <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={`
              w-full px-6 py-4 pr-12 rounded-2xl bg-xf-light border 
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-xf-bg/60 focus:border-xf-primary focus:ring-xf-primary/20'}
              focus:bg-white focus:ring-2 outline-none transition-all text-xf-dark
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="
              absolute right-4 top-1/2 -translate-y-1/2 
              text-xf-primary hover:text-xf-accent 
              transition-colors p-1 rounded
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-xf-primary/30
            "
            aria-label={showPassword ? '隐藏密码' : '显示密码'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-500 text-xs px-2">{error}</p>
        )}
        {helper && (
          <div className="mt-2 px-2">{helper}</div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
