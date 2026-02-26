/**
 * 个人文件页面
 * 显示和管理用户的个人文件
 */

'use client';

import React, { useState } from 'react';

// 导入个人文件页面组件
import FilesHeader from './components/FilesHeader';
import FilesFilter from './components/FilesFilter';
import FilesList from './components/FilesList';
import FilesPagination from './components/FilesPagination';

// 定义文件类型接口
interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'other';
  size: string;
  uploadedAt: string;
  url: string;
  thumbnail: string;
}

// 模拟文件数据
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: '深度思考笔记.pdf',
    type: 'document',
    size: '2.3 MB',
    uploadedAt: '2024-01-02',
    url: '#',
    thumbnail: 'https://api.dicebear.com/7.x/micah/svg?seed=File1',
  },
  {
    id: '2',
    name: '认知科学思维导图.png',
    type: 'image',
    size: '1.8 MB',
    uploadedAt: '2024-01-01',
    url: '#',
    thumbnail: 'https://api.dicebear.com/7.x/micah/svg?seed=File2',
  },
  {
    id: '3',
    name: '哲学探讨录音.mp3',
    type: 'other',
    size: '4.5 MB',
    uploadedAt: '2023-12-31',
    url: '#',
    thumbnail: 'https://api.dicebear.com/7.x/micah/svg?seed=File3',
  },
  {
    id: '4',
    name: '极简主义生活指南.docx',
    type: 'document',
    size: '1.2 MB',
    uploadedAt: '2023-12-30',
    url: '#',
    thumbnail: 'https://api.dicebear.com/7.x/micah/svg?seed=File4',
  },
];

export default function FilesPage() {
  const [files, setFiles] = useState(mockFiles);
  const [activeFilter, setActiveFilter] = useState<'all' | 'document' | 'image' | 'other'>('all');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(12);

  return (
    <div id="profile-files-section" className="space-y-8">
      {/* 文件头部 */}
      <FilesHeader />
      
      {/* 文件筛选 */}
      <FilesFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* 文件列表 */}
      <FilesList files={files} />
      
      {/* 分页 */}
      <FilesPagination
        currentPage={currentPage}
        totalFiles={files.length}
        filesPerPage={filesPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
