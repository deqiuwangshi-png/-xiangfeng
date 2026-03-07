'use client';

import { File, X, Loader2 } from 'lucide-react';
import type { UploadedFile } from '@/types/feedback';

interface FileListProps {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}

/**
 * 获取文件状态图标
 *
 * @param item 文件项
 * @returns 对应的图标组件
 */
const getStatusIcon = (item: UploadedFile) => {
  if (item.isUploading) {
    return <Loader2 className="w-5 h-5 text-xf-primary mr-3 animate-spin" />;
  }
  if (item.error) {
    return <span className="text-xf-error mr-3">✕</span>;
  }
  return <File className="w-5 h-5 text-xf-primary mr-3 shrink-0" />;
};

/**
 * 获取文件状态文本
 *
 * @param item 文件项
 * @returns 状态描述文本
 */
const getStatusText = (item: UploadedFile) => {
  if (item.isUploading) {
    return '上传中...';
  }
  if (item.error) {
    return item.error;
  }
  return `${(item.file.size / 1024).toFixed(1)} KB`;
};

/**
 * 已上传文件列表组件
 * 展示上传中的、成功的、失败的文件状态，支持删除
 *
 * @param files 文件列表
 * @param onRemove 移除文件回调
 */
export default function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {files.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-white border border-xf-bg/60 rounded-xl"
        >
          <div className="flex items-center min-w-0">
            {getStatusIcon(item)}
            <div className="min-w-0">
              <div className="font-medium text-sm truncate" title={item.file.name}>{item.file.name}</div>
              <div className="text-xs text-xf-primary">
                {getStatusText(item)}
              </div>
            </div>
          </div>
          {!item.isUploading && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-xf-primary hover:text-xf-error ml-2 p-1 rounded hover:bg-xf-light transition-colors"
              title="删除文件"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
