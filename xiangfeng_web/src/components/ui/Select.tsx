/**
 * 选择器组件
 * 提供下拉选择功能
 */

import { SelectHTMLAttributes, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ 
  label, 
  error, 
  helperText, 
  options, 
  className = '', 
  id,
  ...props 
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-xf-dark">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-xf-primary focus:border-transparent
          ${error ? 'border-red-500' : 'border-xf-border'}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-xf-medium">{helperText}</p>
      )}
    </div>
  );
}