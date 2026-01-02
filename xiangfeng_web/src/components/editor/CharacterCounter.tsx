/**
 * 字符计数器组件
 * 实时显示文章标题和内容的总字符数
 * 根据字符数提供不同的提示
 */

import React from 'react';

interface CharacterCounterProps {
  title: string;
  content: string;
  recommendedMinLength?: number;
  recommendedMaxLength?: number;
  maxLength?: number;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({
  title,
  content,
  recommendedMinLength = 500,
  recommendedMaxLength = 5000,
  maxLength = 20000
}) => {
  const totalCharacters = title.length + content.length;
  
  // 确定提示文本和样式
  let hintText = '建议字数：500-5000字';
  let className = 'character-count';
  
  if (totalCharacters === 0) {
    hintText = '建议字数：500-5000字';
  } else if (totalCharacters < recommendedMinLength) {
    hintText = '内容较短，建议充实';
  } else if (totalCharacters < recommendedMaxLength) {
    hintText = '字数合适';
  } else if (totalCharacters < recommendedMaxLength * 2) {
    hintText = '字数适中';
  } else if (totalCharacters < maxLength * 0.75) {
    hintText = '字数较多，建议精简';
  } else if (totalCharacters < maxLength) {
    hintText = '接近字数上限';
    className = 'character-count warning';
  } else {
    hintText = '已超过最大字数限制';
    className = 'character-count error';
  }

  return (
    <div className={className}>
      <span id="char-count">{totalCharacters}</span> 字
      <span className="hint" id="content-hint">
        {hintText}
      </span>
    </div>
  );
};

export default CharacterCounter;