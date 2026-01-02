/**
 * 标题输入组件
 * 处理文章标题的输入
 * 包含特定的样式和交互效果
 */

import React from 'react';

interface TitleInputProps {
  title: string;
  onChange: (title: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const TitleInput: React.FC<TitleInputProps> = ({
  title,
  onChange,
  placeholder = '为你的文章起一个引人入胜的标题',
  maxLength = 100
}) => {
  return (
    <div className="title-container">
      <input 
        type="text" 
        id="title-input"
        className="editor-title"
        placeholder={placeholder}
        autocomplete="off"
        spellCheck="false"
        maxLength={maxLength}
        value={title}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="placeholder-hint" id="title-hint">最多{maxLength}字</div>
    </div>
  );
};

export default TitleInput;