/**
 * 文件卡片组件
 * 显示单个文件的信息和操作按钮
 */

import React from 'react';
import { FileText, Image, Music, Download, Trash2, Eye } from 'lucide-react';

interface FileCardProps {
  /** 文件ID */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件类型 */
  type: 'document' | 'image' | 'other';
  /** 文件大小 */
  size: string;
  /** 上传时间 */
  uploadedAt: string;
  /** 文件URL */
  url: string;
  /** 文件缩略图URL */
  thumbnail: string;
}

const FileCard: React.FC<FileCardProps> = ({ 
  id, 
  name, 
  type, 
  size, 
  uploadedAt, 
  url, 
  thumbnail 
}) => {
  // 根据文件类型获取相应图标
  const getFileIcon = () => {
    switch (type) {
      case 'document':
        return <FileText className="w-12 h-12 text-[var(--color-xf-info)]" />;
      case 'image':
        return <Image className="w-12 h-12 text-[var(--color-xf-accent)]" />;
      case 'other':
        return <Music className="w-12 h-12 text-[var(--color-xf-primary)]" />;
      default:
        return <FileText className="w-12 h-12 text-[var(--color-xf-medium)]" />;
    }
  };

  return (
    <div className="card-bg rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group">
      {/* 文件图标区域 */}
      <div className="flex flex-col items-center justify-center h-32 mb-4 bg-[var(--color-xf-light)] rounded-xl">
        {getFileIcon()}
      </div>
      
      {/* 文件信息区域 */}
      <div className="text-center">
        <h3 className="font-semibold text-[var(--color-xf-dark)] mb-1 truncate">{name}</h3>
        <div className="flex justify-center gap-4 text-sm text-[var(--color-xf-medium)] mb-4">
          <span>{size}</span>
          <span>{uploadedAt}</span>
        </div>
        
        {/* 文件操作按钮 */}
        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="p-2 bg-[var(--color-xf-light)] rounded-full hover:bg-[var(--color-xf-primary)] hover:text-white transition-all duration-200"
            title="预览"
          >
            <Eye size={16} />
          </button>
          <button 
            className="p-2 bg-[var(--color-xf-light)] rounded-full hover:bg-[var(--color-xf-primary)] hover:text-white transition-all duration-200"
            title="下载"
          >
            <Download size={16} />
          </button>
          <button 
            className="p-2 bg-[var(--color-xf-light)] rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
