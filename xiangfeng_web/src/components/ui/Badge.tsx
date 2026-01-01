import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

/**
 * 徽章组件
 * @param {ReactNode} children - 徽章内容
 * @param {string} variant - 徽章类型：primary | secondary | success | warning | error | outline
 * @param {string} size - 徽章尺寸：sm | md | lg
 * @param {string} className - 自定义样式类
 * @param {boolean} rounded - 是否圆角
 * @returns {JSX.Element} 徽章组件
 */
export function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  rounded = false,
  ...props 
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-xf-primary text-white',
    secondary: 'bg-xf-secondary text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    outline: 'border border-xf-border bg-white text-xf-dark'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };

  const borderRadius = rounded ? 'rounded-full' : 'rounded-md';
  
  const classes = `inline-flex items-center justify-center font-medium ${borderRadius} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}