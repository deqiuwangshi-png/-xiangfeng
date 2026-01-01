'use client';

interface AuthButtonProps {
  type: 'submit' | 'button';
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * 认证按钮组件
 * 提供统一的按钮样式和加载状态
 */
export function AuthButton({ 
  type, 
  isLoading, 
  loadingText, 
  children, 
  className = '',
  disabled = false
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`
        w-full py-3 px-4 rounded-lg font-medium text-white
        transition-all duration-200 transform hover:scale-[1.02]
        focus:outline-none focus:ring-2 focus:ring-xf-primary focus:ring-offset-2
        ${isLoading 
          ? 'bg-xf-medium cursor-not-allowed' 
          : 'bg-gradient-to-r from-xf-primary to-xf-secondary hover:shadow-lg'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}