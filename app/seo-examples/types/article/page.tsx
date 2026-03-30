/**
 * 文章详情页 SEO 配置示例
 * @module app/seo-examples/types/article/page
 * @description 展示文章详情页的完整 SEO 配置，包含动态生成和结构化数据
 */

import type { Metadata } from 'next';
import { generateArticleMetadata } from '@/lib/seo';
import { generateArticleSchema, toJsonLd } from '@/lib/seo/schema';
import Script from 'next/script';

/**
 * 模拟文章数据获取
 * 实际项目中从数据库或 API 获取
 */
async function getArticle(id: string) {
  // 模拟数据
  return {
    id,
    title: '如何构建个人知识体系：从信息收集到知识输出',
    summary:
      '在信息爆炸的时代，建立个人知识体系变得越来越重要。本文将分享一套完整的知识管理方法论，帮助你从海量信息中提取有价值的知识，并构建属于自己的知识网络。',
    content: '...',
    author: {
      id: 'user-123',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    },
    publishedAt: '2026-03-25T08:00:00Z',
    updatedAt: '2026-03-28T10:30:00Z',
    tags: ['知识管理', '个人成长', '学习方法', '深度思考'],
    wordCount: 3500,
    coverImage: '/images/article-cover.jpg',
  };
}

/**
 * 动态生成文章页面 Metadata
 * @param params - 路由参数
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  return generateArticleMetadata({
    title: article.title,
    description: article.summary,
    path: `/article/${article.id}`,
    author: article.author.name,
    authorUrl: `/profile/${article.author.id}`,
    publishedAt: article.publishedAt,
    modifiedAt: article.updatedAt,
    tags: article.tags,
    wordCount: article.wordCount,
    ogImage: article.coverImage,
  });
}

export default async function ArticleExamplePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  // 生成文章结构化数据
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.summary,
    url: `https://www.xiangfeng.site/article/${article.id}`,
    authorName: article.author.name,
    authorUrl: `https://www.xiangfeng.site/profile/${article.author.id}`,
    authorAvatar: article.author.avatar,
    publishedAt: article.publishedAt,
    modifiedAt: article.updatedAt,
    tags: article.tags,
    wordCount: article.wordCount,
    imageUrl: article.coverImage
      ? `https://www.xiangfeng.site${article.coverImage}`
      : undefined,
  });

  return (
    <>
      {/* 文章结构化数据 */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(articleSchema) }}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              文章详情页 SEO 配置示例
            </h1>

            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.id);

  return generateArticleMetadata({
    title: article.title,
    description: article.summary,
    path: \`/article/\${article.id}\`,
    author: article.author.name,
    authorUrl: \`/profile/\${article.author.id}\`,
    publishedAt: article.publishedAt,
    modifiedAt: article.updatedAt,
    tags: article.tags,
    wordCount: article.wordCount,
    ogImage: article.coverImage,
  });
}`}
                </pre>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">当前文章信息</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="font-medium">标题:</span> {article.title}
                  </p>
                  <p>
                    <span className="font-medium">作者:</span> {article.author.name}
                  </p>
                  <p>
                    <span className="font-medium">发布时间:</span>{' '}
                    {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                  </p>
                  <p>
                    <span className="font-medium">更新时间:</span>{' '}
                    {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
                  </p>
                  <p>
                    <span className="font-medium">字数:</span> {article.wordCount}
                  </p>
                  <p>
                    <span className="font-medium">标签:</span> {article.tags.join(', ')}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                    <p className="text-blue-800">
                      {article.title} | {article.author.name} - 相逢
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                    <p className="text-green-800">{article.summary}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-2">关键词 (Keywords)</h3>
                    <p className="text-purple-800">{article.tags.join(', ')}, 深度文章, 知识分享...</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Open Graph (Article)</h3>
                    <ul className="text-orange-800 space-y-1">
                      <li>• type: article</li>
                      <li>• author: {article.author.name}</li>
                      <li>• publishedTime: {article.publishedAt}</li>
                      <li>• modifiedTime: {article.updatedAt}</li>
                      <li>• section: {article.tags[0]}</li>
                      <li>• tags: {article.tags.join(', ')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Article Schema</h2>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(articleSchema, null, 2)}
                </pre>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
