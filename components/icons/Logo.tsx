/**
 * 品牌 Logo 组件
 * @module components/icons/Logo
 * @description "相逢" 品牌 Logo - 交汇之环设计
 */

import { CSSProperties } from 'react'

/**
 * Logo 组件属性
 */
interface LogoProps {
  /** Logo 尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 是否显示文字 */
  showText?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
}

/**
 * 尺寸映射
 */
const sizeMap = {
  sm: { logo: 32, text: 'text-lg', gap: 'gap-2' },
  md: { logo: 48, text: 'text-xl', gap: 'gap-3' },
  lg: { logo: 64, text: 'text-2xl', gap: 'gap-4' },
  xl: { logo: 80, text: 'text-3xl', gap: 'gap-5' },
}

/**
 * 品牌 Logo 组件 - 交汇之环
 *
 * @param {LogoProps} props - 组件属性
 * @returns {JSX.Element} Logo 组件
 *
 * @description
 * 设计理念：两个弧形交汇，象征"相逢"
 * - 双环交织：代表两个灵魂的相遇
 * - 中心光点：象征相遇瞬间的火花
 * - 流动线条：体现缘分的美妙流动
 */
export function Logo({
  size = 'md',
  showText = true,
  className = '',
  style,
}: LogoProps) {
  const { logo: logoSize, text: textSize, gap } = sizeMap[size]

  return (
    <div
      className={`inline-flex items-center ${gap} ${className}`}
      style={style}
    >
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A5B8A" />
            <stop offset="100%" stopColor="#3A3C6E" />
          </linearGradient>
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#logoGlow)">
          <path
            d="M32 8C19.163 8 8 19.163 8 32s11.163 24 24 24"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="logo-arc-left"
          />
          <path
            d="M32 56c12.837 0 24-11.163 24-24S44.837 8 32 8"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="logo-arc-right"
          />
        </g>

        <circle
          cx="32"
          cy="32"
          r="6"
          fill="url(#logoGradient)"
          className="logo-center"
        />
        <circle
          cx="32"
          cy="32"
          r="3"
          fill="#A5C1D6"
          className="logo-core"
        />
      </svg>

      {showText && (
        <span className={`font-serif font-bold text-xf-accent ${textSize} tracking-wider`}>
          相逢
        </span>
      )}
    </div>
  )
}

/**
 * 纯图形 Logo（无文字）
 */
export function LogoMark({ size = 'md', className = '', style }: Omit<LogoProps, 'showText'>) {
  const { logo: logoSize } = sizeMap[size]

  return (
    <svg
      width={logoSize}
      height={logoSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-mark ${className}`}
      style={style}
    >
      <defs>
        <linearGradient id="logoMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6A5B8A" />
          <stop offset="100%" stopColor="#3A3C6E" />
        </linearGradient>
        <filter id="logoMarkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#logoMarkGlow)">
        <path
          d="M32 8C19.163 8 8 19.163 8 32s11.163 24 24 24"
          stroke="url(#logoMarkGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 56c12.837 0 24-11.163 24-24S44.837 8 32 8"
          stroke="url(#logoMarkGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <circle cx="32" cy="32" r="6" fill="url(#logoMarkGradient)" />
      <circle cx="32" cy="32" r="3" fill="#A5C1D6" />
    </svg>
  )
}
