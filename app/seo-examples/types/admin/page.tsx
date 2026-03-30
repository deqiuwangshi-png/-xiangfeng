/**
 * 后台页面 SEO 配置示例
 * @module app/seo-examples/types/admin/page
 * @description 展示后台页面的 SEO 配置（设置 noindex）
 */

import type { Metadata } from 'next';
import { generateAdminMetadata } from '@/lib/seo';

/**
 * 后台页面 Metadata 配置
 * 设置 noindex，防止搜索引擎收录
 */
export const metadata: Metadata = generateAdminMetadata('创作中心');

export default function AdminExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
              noindex
            </span>
            <h1 className="text-3xl font-bold text-gray-900">后台页面 SEO 配置示例</h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import type { Metadata } from 'next';
import { generateAdminMetadata } from '@/lib/seo';

export const metadata: Metadata = generateAdminMetadata('创作中心');`}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                  <p className="text-blue-800">创作中心 - 相逢</p>
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
                <li>创作中心 / 编辑器</li>
                <li>草稿箱</li>
                <li>个人设置</li>
                <li>消息通知</li>
                <li>积分商城（后台部分）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">注意事项</h2>
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <p className="mb-2">
                  <strong>为什么需要设置 noindex？</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>后台页面通常需要登录才能访问，搜索引擎无法抓取有意义的内容</li>
                  <li>避免用户通过搜索结果直接进入需要登录的页面</li>
                  <li>减少搜索引擎爬虫对服务器资源的无效消耗</li>
                  <li>防止敏感信息被意外索引</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
