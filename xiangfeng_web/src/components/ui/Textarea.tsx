/**
 * 文本域组件
 * 提供多行文本输入
 */

import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id,
  rows = 4,
  ...props 
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-xf-dark">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-xf-primary focus:border-transparent
          ${error ? 'border-red-500' : 'border-xf-border'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-xf-medium">{helperText}</p>
      )}
    </div>
  );
}