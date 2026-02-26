/**
 * 重要条款卡片组件
 * 用于突出显示重要的条款内容，带有特殊样式
 */

import { ReactNode } from 'react';

interface ImportantClauseProps {
  title?: string;
  children: ReactNode;
}

export function ImportantClause({ title, children }: ImportantClauseProps) {
  return (
    <div className="important-clause">
      {title && <p className="font-bold text-xf-accent mb-2">{title}</p>}
      <p className="text-xf-medium">{children}</p>
    </div>
  );
}