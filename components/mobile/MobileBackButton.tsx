'use client'

/**
 * 移动端返回按钮组件
 * @module components/mobile/MobileBackButton
 * @description 用于子页面的返回导航
 */

import Link from 'next/link'
import { ArrowLeft } from '@/components/icons'

/**
 * 移动端返回按钮组件属性接口
 * @interface MobileBackButtonProps
 */
interface MobileBackButtonProps {
  /** 返回链接 */
  href: string
  /** 页面标题 */
  title?: string
}

/**
 * 移动端返回按钮组件
 * @param {MobileBackButtonProps} props - 组件属性
 * @returns {JSX.Element} 返回按钮
 */
export function MobileBackButton({ href, title }: MobileBackButtonProps) {
  return (
    <div className="lg:hidden flex items-center gap-3 mb-4">
      <Link
        href={href}
        className="p-2 rounded-lg hover:bg-xf-surface/50 transition-colors"
        aria-label="返回"
      >
        <ArrowLeft className="w-5 h-5 text-xf-dark" />
      </Link>
      {title && (
        <h1 className="text-lg font-serif text-xf-accent font-bold">{title}</h1>
      )}
    </div>
  )
}
