'use client'

/**
 * 斜杠命令菜单组件
 *
 * 输入 / 时唤起的命令菜单
 * 提供格式化命令的快速入口
 *
 * @module SlashMenu
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Heading1, Heading2, Quote, Code,
  List, ListOrdered, Minus, Image, Table
} from '@/components/icons'
import { selectImageFile, uploadImage } from '@/lib/upload/img'
import { toast } from 'sonner'

interface SlashMenuProps {
  editor: Editor | null
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

interface CommandItem {
  id: string
  label: string
  icon: React.ElementType
  shortcut?: string
  action: () => void
}

/**
 * 斜杠命令菜单组件
 *
 * @param props - 组件属性
 * @returns 命令菜单JSX
 */
export function SlashMenu({ editor, onUploadStart, onUploadEnd }: SlashMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0, containerTop: 0, containerBottom: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [showAbove, setShowAbove] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  /**
   * 获取命令列表
   */
  const getCommands = useCallback((): CommandItem[] => {
    if (!editor) return []

    const allCommands: CommandItem[] = [
      {
        id: 'heading1',
        label: '大标题',
        icon: Heading1,
        shortcut: '#',
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        id: 'heading2',
        label: '小标题',
        icon: Heading2,
        shortcut: '##',
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        id: 'bold',
        label: '加粗',
        icon: Bold,
        shortcut: 'Ctrl+B',
        action: () => editor.chain().focus().toggleBold().run(),
      },
      {
        id: 'italic',
        label: '斜体',
        icon: Italic,
        shortcut: 'Ctrl+I',
        action: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        id: 'underline',
        label: '下划线',
        icon: Underline,
        action: () => editor.chain().focus().toggleUnderline().run(),
      },
      {
        id: 'bulletList',
        label: '无序列表',
        icon: List,
        shortcut: '-',
        action: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        id: 'orderedList',
        label: '有序列表',
        icon: ListOrdered,
        shortcut: '1.',
        action: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        id: 'blockquote',
        label: '引用',
        icon: Quote,
        shortcut: '>',
        action: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        id: 'code',
        label: '行内代码',
        icon: Code,
        shortcut: '`',
        action: () => editor.chain().focus().toggleCode().run(),
      },
      {
        id: 'horizontalRule',
        label: '分割线',
        icon: Minus,
        shortcut: '---',
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        id: 'image',
        label: '图片',
        icon: Image,
        shortcut: '/img',
        action: async () => {
          const file = await selectImageFile()
          if (!file || !editor) return

          onUploadStart?.()
          try {
            const url = await uploadImage(file)
            console.log('SlashMenu uploaded image URL:', url)

            // 使用 insertContent 插入图片节点，支持自定义属性
            editor.chain().focus().insertContent({
              type: 'image',
              attrs: {
                src: url,
                alt: file.name,
                'data-align': 'center',
              },
            }).run()

            toast.success('图片上传成功')
          } catch (error) {
            const message = error instanceof Error ? error.message : '图片上传失败'
            toast.error(message)
            console.error('SlashMenu image upload error:', error)
          } finally {
            onUploadEnd?.()
          }
        },
      },
      {
        id: 'table',
        label: '表格',
        icon: Table,
        shortcut: '/table',
        action: () => {
          // 创建 3×3 表格
          editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
        },
      },
    ]

    // 根据输入过滤命令
    if (!query) return allCommands
    return allCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.id.toLowerCase().includes(query.toLowerCase())
    )
  }, [editor, query, onUploadStart, onUploadEnd])

  const commands = getCommands()

  /**
   * 显示菜单
   * 自动检测屏幕边界，避免菜单被遮挡
   */
  const showMenu = useCallback(() => {
    if (!editor) return

    const { from } = editor.state.selection
    const coords = editor.view.coordsAtPos(from)

    // 获取编辑器容器的边界
    const editorContainer = editor.view.dom.closest('.editor-container, .prose, .publish-content') || document.body
    const containerRect = editorContainer.getBoundingClientRect()

    // 估算菜单高度（基于命令数量）
    const commandCount = getCommands().length
    const estimatedMenuHeight = Math.min(400, 40 + commandCount * 40) // 40px 标题 + 40px 每条命令

    // 计算容器内的可用空间
    const spaceBelow = containerRect.bottom - coords.bottom
    const spaceAbove = coords.top - containerRect.top

    // 如果下方空间不足，菜单向上弹出
    const shouldShowAbove = spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight
    setShowAbove(shouldShowAbove)

    setPosition({
      x: coords.left,
      y: shouldShowAbove ? coords.top - 8 : coords.bottom + 8,
      containerTop: containerRect.top,
      containerBottom: containerRect.bottom,
    })
    setIsVisible(true)
    setSelectedIndex(0)
    setQuery('')
  }, [editor, getCommands])

  /**
   * 隐藏菜单
   */
  const hideMenu = useCallback(() => {
    setIsVisible(false)
    setQuery('')
  }, [])

  /**
   * 执行命令
   */
  const executeCommand = useCallback((index: number) => {
    const command = commands[index]
    if (command) {
      // 删除 / 字符
      editor?.chain().focus().deleteRange({
        from: editor.state.selection.from - query.length - 1,
        to: editor.state.selection.from,
      }).run()

      command.action()
      hideMenu()
    }
  }, [commands, editor, hideMenu, query.length])

  // 监听输入
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) {
        // 检测 / 键
        if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const { empty, from } = editor.state.selection
          // 只在空段落或行首允许唤起
          const $pos = editor.state.doc.resolve(from)
          const isAtStart = $pos.parentOffset === 0
          // 表格内不唤起菜单
          const isInTable = editor.isActive('table')

          if (empty && isAtStart && !isInTable) {
            event.preventDefault()
            showMenu()
          }
        }
        return
      }

      // 菜单显示时的键盘导航
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          hideMenu()
          break
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % commands.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length)
          break
        case 'Enter':
          event.preventDefault()
          executeCommand(selectedIndex)
          break
      }
    }

    const handleUpdate = () => {
      if (!isVisible) return

      const { from } = editor.state.selection
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        ' '
      )

      // 检查是否还在 / 命令模式
      const match = textBefore.match(/\/(\w*)$/)
      if (match) {
        setQuery(match[1])
      } else {
        hideMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleUpdate)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleUpdate)
    }
  }, [editor, isVisible, commands.length, selectedIndex, showMenu, hideMenu, executeCommand])

  // 点击外部隐藏
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideMenu()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, hideMenu])

  if (!isVisible || commands.length === 0) return null

  return (
    <>
      {/* 滚动条样式 */}
      <style jsx>{`
        /* WebKit 滚动条样式 */
        .slash-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .slash-menu::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        
        .slash-menu::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        
        .slash-menu::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
      
      <div
        ref={menuRef}
        className={`fixed z-50 bg-white shadow-xl rounded-xl border border-xf-light/50 py-2 min-w-[200px] max-w-[280px] animate-in fade-in duration-150 slash-menu ${
          showAbove ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'
        }`}
        style={{
          left: position.x,
          top: showAbove ? 'auto' : position.y,
          bottom: showAbove ? position.containerBottom - position.y : 'auto',
          maxHeight: showAbove 
            ? position.y - position.containerTop - 16 
            : position.containerBottom - position.y - 16,
          overflowY: 'auto',
          boxShadow: '0 8px 30px rgba(106, 91, 138, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          // 优化滚动条样式
          scrollbarWidth: 'thin',
          scrollbarColor: '#e2e8f0 #f8fafc',
        }}
      >
        <div className="px-3 py-1.5 text-xs text-xf-medium border-b border-xf-light/30 mb-1">
          基本格式
        </div>
        {commands.map((command, index) => {
          const Icon = command.icon
          return (
            <button
              key={command.id}
              onClick={() => executeCommand(index)}
              className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-xf-primary/8 text-xf-dark'
                  : 'text-xf-dark hover:bg-xf-bg'
              }`}
            >
              <Icon className="w-4 h-4 text-xf-primary" />
              <span className="flex-1 text-sm">{command.label}</span>
              {command.shortcut && (
                <span className="text-xs text-xf-medium">{command.shortcut}</span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}
