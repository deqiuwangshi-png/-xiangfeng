import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  className?: string;
  onClose?: () => void;
}

/**
 * 警告提示组件
 * @param {ReactNode} children - 提示内容
 * @param {string} variant - 提示类型：info | success | warning | error
 * @param {string} title - 可选标题
 * @param {string} className - 自定义样式类
 * @param {Function} onClose - 关闭回调函数
 * @returns {JSX.Element} 警告提示组件
 */
export function Alert({ 
  children, 
  variant = 'info', 
  title, 
  className = '',
  onClose,
  ...props 
}: AlertProps) {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconStyles = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  const classes = `border rounded-lg p-4 ${variantStyles[variant]} ${className}`;

  return (
    <div className={classes} role="alert" {...props}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconStyles[variant]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-current hover:opacity-75 focus:outline-none"
              aria-label="关闭"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}