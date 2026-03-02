'use client';

/**
 * 阅读进度组件
 *
 * 作用: 显示文章阅读进度条
 *
 * 优化点:
 * - 使用 requestAnimationFrame 节流，减少 setState 触发频率
 * - 只有进度变化超过 1% 才更新，避免过度渲染
 * - 使用 GPU 加速提升动画性能
 *
 * @returns {JSX.Element} 阅读进度组件
 */

import { useEffect, useState, useRef } from 'react';

/**
 * ReadingProgress Props 接口
 */
interface ReadingProgressProps {
  articleId?: string;
}

/**
 * 阅读进度组件
 *
 * @function ReadingProgress
 * @param {ReadingProgressProps} props - 组件属性
 * @returns {JSX.Element} 阅读进度组件
 *
 * @description
 * 提供文章阅读进度指示功能：
 * - 实时计算滚动进度
 * - 使用 RAF 节流优化性能
 * - 最小变化阈值减少渲染
 */
export default function ReadingProgress({ articleId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    /**
     * 处理滚动事件
     *
     * 使用 requestAnimationFrame 节流，避免每帧都触发 setState
     */
    const handleScroll = () => {
      // 取消之前的请求
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const newProgress = Math.min((scrolled / documentHeight) * 100, 100);

        // 只有变化超过 1% 才更新，减少渲染次数
        setProgress(prev => {
          const diff = Math.abs(newProgress - prev);
          return diff > 1 ? newProgress : prev;
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="reading-progress">
      <div
        className="reading-progress-fill"
        style={{
          width: `${progress}%`,
          transform: 'translateZ(0)', // 启用 GPU 加速
          willChange: 'width', // 提示浏览器优化宽度变化
        }}
      />
    </div>
  );
}
