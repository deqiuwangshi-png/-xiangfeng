/**
 * PostCSS 配置文件
 * 用于处理Tailwind CSS和其他CSS工具
 * Tailwind CSS v4 配置
 */
const config = {
  plugins: {
    // Tailwind CSS v4 使用新的postcss插件
    '@tailwindcss/postcss': {
      // Tailwind v4 优化选项
      optimize: true,
      minify: process.env.NODE_ENV === 'production'
    },
    
    // Tailwind CSS v4 已包含自动前缀功能，无需额外配置 autoprefixer
    // 'autoprefixer': {}, // 已内置，无需显式声明
    
    // 其他有用的PostCSS插件可以根据需要添加
    // 'cssnano': {}, // 生产环境压缩（Next.js会自动处理）
  },
};

export default config;