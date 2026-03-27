/**
 * 内容保护配置常量
 * @module constants/contentProtection
 * @description 文章内容防复制功能的配置开关
 *
 * @配置说明
 * - 可通过环境变量或此处配置控制保护功能
 * - 支持全局开关和细粒度控制
 */

/**
 * 是否启用内容保护功能
 * 可通过环境变量 NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION 控制
 * 默认为启用
 */
export const ENABLE_CONTENT_PROTECTION =
  process.env.NEXT_PUBLIC_ENABLE_CONTENT_PROTECTION !== 'false';

/**
 * 内容保护默认配置
 */
export const CONTENT_PROTECTION_CONFIG = {
  /** 是否启用保护 */
  enabled: ENABLE_CONTENT_PROTECTION,

  /** 保护提示信息 */
  message: '文章内容受保护，禁止复制',

  /** 排除的选择器（这些元素不受保护） */
  excludeSelectors: [
    '.comment-section',      // 评论区
    '.article-actions',      // 文章操作按钮
    '.share-buttons',        // 分享按钮
    '.author-info',          // 作者信息
    'pre',                   // 代码块
    'code',                  // 行内代码
    '.copy-button',          // 复制按钮
    'input',                 // 输入框
    'textarea',              // 文本域
  ],

  /** 是否禁用右键菜单 */
  disableContextMenu: true,

  /** 是否禁用键盘快捷键 */
  disableKeyboardShortcuts: true,

  /** 是否禁用文本选择 */
  disableTextSelection: true,

  /** 是否禁用拖拽 */
  disableDrag: true,
} as const;

/**
 * 检查内容保护是否启用
 * @returns {boolean} 是否启用
 */
export function isContentProtectionEnabled(): boolean {
  return ENABLE_CONTENT_PROTECTION;
}
