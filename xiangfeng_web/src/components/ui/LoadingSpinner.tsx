interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

/**
 * 加载旋转器组件
 * @param {string} size - 旋转器尺寸：xs | sm | md | lg | xl
 * @param {string} color - 旋转器颜色：primary | secondary | white | gray
 * @param {string} className - 自定义样式类
 * @param {boolean} fullScreen - 是否全屏显示
 * @param {string} text - 加载文本
 * @returns {JSX.Element} 加载旋转器组件
 */
export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  fullScreen = false,
  text = '加载中...',
  ...props 
}: LoadingSpinnerProps) {
  const sizeStyles = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorStyles = {
    primary: 'border-xf-primary',
    secondary: 'border-xf-secondary',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  const spinner = (
    <div className={`inline-flex items-center justify-center ${className}`} {...props}>
      <div className={`${sizeStyles[size]} ${colorStyles[color]} border-2 border-t-transparent rounded-full animate-spin`} />
      {text && (
        <span className={`ml-2 text-sm ${color === 'white' ? 'text-white' : 'text-xf-medium'}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}