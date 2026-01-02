/**
 * 发布页面组件
 * 基于官网发布.html设计
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { Save, Send, Bold, Italic, Underline, Heading, Quote, Code, Link, Image, List, ListOrdered, Minus, Eraser, Undo, Redo, ArrowUpToLine, Maximize, ChevronDown, ChevronUp } from 'lucide-react';

const PublishPage = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'publish'>('publish');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // 切换标签
  const handleTabChange = (tabName: 'home' | 'explore' | 'publish') => {
    setActiveTab(tabName);
  };

  // 保存草稿
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('xf_draft', JSON.stringify({
        title,
        content,
        timestamp: Date.now()
      }));
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
      alert('内容已发布');
      // 清空表单
      setTitle('');
      setContent('');
      localStorage.removeItem('xf_draft');
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
      if (draft) {
        const { title: savedTitle, content: savedContent } = JSON.parse(draft);
        setTitle(savedTitle);
        setContent(savedContent);
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  }, []);

  // 自动保存
  useEffect(() => {
    const autoSave = setTimeout(() => {
      localStorage.setItem('xf_draft', JSON.stringify({
        title,
        content,
        timestamp: Date.now()
      }));
    }, 3000);

    return () => clearTimeout(autoSave);
  }, [title, content]);

  // 调整工具栏位置
  const adjustToolbarPosition = () => {
    if (!editorContainerRef.current || !toolbarRef.current) return;
    
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    const toolbarRect = toolbarRef.current.getBoundingClientRect();
    
    const editorCenter = editorRect.left + editorRect.width / 2;
    const toolbarLeft = editorCenter - toolbarRect.width / 2;
    
    if (toolbarRef.current) {
      toolbarRef.current.style.left = `${editorLeft}px`;
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

  // 计算总字符数
  const totalCharacters = title.length + content.length;

  return (
    <div id="app-view" className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden view-transition">
      {/* 左侧边栏 */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主内容区域 */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth" id="main-scroll">
        {/* 渐变背景装饰 - 更柔和 */}
        <div className="gradient-bg"></div>

        {/* 简约顶部栏 */}
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

        {/* 主编辑区域 */}
        <div className="editor-container px-4 py-8 md:py-12 fade-in" ref={editorContainerRef}>
          {/* 编辑卡片 */}
          <div className={`editor-card slide-up ${isFullscreen ? 'max-h-[calc(100vh-120px)] overflow-y-auto' : ''}`}>
            {/* 标题输入 */}
            <div className="title-container">
              <input 
                type="text" 
                id="title-input"
                className="editor-title"
                placeholder="为你的文章起一个引人入胜的标题"
                autocomplete="off"
                spellCheck="false"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="placeholder-hint" id="title-hint">最多100字</div>
            </div>
            
            {/* 内容编辑器 */}
            <div className="content-container">
              <textarea 
                id="content-textarea"
                className="editor-content"
                placeholder="开始书写你的故事...（支持Markdown格式）"
                autocomplete="off"
                spellCheck="true"
                rows={30}
                maxLength={20000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={contentRef}
              ></textarea>
              
              {/* 字符计数 */}
              <div 
                className={`character-count ${totalCharacters > 15000 ? 'warning' : ''} ${totalCharacters > 20000 ? 'error' : ''}`}
              >
                <span id="char-count">{totalCharacters}</span> 字
                <span className="hint" id="content-hint">
                  {totalCharacters === 0 ? '建议字数：500-5000字' : 
                   totalCharacters < 500 ? '内容较短，建议充实' : 
                   totalCharacters > 5000 ? '字数适中' : 
                   totalCharacters > 10000 ? '字数较多，建议精简' : 
                   totalCharacters > 15000 ? '接近字数上限' : 
                   '字数合适'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 浮动工具栏 */}
        <div 
          className={`editor-toolbar ${toolbarCollapsed ? 'collapsed' : 'visible'}`} 
          id="editor-toolbar"
          ref={toolbarRef}
        >
          {!toolbarCollapsed && (
            <>
              <div className="toolbar-group">
                <button className="editor-btn" onClick={() => formatText('bold')} title="加粗">
                  <Bold className="w-4 h-4" />
                  <span className="tooltip-text">加粗</span>
                </button>
                <button className="editor-btn" onClick={() => formatText('italic')} title="斜体">
                  <Italic className="w-4 h-4" />
                  <span className="tooltip-text">斜体</span>
                </button>
                <button className="editor-btn" onClick={() => formatText('underline')} title="下划线">
                  <Underline className="w-4 h-4" />
                  <span className="tooltip-text">下划线</span>
                </button>
              </div>
              
              <div className="toolbar-separator"></div>
              
              <div className="toolbar-group">
                <button className="editor-btn" onClick={() => formatText('heading')} title="标题">
                  <Heading className="w-4 h-4" />
                  <span className="tooltip-text">标题</span>
                </button>
                <button className="editor-btn" onClick={() => formatText('quote')} title="引用">
                  <Quote className="w-4 h-4" />
                  <span className="tooltip-text">引用</span>
                </button>
                <button className="editor-btn" onClick={() => formatText('code')} title="代码块">
                  <Code className="w-4 h-4" />
                  <span className="tooltip-text">代码</span>
                </button>
              </div>
              
              <div className="toolbar-separator"></div>
              
              <div className="toolbar-group">
                <button className="editor-btn" onClick={insertLink} title="链接">
                  <Link className="w-4 h-4" />
                  <span className="tooltip-text">链接</span>
                </button>
                <button className="editor-btn" onClick={insertImage} title="插入图片">
                  <Image className="w-4 h-4" />
                  <span className="tooltip-text">图片</span>
                </button>
                <button className="editor-btn" onClick={() => insertList('ul')} title="无序列表">
                  <List className="w-4 h-4" />
                  <span className="tooltip-text">列表</span>
                </button>
                <button className="editor-btn" onClick={() => insertList('ol')} title="有序列表">
                  <ListOrdered className="w-4 h-4" />
                  <span className="tooltip-text">有序列表</span>
                </button>
              </div>
              
              <div className="toolbar-separator"></div>
              
              <div className="toolbar-group">
                <button className="editor-btn" onClick={() => formatText('hr')} title="分割线">
                  <Minus className="w-4 h-4" />
                  <span className="tooltip-text">分割线</span>
                </button>
                <button className="editor-btn" onClick={clearFormatting} title="清除格式">
                  <Eraser className="w-4 h-4" />
                  <span className="tooltip-text">清除格式</span>
                </button>
                <button className="editor-btn" onClick={undoAction} title="撤销">
                  <Undo className="w-4 h-4" />
                  <span className="tooltip-text">撤销</span>
                </button>
                <button className="editor-btn" onClick={redoAction} title="重做">
                  <Redo className="w-4 h-4" />
                  <span className="tooltip-text">重做</span>
                </button>
              </div>
              
              <div className="toolbar-separator"></div>
              
              <div className="toolbar-group">
                <button className="editor-btn" onClick={focusTitle} title="跳转到标题">
                  <ArrowUpToLine className="w-4 h-4" />
                  <span className="tooltip-text">跳转到标题</span>
                </button>
                <button className="editor-btn" onClick={toggleFullscreen} title="全屏编辑">
                  <Maximize className="w-4 h-4" />
                  <span className="tooltip-text">{isFullscreen ? '退出全屏' : '全屏'}</span>
                </button>
              </div>
            </>
          )}
          <div className="toolbar-separator"></div>
          <div className="toolbar-group">
            <button className="editor-btn" onClick={toggleToolbar} title={toolbarCollapsed ? '展开工具栏' : '收起工具栏'}>
              {toolbarCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span className="tooltip-text">{toolbarCollapsed ? '展开' : '收起'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* 移动端侧边栏切换按钮 */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center text-xf-primary"
        onClick={() => {
          const sidebar = document.getElementById('right-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('flex');
          }
        }}
      >
        <span className="w-5 h-5">☰</span>
      </button>
    </div>
  );
};

export default PublishPage;