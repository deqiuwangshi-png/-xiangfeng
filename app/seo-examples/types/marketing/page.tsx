/**
 * 营销页 SEO 配置示例
 * @module app/seo-examples/types/marketing/page
 * @description 展示营销页面的 SEO 配置（关于我们、合作伙伴等）
 */

import type { Metadata } from 'next';
import { generateMarketingMetadata } from '@/lib/seo';

/**
 * 营销页 Metadata 配置
 */
export const metadata: Metadata = generateMarketingMetadata(
  '关于我们',
  '了解相逢团队的使命与愿景，探索我们如何通过技术创新连接深度思考者，构建知识共享的生态系统。',
  '/about'
);

export default function MarketingExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              index
            </span>
            <h1 className="text-3xl font-bold text-gray-900">营销页 SEO 配置示例</h1>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import type { Metadata } from 'next';
import { generateMarketingMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMarketingMetadata(
  '关于我们',
  '了解相逢团队的使命与愿景，探索我们如何通过技术创新...',
  '/about'
);`}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                  <p className="text-blue-800">关于我们 - 相逢</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                  <p className="text-green-800">
                    了解相逢团队的使命与愿景，探索我们如何通过技术创新连接深度思考者，构建知识共享的生态系统。
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Open Graph</h3>
                  <ul className="text-orange-800 space-y-1">
                    <li>• type: website</li>
                    <li>• locale: zh_CN</li>
                    <li>• priority: 0.6</li>
                    <li>• changeFrequency: monthly</li>
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
                <li>关于我们 (/about)</li>
                <li>合作伙伴 (/partners)</li>
                <li>品牌故事</li>
                <li>联系我们</li>
                <li>媒体资源</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">营销页 SEO 建议</h2>
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>使用品牌故事性的描述，增强用户信任感</li>
                  <li>包含核心关键词，提升品牌词搜索排名</li>
                  <li>配合高质量图片，优化社交分享效果</li>
                  <li>定期更新内容，保持页面活跃度</li>
                  <li>添加内部链接，引导用户探索更多内容</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
