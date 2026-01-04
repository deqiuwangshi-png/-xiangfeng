/**
 * 分享菜单组件
 * 包含微信好友、微博、复制链接功能
 */

'use client';

import { MessageCircle, Share, Link } from 'lucide-react';

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareMenu({ isOpen, onClose }: ShareMenuProps) {
  const shareToWechat = () => {
    // 微信分享逻辑
    alert('微信分享功能开发中');
    onClose();
  };

  const shareToWeibo = () => {
    // 微博分享逻辑
    alert('微博分享功能开发中');
    onClose();
  };

  const copyArticleLink = async () => {
    // 复制链接逻辑
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      alert('链接已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制链接');
    }
    onClose();
  };

  // 点击外部关闭分享菜单
  const handleClickOutside = (e: React.MouseEvent) => {
    const shareMenu = document.getElementById('shareMenu');
    const shareBtn = document.getElementById('douyinShareBtn');
    if (shareMenu && !shareMenu.contains(e.target as Node) && shareBtn && !shareBtn.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className={`share-menu ${isOpen ? 'active' : ''}`} 
      id="shareMenu"
      onClick={handleClickOutside}
    >
      <div className="share-options">
        <div className="share-option" onClick={shareToWechat}>
          <MessageCircle className="share-icon" />
          <span className="share-text">微信好友</span>
        </div>
        <div className="share-option" onClick={shareToWeibo}>
          <Share className="share-icon" />
          <span className="share-text">微博</span>
        </div>
        <div className="share-option" onClick={copyArticleLink}>
          <Link className="share-icon" />
          <span className="share-text">复制链接</span>
        </div>
      </div>
    </div>
  );
}
