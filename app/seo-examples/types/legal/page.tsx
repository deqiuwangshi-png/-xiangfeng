/**
 * 法律页 SEO 配置示例
 * @module app/seo-examples/types/legal/page
 * @description 展示法律页面的 SEO 配置（隐私政策、服务条款等）
 */

import type { Metadata } from 'next';
import { generateLegalMetadata } from '@/lib/seo';

/**
 * 法律页 Metadata 配置
 */
export const metadata: Metadata = generateLegalMetadata('隐私政策', '/privacy');

export default function LegalExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              index
            </span>
            <h1 className="text-3xl font-bold text-gray-900">法律页 SEO 配置示例</h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import type { Metadata } from 'next';
import { generateLegalMetadata } from '@/lib/seo';

export const metadata: Metadata = generateLegalMetadata('隐私政策', '/privacy');`}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                  <p className="text-blue-800">隐私政策 - 相逢</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                  <p className="text-green-800">
                    相逢 Xiangfeng 隐私政策，了解我们的服务条款和隐私政策。
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Sitemap 配置</h3>
                  <ul className="text-orange-800 space-y-1">
                    <li>• priority: 0.3（低优先级）</li>
                    <li>• changeFrequency: yearly（很少更新）</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Robots</h3>
                  <p className="text-purple-800">index: true, follow: true ✓</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">适用场景</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>隐私政策 (/privacy)</li>
                <li>服务条款 (/terms)</li>
                <li>Cookie 政策</li>
                <li>版权声明</li>
                <li>免责声明</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">法律页 SEO 特点</h2>
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>低优先级（0.3），因为用户很少通过搜索找到这些页面</li>
                  <li>更新频率设为 yearly，法律文本通常很少变更</li>
                  <li>保持简洁明了的标题和描述</li>
                  <li>确保内容完整、准确，符合法律法规要求</li>
                  <li>建议添加最后更新日期，增强可信度</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
