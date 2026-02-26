'use client';

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: string;
  className?: string;
}

/**
 * 表单输入组件
 * 提供统一的输入框样式和图标支持
 */
export function FormInput({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  icon,
  className = ''
}: FormInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xf-medium">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-3 border border-xf-border rounded-lg 
          focus:ring-2 focus:ring-xf-primary focus:border-transparent
          transition-all duration-200 bg-white/50 backdrop-blur-sm
          placeholder:text-xf-medium text-xf-dark
          ${icon ? 'pl-12' : 'pl-4'} ${className}
        `}
      />
    </div>
  );
}