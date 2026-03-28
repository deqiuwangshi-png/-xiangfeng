/**
 * 内容安全过滤工具
 *
 * @module lib/security/contentFilter
 * @description 提供敏感词过滤、内容审核等安全功能
 *
 * @安全特性
 * - 敏感词检测与替换
 * - 支持自定义敏感词库
 * - 可配置过滤级别（严格/宽松）
 * - 支持正则表达式匹配
 */

/**
 * 过滤级别枚举
 */
export type FilterLevel = 'strict' | 'normal' | 'loose';

/**
 * 过滤结果接口
 */
export interface FilterResult {
  /** 是否包含敏感词 */
  hasSensitiveWords: boolean;
  /** 过滤后的内容 */
  filteredContent: string;
  /** 检测到的敏感词列表 */
  detectedWords: string[];
  /** 敏感词出现次数 */
  matchCount: number;
}

/**
 * 默认敏感词库（宽松策略）
 *
 * @security
 * 仅保留严重违法违规词汇，普通词汇放宽审核
 * 实际项目中应从配置文件或数据库加载
 */
const DEFAULT_SENSITIVE_WORDS: string[] = [
  // 严重暴力相关（保留）
  '炸弹', '枪支',
  // 色情相关（保留核心词汇）
  '色情', '淫秽', '嫖娼', '卖淫',
  // 诈骗相关（保留）
  '诈骗', '传销', '非法集资', '洗钱',
  // 注：以下词汇已移除，采用更宽松的审核策略
  // '暴力', '血腥', '杀戮', '武器', '反动', '颠覆', '分裂', '暴乱', '游行',
  // '种族歧视', '性别歧视', '地域歧视', '裸体',
];

/**
 * 敏感词正则表达式缓存
 */
const regexCache = new Map<string, RegExp>();

/**
 * 获取敏感词正则表达式
 *
 * @param words - 敏感词列表
 * @returns 编译后的正则表达式
 */
function getSensitiveWordsRegex(words: string[]): RegExp {
  const cacheKey = words.join('|');

  if (regexCache.has(cacheKey)) {
    return regexCache.get(cacheKey)!;
  }

  // 转义特殊字符并构建正则
  const escapedWords = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
  regexCache.set(cacheKey, regex);

  return regex;
}

/**
 * 过滤敏感词
 *
 * @param content - 原始内容
 * @param options - 过滤选项
 * @returns 过滤结果
 *
 * @example
 * ```typescript
 * const result = filterSensitiveWords('这是一篇包含暴力的文章', {
 *   level: 'strict',
 *   replacement: '***'
 * });
 * // result.filteredContent = '这是一篇包含***的文章'
 * ```
 */
export function filterSensitiveWords(
  content: string,
  options: {
    /** 敏感词列表，默认使用内置词库 */
    words?: string[];
    /** 过滤级别 */
    level?: FilterLevel;
    /** 替换字符，默认 *** */
    replacement?: string;
    /** 是否只检测不替换 */
    detectOnly?: boolean;
  } = {}
): FilterResult {
  const {
    words = DEFAULT_SENSITIVE_WORDS,
    level = 'normal',
    replacement = '***',
    detectOnly = false,
  } = options;

  // 空内容直接返回
  if (!content || typeof content !== 'string') {
    return {
      hasSensitiveWords: false,
      filteredContent: content || '',
      detectedWords: [],
      matchCount: 0,
    };
  }

  // 根据级别调整敏感词列表
  let activeWords = words;
  if (level === 'strict') {
    // 严格模式：增加更多敏感词检测
    activeWords = [...words, ...words.map((w) => `${w}的`)];
  } else if (level === 'loose') {
    // 宽松模式：减少敏感词数量
    activeWords = words.slice(0, Math.floor(words.length / 2));
  }

  const regex = getSensitiveWordsRegex(activeWords);
  const detectedWords: string[] = [];
  let matchCount = 0;

  // 检测敏感词
  const matches = content.matchAll(regex);
  for (const match of matches) {
    if (match[0] && !detectedWords.includes(match[0])) {
      detectedWords.push(match[0]);
    }
    matchCount++;
  }

  // 替换敏感词
  const filteredContent = detectOnly
    ? content
    : content.replace(regex, replacement);

  return {
    hasSensitiveWords: detectedWords.length > 0,
    filteredContent,
    detectedWords,
    matchCount,
  };
}

/**
 * 快速检测内容是否包含敏感词
 *
 * @param content - 待检测内容
 * @param words - 敏感词列表
 * @returns 是否包含敏感词
 */
export function hasSensitiveWords(
  content: string,
  words: string[] = DEFAULT_SENSITIVE_WORDS
): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const regex = getSensitiveWordsRegex(words);
  return regex.test(content);
}

/**
 * 验证文章内容安全性（宽松策略）
 *
 * @param title - 文章标题
 * @param content - 文章内容
 * @returns 验证结果
 *
 * @security
 * - 使用宽松模式检测敏感词
 * - 仅阻止严重违规内容，其他自动替换
 * - 返回详细错误信息
 */
export function validateArticleContent(
  title: string,
  content: string
): {
  valid: boolean;
  errors: string[];
  titleResult: FilterResult;
  contentResult: FilterResult;
} {
  const errors: string[] = [];

  // 验证标题长度
  if (title.length < 1 || title.length > 100) {
    errors.push('标题长度必须在1-100字符之间');
  }

  // 验证内容长度
  if (content.length < 1 || content.length > 50000) {
    errors.push('内容长度必须在1-50000字符之间');
  }

  // 使用严格级别检测标题
  const titleResult = filterSensitiveWords(title, {
    detectOnly: true,
    level: 'strict',
  });

  // 使用严格级别检测内容
  const contentResult = filterSensitiveWords(content, {
    detectOnly: true,
    level: 'strict',
  });

  // 严格策略：阻止包含敏感词的内容
  if (titleResult.hasSensitiveWords) {
    errors.push(`标题包含敏感词: ${titleResult.detectedWords.join(', ')}`);
  }
  if (contentResult.hasSensitiveWords) {
    errors.push(`内容包含敏感词: ${contentResult.detectedWords.join(', ')}`);
  }

  // 检测恶意脚本
  const scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  if (scriptRegex.test(content)) {
    errors.push('内容包含恶意脚本');
  }

  // 检测iframe标签
  const iframeRegex = /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi;
  if (iframeRegex.test(content)) {
    errors.push('内容包含不允许的iframe标签');
  }

  return {
    valid: errors.length === 0,
    errors,
    titleResult,
    contentResult,
  };
}

/**
 * 清理内容中的敏感词
 *
 * @param title - 文章标题
 * @param content - 文章内容
 * @returns 清理后的内容
 */
export function sanitizeArticleContent(title: string, content: string): {
  title: string;
  content: string;
  hasSensitiveWords: boolean;
} {
  const titleResult = filterSensitiveWords(title);
  const contentResult = filterSensitiveWords(content);

  return {
    title: titleResult.filteredContent,
    content: contentResult.filteredContent,
    hasSensitiveWords:
      titleResult.hasSensitiveWords || contentResult.hasSensitiveWords,
  };
}
