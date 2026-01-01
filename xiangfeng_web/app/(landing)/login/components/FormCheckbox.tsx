'use client';

interface FormCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  className?: string;
}

/**
 * 表单复选框组件
 * 提供统一的复选框样式和标签
 */
export function FormCheckbox({ 
  checked, 
  onChange, 
  label, 
  required = false,
  className = ''
}: FormCheckboxProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        className="w-4 h-4 text-xf-primary border-xf-border rounded focus:ring-xf-primary focus:ring-2"
      />
      <label className="text-sm text-xf-medium cursor-pointer">
        {label}
      </label>
    </div>
  );
}