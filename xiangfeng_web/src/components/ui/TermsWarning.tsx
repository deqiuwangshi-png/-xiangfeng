/**
 * 警告提示组件
 * 用于显示重要的警告信息，带有警告图标和特殊样式
 */

import { ReactNode } from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface TermsWarningProps {
  title?: string;
  children: ReactNode;
  type?: 'default' | 'small';
}

export function TermsWarning({ title, children, type = 'default' }: TermsWarningProps) {
  if (type === 'small') {
    return (
      <div className="terms-warning mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-xf-warning mt-0.5 flex-shrink-0" />
          <div>
            {title && <p className="font-medium text-xf-dark mb-1">{title}</p>}
            <p className="text-xf-medium text-sm">{children}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terms-warning mb-12">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white shadow-soft flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-xf-warning" />
        </div>
        <div>
          {title && <h4 className="text-xl font-bold text-xf-dark mb-2">{title}</h4>}
          <p className="text-xf-medium">{children}</p>
        </div>
      </div>
    </div>
  );
}