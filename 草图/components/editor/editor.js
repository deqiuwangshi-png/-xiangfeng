// 编辑器组件功能

// 页面状态
let isFullscreen = false;
let autoSaveInterval;
let currentEditorMode = 'edit'; // 'edit' 或 'preview'

// 页面加载后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图标
    lucide.createIcons();
    
    // 初始化编辑器功能
    initEditor();
    
    // 初始化字符计数
    initCharacterCount();
    
    // 加载草稿
    loadDraft();
    
    // 设置编辑器焦点
    setTimeout(() => {
        const titleInput = document.getElementById('title-input');
        const contentTextarea = document.getElementById('content-textarea');
        
        // 如果标题为空，聚焦标题
        if (!titleInput.value.trim()) {
            titleInput.focus();
        } else {
            // 否则聚焦内容区域
            contentTextarea.focus();
        }
    }, 400);
    
    // 监听键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 启动自动保存
    startAutoSave();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            saveDraft();
        }
    });
    
    // 调整工具栏位置，使其与内容编辑器居中对齐
    adjustToolbarPosition();
    
    // 监听窗口大小变化，重新调整工具栏位置
    window.addEventListener('resize', adjustToolbarPosition);
    
    // 监听编辑器滚动，调整工具栏位置
    const contentTextarea = document.getElementById('content-textarea');
    if (contentTextarea) {
        contentTextarea.addEventListener('scroll', adjustToolbarPosition);
    }
});

// 初始化编辑器
function initEditor() {
    // 编辑器模式切换
    const editTab = document.getElementById('edit-tab');
    const previewTab = document.getElementById('preview-tab');
    const editorContent = document.getElementById('content-textarea');
    const previewContent = document.getElementById('preview-content');
    
    if (editTab && previewTab && editorContent && previewContent) {
        editTab.addEventListener('click', function() {
            currentEditorMode = 'edit';
            editTab.classList.add('active');
            previewTab.classList.remove('active');
            editorContent.classList.remove('hidden');
            previewContent.classList.add('hidden');
            editorContent.focus();
        });
        
        previewTab.addEventListener('click', function() {
            currentEditorMode = 'preview';
            previewTab.classList.add('active');
            editTab.classList.remove('active');
            editorContent.classList.add('hidden');
            previewContent.classList.remove('hidden');
            updatePreview();
        });
    }
}

// 初始化字符计数
function initCharacterCount() {
    const titleInput = document.getElementById('title-input');
    const contentTextarea = document.getElementById('content-textarea');
    const counter = document.getElementById('character-counter');
    const charCount = document.getElementById('char-count');
    const contentHint = document.getElementById('content-hint');
    
    function updateCounter() {
        const titleLength = titleInput.value.length;
        const contentLength = contentTextarea.value.length;
        const totalLength = titleLength + contentLength;
        
        charCount.textContent = totalLength;
        
        // 根据长度改变颜色和提示
        if (totalLength === 0) {
            counter.className = 'character-count';
            contentHint.textContent = '建议字数：500-5000字';
        } else if (totalLength > 20000) {
            counter.className = 'character-count error';
            contentHint.textContent = '已超过最大字数限制';
        } else if (totalLength > 15000) {
            counter.className = 'character-count error';
            contentHint.textContent = '接近字数上限';
        } else if (totalLength > 10000) {
            counter.className = 'character-count warning';
            contentHint.textContent = '字数较多，建议精简';
        } else if (totalLength > 5000) {
            counter.className = 'character-count warning';
            contentHint.textContent = '字数适中';
        } else if (totalLength < 500) {
            counter.className = 'character-count warning';
            contentHint.textContent = '内容较短，建议充实';
        } else {
            counter.className = 'character-count';
            contentHint.textContent = '字数合适';
        }
    }
    
    titleInput.addEventListener('input', updateCounter);
    contentTextarea.addEventListener('input', function() {
        updateCounter();
        if (currentEditorMode === 'preview') {
            updatePreview();
        }
    });
    
    // 初始更新
    updateCounter();
}

// 文本格式化功能
function formatText(type) {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';
    
    switch (type) {
        case 'bold':
            newText = `**${selectedText}**`;
            break;
        case 'italic':
            newText = `*${selectedText}*`;
            break;
        case 'underline':
            newText = `<u>${selectedText}</u>`;
            break;
        case 'heading':
            newText = `# ${selectedText}`;
            break;
        case 'quote':
            newText = `> ${selectedText}`;
            break;
        case 'code':
            newText = `\`${selectedText}\``;
            break;
        case 'hr':
            newText = `\n---\n${selectedText}`;
            break;
    }
    
    // 替换选中文本
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    textarea.value = beforeText + newText + afterText;
    
    // 设置光标位置
    textarea.focus();
    const newCursorPosition = start + newText.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    
    // 更新字符计数
    updateCharacterCount();
    
    // 更新预览
    if (currentEditorMode === 'preview') {
        updatePreview();
    }
}

// 插入链接
function insertLink() {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const linkText = selectedText || '链接文本';
    const linkUrl = prompt('请输入链接地址:', 'https://');
    
    if (linkUrl) {
        const newText = `[${linkText}](${linkUrl})`;
        
        // 替换选中文本
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        textarea.value = beforeText + newText + afterText;
        
        // 设置光标位置
        textarea.focus();
        const newCursorPosition = start + newText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // 更新字符计数
        updateCharacterCount();
        
        // 更新预览
        if (currentEditorMode === 'preview') {
            updatePreview();
        }
    }
}

// 插入图片
function insertImage() {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const imageUrl = prompt('请输入图片地址:', 'https://');
    const altText = prompt('请输入图片描述:', '图片描述');
    
    if (imageUrl) {
        const newText = `![${altText || '图片'}](${imageUrl})`;
        
        // 替换选中文本
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        textarea.value = beforeText + newText + afterText;
        
        // 设置光标位置
        textarea.focus();
        const newCursorPosition = start + newText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // 更新字符计数
        updateCharacterCount();
        
        // 更新预览
        if (currentEditorMode === 'preview') {
            updatePreview();
        }
    }
}

// 插入列表
function insertList(type) {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText = '';
    if (selectedText) {
        // 如果有选中文本，将每行转换为列表项
        const lines = selectedText.split('\n');
        newText = lines.map((line, index) => {
            if (type === 'ul') {
                return `- ${line}`;
            } else {
                return `${index + 1}. ${line}`;
            }
        }).join('\n');
    } else {
        // 如果没有选中文本，插入一个列表项
        newText = type === 'ul' ? '- 列表项' : '1. 列表项';
    }
    
    // 替换选中文本
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    textarea.value = beforeText + newText + afterText;
    
    // 设置光标位置
    textarea.focus();
    const newCursorPosition = start + newText.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    
    // 更新字符计数
    updateCharacterCount();
    
    // 更新预览
    if (currentEditorMode === 'preview') {
        updatePreview();
    }
}

// 清除格式
function clearFormatting() {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    // 简单的清除格式（实际应用中可能需要更复杂的处理）
    let newText = selectedText;
    newText = newText.replace(/\*\*(.*?)\*\*/g, '$1'); // 清除粗体
    newText = newText.replace(/\*(.*?)\*/g, '$1'); // 清除斜体
    newText = newText.replace(/<u>(.*?)<\/u>/g, '$1'); // 清除下划线
    newText = newText.replace(/^#\s+/gm, ''); // 清除标题
    newText = newText.replace(/^>\s+/gm, ''); // 清除引用
    newText = newText.replace(/\`(.*?)\`/g, '$1'); // 清除行内代码
    newText = newText.replace(/^-\s+/gm, ''); // 清除无序列表
    newText = newText.replace(/^\d+\.\s+/gm, ''); // 清除有序列表
    
    // 替换选中文本
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    textarea.value = beforeText + newText + afterText;
    
    // 设置光标位置
    textarea.focus();
    const newCursorPosition = start + newText.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    
    // 更新字符计数
    updateCharacterCount();
    
    // 更新预览
    if (currentEditorMode === 'preview') {
        updatePreview();
    }
}

// 更新字符计数
function updateCharacterCount() {
    const titleInput = document.getElementById('title-input');
    const contentTextarea = document.getElementById('content-textarea');
    const counter = document.getElementById('character-counter');
    const charCount = document.getElementById('char-count');
    const contentHint = document.getElementById('content-hint');
    
    if (titleInput && contentTextarea && counter && charCount && contentHint) {
        const titleLength = titleInput.value.length;
        const contentLength = contentTextarea.value.length;
        const totalLength = titleLength + contentLength;
        
        charCount.textContent = totalLength;
        
        // 根据长度改变颜色和提示
        if (totalLength === 0) {
            counter.className = 'character-count';
            contentHint.textContent = '建议字数：500-5000字';
        } else if (totalLength > 20000) {
            counter.className = 'character-count error';
            contentHint.textContent = '已超过最大字数限制';
        } else if (totalLength > 15000) {
            counter.className = 'character-count error';
            contentHint.textContent = '接近字数上限';
        } else if (totalLength > 10000) {
            counter.className = 'character-count warning';
            contentHint.textContent = '字数较多，建议精简';
        } else if (totalLength > 5000) {
            counter.className = 'character-count warning';
            contentHint.textContent = '字数适中';
        } else if (totalLength < 500) {
            counter.className = 'character-count warning';
            contentHint.textContent = '内容较短，建议充实';
        } else {
            counter.className = 'character-count';
            contentHint.textContent = '字数合适';
        }
    }
}

// 更新预览
function updatePreview() {
    const contentTextarea = document.getElementById('content-textarea');
    const previewContent = document.getElementById('preview-content');
    
    if (contentTextarea && previewContent) {
        const markdownText = contentTextarea.value;
        const htmlText = renderMarkdown(markdownText);
        previewContent.innerHTML = htmlText;
    }
}

// 简单的Markdown渲染（实际应用中建议使用专门的Markdown库）
function renderMarkdown(markdown) {
    let html = markdown;
    
    // 标题
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // 粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // 斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // 链接
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // 图片
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // 引用
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // 行内代码
    html = html.replace(/\`(.*?)\`/g, '<code>$1</code>');
    
    // 代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 无序列表
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)(?!.*<li>)/gs, '<ul>$&</ul>');
    
    // 有序列表
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)(?!.*<li>)/gs, '<ol>$&</ol>');
    
    // 分割线
    html = html.replace(/^---$/gm, '<hr>');
    
    // 段落
    html = html.replace(/^(?!<h|<ul|<ol|<blockquote|<pre|<li|<hr)(.*$)/gm, '<p>$1</p>');
    
    // 换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// 处理键盘快捷键
function handleKeyboardShortcuts(event) {
    // Ctrl/Command + S 保存
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDraft();
        return;
    }
    
    // Ctrl/Command + Enter 发布
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        publishContent();
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
    
    // Ctrl/Command + Z 撤销
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undoAction();
        return;
    }
    
    // Ctrl/Command + Y 或 Shift + Z 重做
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        redoAction();
        return;
    }
}

// 调整工具栏位置，使其与内容编辑器居中对齐
function adjustToolbarPosition() {
    const editorContainer = document.querySelector('.editor-container');
    const toolbar = document.getElementById('editor-toolbar');
    
    if (!editorContainer || !toolbar) return;
    
    // 获取编辑器的位置和宽度
    const editorRect = editorContainer.getBoundingClientRect();
    const editorCenter = editorRect.left + editorRect.width / 2;
    
    // 设置工具栏的中心位置与编辑器的中心位置对齐
    toolbar.style.left = `${editorCenter}px`;
    toolbar.style.transform = 'translateX(-50%)';
}

// 切换全屏
function toggleFullscreen() {
    const editorCard = document.querySelector('.editor-card');
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        // 进入全屏
        if (editorCard.requestFullscreen) {
            editorCard.requestFullscreen();
        } else if (editorCard.webkitRequestFullscreen) {
            editorCard.webkitRequestFullscreen();
        } else if (editorCard.msRequestFullscreen) {
            editorCard.msRequestFullscreen();
        }
        document.getElementById('fullscreen-text').textContent = '退出全屏';
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        document.getElementById('fullscreen-text').textContent = '全屏';
    }
}

// 切换工具栏
function toggleToolbar() {
    const toolbar = document.getElementById('editor-toolbar');
    const toggleIcon = document.getElementById('toggle-icon');
    const toggleText = document.getElementById('toggle-text');
    
    toolbar.classList.toggle('collapsed');
    
    if (toolbar.classList.contains('collapsed')) {
        toggleIcon.innerHTML = '<i data-lucide="chevron-up"></i>';
        toggleText.textContent = '展开';
    } else {
        toggleIcon.innerHTML = '<i data-lucide="chevron-down"></i>';
        toggleText.textContent = '收起';
    }
}

// 跳转到标题
function focusTitle() {
    const titleInput = document.getElementById('title-input');
    if (titleInput) {
        titleInput.focus();
    }
}

// 撤销操作
function undoAction() {
    // 简单的撤销实现，实际应用中建议使用更复杂的撤销栈
    const contentTextarea = document.getElementById('content-textarea');
    if (contentTextarea) {
        contentTextarea.focus();
        document.execCommand('undo');
        updateCharacterCount();
        if (currentEditorMode === 'preview') {
            updatePreview();
        }
    }
}

// 重做操作
function redoAction() {
    // 简单的重做实现，实际应用中建议使用更复杂的撤销栈
    const contentTextarea = document.getElementById('content-textarea');
    if (contentTextarea) {
        contentTextarea.focus();
        document.execCommand('redo');
        updateCharacterCount();
        if (currentEditorMode === 'preview') {
            updatePreview();
        }
    }
}

// 保存草稿
function saveDraft() {
    const titleInput = document.getElementById('title-input');
    const contentTextarea = document.getElementById('content-textarea');
    
    if (titleInput && contentTextarea) {
        const draft = {
            title: titleInput.value,
            content: contentTextarea.value,
            timestamp: Date.now()
        };
        
        localStorage.setItem('xf_draft', JSON.stringify(draft));
        showMessage('草稿已保存', 'success');
    }
}

// 加载草稿
function loadDraft() {
    try {
        const draft = localStorage.getItem('xf_draft');
        if (draft) {
            const { title, content, timestamp } = JSON.parse(draft);
            if (title || content) {
                const titleInput = document.getElementById('title-input');
                const contentTextarea = document.getElementById('content-textarea');
                
                titleInput.value = title || '';
                contentTextarea.value = content || '';
                
                // 显示恢复草稿的提示
                const timeAgo = getTimeAgo(timestamp);
                showMessage(`已恢复 ${timeAgo} 的草稿`, 'info', 4000);
            }
        }
    } catch (e) {
        console.log('无草稿可恢复');
    }
}

// 获取时间差描述
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
}

// 启动自动保存
function startAutoSave() {
    // 每30秒自动保存一次
    autoSaveInterval = setInterval(saveDraft, 30000);
}

// 发布内容
function publishContent() {
    const titleInput = document.getElementById('title-input');
    const contentTextarea = document.getElementById('content-textarea');
    
    if (!titleInput.value.trim()) {
        showMessage('请输入标题', 'warning');
        titleInput.focus();
        return;
    }
    
    if (!contentTextarea.value.trim()) {
        showMessage('请输入内容', 'warning');
        contentTextarea.focus();
        return;
    }
    
    // 发布逻辑
    showMessage('正在发布...', 'info');
    
    // 模拟发布延迟
    setTimeout(() => {
        showMessage('发布成功', 'success');
        
        // 清除草稿
        localStorage.removeItem('xf_draft');
        
        // 重置表单
        titleInput.value = '';
        contentTextarea.value = '';
        updateCharacterCount();
        
        // 跳转到首页
        setTimeout(() => {
            window.location.href = './首页.html';
        }, 1500);
    }, 1500);
}

// 显示消息
function showMessage(message, type = 'info', duration = 3000) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-soft animate-slide-up ${type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
    messageEl.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 自动移除
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(20px) translateX(-50%)';
        messageEl.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, duration);
}

// 导出函数供外部使用
window.initEditor = initEditor;
window.formatText = formatText;
window.insertLink = insertLink;
window.insertImage = insertImage;
window.insertList = insertList;
window.clearFormatting = clearFormatting;
window.saveDraft = saveDraft;
window.publishContent = publishContent;
window.toggleFullscreen = toggleFullscreen;
window.toggleToolbar = toggleToolbar;