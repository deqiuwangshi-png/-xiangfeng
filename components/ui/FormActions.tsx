'use client'

/**
 * 表单操作按钮组件
 *
 * 作用: 提供统一的表单取消和提交按钮
 *
 * @param {function} onCancel - 取消回调函数
 * @param {boolean} loading - 提交按钮加载状态
 * @param {string} submitText - 提交按钮文本，默认为"保存更改"
 * @param {string} cancelText - 取消按钮文本，默认为"取消"
 * @param {boolean} showBorder - 是否显示顶部边框，默认为true
 * @returns {JSX.Element} 表单操作按钮组件
 * 更新时间: 2026-03-02
 */

import { PrimaryButton } from './PrimaryButton'

interface FormActionsProps {
  onCancel: () => void
  loading?: boolean
  submitText?: string
  cancelText?: string
  showBorder?: boolean
}

export function FormActions({
  onCancel,
  loading = false,
  submitText = '保存更改',
  cancelText = '取消',
  showBorder = true,
}: FormActionsProps) {
  return (
    <div className={`flex gap-4 pt-4 ${showBorder ? 'border-t border-xf-bg/60' : ''}`}>
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
      >
        {cancelText}
      </button>
      <PrimaryButton type="submit" loading={loading}>
        {submitText}
      </PrimaryButton>
    </div>
  )
}
