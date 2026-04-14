/**
 * 设置页面通用按钮组件
 */

interface SettingsBtnProps {
  /** 按钮文本 */
  children: React.ReactNode
  /** 点击回调 */
  onClick: () => void
  /** 是否禁用 */
  disabled?: boolean
  /** 变体样式 */
  variant?: 'primary' | 'danger'
}

/**
 * 设置页面通用按钮
 *
 * @param props 组件属性
 * @returns 统一样式的按钮
 */
export function SettingsBtn({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
}: SettingsBtnProps) {
  const baseStyles =
    'w-full px-4 py-3 border rounded-xl font-medium transition-all'

  const variantStyles = {
    primary:
      'bg-white border-xf-bg/60 hover:bg-xf-light text-xf-primary disabled:opacity-50',
    danger:
      'bg-white border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-50',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  )
}
