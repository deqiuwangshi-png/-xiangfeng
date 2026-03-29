'use client';

import { X, FileText, Image as ImageIcon, File } from '@/components/icons';
import type { UploadedFile } from '@/types/user/feedback';

interface FileListProps {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}

/**
 * 获取文件图标
 *
 * @param fileName 文件名
 * @returns 对应的图标组件
 */
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

  if (extension && imageExtensions.includes(extension)) {
    return <ImageIcon className="w-6 h-6 text-xf-primary" />;
  }
  if (extension === 'pdf') {
    return <FileText className="w-6 h-6 text-xf-error" />;
  }
  if (extension === 'md') {
    return <FileText className="w-6 h-6 text-xf-accent" />;
  }
  return <File className="w-6 h-6 text-xf-primary" />;
};

/**
 * 格式化文件大小
 *
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 获取文件状态样式
 *
 * @param status 文件状态
 * @returns 对应的样式类名
 */
const getStatusStyle = (status: UploadedFile['status']) => {
  switch (status) {
    case 'pending':
      return 'border-xf-primary/30 bg-xf-primary/5';
    case 'uploading':
      return 'border-xf-primary/50 bg-xf-primary/10';
    case 'uploaded':
      return 'border-xf-success/30 bg-xf-success/5';
    default:
      return 'border-xf-bg/60 bg-white';
  }
};

/**
 * 获取文件状态文本
 *
 * @param item 文件项
 * @returns 状态描述文本
 */
const getStatusText = (item: UploadedFile): string => {
  switch (item.status) {
    case 'pending':
      return '等待上传';
    case 'uploading':
      return '上传中...';
    case 'uploaded':
      return '已上传';
    default:
      return '';
  }
};

/**
 * 待上传文件列表组件
 * 采用卡片式布局展示待上传文件信息
 * 支持取消选择，避免资源浪费
 *
 * @param files 文件列表
 * @param onRemove 移除文件回调
 */
export default function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-sm font-medium text-xf-dark mb-3">
        待上传文件 ({files.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className={`relative group p-2 rounded-lg border-2 transition-all duration-200 ${getStatusStyle(item.status)}`}
          >
            {/* 删除按钮 */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-white text-xf-primary hover:text-xf-error shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              title="取消选择"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-2">
              {/* 文件图标 */}
              <div className="shrink-0 p-1.5 bg-white rounded-md shadow-sm">
                {getFileIcon(item.file.name)}
              </div>

              {/* 文件信息 */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium text-xs text-xf-dark truncate"
                  title={item.file.name}
                >
                  {item.file.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-xf-primary">
                    {formatFileSize(item.file.size)}
                  </span>
                  <span className="text-[10px] text-xf-primary/60">·</span>
                  <span
                    className={`text-[10px] ${
                      item.status === 'uploaded'
                        ? 'text-xf-success'
                        : 'text-xf-primary'
                    }`}
                  >
                    {getStatusText(item)}
                  </span>
                </div>
              </div>
            </div>

            {/* 上传中进度条 */}
            {item.status === 'uploading' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-xf-primary/20 rounded-b-xl overflow-hidden">
                <div className="h-full bg-xf-primary animate-pulse" style={{ width: '60%' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
