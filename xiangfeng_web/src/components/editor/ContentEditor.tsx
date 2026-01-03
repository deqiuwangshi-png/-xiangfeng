/**
 * 内容编辑组件
 * 处理文章内容的输入和编辑
 * 包含特定的样式和交互效果
 */

import React, { forwardRef } from 'react';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

const ContentEditor = forwardRef<HTMLTextAreaElement, ContentEditorProps>(({
  content,
  onChange,
  placeholder = '开始书写你的故事...（支持Markdown格式）',
  maxLength = 20000,
  rows = 30
}, ref) => {
  return (
    <div className="content-container">
      <textarea 
        id="content-textarea"
        className="editor-content"
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="true"
        rows={rows}
        maxLength={maxLength}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
      ></textarea>
    </div>
  );
});

ContentEditor.displayName = 'ContentEditor';

export default ContentEditor;