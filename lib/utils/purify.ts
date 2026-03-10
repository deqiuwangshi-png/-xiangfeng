/**
 * DOMPurify HTML 净化工具
 *
 * @module lib/utils/purify
 * @description 使用 DOMPurify 进行专业的 XSS 防护
 *
 * @安全说明
 * - 使用条件导入避免 ESM/CommonJS 冲突
 * - 配置严格的标签和属性白名单
 * - 自动处理危险协议 (javascript:, data: 等)
 */

// 条件导入 DOMPurify，避免 ESM/CommonJS 冲突
let DOMPurify: any;
try {
  // 尝试动态导入
  const module = require('isomorphic-dompurify');
  DOMPurify = module.default || module;
} catch (error) {
  // 导入失败时使用简单的文本处理
  console.warn('DOMPurify 导入失败，使用备用文本处理:', error);
  DOMPurify = {
    sanitize: (html: string, config: any) => {
      if (config?.ALLOWED_TAGS?.length === 0) {
        // 纯文本模式：移除所有标签
        return html.replace(/<[^>]*>/g, '');
      } else {
        // 富文本模式：简单的标签过滤
        return html
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
      }
    }
  };
}

/**
 * 富文本内容净化配置
 * 用于文章正文等需要格式化内容的场景
 */
const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'del',
    'a',
    'ul',
    'ol',
    'li',
    'code',
    'pre',
    'blockquote',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  // 强制所有链接在新标签页打开，并添加安全属性
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
};

/**
 * 纯文本净化配置
 * 用于评论、标题等只需要纯文本的场景
 */
const PLAIN_TEXT_CONFIG = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true, // 保留标签内的文本内容
};

/**
 * 净化富文本内容
 *
 * 用于文章正文，保留安全的 HTML 格式
 *
 * @param html - 原始 HTML 内容
 * @returns 净化后的安全 HTML
 *
 * @example
 * ```typescript
 * const clean = sanitizeRichText('<p>Hello</p><script>alert(1)</script>');
 * // 返回: '<p>Hello</p>'
 * ```
 */
export function sanitizeRichText(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // 先使用 DOMPurify 净化
  let purified = DOMPurify.sanitize(html, RICH_TEXT_CONFIG);

  // 额外处理：确保所有链接都有安全属性
  purified = purified.replace(
    /<a\s+([^>]*)href="([^"]*)"([^>]*)>/gi,
    (match: string, before: string, href: string, after: string) => {
      // 检查是否是危险协议
      const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
      if (dangerousProtocols.test(href)) {
        return '<a href="#">';
      }

      // 确保有 target="_blank" 和 rel="noopener noreferrer"
      const hasTarget = /target\s*=\s*"[^"]*"/i.test(match);
      const hasRel = /rel\s*=\s*"[^"]*"/i.test(match);

      let safeAttrs = `href="${href}"`;
      if (before.trim()) safeAttrs = `${before.trim()} ${safeAttrs}`;
      if (after.trim()) safeAttrs = `${safeAttrs} ${after.trim()}`;
      if (!hasTarget) safeAttrs += ' target="_blank"';
      if (!hasRel) safeAttrs += ' rel="noopener noreferrer nofollow"';

      return `<a ${safeAttrs}>`;
    }
  );

  return purified;
}

/**
 * 净化纯文本内容
 *
 * 用于评论、标题等，移除所有 HTML 标签
 *
 * @param text - 原始文本
 * @returns 净化后的纯文本
 *
 * @example
 * ```typescript
 * const clean = sanitizePlainText('<p>Hello</p>');
 * // 返回: 'Hello'
 * ```
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 使用 DOMPurify 移除所有标签，只保留文本
  const purified = DOMPurify.sanitize(text, PLAIN_TEXT_CONFIG);

  // 解码 HTML 实体
  return (
    purified
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&nbsp;/g, ' ')
      // 移除控制字符
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // 移除多余空白
      .trim()
  );
}

/**
 * 生成文章摘要
 *
 * 从 HTML 内容中提取纯文本，并截取指定长度
 *
 * @param html - HTML 内容
 * @param maxLength - 最大长度，默认 150
 * @returns 文章摘要
 */
export function generateExcerpt(html: string, maxLength: number = 150): string {
  const plainText = sanitizePlainText(html);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 截取到指定长度，并在单词边界处截断
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
}
