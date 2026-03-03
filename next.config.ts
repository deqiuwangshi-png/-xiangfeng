import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // 实验性功能：优化CSS
  experimental: {
    // 优化包体积
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
