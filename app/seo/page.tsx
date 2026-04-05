import { Metadata } from 'next'
import { siteName, siteUrl, createMetadata } from '@/lib/seo'

/**
 * SEO页面元数据配置
 * @description 使用统一SEO配置作为基础，扩展SEO展示页面特有配置
 */
export const metadata: Metadata = {
  ...createMetadata({
    title: '深度思考者的知识社区 | 长文创作与阅读平台',
    description: '相逢是面向全球思考者的深度知识社区，提供沉浸式长文阅读体验。整理碎片化知识，构建个人思维体系，与志同道合者共创价值，享受长期创作红利。',
  }),
  // SEO页面特有：扩展关键词
  keywords: '相逢,知识社区,深度阅读,长文创作,思考者,知识体系,内容创作,思维网络,认知迭代',
  // SEO页面特有：规范链接
  alternates: {
    canonical: '/seo',
  },
}

/**
 * 结构化数据配置
 * @description 使用统一SEO配置中的站点信息
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  description: '深度思考者的知识社区',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

/**
 * 组织结构化数据
 */
const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  description: '面向全球思考者的深度知识社区平台',
  url: siteUrl,
  sameAs: [],
}

/**
 * SEO页面组件
 * 
 * @returns {JSX.Element} SEO优化的页面组件
 * 
 * @description
 * 本页面遵循商业化SEO最佳实践：
 * 1. 语义化HTML结构
 * 2. 合理的标题层级（H1-H3）
 * 3. 内链优化
 * 4. 结构化数据标记
 * 5. 移动端友好的响应式设计
 */
export default function SeoPage() {
  return (
    <>
      {/* 结构化数据注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      
      <main style={styles.main}>
        <article style={styles.article}>
          {/* H1标题 - 页面唯一主标题 */}
          <header style={styles.header}>
            <h1 style={styles.h1}>
              相逢 - 深度思考者的精神家园
            </h1>
            <p style={styles.subtitle}>
              面向全球80亿人，致敬全球思考者。不止相遇，更是改变。
            </p>
          </header>
          
          {/* 核心介绍 */}
          <section style={styles.section} aria-labelledby="what-is">
            <h2 id="what-is" style={styles.h2}>
              相逢是什么
            </h2>
            <p style={styles.paragraph}>
              相逢是一个<strong>深度思考者的知识社区</strong>，专注于长文创作与深度阅读。
              在嘈杂的信息流中寻找深度连接，打破认知边界，构建属于你的思维网络。
            </p>
            <p style={styles.paragraph}>
              从不是单纯的平台，而是链接碎片知识、碰撞思想火花、助力认知迭代的长期成长伙伴。
            </p>
          </section>
          
          {/* 核心特色 */}
          <section style={styles.section} aria-labelledby="features">
            <h2 id="features" style={styles.h2}>
              核心特色
            </h2>
            
            <div style={styles.featureGrid}>
              <div style={styles.featureItem}>
                <h3 style={styles.h3}>长文栖息地</h3>
                <p style={styles.paragraph}>
                  优雅的沉浸式阅读体验，支持万字长文创作与排版，让深度内容回归本真。
                </p>
              </div>
              
              <div style={styles.featureItem}>
                <h3 style={styles.h3}>体系化沉淀</h3>
                <p style={styles.paragraph}>
                  整理零散知识，构建逻辑体系，让输入成为可成长的个人资产。
                </p>
              </div>
              
              <div style={styles.featureItem}>
                <h3 style={styles.h3}>生态共建</h3>
                <p style={styles.paragraph}>
                  与志同道合的思考者共建知识生态，创造价值，共享成长。
                </p>
              </div>
            </div>
          </section>
          
          {/* 使用指南 */}
          <section style={styles.section} aria-labelledby="how-to-start">
            <h2 id="how-to-start" style={styles.h2}>
              如何开始
            </h2>
            <ol style={styles.orderedList}>
              <li style={styles.listItem}>
                <strong>注册与探索</strong> - 创建属于你的思考者档案，探索不同领域的深度内容。
              </li>
              <li style={styles.listItem}>
                <strong>创造与连接</strong> - 参与创作，连接深度思考者，建立有价值的生态关系。
              </li>
              <li style={styles.listItem}>
                <strong>成长与共赢</strong> - 通过生态经济模型，实现个人成长与价值创造的真实变现。
              </li>
            </ol>
          </section>
          
          {/* 核心功能 */}
          <section style={styles.section} aria-labelledby="core-functions">
            <h2 id="core-functions" style={styles.h2}>
              核心功能
            </h2>
            <ul style={styles.unorderedList}>
              <li style={styles.listItem}>
                <strong>深度阅读</strong> - 沉浸式长文阅读体验，专注内容本身
              </li>
              <li style={styles.listItem}>
                <strong>体系化创作</strong> - 构建个人知识体系，沉淀思考成果
              </li>
              <li style={styles.listItem}>
                <strong>价值共创</strong> - 与思考者共建生态，实现知识变现
              </li>
              <li style={styles.listItem}>
                <strong>积分奖励</strong> - 优质创作获得积分奖励，激励持续输出
              </li>
              <li style={styles.listItem}>
                <strong>社区互动</strong> - 与志同道合者深度交流，碰撞思想火花
              </li>
              <li style={styles.listItem}>
                <strong>个人主页</strong> - 展示你的思考成果，建立个人品牌
              </li>
            </ul>
          </section>
          
          {/* 技术架构 */}
          <section style={styles.section} aria-labelledby="tech-stack">
            <h2 id="tech-stack" style={styles.h2}>
              技术架构
            </h2>
            <p style={styles.paragraph}>
              相逢致力于为用户提供流畅、稳定的使用体验。我们采用现代化的技术架构，
              确保页面加载速度快、响应及时，让你专注于内容创作和深度阅读。
            </p>
          </section>
          
          {/* 联系我们 */}
          <section style={styles.section} aria-labelledby="contact">
            <h2 id="contact" style={styles.h2}>
              联系我们
            </h2>
            <p style={styles.paragraph}>
              欢迎加入相逢，开启你的深度思考之旅。
            </p>
            <nav aria-label="主要导航">
              <ul style={styles.navList}>
                <li style={styles.navItem}>
                  <a 
                    href="/login" 
                    style={styles.link}
                    title="立即注册相逢账号"
                  >
                    立即注册
                  </a>
                </li>
                <li style={styles.navItem}>
                  <a 
                    href="/about" 
                    style={styles.link}
                    title="了解相逢团队"
                  >
                    关于我们
                  </a>
                </li>
              </ul>
            </nav>
          </section>
          
          {/* 相关资源 */}
          <footer style={styles.footer}>
            <h2 style={styles.h2}>
              相关资源
            </h2>
            <nav aria-label="相关资源链接">
              <ul style={styles.resourceList}>
                <li style={styles.resourceItem}>
                  <a 
                    href="https://nextjs.org/docs" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    style={styles.externalLink}
                    title="Next.js 官方文档"
                  >
                    Next.js 文档
                  </a>
                </li>
                <li style={styles.resourceItem}>
                  <a 
                    href="https://supabase.com/docs" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    style={styles.externalLink}
                    title="Supabase 官方文档"
                  >
                    Supabase 文档
                  </a>
                </li>
                <li style={styles.resourceItem}>
                  <a 
                    href="https://developer.mozilla.org/zh-CN/docs/Web/HTML" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    style={styles.externalLink}
                    title="MDN HTML 中文文档"
                  >
                    MDN HTML 文档
                  </a>
                </li>
              </ul>
            </nav>
          </footer>
        </article>
      </main>
    </>
  )
}

/**
 * 样式对象
 * 遵循商业化SEO设计原则：简洁、专业、易读
 */
const styles = {
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.7',
    color: '#333',
    backgroundColor: '#fff',
  },
  article: {
    display: 'block',
  },
  header: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #eee',
  },
  h1: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: '#111',
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  section: {
    marginBottom: '2rem',
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#222',
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
    color: '#333',
  },
  paragraph: {
    marginBottom: '1rem',
    textAlign: 'justify' as const,
  },
  featureGrid: {
    display: 'grid',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  featureItem: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  orderedList: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
  },
  unorderedList: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
  },
  listItem: {
    marginBottom: '0.5rem',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0',
  },
  navItem: {
    marginBottom: '0.5rem',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    fontWeight: '500',
  },
  resourceList: {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0',
  },
  resourceItem: {
    marginBottom: '0.5rem',
  },
  externalLink: {
    color: '#0066cc',
    textDecoration: 'none',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee',
  },
}
