/**
 * 认证页面 SEO 配置示例
 * @module app/seo-examples/types/auth/page
 * @description 展示认证页面的 SEO 配置（设置 noindex）
 */

import type { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/seo';

/**
 * 认证页面 Metadata 配置
 * 设置 noindex，防止搜索引擎收录登录注册页面
 */
export const metadata: Metadata = generateAuthMetadata('登录');

export default function AuthExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
              noindex
            </span>
            <h1 className="text-3xl font-bold text-gray-900">认证页面 SEO 配置示例</h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import type { Metadata } from 'next';
import { generateAuthMetadata } from '@/lib/seo';

export const metadata: Metadata = generateAuthMetadata('登录');`}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                  <p className="text-blue-800">登录 - 相逢</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                  <p className="text-green-800">
                    登录或注册 相逢 Xiangfeng 账号，开启深度创作之旅。
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h3 className="font-medium text-red-900 mb-2">Robots（重要）</h3>
                  <ul className="text-red-800 space-y-1">
                    <li>• index: false ❌</li>
                    <li>• follow: false ❌</li>
                    <li>• nocache: true</li>
                  </ul>
                  <p className="mt-2 text-red-700 text-xs">
                    搜索引擎不会收录此页面，也不会跟踪页面中的链接
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">适用场景</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>登录页面 (/login)</li>
                <li>注册页面 (/register)</li>
                <li>忘记密码 (/forgot-password)</li>
                <li>重置密码 (/reset-password)</li>
                <li>OAuth 回调 (/auth/callback)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">SEO 最佳实践</h2>
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <p className="mb-2">
                  <strong>认证页面 SEO 注意事项：</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>认证页面不应该出现在搜索结果中</li>
                  <li>不要在 sitemap.xml 中包含认证页面</li>
                  <li>robots.txt 不应该暴露认证路径（使用 noindex 而非 Disallow）</li>
                  <li>保持简洁的标题，不需要过度优化</li>
                  <li>确保登录后重定向到用户原本想访问的页面</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
