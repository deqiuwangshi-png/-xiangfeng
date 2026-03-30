/**
 * SEO 配置示例页面
 * @module app/seo-examples/page
 * @description 展示各种页面类型的 SEO 配置方式
 */

import Link from 'next/link';

export default function SEOExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SEO 配置示例</h1>

        <div className="space-y-6">
          {/* 基础页面示例 */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">基础页面</h2>
            <div className="space-y-3">
              <Link
                href="/seo-examples/types/home"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">首页 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">查看首页的完整 SEO 实现</p>
              </Link>
              <Link
                href="/seo-examples/types/marketing"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">营销页 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">关于我们、合作伙伴等页面</p>
              </Link>
              <Link
                href="/seo-examples/types/legal"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">法律页 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">隐私政策、服务条款等页面</p>
              </Link>
            </div>
          </section>

          {/* 动态页面示例 */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">动态页面</h2>
            <div className="space-y-3">
              <Link
                href="/seo-examples/types/article"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">文章详情页 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">包含 Article Schema 和结构化数据</p>
              </Link>
              <Link
                href="/seo-examples/types/profile"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">用户主页 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">包含 ProfilePage Schema</p>
              </Link>
            </div>
          </section>

          {/* 后台页面示例 */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">后台页面（noindex）</h2>
            <div className="space-y-3">
              <Link
                href="/seo-examples/types/admin"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">后台页面 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">创作中心、草稿箱等（设置 noindex）</p>
              </Link>
              <Link
                href="/seo-examples/types/auth"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">认证页面 SEO 配置</h3>
                <p className="text-sm text-gray-600 mt-1">登录、注册等（设置 noindex）</p>
              </Link>
            </div>
          </section>

          {/* 组件使用示例 */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO 组件使用</h2>
            <div className="space-y-3">
              <Link
                href="/seo-examples/components/structured-data"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">结构化数据组件</h3>
                <p className="text-sm text-gray-600 mt-1">Schema.org JSON-LD 标记</p>
              </Link>
              <Link
                href="/seo-examples/components/social-share"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">社交分享组件</h3>
                <p className="text-sm text-gray-600 mt-1">多平台分享功能</p>
              </Link>
              <Link
                href="/seo-examples/components/breadcrumb"
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium text-gray-900">面包屑导航</h3>
                <p className="text-sm text-gray-600 mt-1">BreadcrumbList Schema + UI 组件</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
