/**
 * 编辑器容器组件
 * 管理整个编辑器的状态和布局
 * 包含标题输入、内容编辑、浮动工具栏和字符计数器
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, Send } from 'lucide-react';
import TitleInput from './TitleInput';
import ContentEditor from './ContentEditor';
import CharacterCounter from './CharacterCounter';
import EditorToolbar from './EditorToolbar';

interface EditorContainerProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
  onPublish?: (title: string, content: string) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  initialTitle = '',
  initialContent = '',
  onSave,
  onPublish
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // 保存草稿
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (onSave) {
        onSave(title, content);
      } else {
        // 默认保存到localStorage
        localStorage.setItem('xf_draft', JSON.stringify({
          title,
          content,
          timestamp: Date.now()
        }));
      }
      
      alert('草稿已保存');
    } catch (error) {
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 发布内容
  const publishContent = async () => {
    setIsPublishing(true);
    try {
      // 模拟发布延迟
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (onPublish) {
        onPublish(title, content);
      } else {
        // 默认发布成功后清空
        setTitle('');
        setContent('');
        localStorage.removeItem('xf_draft');
      }
      
      alert('内容已发布');
    } catch (error) {
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // 加载草稿
  useEffect(() => {
    try {
      const draft = localStorage.getItem('xf_draft');
      if (draft && !initialTitle && !initialContent) {
        const { title: savedTitle, content: savedContent } = JSON.parse(draft);
        setTitle(savedTitle);
        setContent(savedContent);
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  }, [initialTitle, initialContent]);

  // 自动保存
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (!initialTitle && !initialContent) {
        localStorage.setItem('xf_draft', JSON.stringify({
          title,
          content,
          timestamp: Date.now()
        }));
      }
    }, 3000);

    return () => clearTimeout(autoSave);
  }, [title, content, initialTitle, initialContent]);

  // 调整工具栏位置
  const adjustToolbarPosition = () => {
    if (!editorContainerRef.current || !toolbarRef.current) return;
    
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    const toolbarRect = toolbarRef.current.getBoundingClientRect();
    
    const editorCenter = editorRect.left + editorRect.width / 2;
    const toolbarLeft = editorCenter - toolbarRect.width / 2;
    
    if (toolbarRef.current) {
      toolbarRef.current.style.left = `${toolbarLeft}px`;
      toolbarRef.current.style.transform = 'translateX(0)';
    }
  };

  // 监听窗口大小变化，重新调整工具栏位置
  useEffect(() => {
    adjustToolbarPosition();
    window.addEventListener('resize', adjustToolbarPosition);
    return () => window.removeEventListener('resize', adjustToolbarPosition);
  }, []);

  // 监听内容变化，调整工具栏位置
  useEffect(() => {
    adjustToolbarPosition();
  }, [title, content]);

  // 格式化文本
  const formatText = (format: string) => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText = '';
    let newStart = start;
    let newEnd = end;
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newStart = start + 1;
        newEnd = end + 1;
        break;
      case 'underline':
        newText = `__${selectedText}__`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        newStart = start + 1;
        newEnd = end + 1;
        break;
      case 'hr':
        newText = `\n---\n${selectedText}`;
        newStart = start + 5;
        newEnd = end + 5;
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setContent(newContent);
    
    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  // 插入链接
  const insertLink = () => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || '链接文本';
    
    const newText = `[${selectedText}](https://example.com)`;
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setContent(newContent);
    
    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + selectedText.length + 2, start + selectedText.length + 14);
    }, 0);
  };

  // 插入图片
  const insertImage = () => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = `![图片描述](https://example.com/image.jpg)`;
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setContent(newContent);
    
    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 11);
    }, 0);
  };

  // 插入列表
  const insertList = (type: 'ul' | 'ol') => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText = '';
    if (selectedText) {
      const lines = selectedText.split('\n');
      if (type === 'ul') {
        newText = lines.map(line => `- ${line}`).join('\n');
      } else {
        newText = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
      }
    } else {
      newText = type === 'ul' ? '- 列表项\n- 列表项' : '1. 列表项\n2. 列表项';
    }
    
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setContent(newContent);
    
    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  // 清除格式
  const clearFormatting = () => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    // 移除常见的Markdown格式
    const newText = selectedText
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/^# (.*)$/gm, '$1')
      .replace(/^> (.*)$/gm, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^- (.*)$/gm, '$1')
      .replace(/^\d+\. (.*)$/gm, '$1');
    
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    setContent(newContent);
  };

  // 撤销操作
  const undoAction = () => {
    // 简单实现，实际项目中可能需要更复杂的撤销栈
    alert('撤销操作');
  };

  // 重做操作
  const redoAction = () => {
    // 简单实现，实际项目中可能需要更复杂的撤销栈
    alert('重做操作');
  };

  // 聚焦标题
  const focusTitle = () => {
    const titleInput = document.getElementById('title-input');
    if (titleInput) {
      titleInput.focus();
    }
  };

  // 切换全屏
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 切换工具栏
  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };

  return (
    <div className="editor-container" ref={editorContainerRef}>
      {/* 编辑卡片 */}
      <div className={`editor-card slide-up ${isFullscreen ? 'max-h-[calc(100vh-120px)] overflow-y-auto' : ''}`}>
        {/* 标题输入 */}
        <TitleInput 
          title={title} 
          onChange={setTitle} 
        />
        
        {/* 内容编辑器 */}
        <ContentEditor 
          content={content} 
          onChange={setContent} 
          ref={contentRef} 
        />
        
        {/* 字符计数 */}
        <CharacterCounter 
          title={title} 
          content={content} 
        />
      </div>

      {/* 浮动工具栏 */}
      <EditorToolbar 
        ref={toolbarRef}
        collapsed={toolbarCollapsed}
        onToggleCollapsed={toggleToolbar}
        onFormatText={formatText}
        onInsertLink={insertLink}
        onInsertImage={insertImage}
        onInsertList={insertList}
        onClearFormatting={clearFormatting}
        onUndo={undoAction}
        onRedo={redoAction}
        onFocusTitle={focusTitle}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {/* 顶部保存/发布按钮 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-xf-bg/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：标题 */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-xf-primary bg-xf-light/50 px-3 py-1.5 rounded-lg">
                创作新文章
              </div>
            </div>
            
            {/* 右侧：保存/发布按钮 */}
            <div className="flex items-center gap-3">
              <button 
                onClick={saveDraft} 
                className="text-sm text-xf-medium hover:text-xf-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-xf-bg flex items-center gap-2"
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{isSaving ? '保存中...' : '保存草稿'}</span>
              </button>
              <button 
                onClick={publishContent} 
                className="publish-btn"
                disabled={isPublishing}
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? '发布中...' : '发布'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default EditorContainer;