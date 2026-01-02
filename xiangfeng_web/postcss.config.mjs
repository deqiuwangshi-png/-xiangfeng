/**
 * PostCSS 配置文件
 * 用于处理Tailwind CSS和其他CSS工具
 * Tailwind CSS v4 配置
 */
const config = {
  plugins: {
    // Tailwind CSS v4 使用新的postcss插件
    '@tailwindcss/postcss': {
      // Tailwind CSS v4 配置选项
    },
    
    // 其他有用的PostCSS插件可以根据需要添加
    // 'autoprefixer': {}, // Tailwind v4已包含自动前缀
    // 'cssnano': {}, // 生产环境压缩（Next.js会自动处理）
  },
};

export default config;