'use client'

/**
 * 编辑器骨架屏组件
 * 
 * 在动态导入加载期间显示，优化感知性能
 * 与编辑器实际布局一致，减少布局偏移(CLS)
 * 
 * @module EditorSkeleton
 */

/**
 * 编辑器骨架屏
 * 
 * 模拟编辑器的完整布局结构：
 * - 顶部操作栏
 * - 标题输入区域
 * - 内容编辑区域
 * - 底部字符计数
 * 
 * @returns 骨架屏JSX
 */
export function EditorSkeleton() {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth publish-page-container">
      {/* 顶部操作栏骨架 */}
      <div className="sticky top-0 z-20 glass border-b border-white/50">
        <div className="max-w-[840px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* 返回按钮 */}
          <div className="w-10 h-10 rounded-xl bg-white/60 animate-pulse" />
          
          {/* 操作按钮组 */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-9 rounded-lg bg-white/60 animate-pulse" />
            <div className="w-20 h-9 rounded-lg bg-xf-primary/30 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 编辑器卡片骨架 */}
      <div className="max-w-[840px] mx-auto px-4 py-8 md:py-12">
        <div 
          className="bg-white rounded-[20px] border border-xf-light p-10 relative overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(106, 91, 138, 0.08)' }}
        >
          {/* 顶部装饰条 */}
          <div 
            className="absolute top-0 left-0 right-0 bg-xf-primary/30 rounded-t-[20px] animate-pulse" 
            style={{ height: '4px' }} 
          />

          {/* 标题输入骨架 */}
          <div className="mb-8">
            <div className="h-14 bg-xf-bg/40 rounded-xl animate-pulse w-3/4" />
          </div>

          {/* 内容编辑区域骨架 */}
          <div className="relative py-0">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-xf-bg/30 rounded" />
            
            {/* 多行文本骨架 */}
            <div className="pl-6 space-y-4">
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-full" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-5/6" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-4/5" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-full" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-3/4" />
              
              {/* 空行 */}
              <div className="h-4" />
              
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-full" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-5/6" />
              <div className="h-6 bg-xf-bg/40 rounded animate-pulse w-4/5" />
            </div>
          </div>

          {/* 字符计数骨架 */}
          <div className="mt-8 pt-6 border-t border-xf-bg/50">
            <div className="flex justify-end gap-4">
              <div className="h-4 bg-xf-bg/40 rounded animate-pulse w-24" />
              <div className="h-4 bg-xf-bg/40 rounded animate-pulse w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* 工具栏骨架 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="glass rounded-2xl px-4 py-2 shadow-lg border border-white/50">
          <div className="flex items-center gap-2">
            {/* 工具按钮组 */}
            <div className="flex items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-px h-6 bg-xf-medium/20 mx-1" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-px h-6 bg-xf-medium/20 mx-1" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-white/60 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
