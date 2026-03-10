'use client';

import { Toaster } from 'sonner';

/**
 * Toast Provider 组件
 * @description 全局 Toast 提示容器
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
        },
      }}
    />
  );
}
