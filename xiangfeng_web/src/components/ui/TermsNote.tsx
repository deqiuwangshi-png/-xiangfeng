/**
 * 注意事项组件
 * 用于显示辅助说明信息，带有特殊样式
 */

import { ReactNode } from 'react';

interface TermsNoteProps {
  title?: string;
  children: ReactNode;
}

export function TermsNote({ title, children }: TermsNoteProps) {
  return (
    <div className="terms-note">
      {title && <p className="font-medium text-xf-dark mb-1">{title}</p>}
      <p className="text-xf-medium text-sm">{children}</p>
    </div>
  );
}