import type { NextConfig } from "next";

/**
 * CSP (Content Security Policy) 配置
 *
 * @安全说明
 * - default-src 'self': 默认只允许同源资源
 * - script-src: 使用 self + unsafe-inline（Next.js 需要内联脚本）
 * - style-src: 保留 unsafe-inline（Tailwind 需要）
 * - img-src: 允许同源、Supabase、DiceBear 图片
 * - connect-src: 允许 API 请求到 Supabase
 * - frame-ancestors 'none': 防止点击劫持
 *
 * @注意
 * - CSP 只在生产环境启用，开发环境禁用避免样式问题
 * - 生产环境也可在反向代理（Nginx/CDN）层添加此头
 * @安全修复 S-02: 限制 script-src 为 self，移除 eval
 */
const prodCspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline' https://www.gstatic.com;
  img-src 'self' https://*.supabase.co https://api.dicebear.com https://*.supabase.in data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://vercel.live;
  media-src 'self';
  object-src 'none';
  frame-src 'self' https://vercel.live;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s+/g, ' ').trim();

/**
 * Next.js 配置 - SEO与性能优化
 * @description 全面优化网站性能和搜索引擎友好度
 */
const nextConfig: NextConfig = {
  // 输出配置 - 静态导出优化
  output: 'standalone',
  
  // 压缩配置
  compress: true,
  
  //  poweredByHeader - 隐藏X-Powered-By头
  poweredByHeader: false,
  
  // 生成Etags
  generateEtags: true,
  
  // Server Actions 配置
  experimental: {
    // 增加请求体大小限制到 10MB（用于文件上传）
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // 优化包体积
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // 优化CSS
    optimizeCss: true,
  },
  
  // 禁用 React 实验性 draggable 功能，避免移动端指针事件错误
  reactStrictMode: true,
  
  /**
   * 图片优化配置
   */
  images: {
    // 图片优化配置
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      // Supabase存储图片（用户上传头像）
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      // 其他可能的图片源
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/**',
      },
    ],
    // 图片格式优化 - 优先WebP和AVIF
    formats: ['image/avif', 'image/webp'],
    // 设备尺寸断点 - 响应式图片
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 图片缓存时间
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
    // 禁用静态导入图片的优化（用于SVG）
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  /**
   * 重写规则 - 优化URL结构
   */
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/robots',
      },
    ];
  },
  
  /**
   * 重定向规则 - SEO优化
   */
  async redirects() {
    return [
      // 强制HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://www.xiangfeng.site/:path*',
        permanent: true,
      },
      // 移除尾部斜杠
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
  // 安全响应头配置 - 只在生产环境启用
  async headers() {
    // 开发环境不添加 CSP，避免样式问题
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: prodCspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
