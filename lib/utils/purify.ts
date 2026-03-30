/**
 * HTML 净化工具
 *
 * @module lib/utils/purify
 * @description 使用纯 JavaScript 实现的 XSS 防护
 *
 * @安全说明
 * - 纯 JavaScript 实现，避免 ESM/CommonJS 冲突
 * - 配置严格的标签和属性白名单
 * - 自动处理危险协议 (javascript:, data: 等)
 */

// 净化配置接口
interface SanitizeConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
  FORBID_ATTR?: string[];
  KEEP_CONTENT?: boolean;
}

// 纯 JavaScript 实现的 HTML 净化函数
const sanitizeHtml = (html: string, config: SanitizeConfig) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  if (config?.ALLOWED_TAGS?.length === 0) {
    // 纯文本模式：移除所有标签
    return html.replace(/<[^>]*>/g, '');
  } else {
    // 富文本模式：使用白名单过滤
    let sanitized = html;

    // 移除危险标签
    sanitized = sanitized
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
      .replace(/<link[^>]*>.*?<\/link>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '');

    /**
     * 移除危险事件属性
     * @安全修复 S-01: 支持无引号、单引号、双引号形式
     * 匹配模式: onerror=alert(1), onerror='alert(1)', onerror="alert(1)"
     */
    // 双引号形式: onerror="..."
    sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
    // 单引号形式: onerror='...'
    sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');
    // 无引号形式: onerror=... (匹配到空格或标签结束)
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]+/gi, '');

    // 过滤标签，只保留白名单中的标签
    if (config?.ALLOWED_TAGS && config.ALLOWED_TAGS.length > 0) {
      const allowedTags = config.ALLOWED_TAGS.join('|');
      const tagRegex = new RegExp(`<\/?(?!(${allowedTags}))[a-z][a-z0-9]*[^>]*>`, 'gi');
      sanitized = sanitized.replace(tagRegex, '');

      // 过滤属性，只保留白名单中的属性
      if (config?.ALLOWED_ATTR && config.ALLOWED_ATTR.length > 0) {
        const allowedAttrs = config.ALLOWED_ATTR.join('|');
        // 匹配双引号属性
        const attrRegexDouble = new RegExp(`\\s+(?!(${allowedAttrs}))[a-z][a-z0-9-]*\\s*=\\s*"[^"]*"`, 'gi');
        sanitized = sanitized.replace(attrRegexDouble, '');
        // 匹配单引号属性
        const attrRegexSingle = new RegExp(`\\s+(?!(${allowedAttrs}))[a-z][a-z0-9-]*\\s*=\\s*'[^']*'`, 'gi');
        sanitized = sanitized.replace(attrRegexSingle, '');
        // 匹配无引号属性
        const attrRegexNoQuote = new RegExp(`\\s+(?!(${allowedAttrs}))[a-z][a-z0-9-]*\\s*=\\s*[^\\s>]+`, 'gi');
        sanitized = sanitized.replace(attrRegexNoQuote, '');
      }
    }

    /**
     * 额外处理：确保 img 标签的 src 属性不包含危险协议
     * @性能优化 P1: 添加 loading="lazy" 属性实现图片懒加载
     */
    if (config?.ALLOWED_TAGS?.includes('img')) {
      // 处理双引号 src
      sanitized = sanitized.replace(/<img\s+([^>]*)src="([^"]*)"([^>]*)>/gi, (match, before, src, after) => {
        const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
        if (dangerousProtocols.test(src)) {
          return `<img ${before}src="#" alt="" loading="lazy" ${after}>`;
        }
        // 检查是否已有 loading 属性
        const hasLoading = /loading\s*=/i.test(match);
        const loadingAttr = hasLoading ? '' : ' loading="lazy"';
        return `<img ${before}src="${src}"${loadingAttr} ${after}>`;
      });
      // 处理单引号 src
      sanitized = sanitized.replace(/<img\s+([^>]*)src='([^']*)'([^>]*)>/gi, (match, before, src, after) => {
        const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
        if (dangerousProtocols.test(src)) {
          return `<img ${before}src="#" alt="" loading="lazy" ${after}>`;
        }
        const hasLoading = /loading\s*=/i.test(match);
        const loadingAttr = hasLoading ? '' : ' loading="lazy"';
        return `<img ${before}src='${src}'${loadingAttr} ${after}>`;
      });
      // 处理无引号 src
      sanitized = sanitized.replace(/<img\s+([^>]*)src=([^\s>]+)\s*([^>]*)>/gi, (match, before, src, after) => {
        const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
        if (dangerousProtocols.test(src)) {
          return `<img ${before}src="#" alt="" loading="lazy" ${after}>`;
        }
        const hasLoading = /loading\s*=/i.test(match);
        const loadingAttr = hasLoading ? '' : ' loading="lazy"';
        return `<img ${before}src="${src}"${loadingAttr} ${after}>`;
      });
    }

    return sanitized;
  }
};

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
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title', 'data-align'],
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

  // 使用纯 JavaScript 实现的净化函数
  let purified = sanitizeHtml(html, RICH_TEXT_CONFIG);

  /**
   * 额外处理：确保所有链接都有安全属性
   * @安全修复 S-01: 支持单引号和无引号的 href 属性
   */
  // 处理双引号 href: <a href="...">
  purified = purified.replace(
    /<a\s+([^>]*)href="([^"]*)"([^>]*)>/gi,
    (match: string, before: string, href: string, after: string) => {
      return processLinkAttribute(match, before, href, after, '"');
    }
  );
  // 处理单引号 href: <a href='...'>
  purified = purified.replace(
    /<a\s+([^>]*)href='([^']*)'([^>]*)>/gi,
    (match: string, before: string, href: string, after: string) => {
      return processLinkAttribute(match, before, href, after, "'");
    }
  );
  // 处理无引号 href: <a href=...> (简化处理，不重构属性)
  purified = purified.replace(
    /<a\s+([^>]*)href=([^\s>]*)\s*([^>]*)>/gi,
    (match: string, before: string, href: string, after: string) => {
      // 检查是否是危险协议
      const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
      if (dangerousProtocols.test(href)) {
        return '<a href="#">';
      }
      // 无引号形式直接替换为安全形式
      return `<a ${before.trim()} href="${href}" target="_blank" rel="noopener noreferrer nofollow" ${after.trim()}>`;
    }
  );

  return purified;
}

/**
 * 处理链接属性
 * @param match - 完整匹配字符串
 * @param before - href 前的属性
 * @param href - 链接地址
 * @param after - href 后的属性
 * @param quote - 引号类型
 * @returns 处理后的安全链接标签
 */
function processLinkAttribute(
  match: string,
  before: string,
  href: string,
  after: string,
  quote: string
): string {
  // 检查是否是危险协议
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(href)) {
    return '<a href="#">';
  }

  // 确保有 target="_blank" 和 rel="noopener noreferrer"
  const hasTarget = /target\s*=\s*["']?[^"'>\s]*["']?/i.test(match);
  const hasRel = /rel\s*=\s*["']?[^"'>\s]*["']?/i.test(match);

  let safeAttrs = `href=${quote}${href}${quote}`;
  if (before.trim()) safeAttrs = `${before.trim()} ${safeAttrs}`;
  if (after.trim()) safeAttrs = `${safeAttrs} ${after.trim()}`;
  if (!hasTarget) safeAttrs += ' target="_blank"';
  if (!hasRel) safeAttrs += ' rel="noopener noreferrer nofollow"';

  return `<a ${safeAttrs}>`;
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

  // 使用纯 JavaScript 实现的净化函数
  const purified = sanitizeHtml(text, PLAIN_TEXT_CONFIG);

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

/**
 * 转义 HTML 特殊字符
 *
 * 用于将用户输入的纯文本安全地显示在 HTML 中，防止 XSS 攻击
 * 与 sanitizePlainText 不同，此函数保留 HTML 标签的文本形式（如将 < 转换为 &lt;）
 *
 * @security
 * - 必须用于所有用户生成的、在 JSX 中作为文本节点渲染的内容
 * - 不适用于已经使用 dangerouslySetInnerHTML 的场景（那些应该使用 sanitizeRichText）
 *
 * @param text - 原始文本
 * @returns 转义后的安全文本
 *
 * @example
 * ```typescript
 * const safe = escapeHtml('<script>alert(1)</script>');
 * // 返回: '&lt;script&gt;alert(1)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}
