/**
 * 模态框组件
 * 提供弹出层功能
 */

'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} relative`}>
          {/* 标题栏 */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-xf-soft">
              <h3 className="text-lg font-semibold text-xf-dark">{title}</h3>
              <button
                onClick={onClose}
                className="text-xf-medium hover:text-xf-dark"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* 内容区域 */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}