/**
 * Tailwind CSS 配置文件
 * Tailwind CSS v4 简化配置 - 主要样式已迁移到CSS中
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 主题配置已迁移到CSS中的 @theme 块
  theme: {
    extend: {
      // 仅保留必要的配置，其他配置在CSS中定义
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config