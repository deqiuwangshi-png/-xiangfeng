/**
 * 发布页面组件
 * 基于官网发布.html设计
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Save, Send, Sidebar as SidebarIcon } from 'lucide-react';
import TitleInput from '@/components/editor/TitleInput';
import ContentEditor from '@/components/editor/ContentEditor';
import CharacterCounter from '@/components/editor/CharacterCounter';
import EditorToolbar from '@/components/editor/EditorToolbar';

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

  // 创建ref保存最新的title和content
  const latestTitle = useRef(title);
  const latestContent = useRef(content);
  
  // 创建ref保存上一次保存的内容哈希值
  const lastSavedHash = useRef<string>('');
  
  // 计算内容哈希值的函数
  const getContentHash = useCallback((title: string, content: string) => {
    // 简单的哈希算法，实际项目中可以使用更复杂的算法
    const str = `${title}|${content}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }, []);

  // 更新ref，使其始终指向最新的title和content
  useEffect(() => {
    latestTitle.current = title;
    latestContent.current = content;
  }, [title, content]);

  // 切换标签
  const handleTabChange = useCallback((tabName: 'home' | 'explore' | 'publish') => {
    setActiveTab(tabName);
  }, []);

  // 保存草稿
  const saveDraft = useCallback(async () => {
    // 如果正在保存，直接返回
    if (isSaving) return;
    
    // 计算当前内容的哈希值
    const currentHash = getContentHash(latestTitle.current, latestContent.current);
    
    // 如果内容没有变化，直接返回
    if (currentHash === lastSavedHash.current) return;
    
    setIsSaving(true);
    try {
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('xf_draft', JSON.stringify({
        title: latestTitle.current,
        content: latestContent.current,
        timestamp: Date.now()
      }));
      
      // 更新上一次保存的哈希值
      lastSavedHash.current = currentHash;
      
      console.log('草稿已保存');
    } catch (_) {
      console.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, getContentHash]);

  // 发布内容
  const publishContent = useCallback(async () => {
    setIsPublishing(true);
    try {
      // 模拟发布延迟
      await new Promise(resolve => setTimeout(resolve, 1200));
      alert('内容已发布');
      // 清空表单
      setTitle('');
      setContent('');
      localStorage.removeItem('xf_draft');
    } catch (_) {
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  }, []);

  // 加载草稿
  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem('xf_draft');
      if (draft) {
        const { title: savedTitle, content: savedContent, timestamp } = JSON.parse(draft);
        if (savedTitle || savedContent) {
          setTitle(savedTitle || '');
          setContent(savedContent || '');
          
          // 显示恢复草稿的提示
          const timeAgo = getTimeAgo(timestamp);
          alert(`已恢复 ${timeAgo} 的草稿`);
        }
      }
    } catch (_) {
      console.log('无草稿可恢复');
    }
  }, []);

  // 获取时间差描述
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  // 格式化文本
  const formatText = useCallback((format: string) => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || '';
    
    let newText = '';
    let newStart = start;
    let newEnd = end;
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText || '加粗文本'}**`;
        newStart = selectedText ? start + 2 : start + 2;
        newEnd = selectedText ? end + 2 : start + 8;
        break;
      case 'italic':
        newText = `*${selectedText || '斜体文本'}*`;
        newStart = selectedText ? start + 1 : start + 1;
        newEnd = selectedText ? end + 1 : start + 5;
        break;
      case 'underline':
        newText = `__${selectedText || '下划线文本'}__`;
        newStart = selectedText ? start + 2 : start + 2;
        newEnd = selectedText ? end + 2 : start + 9;
        break;
      case 'heading':
        newText = `# ${selectedText || '标题文本'}`;
        newStart = selectedText ? start + 2 : start + 2;
        newEnd = selectedText ? end + 2 : start + 6;
        break;
      case 'quote':
        newText = `> ${selectedText || '引用文本'}`;
        newStart = selectedText ? start + 2 : start + 2;
        newEnd = selectedText ? end + 2 : start + 6;
        break;
      case 'code':
        newText = `\`${selectedText || '代码片段'}\``;
        newStart = selectedText ? start + 1 : start + 1;
        newEnd = selectedText ? end + 1 : start + 7;
        break;
      case 'hr':
        newText = `\n---\n${selectedText}`;
        newStart = selectedText ? start + 5 : start + 5;
        newEnd = selectedText ? end + 5 : start + 5;
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
  }, []);

  // 插入链接
  const insertLink = useCallback(() => {
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
  }, []);

  // 插入图片
  const insertImage = useCallback(() => {
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
  }, []);

  // 插入列表
  const insertList = useCallback((type: 'ul' | 'ol') => {
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
  }, []);

  // 清除格式
  const clearFormatting = useCallback(() => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
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
    
    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    }, 0);
  }, []);

  // 撤销操作
  const undoAction = useCallback(() => {
    // 简单实现，实际项目中可能需要更复杂的撤销栈
    console.log('撤销操作');
  }, []);

  // 重做操作
  const redoAction = useCallback(() => {
    // 简单实现，实际项目中可能需要更复杂的撤销栈
    console.log('重做操作');
  }, []);

  // 聚焦标题
  const focusTitle = useCallback(() => {
    const titleInput = document.getElementById('title-input') as HTMLInputElement;
    if (titleInput) {
      titleInput.focus();
    }
  }, []);

  // 切换全屏
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // 切换工具栏
  const toggleToolbar = useCallback(() => {
    setToolbarCollapsed(prev => !prev);
  }, []);

  // 创建防抖定时器ref
  const saveDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const publishDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // 防抖保存函数
  const debouncedSaveDraft = useCallback(() => {
    // 清除之前的定时器
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }
    
    // 设置新的定时器
    saveDebounceRef.current = setTimeout(() => {
      saveDraft();
    }, 300); // 300ms防抖
  }, [saveDraft]);
  
  // 防抖发布函数
  const debouncedPublishContent = useCallback(() => {
    // 清除之前的定时器
    if (publishDebounceRef.current) {
      clearTimeout(publishDebounceRef.current);
    }
    
    // 设置新的定时器
    publishDebounceRef.current = setTimeout(() => {
      publishContent();
    }, 300); // 300ms防抖
  }, [publishContent]);
  
  // 处理键盘快捷键
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    // Ctrl/Command + S 保存
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      debouncedSaveDraft();
      return;
    }
    
    // Ctrl/Command + Enter 发布
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      debouncedPublishContent();
      return;
    }
    
    // Ctrl/Command + B 加粗
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      formatText('bold');
      return;
    }
    
    // Ctrl/Command + I 斜体
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      formatText('italic');
      return;
    }
    
    // Ctrl/Command + K 链接
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      insertLink();
      return;
    }
    
    // F11 全屏
    if (event.key === 'F11') {
      event.preventDefault();
      toggleFullscreen();
      return;
    }
  }, [debouncedSaveDraft, debouncedPublishContent, formatText, insertLink, toggleFullscreen]);

  // 调整工具栏位置，使其与内容编辑器居中对齐
  const adjustToolbarPosition = useCallback(() => {
    if (!editorContainerRef.current || !toolbarRef.current) return;
    
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    const editorCenter = editorRect.left + editorRect.width / 2;
    
    toolbarRef.current.style.left = `${editorCenter}px`;
    toolbarRef.current.style.transform = 'translateX(-50%)';
  }, []);

  // 页面加载后的初始化
  useEffect(() => {
    // 页面加载后的优雅浮现效果
    const mainApp = document.getElementById('app-view');
    let fadeTimeout: NodeJS.Timeout;
    
    if (mainApp && !mainApp.classList.contains('hidden')) {
      mainApp.style.opacity = '0';
      mainApp.style.transform = 'translateY(10px)';
      fadeTimeout = setTimeout(() => {
        mainApp.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        mainApp.style.opacity = '1';
        mainApp.style.transform = 'translateY(0)';
      }, 100);
    }

    // 为所有可点击元素添加按下效果
    const buttonElements = document.querySelectorAll('button, .cursor-pointer');
    const mousedownHandler = (e: MouseEvent) => {
      const htmlEl = e.currentTarget as HTMLElement;
      htmlEl.style.transform = 'scale(0.98)';
    };
    
    const mouseupHandler = (e: MouseEvent) => {
      const htmlEl = e.currentTarget as HTMLElement;
      htmlEl.style.transform = '';
    };
    
    const mouseleaveHandler = (e: MouseEvent) => {
      const htmlEl = e.currentTarget as HTMLElement;
      htmlEl.style.transform = '';
    };
    
    buttonElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.addEventListener('mousedown', mousedownHandler);
      htmlEl.addEventListener('mouseup', mouseupHandler);
      htmlEl.addEventListener('mouseleave', mouseleaveHandler);
    });

    // 设置编辑器焦点
    let focusTimeout: NodeJS.Timeout;
    focusTimeout = setTimeout(() => {
      const titleInput = document.getElementById('title-input') as HTMLInputElement | null;
      const contentTextarea = document.getElementById('content-textarea') as HTMLTextAreaElement | null;
      
      // 如果标题为空，聚焦标题
      if (titleInput && !titleInput.value.trim()) {
        titleInput.focus();
      } else if (contentTextarea) {
        // 否则聚焦内容区域
        contentTextarea.focus();
      }
    }, 400);

    // 监听键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 启动自动保存
    const autoSaveInterval = setInterval(() => {
      // 使用统一的saveDraft函数，避免重复保存
      saveDraft();
    }, 30000); // 每30秒自动保存一次
    
    // 监听页面可见性变化
    const visibilityChangeHandler = () => {
      if (document.hidden) {
        // 只有当不在保存状态时才调用saveDraft
        if (!isSaving) {
          saveDraft();
        }
      }
    };
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    
    // 调整工具栏位置，使其与内容编辑器居中对齐
    adjustToolbarPosition();
    
    // 监听窗口大小变化和滚动事件，重新调整工具栏位置
    window.addEventListener('resize', adjustToolbarPosition);
    window.addEventListener('scroll', adjustToolbarPosition);
    
    // 加载草稿
    loadDraft();
    
    return () => {
      // 清除定时器
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (focusTimeout) clearTimeout(focusTimeout);
      
      // 清除防抖定时器
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
      if (publishDebounceRef.current) clearTimeout(publishDebounceRef.current);
      
      // 移除事件监听器
      document.removeEventListener('keydown', handleKeyboardShortcuts);
      window.removeEventListener('resize', adjustToolbarPosition);
      window.removeEventListener('scroll', adjustToolbarPosition);
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      
      // 移除按钮按下效果的事件监听器
      buttonElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeEventListener('mousedown', mousedownHandler);
        htmlEl.removeEventListener('mouseup', mouseupHandler);
        htmlEl.removeEventListener('mouseleave', mouseleaveHandler);
      });
      
      // 清除自动保存定时器
      clearInterval(autoSaveInterval);
    };
  }, [saveDraft, loadDraft, adjustToolbarPosition, handleKeyboardShortcuts]);

  // 监听内容变化，调整工具栏位置
  useEffect(() => {
    adjustToolbarPosition();
  }, [adjustToolbarPosition]);

  return (
    <div id="app-view" className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden view-transition">
      {/* 左侧边栏 */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主内容区域 - 使用发布.html的设计 */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth" id="main-scroll">
        {/* 渐变背景装饰 - 更柔和 */}
        <div className="gradient-bg"></div>

        {/* 简约顶部栏 - 已修改：移除返回按钮，将标题移到左侧 */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-xf-bg/50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* 左侧：标题 */}
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-xf-primary bg-xf-subtle px-3 py-1.5 rounded-lg">
                  创作新文章
                </div>
              </div>
              
              {/* 右侧：保存/发布按钮 */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={debouncedSaveDraft} 
                  className="text-sm text-xf-medium hover:text-xf-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-xf-bg flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{isSaving ? '保存中...' : '保存草稿'}</span>
                </button>
                <button 
                  onClick={debouncedPublishContent} 
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
          <div className="editor-card slide-up">
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
        </div>

        {/* 浮动工具栏 - 与内容编辑器居中对齐 */}
        <EditorToolbar
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
          ref={toolbarRef}
        />
      </main>

      {/* 移动端侧边栏切换按钮 */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center text-xf-primary"
        onClick={() => {
          const sidebar = document.querySelector('aside');
          if (sidebar) {
            sidebar.classList.toggle('hidden');
          }
        }}
      >
        <SidebarIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
export default PublishPage;