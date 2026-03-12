'use client'

/**
 * 标题级别选择组件
 * 
 * 提供H1-H6六级标题下拉选择
 * 与TipTap编辑器集成
 */

import { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { Heading, ChevronDown } from '@/components/icons'

interface HeadingSelectProps {
  editor: Editor | null
}

const headingLevels = [
  { level: 1, label: 'H1', text: '一级标题' },
  { level: 2, label: 'H2', text: '二级标题' },
  { level: 3, label: 'H3', text: '三级标题' },
  { level: 4, label: 'H4', text: '四级标题' },
  { level: 5, label: 'H5', text: '五级标题' },
  { level: 6, label: 'H6', text: '六级标题' },
] as const

export function HeadingSelect({ editor }: HeadingSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 检测当前激活的标题级别
  const getActiveLevel = () => {
    if (!editor) return null
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        return i
      }
    }
    return null
  }

  const activeLevel = getActiveLevel()

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (level: number) => {
    if (!editor) return
    editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* 主按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="标题"
        className={`relative py-2.5 px-2.5 rounded-xl text-xf-primary bg-xf-primary/5 border border-transparent cursor-pointer transition-all flex items-center justify-center gap-1 hover:bg-xf-primary/12 hover:border-xf-primary/20 hover:-translate-y-px hover:shadow-md ${
          activeLevel ? 'bg-xf-primary/15 text-xf-accent border-xf-primary/30' : ''
        }`}
      >
        <Heading className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-xf-light py-1 min-w-[80px] z-50">
          {headingLevels.map(({ level, label, text }) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-xf-primary/5 transition-colors flex items-center gap-2 ${
                activeLevel === level ? 'bg-xf-primary/10 text-xf-accent font-medium' : 'text-xf-dark'
              }`}
            >
              <span className="w-6 text-center font-bold">{label}</span>
              <span className="text-xs opacity-60">{text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
