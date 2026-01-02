/**
 * 编辑器浮动工具栏组件
 * 包含各种文本格式化工具按钮
 * 支持折叠/展开功能
 */

import React, { forwardRef } from 'react';
import { 
  Bold, Italic, Underline, Heading, Quote, Code, Link, Image, List, 
  ListOrdered, Minus, Eraser, Undo, Redo, ArrowUpToLine, Maximize, 
  ChevronDown, ChevronUp 
} from 'lucide-react';

interface EditorToolbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onFormatText: (format: string) => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
  onInsertList: (type: 'ul' | 'ol') => void;
  onClearFormatting: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFocusTitle: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const EditorToolbar = forwardRef<HTMLDivElement, EditorToolbarProps>(({
  collapsed,
  onToggleCollapsed,
  onFormatText,
  onInsertLink,
  onInsertImage,
  onInsertList,
  onClearFormatting,
  onUndo,
  onRedo,
  onFocusTitle,
  onToggleFullscreen,
  isFullscreen
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`editor-toolbar ${collapsed ? 'collapsed' : 'visible'}`} 
      id="editor-toolbar"
    >
      {!collapsed && (
        <>
          <div className="toolbar-group">
            <button className="editor-btn" onClick={() => onFormatText('bold')} title="加粗">
              <Bold className="w-4 h-4" />
              <span className="tooltip-text">加粗</span>
            </button>
            <button className="editor-btn" onClick={() => onFormatText('italic')} title="斜体">
              <Italic className="w-4 h-4" />
              <span className="tooltip-text">斜体</span>
            </button>
            <button className="editor-btn" onClick={() => onFormatText('underline')} title="下划线">
              <Underline className="w-4 h-4" />
              <span className="tooltip-text">下划线</span>
            </button>
          </div>
          
          <div className="toolbar-separator"></div>
          
          <div className="toolbar-group">
            <button className="editor-btn" onClick={() => onFormatText('heading')} title="标题">
              <Heading className="w-4 h-4" />
              <span className="tooltip-text">标题</span>
            </button>
            <button className="editor-btn" onClick={() => onFormatText('quote')} title="引用">
              <Quote className="w-4 h-4" />
              <span className="tooltip-text">引用</span>
            </button>
            <button className="editor-btn" onClick={() => onFormatText('code')} title="代码块">
              <Code className="w-4 h-4" />
              <span className="tooltip-text">代码</span>
            </button>
          </div>
          
          <div className="toolbar-separator"></div>
          
          <div className="toolbar-group">
            <button className="editor-btn" onClick={onInsertLink} title="链接">
              <Link className="w-4 h-4" />
              <span className="tooltip-text">链接</span>
            </button>
            <button className="editor-btn" onClick={onInsertImage} title="插入图片">
              <Image className="w-4 h-4" />
              <span className="tooltip-text">图片</span>
            </button>
            <button className="editor-btn" onClick={() => onInsertList('ul')} title="无序列表">
              <List className="w-4 h-4" />
              <span className="tooltip-text">列表</span>
            </button>
            <button className="editor-btn" onClick={() => onInsertList('ol')} title="有序列表">
              <ListOrdered className="w-4 h-4" />
              <span className="tooltip-text">有序列表</span>
            </button>
          </div>
          
          <div className="toolbar-separator"></div>
          
          <div className="toolbar-group">
            <button className="editor-btn" onClick={() => onFormatText('hr')} title="分割线">
              <Minus className="w-4 h-4" />
              <span className="tooltip-text">分割线</span>
            </button>
            <button className="editor-btn" onClick={onClearFormatting} title="清除格式">
              <Eraser className="w-4 h-4" />
              <span className="tooltip-text">清除格式</span>
            </button>
            <button className="editor-btn" onClick={onUndo} title="撤销">
              <Undo className="w-4 h-4" />
              <span className="tooltip-text">撤销</span>
            </button>
            <button className="editor-btn" onClick={onRedo} title="重做">
              <Redo className="w-4 h-4" />
              <span className="tooltip-text">重做</span>
            </button>
          </div>
          
          <div className="toolbar-separator"></div>
          
          <div className="toolbar-group">
            <button className="editor-btn" onClick={onFocusTitle} title="跳转到标题">
              <ArrowUpToLine className="w-4 h-4" />
              <span className="tooltip-text">跳转到标题</span>
            </button>
            <button className="editor-btn" onClick={onToggleFullscreen} title="全屏编辑">
              <Maximize className="w-4 h-4" />
              <span className="tooltip-text">{isFullscreen ? '退出全屏' : '全屏'}</span>
            </button>
          </div>
        </>
      )}
      <div className="toolbar-separator"></div>
      <div className="toolbar-group">
        <button 
          className="editor-btn" 
          onClick={onToggleCollapsed} 
          title={collapsed ? '展开工具栏' : '收起工具栏'}
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="tooltip-text">{collapsed ? '展开' : '收起'}</span>
        </button>
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;