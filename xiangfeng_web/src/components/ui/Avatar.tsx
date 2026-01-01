import { ReactNode } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  className?: string;
  rounded?: boolean;
  status?: 'online' | 'offline' | 'away';
  children?: ReactNode;
}

/**
 * 头像组件
 * @param {string} src - 头像图片URL
 * @param {string} alt - 替代文本
 * @param {string} size - 头像尺寸：xs | sm | md | lg | xl
 * @param {string} name - 用户名（用于生成首字母）
 * @param {string} className - 自定义样式类
 * @param {boolean} rounded - 是否圆角
 * @param {string} status - 在线状态：online | offline | away
 * @param {ReactNode} children - 子元素
 * @returns {JSX.Element} 头像组件
 */
export function Avatar({ 
  src, 
  alt = '', 
  size = 'md', 
  name = '', 
  className = '',
  rounded = true,
  status,
  children,
  ...props 
}: AvatarProps) {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  };

  const borderRadius = rounded ? 'rounded-full' : 'rounded-md';
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const classes = `relative inline-flex items-center justify-center ${borderRadius} ${sizeStyles[size]} ${className}`;

  return (
    <div className={classes} {...props}>
      {src ? (
        <img 
          src={src} 
          alt={alt || name} 
          className={`w-full h-full object-cover ${borderRadius}`}
        />
      ) : (
        <div className={`w-full h-full bg-xf-primary text-white flex items-center justify-center font-medium ${borderRadius}`}>
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusStyles[status]} rounded-full border-2 border-white`} />
      )}
      
      {children}
    </div>
  );
}