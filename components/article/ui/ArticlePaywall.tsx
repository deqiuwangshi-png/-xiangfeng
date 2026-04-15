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
 *
 * @性能优化 P1: 使用 useMemo 缓存计算结果
 * - 缓存 truncateHtml 计算结果，避免重复解析
 * - 缓存 generateThemeCopy 结果
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, Users } from 'lucide-react';
import { sanitizeRichText } from '@/lib/utils/purify';

/**
 * 文章预览墙组件属性
 * @interface ArticlePaywallProps
 */
interface ArticlePaywallProps {
  /** 服务端生成的预览内容（不下发全文） */
  previewContent: string;
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
 * 智能截断HTML内容，保留完整标签结构
 * @param {string} html - HTML格式的文章内容
 * @param {number} maxLength - 最大文本长度
 * @returns {string} 保留HTML标签的预览内容
 */
function truncateHtml(html: string, maxLength: number): string {
  let currentLength = 0;
  let result = '';
  let inTag = false;
  let tagBuffer = '';
  let textBuffer = '';
  const tagStack: string[] = [];

  for (let i = 0; i < html.length; i++) {
    const char = html[i];

    // 处理标签
    if (char === '<') {
      // 先处理累积的文本
      if (textBuffer) {
        const remaining = maxLength - currentLength;
        if (remaining <= 0) break;

        if (textBuffer.length <= remaining) {
          result += textBuffer;
          currentLength += textBuffer.length;
        } else {
          // 需要截断文本
          let truncatedText = textBuffer.slice(0, remaining);

          // 在语义边界截断（句号、逗号）
          const lastPeriod = truncatedText.lastIndexOf('。');
          const lastComma = truncatedText.lastIndexOf('，');
          const boundaryIndex = Math.max(lastPeriod, lastComma);

          if (boundaryIndex > remaining * 0.5) {
            truncatedText = truncatedText.slice(0, boundaryIndex + 1);
          }

          result += truncatedText;
          currentLength += truncatedText.length;

          // 关闭所有未闭合的标签
          while (tagStack.length > 0) {
            const tag = tagStack.pop();
            if (tag && !tag.includes('/')) {
              result += `</${tag}>`;
            }
          }
          break;
        }
        textBuffer = '';
      }

      inTag = true;
      tagBuffer = char;
      continue;
    }

    if (inTag) {
      tagBuffer += char;

      if (char === '>') {
        inTag = false;
        result += tagBuffer;

        // 处理标签栈
        const tagMatch = tagBuffer.match(/<\/?([a-z0-9]+)[^>]*>/i);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (tagBuffer.startsWith('</')) {
            // 结束标签
            const lastIndex = tagStack.lastIndexOf(tagName);
            if (lastIndex !== -1) {
              tagStack.splice(lastIndex, 1);
            }
          } else if (!tagBuffer.endsWith('/>')) {
            // 开始标签（非自闭合）
            tagStack.push(tagName);
          }
        }

        tagBuffer = '';
      }
      continue;
    }

    // 累积文本
    textBuffer += char;
  }

  // 处理剩余的文本
  if (textBuffer && currentLength < maxLength) {
    const remaining = maxLength - currentLength;
    result += textBuffer.slice(0, remaining);
  }

  // 关闭所有未闭合的标签
  while (tagStack.length > 0) {
    const tag = tagStack.pop();
    if (tag && !tag.includes('/')) {
      result += `</${tag}>`;
    }
  }

  return result;
}

/**
 * 文章预览墙组件
 *
 * @param {ArticlePaywallProps} props - 组件属性
 * @returns {JSX.Element} 文章预览墙
 */
export function ArticlePaywall({
  previewContent,
  previewRatio = 0.35,
  articleTitle = '',
  tags = [],
  headline,
  valueProposition,
  communitySize,
}: ArticlePaywallProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  /**
   * 缓存主题文案计算结果
   */
  const themeCopy = useMemo(() => {
    return generateThemeCopy(articleTitle, tags);
  }, [articleTitle, tags]);

  const finalHeadline = headline || themeCopy.headline;
  const finalValueProp = valueProposition || themeCopy.valueProposition;
  const finalCtaText = themeCopy.ctaText;

  /**
   * 缓存预览内容计算结果
   * 避免每次渲染重新解析 HTML
   */
  const sanitizedPreview = useMemo(() => {
    const previewLength = calculatePreviewLength(previewContent, previewRatio);
    const previewHtml = truncateHtml(previewContent, previewLength);
    return sanitizeRichText(previewHtml);
  }, [previewContent, previewRatio]);

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
