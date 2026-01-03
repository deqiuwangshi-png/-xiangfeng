/**
 * 文件分页组件
 * 显示文件列表的分页导航
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilesPaginationProps {
  /** 当前页码 */
  currentPage: number;
  /** 总文件数 */
  totalFiles: number;
  /** 每页显示文件数 */
  filesPerPage: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
}

const FilesPagination: React.FC<FilesPaginationProps> = ({
  currentPage,
  totalFiles,
  filesPerPage,
  onPageChange,
}) => {
  // 计算总页数
  const totalPages = Math.ceil(totalFiles / filesPerPage);

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 如果只有一页，不显示分页
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-10 gap-2">
      {/* 上一页按钮 */}
      <button
        className={`p-3 rounded-xl transition-all duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-xf-light'}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5 text-xf-dark" />
      </button>
      
      {/* 页码按钮 */}
      {generatePageNumbers().map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentPage === page 
            ? 'bg-xf-accent text-white shadow-md' 
            : 'text-xf-dark hover:bg-xf-light'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      {/* 下一页按钮 */}
      <button
        className={`p-3 rounded-xl transition-all duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-xf-light'}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5 text-xf-dark" />
      </button>
      
      {/* 页码信息 */}
      <div className="text-sm text-xf-medium ml-4">
        第 {currentPage} / {totalPages} 页
      </div>
    </div>
  );
};

export default FilesPagination;
