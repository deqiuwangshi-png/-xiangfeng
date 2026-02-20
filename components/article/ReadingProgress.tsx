'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  articleId?: string;
}

export default function ReadingProgress({ articleId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min((scrolled / documentHeight) * 100, 100);
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="reading-progress">
      <div 
        className="reading-progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
