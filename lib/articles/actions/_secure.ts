/**
 * 文章模块安全工具函数
 *
 * @module lib/articles/actions/_secure
 * @description 提供权限验证、内容净化等安全功能
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 验证用户是否为文章作者
 *
 * @param articleId - 文章ID
 * @param userId - 用户ID
 * @returns 是否为作者
 * @throws 文章不存在时抛出错误
 */
export async function verifyArticleOwnership(
  articleId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', articleId)
    .single();

  if (error || !article) {
    throw new Error('文章不存在');
  }

  return article.author_id === userId;
}

/**
 * 验证用户是否为评论作者
 *
 * @param commentId - 评论ID
 * @param userId - 用户ID
 * @returns 是否为作者
 * @throws 评论不存在时抛出错误
 */
export async function verifyCommentOwnership(
  commentId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: comment, error } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (error || !comment) {
    throw new Error('评论不存在');
  }

  return comment.user_id === userId;
}

/**
 * 净化用户输入内容
 *
 * 移除所有 HTML 标签，只保留纯文本
 * 用于评论、标题等不需要富文本的字段
 *
 * @param input - 原始输入
 * @returns 净化后的纯文本
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return (
    input
      // 移除所有 HTML 标签
      .replace(/<[^>]*>/g, '')
      // 解码 HTML 实体
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
 * 净化富文本内容
 *
 * 保留安全的 HTML 标签，移除危险内容
 * 用于文章正文等需要富文本的字段
 *
 * @param html - 原始 HTML
 * @returns 净化后的 HTML
 */
export function sanitizeRichContent(html: string): string {
  if (!html) return '';

  {/* 允许的标签白名单 */}
  const allowedTags = new Set([
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
  ]);

  {/* 危险协议黑名单 */}
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;

  let sanitized = html;

  {/* 移除注释 */}
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  {/* 移除 script/style 标签 */}
  sanitized = sanitized.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  sanitized = sanitized.replace(/<(script|style)[^>]*\/>/gi, '');

  {/* 移除事件处理器 */}
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  {/* 处理标签 */}
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase();

    if (!allowedTags.has(lowerTagName)) {
      return '';
    }

    {/* 处理 a 标签的 href 属性 */}
    if (lowerTagName === 'a') {
      const hrefMatch = match.match(/href\s*=\s*"([^"]*)"/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (dangerousProtocols.test(href)) {
          return `<${lowerTagName} href="#">`;
        }
      }
    }

    const isClosingTag = match.startsWith('</');
    if (isClosingTag) {
      return `</${lowerTagName}>`;
    }

    {/* 只允许特定属性 */}
    if (lowerTagName === 'a') {
      const hrefMatch = match.match(/href\s*=\s*"([^"]*)"/i);
      const href = hrefMatch ? hrefMatch[1] : '#';
      return `<${lowerTagName} href="${href.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">`;
    }

    return `<${lowerTagName}>`;
  });

  {/* 移除空标签 */}
  sanitized = sanitized.replace(/<[^>]+>\s*<\/[^>]+>/g, '');

  return sanitized.trim();
}
