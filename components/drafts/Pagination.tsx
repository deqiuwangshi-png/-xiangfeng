'use client'

/**
 * 分页器组件属性
 */
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

/**
 * 分页器组件
 * 
 * @function Pagination
 * @param {PaginationProps} props - 组件属性
 * @returns {JSX.Element} 分页器组件
 * 
 * @description
 * 提供分页导航功能，包含：
 * - 上一页按钮
 * - 页码按钮
 * - 下一页按钮
 * - 省略号（当页数较多时）
 * 
 * @data-source
 * docs/08原型文件设计图/草稿.html
 * 
 * @styles
 * - 分页按钮背景默认: transparent
 * - 分页按钮背景悬停: rgba(106, 91, 138, 0.08)
 * - 分页按钮背景激活: #6A5B8A
 * - 分页按钮文字默认: #6A5B8A
 * - 分页按钮文字激活: white
 * - 分页按钮禁用: opacity: 0.5
 * - 分页按钮内边距: 0.5rem 0.75rem
 * - 分页按钮圆角: 8px
 * - 分页按钮间距: 0.25rem
 * 
 * @interactions
 * - 点击页码：跳转到对应页
 * - 点击上一页/下一页：切换页面
 * - 禁用状态：无法点击
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  /**
   * 生成页码数组
   * 
   * @function generatePageNumbers
   * @returns {Array<number | string>} 页码数组（包含数字和省略号）
   * 
   * @description
   * 根据当前页和总页数生成页码数组
   * 包含省略号以减少显示的页码数量
   */
  const generatePageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= halfVisible) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - halfVisible) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  /**
   * 处理上一页
   * 
   * @function handlePrevious
   * @returns {void}
   * 
   * @description
   * 跳转到上一页
   */
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  /**
   * 处理下一页
   * 
   * @function handleNext
   * @returns {void}
   * 
   * @description
   * 跳转到下一页
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  /**
   * 处理页码点击
   * 
   * @function handlePageClick
   * @param {number} page - 页码
   * @returns {void}
   * 
   * @description
   * 跳转到指定页码
   */
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* 上一页按钮 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          pagination-btn px-3 py-2 rounded-lg transition-all duration-200
          ${currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-xf-primary/8'
          }
        `}
        aria-label="上一页"
      >
        <svg
          className="w-4 h-4 text-xf-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && handlePageClick(page)}
          disabled={typeof page !== 'number'}
          className={`
            pagination-btn px-3 py-2 rounded-lg transition-all duration-200
            ${typeof page === 'number'
              ? page === currentPage
                ? 'bg-xf-primary text-white'
                : 'text-xf-primary hover:bg-xf-primary/8'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
          aria-label={typeof page === 'number' ? `第${page}页` : '省略号'}
        >
          {page}
        </button>
      ))}

      {/* 下一页按钮 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          pagination-btn px-3 py-2 rounded-lg transition-all duration-200
          ${currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-xf-primary/8'
          }
        `}
        aria-label="下一页"
      >
        <svg
          className="w-4 h-4 text-xf-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  )
}
