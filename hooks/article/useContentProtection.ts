'use client';

/**
 * 内容保护Hook
 * @module hooks/useContentProtection
 * @description 防止文章内容被复制的保护机制
 *
 * @特性
 * - 禁用文本选择
 * - 禁用右键菜单
 * - 屏蔽复制/剪切/粘贴快捷键
 * - 可配置开关
 * - 支持排除特定元素
 *
 * @性能优化 P1: 优化事件监听策略
 * - selectstart、contextmenu 绑定到 document（需要在 capture 阶段阻止）
 * - keydown、copy、cut、dragstart 绑定到元素本身（减少全局监听）
 */

import { useEffect, useCallback, useRef, RefObject } from 'react';

/**
 * 内容保护配置选项
 * @interface ContentProtectionOptions
 */
interface ContentProtectionOptions {
  /** 是否启用保护 */
  enabled?: boolean;
  /** 排除的选择器（这些元素不会被保护） */
  excludeSelectors?: string[];
  /** 自定义提示信息 */
  message?: string;
}

/**
 * 检查元素是否在排除列表中
 * @param {Element} element - 要检查的元素
 * @param {string[]} excludeSelectors - 排除选择器列表
 * @returns {boolean} 是否在排除列表中
 */
function isExcludedElement(element: Element, excludeSelectors: string[]): boolean {
  return excludeSelectors.some(selector => {
    try {
      return element.closest(selector) !== null;
    } catch {
      return false;
    }
  });
}

/**
 * 内容保护Hook
 *
 * @param {RefObject<HTMLElement>} contentRef - 内容容器引用
 * @param {ContentProtectionOptions} options - 保护配置选项
 *
 * @example
 * const contentRef = useRef<HTMLDivElement>(null);
 * useContentProtection(contentRef, {
 *   enabled: true,
 *   excludeSelectors: ['.code-block', '.share-button'],
 *   message: '文章内容受保护，禁止复制'
 * });
 */
export function useContentProtection(
  contentRef: RefObject<HTMLElement | null>,
  options: ContentProtectionOptions = {}
): void {
  const {
    enabled = true,
    excludeSelectors = [],
    message = '文章内容受保护，禁止复制',
  } = options;

  /**
   * 处理选择开始事件
   * 阻止在受保护区域内的文本选择
   */
  const handleSelectStart = useCallback((event: Event) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    // 检查是否在内容区域内且不在排除列表中
    if (
      contentRef.current.contains(target) &&
      !isExcludedElement(target, excludeSelectors)
    ) {
      event.preventDefault();
    }
  }, [enabled, excludeSelectors, contentRef]);

  /**
   * 处理上下文菜单事件
   * 禁用右键菜单
   */
  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    // 检查是否在内容区域内且不在排除列表中
    if (
      contentRef.current.contains(target) &&
      !isExcludedElement(target, excludeSelectors)
    ) {
      event.preventDefault();

      // 可选：显示提示
      if (message) {
        // 使用浏览器原生提示或自定义提示组件
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 9999;
          pointer-events: none;
          animation: fadeInOut 2s ease-in-out;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
      }
    }
  }, [enabled, excludeSelectors, message, contentRef]);

  /**
   * 处理键盘快捷键
   * 屏蔽 Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A 等
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    // 检查是否在内容区域内且不在排除列表中
    if (
      !contentRef.current.contains(target) ||
      isExcludedElement(target, excludeSelectors)
    ) {
      return;
    }

    // 检查是否是复制/剪切/粘贴/全选快捷键
    const isCopyShortcut = (event.ctrlKey || event.metaKey) && (
      event.key === 'c' ||
      event.key === 'C' ||
      event.key === 'x' ||
      event.key === 'X' ||
      event.key === 'v' ||
      event.key === 'V' ||
      event.key === 'a' ||
      event.key === 'A'
    );

    // 检查是否是打印快捷键
    const isPrintShortcut = (event.ctrlKey || event.metaKey) && (
      event.key === 'p' ||
      event.key === 'P'
    );

    // 检查是否是保存快捷键
    const isSaveShortcut = (event.ctrlKey || event.metaKey) && (
      event.key === 's' ||
      event.key === 'S'
    );

    if (isCopyShortcut || isPrintShortcut || isSaveShortcut) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [enabled, excludeSelectors, contentRef]);

  /**
   * 处理复制事件
   */
  const handleCopy = useCallback((event: ClipboardEvent) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    if (
      contentRef.current.contains(target) &&
      !isExcludedElement(target, excludeSelectors)
    ) {
      event.preventDefault();
      event.clipboardData?.clearData();
    }
  }, [enabled, excludeSelectors, contentRef]);

  /**
   * 处理剪切事件
   */
  const handleCut = useCallback((event: ClipboardEvent) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    if (
      contentRef.current.contains(target) &&
      !isExcludedElement(target, excludeSelectors)
    ) {
      event.preventDefault();
    }
  }, [enabled, excludeSelectors, contentRef]);

  /**
   * 处理拖拽事件
   * 防止通过拖拽复制内容
   */
  const handleDragStart = useCallback((event: DragEvent) => {
    if (!enabled || !contentRef.current) return;

    const target = event.target as Element;

    if (
      contentRef.current.contains(target) &&
      !isExcludedElement(target, excludeSelectors)
    ) {
      event.preventDefault();
    }
  }, [enabled, excludeSelectors, contentRef]);

  useEffect(() => {
    if (!enabled) return;

    const element = contentRef.current;
    if (!element) return;

    element.style.userSelect = 'none';
    (element.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = 'none';

    /**
     * @性能优化: 将事件监听器分类绑定
     * - document 级别：selectstart、contextmenu（需要在 capture 阶段阻止默认行为）
     * - 元素级别：keydown、copy、cut、dragstart（减少全局监听开销）
     */
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    
    element.addEventListener('keydown', handleKeyDown, true);
    element.addEventListener('copy', handleCopy, true);
    element.addEventListener('cut', handleCut, true);
    element.addEventListener('dragstart', handleDragStart, true);

    return () => {
      element.style.userSelect = '';
      (element.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = '';

      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      
      element.removeEventListener('keydown', handleKeyDown, true);
      element.removeEventListener('copy', handleCopy, true);
      element.removeEventListener('cut', handleCut, true);
      element.removeEventListener('dragstart', handleDragStart, true);
    };
  }, [
    enabled,
    handleSelectStart,
    handleContextMenu,
    handleKeyDown,
    handleCopy,
    handleCut,
    handleDragStart,
    contentRef,
  ]);
}

export default useContentProtection;
