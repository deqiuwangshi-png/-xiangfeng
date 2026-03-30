'use client';

/**
 * 文章预览墙组件
 * @module components/article/ArticlePaywall
 * @description 匿名用户浏览文章时显示部分内容，通过嵌入式渐变引导登录
 *
 * @设计原则
 * - 不阻断用户阅读体验
 * - 渐变过渡自然引导
 * - 文案结合文章主题，提供具体价值主张
 * - 服务于内容而非强制拦截
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, Users } from 'lucide-react';
import { sanitizeRichText } from '@/lib/utils/purify';

/**
 * 文章预览墙组件属性
 * @interface ArticlePaywallProps
 */
interface ArticlePaywallProps {
  /** 文章完整内容 */
  content: string;
  /** 预览比例（默认35%） */
  previewRatio?: number;
  /** 文章标题（用于生成主题文案） */
  articleTitle?: string;
  /** 文章标签（用于生成主题文案） */
  tags?: string[];
  /** 自定义主标题 */
  headline?: string;
  /** 自定义价值描述 */
  valueProposition?: string;
  /** 社区规模（用于社交证明） */
  communitySize?: string;
}

/**
 * 根据文章主题生成文案
 * @param {string} title - 文章标题
 * @param {string[]} tags - 文章标签
 * @returns {object} 生成的文案
 */
function generateThemeCopy(title: string = '', tags: string[] = []): {
  headline: string;
  valueProposition: string;
  ctaText: string;
} {
  const lowerTitle = title.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());
  const allText = `${lowerTitle} ${lowerTags.join(' ')}`;

  // AI 相关主题
  if (allText.includes('ai') || allText.includes('人工智能') || allText.includes('chatgpt') || allText.includes('大模型')) {
    return {
      headline: '加入 10,000+ 深度思考者',
      valueProposition: '解锁应对 AI 浪潮的实战策略与制度建议，与先行者共同探讨人机协作的未来',
      ctaText: '获取完整洞察',
    };
  }

  // 职业发展相关
  if (allText.includes('职业') || allText.includes('工作') || allText.includes('职场') || allText.includes('转型')) {
    return {
      headline: '与 8,000+ 职场进化者同行',
      valueProposition: '获取完整的职业发展路径规划，掌握转型期的关键决策框架',
      ctaText: '开启职业进化',
    };
  }

  // 技术/编程相关
  if (allText.includes('技术') || allText.includes('编程') || allText.includes('开发') || allText.includes('架构')) {
    return {
      headline: '加入 15,000+ 技术实践者',
      valueProposition: '阅读完整的技术深度解析，获取可落地的工程实践方案',
      ctaText: '解锁技术方案',
    };
  }

  // 产品/设计相关
  if (allText.includes('产品') || allText.includes('设计') || allText.includes('用户体验') || allText.includes('ux')) {
    return {
      headline: '与 6,000+ 产品创造者共鸣',
      valueProposition: '探索完整的产品思维框架，学习优秀案例的设计决策逻辑',
      ctaText: '获取产品洞察',
    };
  }

  // 商业/创业相关
  if (allText.includes('创业') || allText.includes('商业') || allText.includes('增长') || allText.includes('运营')) {
    return {
      headline: '连接 5,000+ 商业探索者',
      valueProposition: '深入理解商业逻辑与增长策略，获取可执行的方法论',
      ctaText: '解锁商业智慧',
    };
  }

  // 默认文案
  return {
    headline: '加入 12,000+ 深度阅读者',
    valueProposition: '解锁完整内容，与志同道合的思考者交流碰撞',
    ctaText: '阅读完整文章',
  };
}

/**
 * 计算预览内容长度
 * @param {string} content - 文章内容
 * @param {number} ratio - 预览比例
 * @returns {number} 预览内容长度
 */
function calculatePreviewLength(content: string, ratio: number): number {
  const textContent = content.replace(/<[^>]*>/g, '');
  return Math.floor(textContent.length * ratio);
}

/**
 * 智能截断HTML内容，保留标签结构
 * @param {string} html - HTML格式的文章内容
 * @param {number} maxLength - 最大文本长度
 * @returns {string} 保留HTML标签的预览内容
 */
function truncateHtml(html: string, maxLength: number): string {
  // 解析HTML，提取带标签的段落
  const paragraphs: string[] = [];
  const tagRegex = /<(p|h[1-6]|blockquote|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1];
    const content = match[2];
    paragraphs.push({ tag: tagName, content, fullMatch: match[0] } as unknown as string);
  }

  // 如果没有匹配到标准标签，尝试按段落分割
  if (paragraphs.length === 0) {
    const simpleParagraphs = html.split(/\n{2,}/);
    return simpleParagraphs
      .slice(0, 3)
      .map((p) => `<p>${p.trim()}</p>`)
      .join('');
  }

  // 累积文本直到达到预览长度
  let currentLength = 0;
  const result: string[] = [];

  for (const para of paragraphs) {
    const p = para as unknown as { tag: string; content: string; fullMatch: string };
    const textContent = p.content.replace(/<[^>]*>/g, '');

    if (currentLength + textContent.length <= maxLength) {
      // 完整保留这个段落
      result.push(p.fullMatch);
      currentLength += textContent.length;
    } else {
      // 需要截断这个段落
      const remaining = maxLength - currentLength;
      if (remaining > 20) {
        // 如果剩余空间足够，截断并保留部分
        let truncatedText = textContent.slice(0, remaining);

        // 在语义边界截断
        const lastPeriod = truncatedText.lastIndexOf('。');
        const lastComma = truncatedText.lastIndexOf('，');
        const boundaryIndex = Math.max(lastPeriod, lastComma);

        if (boundaryIndex > remaining * 0.7) {
          truncatedText = truncatedText.slice(0, boundaryIndex + 1);
        }

        // 重建HTML标签
        const truncatedHtml = `<${p.tag}>${truncatedText}</${p.tag}>`;
        result.push(truncatedHtml);
      }
      break;
    }
  }

  return result.join('');
}

/**
 * 文章预览墙组件
 *
 * @param {ArticlePaywallProps} props - 组件属性
 * @returns {JSX.Element} 文章预览墙
 */
export function ArticlePaywall({
  content,
  previewRatio = 0.35,
  articleTitle = '',
  tags = [],
  headline,
  valueProposition,
  communitySize,
}: ArticlePaywallProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  // 生成主题文案
  const themeCopy = generateThemeCopy(articleTitle, tags);
  const finalHeadline = headline || themeCopy.headline;
  const finalValueProp = valueProposition || themeCopy.valueProposition;
  const finalCtaText = themeCopy.ctaText;

  const previewLength = calculatePreviewLength(content, previewRatio);
  const previewHtml = truncateHtml(content, previewLength);
  const sanitizedPreview = sanitizeRichText(previewHtml);

  return (
    <div className="relative">
      {/* 预览内容 */}
      <article
        className="article-content article-content-reader"
        dangerouslySetInnerHTML={{ __html: sanitizedPreview }}
      />

      {/* 渐变遮罩 - 自然过渡 */}
      <div className="relative -mt-32">
        {/* 第一层渐变：从透明到半透明白色 */}
        <div className="h-32 bg-linear-to-b from-transparent to-white/80" />

        {/* 第二层：纯白背景 + 引导内容 */}
        <div className="bg-white pb-16">
          {/* 分割线装饰 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
            <span className="text-gray-400 text-sm">以下内容登录后可见</span>
            <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
          </div>

          {/* 引导卡片 */}
          <div className="max-w-lg mx-auto px-6">
            <div className="bg-linear-to-br from-xf-primary/5 via-xf-primary/10 to-xf-primary/5 rounded-2xl p-6 border border-xf-primary/10">
              {/* 社交证明标签 */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-xf-primary/10 text-xf-primary text-xs font-medium rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  深度内容
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  <Users className="w-3.5 h-3.5" />
                  {communitySize || finalHeadline.split(' ')[1] || '10,000+'}
                </span>
              </div>

              {/* 主标题 - 结合文章主题 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {finalHeadline}
              </h3>

              {/* 价值主张 */}
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                {finalValueProp}
              </p>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Link
                  href={`/login?redirect=${redirectUrl}`}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {finalCtaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/register?redirect=${redirectUrl}`}
                  className="flex-1 flex items-center justify-center px-5 py-2.5 text-xf-primary bg-white border border-xf-primary/20 rounded-xl font-medium hover:bg-xf-primary/5 transition-colors"
                >
                  免费注册
                </Link>
              </div>
            </div>

            {/* 信任提示 */}
            <p className="mt-4 text-center text-xs text-gray-400">
              登录后自动返回当前文章，无需重新查找
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePaywall;
