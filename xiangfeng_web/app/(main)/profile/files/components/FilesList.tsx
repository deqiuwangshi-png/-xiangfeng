/**
 * 文件列表组件
 * 展示文件卡片列表，支持响应式布局
 */

import React from 'react';
import FileCard from './FileCard';

interface FileItem {
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

interface FilesListProps {
  /** 文件列表数据 */
  files: FileItem[];
}

const FilesList: React.FC<FilesListProps> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {files.map((file) => (
        <FileCard
          key={file.id}
          id={file.id}
          name={file.name}
          type={file.type}
          size={file.size}
          uploadedAt={file.uploadedAt}
          url={file.url}
          thumbnail={file.thumbnail}
        />
      ))}
      
      {/* 如果没有文件，显示提示信息 */}
      {files.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[var(--color-xf-medium)] mb-4">暂无文件</p>
          <p className="text-[var(--color-xf-medium)]/80">点击上传文件按钮开始上传您的文件</p>
        </div>
      )}
    </div>
  );
};

export default FilesList;
