/**
 * 官网专属Logo组件
 * 作为网站的唯一标识图标
 * 
 * @param size - 图标尺寸: 'sm' | 'md' | 'lg'
 * @param showText - 是否显示文字标识
 * @param className - 自定义样式类
 */

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 官网唯一图标容器 */}
      <div className={`${sizeClasses[size]} bg-gradient-to-tr from-xf-accent to-xf-primary rounded-lg flex items-center justify-center animate-logo-pulse`}>
        {/* 使用 Image 组件加载 SVG 文件 */}
        <Image 
          src="/LOGO.svg" 
          alt="相逢 Logo"
          width={iconSizes[size]}
          height={iconSizes[size]}
          className="text-white"
        />
      </div>
      
      {/* 网站名称 */}
      {showText && (
        <span className={`font-serif font-bold text-gradient ${textSizes[size]}`}>
          相逢
        </span>
      )}
    </div>
  );
};