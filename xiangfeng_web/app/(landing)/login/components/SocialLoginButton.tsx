import { ReactNode } from 'react';

interface SocialLoginButtonProps {
  provider: 'wechat' | 'qq' | 'github' | 'google';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * 社交登录按钮组件
 * @param {string} provider - 社交提供商：wechat | qq | github | google
 * @param {ReactNode} children - 按钮内容
 * @param {string} className - 自定义样式类
 * @param {Function} onClick - 点击回调函数
 * @returns {JSX.Element} 社交登录按钮组件
 */
export function SocialLoginButton({ 
  provider, 
  children, 
  className = '',
  onClick,
  ...props 
}: SocialLoginButtonProps) {
  const providerStyles = {
    wechat: 'bg-green-500 hover:bg-green-600 text-white',
    qq: 'bg-blue-500 hover:bg-blue-600 text-white',
    github: 'bg-gray-800 hover:bg-gray-900 text-white',
    google: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
  };

  const providerIcons = {
    wechat: '📱',
    qq: '🔵',
    github: '🐙',
    google: '🔍'
  };

  const classes = `inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${providerStyles[provider]} ${className}`;

  return (
    <button 
      type="button"
      className={classes} 
      onClick={onClick}
      {...props}
    >
      <span className="mr-2">{providerIcons[provider]}</span>
      {children}
    </button>
  );
}