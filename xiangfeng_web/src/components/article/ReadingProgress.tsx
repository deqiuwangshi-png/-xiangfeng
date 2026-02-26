/**
 * 阅读进度条组件
 * 实时跟踪用户的阅读进度
 */

'use client';

import { useEffect, useRef, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const readingProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const contentHeight = documentHeight - windowHeight;
      const scrollPercent = (scrollTop / contentHeight) * 100;
      const clampedProgress = Math.min(100, Math.max(0, scrollPercent));
      
      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', updateProgress);
    // 初始化时调用一次
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div className="reading-progress" ref={readingProgressRef}>
      <div 
        className="reading-progress-fill" 
        style={{ width: `${progress}%` }} 
      ></div>
    </div>
  );
}
