/**
 * 文件头部组件
 * 显示页面标题和文件上传按钮
 */

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import FileUploader from './FileUploader';

const FilesHeader: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      {/* 页面标题 */}
      <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1">我的文件</h2>
      
      {/* 上传文件按钮 */}
      <button
        className="px-6 py-3 bg-gradient-to-r from-[var(--color-xf-accent)] to-[var(--color-xf-primary)] hover:from-[var(--color-xf-accent)]/90 hover:to-[var(--color-xf-primary)]/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
        onClick={() => setUploadModalOpen(true)}
      >
        <Upload className="w-5 h-5" />
        上传文件
      </button>
      
      {/* 文件上传组件 */}
      {uploadModalOpen && (
        <FileUploader onClose={() => setUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default FilesHeader;
