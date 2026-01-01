import { useState, useEffect } from 'react';

/**
 * 防抖钩子
 * @param {T} value - 需要防抖的值
 * @param {number} delay - 防抖延迟时间（毫秒）
 * @returns {T} 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 本地存储钩子
 * @param {string} key - 存储键名
 * @param {T} initialValue - 初始值
 * @returns {[T, (value: T) => void]} 存储的值和设置函数
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * 点击外部钩子
 * @param {React.RefObject<HTMLElement>} ref - 元素引用
 * @param {Function} handler - 点击外部时的处理函数
 */
export function useClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent) => void): void {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

/**
 * 键盘事件钩子
 * @param {string} targetKey - 目标按键
 * @param {Function} handler - 按键处理函数
 */
export function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void): void {
  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler(event);
      }
    };

    window.addEventListener('keydown', keyPressHandler);
    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [targetKey, handler]);
}

/**
 * 窗口尺寸钩子
 * @returns {{width: number, height: number}} 窗口尺寸
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * 滚动位置钩子
 * @returns {{x: number, y: number}} 滚动位置
 */
export function useScrollPosition(): { x: number; y: number } {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}