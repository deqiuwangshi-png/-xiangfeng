/**
 * Tailwind CSS 配置文件
 * Tailwind CSS v4 配置 - 与草图探索.html保持一致
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 自定义颜色主题
      colors: {
        xf: {
          bg: '#E1E4EA',
          surface: '#D2C3D5',
          primary: '#6A5B8A',
          accent: '#3A3C6E',
          info: '#4A6FA5',
          soft: '#A5C1D6',
          dark: '#25263D',
          light: '#F7F9FC',
          medium: '#8C8EA9',
          success: '#4CAF50',
          warning: '#FF9800',
          border: '#E1E4EA',
        }
      },
      // 字体配置
      fontFamily: {
        sans: ['"Noto Sans SC"', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'serif'],
      },
      // 阴影配置
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(165, 193, 214, 0.3)',
        'glow': '0 0 15px rgba(106, 91, 138, 0.5)',
        'elevated': '0 15px 35px -10px rgba(58, 60, 110, 0.15)',
        'deep': '0 8px 25px -5px rgba(58, 60, 110, 0.2)',
      },
      // 动画配置
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },
      // 关键帧配置
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      // 背景模糊配置
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  // v4 实验性功能和优化配置
  experimental: {
    optimizeUniversalDefaults: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}

export default config