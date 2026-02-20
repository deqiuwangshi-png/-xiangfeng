import { ReactNode } from 'react';

/**
 * 表单卡片组件
 * 
 * 作用: 提供表单卡片的容器和装饰
 * 
 * @param title - 卡片标题
 * @param children - 表单内容
 * @param className - 可选的额外类名
 * 
 * 使用说明:
 *   用于登录和注册页面的表单卡片
 *   包含顶部装饰条和卡片样式
 */

interface FormCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, children, className = '' }: FormCardProps) {
  return (
    <div className={`card-bg rounded-4xl p-10 px-12 relative overflow-hidden shadow-deep ${className}`}>
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 w-full h-2 bg-xf-primary/70 opacity-70" />

      {/* 卡片标题 */}
      <h2 className="text-2xl font-serif text-xf-accent font-bold mb-8 text-center">{title}</h2>

      {/* 表单内容 */}
      {children}
    </div>
  );
}
