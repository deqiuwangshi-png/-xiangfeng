/**
 * 文件筛选组件
 * 提供文件筛选、排序和搜索功能
 */

import React from 'react';
import { Search, Filter, ArrowDownUp } from 'lucide-react';

interface FilesFilterProps {
  /** 当前激活的筛选类型 */
  activeFilter: 'all' | 'image' | 'document' | 'other';
  /** 筛选类型变化回调 */
  onFilterChange: (filter: 'all' | 'image' | 'document' | 'other') => void;
  /** 当前排序方式 */
  sortBy: string;
  /** 排序方式变化回调 */
  onSortChange: (sortBy: string) => void;
  /** 当前搜索查询 */
  searchQuery: string;
  /** 搜索查询变化回调 */
  onSearchChange: (query: string) => void;
}

const FilesFilter: React.FC<FilesFilterProps> = ({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  // 筛选类型选项
  const filterOptions = [
    { id: 'all', label: '全部' },
    { id: 'image', label: '图片' },
    { id: 'document', label: '文档' },
    { id: 'other', label: '其他' },
  ];

  // 排序选项
  const sortOptions = [
    { id: 'uploadedAt', label: '上传时间' },
    { id: 'name', label: '文件名称' },
    { id: 'size', label: '文件大小' },
  ];

  return (
    <div className="card-bg rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* 搜索框 */}
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-xf-medium)]" size={18} />
          <input
            type="text"
            placeholder="搜索文件..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-xf-light)] rounded-xl border border-[var(--color-xf-soft)] focus:ring-2 focus:ring-[var(--color-xf-primary)] focus:border-transparent outline-none transition-all duration-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* 筛选和排序区域 */}
        <div className="flex flex-wrap gap-4 w-full md:w-2/3 justify-end">
          {/* 筛选选项 */}
          <div className="flex items-center gap-2">
            <Filter className="text-[var(--color-xf-medium)]" size={18} />
            <select
              className="bg-[var(--color-xf-light)] rounded-xl border border-[var(--color-xf-soft)] py-2 px-4 focus:ring-2 focus:ring-[var(--color-xf-primary)] focus:border-transparent outline-none transition-all duration-200"
              value={activeFilter}
              onChange={(e) => onFilterChange(e.target.value as 'all' | 'image' | 'document' | 'other')}
            >
              {filterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 排序选项 */}
          <div className="flex items-center gap-2">
            <ArrowDownUp className="text-[var(--color-xf-medium)]" size={18} />
            <select
              className="bg-[var(--color-xf-light)] rounded-xl border border-[var(--color-xf-soft)] py-2 px-4 focus:ring-2 focus:ring-[var(--color-xf-primary)] focus:border-transparent outline-none transition-all duration-200"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesFilter;
