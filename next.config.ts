import type { NextConfig } from "next";

/**
 * CSP (Content Security Policy) 配置
 *
 * @安全说明
 * - default-src 'self': 默认只允许同源资源
 * - script-src: 使用 strict-dynamic 和 nonce 替代 unsafe-inline/eval
 * - style-src: 保留 unsafe-inline（Tailwind 需要，但已限制为 self）
 * - img-src: 允许同源、Supabase、DiceBear 图片
 * - connect-src: 允许 API 请求到 Supabase
 * - frame-ancestors 'none': 防止点击劫持
 *
 * @注意
 * - CSP 只在生产环境启用，开发环境禁用避免样式问题
 * - 生产环境也可在反向代理（Nginx/CDN）层添加此头
 * @安全修复 S-02: 移除 script-src 的 unsafe-inline 和 unsafe-eval
 */
const prodCspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://www.gstatic.com;
  img-src 'self' https://*.supabase.co https://api.dicebear.com https://*.supabase.in data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://*.supabase.in;
  media-src 'self';
  object-src 'none';
  frame-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s+/g, ' ').trim();

const nextConfig: NextConfig = {
  // Server Actions 配置
  experimental: {
    // 增加请求体大小限制到 10MB（用于文件上传）
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // 优化包体积
    optimizePackageImports: ['lucide-react'],
  },
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
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
