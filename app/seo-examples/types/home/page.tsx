/**
 * 首页 SEO 配置示例
 * @module app/seo-examples/types/home/page
 * @description 展示首页的完整 SEO 配置
 */

import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo';

/**
 * 首页 Metadata 配置
 * 使用 generateHomeMetadata 生成首页专用的 SEO 配置
 */
export const metadata: Metadata = generateHomeMetadata();

export default function HomeExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">首页 SEO 配置示例</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo';

export const metadata: Metadata = generateHomeMetadata();`}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                  <p className="text-blue-800">
                    相逢 Xiangfeng - 深度思考者社区 | 长文创作与知识分享平台
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                  <p className="text-green-800">
                    相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。
                    打破认知边界，构建思维网络与知识经济生态，让深度内容回归本真。
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">关键词 (Keywords)</h3>
                  <p className="text-purple-800">
                    知识社区, 深度思考, 长文创作, 深度阅读, 认知网络, 创作者经济,
                    内容创作, 知识分享, 优质内容, 独立思考
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Open Graph</h3>
                  <ul className="text-orange-800 space-y-1">
                    <li>• type: website</li>
                    <li>• locale: zh_CN</li>
                    <li>• siteName: 相逢 Xiangfeng</li>
                    <li>• image: /og-image.svg (1200x630)</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">Robots</h3>
                  <p className="text-red-800">
                    index: true, follow: true, priority: 1.0
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">包含的结构化数据</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>WebSite Schema - 网站信息</li>
                <li>Organization Schema - 组织信息</li>
                <li>SearchAction - 站内搜索</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
