/**
 * 条款区块组件
 * 用于组织条款内容，包含标题和内容区域
 */

import { ReactNode } from 'react';

interface TermsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function TermsSection({ id, title, children }: TermsSectionProps) {
  return (
    <section id={id} className="terms-section mb-16">
      <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">{title}</h2>
      <div className="terms-content space-y-6">
        {children}
      </div>
    </section>
  );
}