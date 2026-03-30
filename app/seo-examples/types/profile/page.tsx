/**
 * 用户主页 SEO 配置示例
 * @module app/seo-examples/types/profile/page
 * @description 展示用户主页的完整 SEO 配置
 */

import type { Metadata } from 'next';
import { generateProfileMetadata } from '@/lib/seo';
import { generateProfileSchema, toJsonLd } from '@/lib/seo/schema';
import Script from 'next/script';

/**
 * 模拟用户数据获取
 */
async function getProfile(userId: string) {
  return {
    id: userId,
    name: '张三',
    bio: '深度思考者 | 技术博主 | 知识管理爱好者。专注于个人成长、知识管理和技术分享。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    jobTitle: '高级产品经理',
    organization: '某科技公司',
    articleCount: 42,
    followerCount: 1280,
    followingCount: 356,
    tags: ['产品经理', '知识管理', '个人成长', '技术'],
  };
}

/**
 * 动态生成用户主页 Metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const profile = await getProfile(userId);

  return generateProfileMetadata({
    title: profile.name,
    description: profile.bio,
    path: `/profile/${profile.id}`,
    avatar: profile.avatar,
    articleCount: profile.articleCount,
    keywords: profile.tags,
  });
}

export default async function ProfileExamplePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profile = await getProfile(userId);

  // 生成个人主页结构化数据
  const profileSchema = generateProfileSchema({
    name: profile.name,
    url: `https://www.xiangfeng.site/profile/${profile.id}`,
    description: profile.bio,
    image: profile.avatar,
    jobTitle: profile.jobTitle,
    organization: profile.organization,
    articleCount: profile.articleCount,
  });

  return (
    <>
      {/* 个人主页结构化数据 */}
      <Script
        id="profile-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(profileSchema) }}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              用户主页 SEO 配置示例
            </h1>

            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">配置代码</h2>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`export async function generateMetadata({ params }): Promise<Metadata> {
  const profile = await getProfile(params.userId);

  return generateProfileMetadata({
    title: profile.name,
    description: profile.bio,
    path: \`/profile/\${profile.id}\`,
    avatar: profile.avatar,
    articleCount: profile.articleCount,
    keywords: profile.tags,
  });
}`}
                </pre>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">当前用户信息</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="font-medium">用户名:</span> {profile.name}
                  </p>
                  <p>
                    <span className="font-medium">简介:</span> {profile.bio}
                  </p>
                  <p>
                    <span className="font-medium">职位:</span> {profile.jobTitle}
                  </p>
                  <p>
                    <span className="font-medium">公司:</span> {profile.organization}
                  </p>
                  <p>
                    <span className="font-medium">文章数:</span> {profile.articleCount}
                  </p>
                  <p>
                    <span className="font-medium">粉丝数:</span> {profile.followerCount}
                  </p>
                  <p>
                    <span className="font-medium">标签:</span> {profile.tags.join(', ')}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">生成的 SEO 内容</h2>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">标题 (Title)</h3>
                    <p className="text-blue-800">
                      {profile.name} - {profile.bio.slice(0, 30)}... | 相逢
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">描述 (Description)</h3>
                    <p className="text-green-800">
                      {profile.name} 的个人主页，在相逢发布了 {profile.articleCount} 篇深度文章。
                      发现更多优质内容创作者。
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-2">关键词 (Keywords)</h3>
                    <p className="text-purple-800">
                      {profile.name}, 个人主页, 创作者, 博主, {profile.tags.join(', ')}, 相逢
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Open Graph (Profile)</h3>
                    <ul className="text-orange-800 space-y-1">
                      <li>• type: profile</li>
                      <li>• title: {profile.name} - 创作者主页</li>
                      <li>• image: 用户头像</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">ProfilePage Schema</h2>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(profileSchema, null, 2)}
                </pre>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
