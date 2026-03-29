/**
 * 受保护操作组件
 * @module components/auth/ProtectedAction
 * @description 包装需要认证的操作按钮/组件，未登录时显示登录提示
 */

'use client';
import Link from 'next/link'
import { useState, type ReactNode, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToast } from '@/hooks/useAuthToast';

/**
 * 受保护操作组件属性
 * @interface ProtectedActionProps
 */
interface ProtectedActionProps {
  /** 子元素（按钮或触发器） */
  children: ReactNode;
  /** 操作名称（用于提示） */
  actionName?: string;
  /** 点击后的回调（已认证时调用） */
  onAction?: () => void | Promise<void>;
  /** 是否显示登录弹窗而不是跳转 */
  showModal?: boolean;
  /** 自定义登录提示 */
  loginMessage?: string;
  /** 是否禁用认证检查（调试用） */
  bypassAuth?: boolean;
}

/**
 * 受保护的操作包装组件
 *
 * @param {ProtectedActionProps} props - 组件属性
 * @returns {JSX.Element} 包装后的组件
 *
 * @example
 *   <ProtectedAction actionName="点赞" onAction={handleLike}>
 *     <button className="like-btn">点赞</button>
 *   </ProtectedAction>
 *
 * @example
 *   <ProtectedAction actionName="评论" loginMessage="登录后即可发表评论">
 *     <CommentInput />
 *   </ProtectedAction>
 */
export function ProtectedAction({
  children,
  actionName = '此操作',
  onAction,
  showModal = false,
  loginMessage,
  bypassAuth = false,
}: ProtectedActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showLoginRequired } = useAuthToast();

  /**
   * 处理点击事件
   */
  const handleClick = async (e: MouseEvent) => {
    {/* 阻止默认行为，由我们控制 */}
    e.preventDefault();
    e.stopPropagation();

    if (bypassAuth) {
      await onAction?.();
      return;
    }

    setIsLoading(true);

    try {
      {/* 检查认证状态 */}
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!data.authenticated) {
        {/* 未登录 - 显示提示或跳转 */}
        if (showModal) {
          showLoginRequired(loginMessage || actionName);
        } else {
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
        return;
      }

      {/* 已登录 - 执行操作 */}
      await onAction?.();
    } catch (error) {
      console.error('[ProtectedAction] 认证检查失败:', error);
      showLoginRequired('操作');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`protected-action-wrapper ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as MouseEvent);
        }
      }}
    >
      {children}
    </span>
  );
}

/**
 * 需要认证的按钮组件
 *
 * @param {Omit<ProtectedActionProps, 'children'> & { label: string; icon?: ReactNode; className?: string }} props - 组件属性
 * @returns {JSX.Element} 按钮组件
 *
 * @example
 * <AuthRequiredButton
 *   label="发布文章"
 *   icon={<PlusIcon />}
 *   onAction={() => router.push('/publish')}
 * />
 */
export function AuthRequiredButton({
  label,
  icon,
  className = '',
  ...props
}: Omit<ProtectedActionProps, 'children'> & {
  label: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <ProtectedAction {...props}>
      <button className={`auth-required-btn ${className}`} type="button">
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-label">{label}</span>
      </button>
    </ProtectedAction>
  );
}

/**
 * 匿名用户遮罩组件
 * 为内容区域添加遮罩，提示需要登录
 *
 * @param {{ children: ReactNode; message?: string }} props - 组件属性
 * @returns {JSX.Element} 遮罩组件
 */
export function AnonymousMask({
  children,
  message = '登录后查看完整内容',
}: {
  children: ReactNode;
  message?: string;
}) {
  return (
    <div className="anonymous-mask-container relative">
      {children}
      <div className="anonymous-mask absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <p className="text-xf-medium mb-4">{message}</p>
        <Link href="/login">
          <button
            className="px-6 py-2 bg-xf-primary text-white rounded-lg font-medium hover:bg-xf-primary/90 transition-colors"
            type="button"
          >
            立即登录
          </button>
        </Link>
      </div>
    </div>
  );
}
