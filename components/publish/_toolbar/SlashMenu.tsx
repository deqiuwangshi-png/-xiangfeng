'use client'

/**
 * 斜杠命令菜单组件
 * @module SlashMenu
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Heading1, Heading2, Quote, Code,
  List, ListOrdered, Minus
} from '@/components/icons'

interface SlashMenuProps {
  editor: Editor | null
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
 */
export function SlashMenu({ editor }: SlashMenuProps) {
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
    ]

    if (!query) return allCommands
    return allCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.id.toLowerCase().includes(query.toLowerCase())
    )
  }, [editor, query])

  const commands = getCommands()

  /**
   * 更新菜单位置
   */
  const updateMenuPosition = useCallback((forceShow = false) => {
    if (!editor) return

    const { from } = editor.state.selection
    const coords = editor.view.coordsAtPos(from)
    const editorElement = editor.view.dom as HTMLElement
    const editorRect = editorElement.getBoundingClientRect()

    const commandCount = getCommands().length
    const estimatedMenuHeight = Math.min(400, 40 + commandCount * 40)

    const viewportHeight = window.innerHeight
    const spaceBelow = Math.min(viewportHeight - coords.bottom, editorRect.bottom - coords.bottom)
    const spaceAbove = Math.max(coords.top - editorRect.top, coords.top)

    const shouldShowAbove = spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight
    setShowAbove(shouldShowAbove)

    setPosition({
      x: coords.left,
      y: shouldShowAbove ? coords.top - 8 : coords.bottom + 8,
      containerTop: editorRect.top,
      containerBottom: Math.min(viewportHeight, editorRect.bottom),
    })

    if (forceShow) {
      setIsVisible(true)
      setSelectedIndex(0)
      setQuery('')
    }
  }, [editor, getCommands])

  const showMenu = useCallback(() => {
    updateMenuPosition(true)
  }, [updateMenuPosition])

  const hideMenu = useCallback(() => {
    setIsVisible(false)
    setQuery('')
  }, [])

  /**
   * 执行命令
   */
  const executeCommand = useCallback(async (index: number) => {
    const command = commands[index]
    if (command) {
      editor?.chain().focus().deleteRange({
        from: editor.state.selection.from - query.length - 1,
        to: editor.state.selection.from,
      }).run()

      await command.action()
      hideMenu()
    }
  }, [commands, editor, hideMenu, query.length])

  // 监听输入
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) {
        if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const { empty, from } = editor.state.selection
          const $pos = editor.state.doc.resolve(from)
          const isAtStart = $pos.parentOffset === 0

          if (empty && isAtStart) {
            event.preventDefault()
            showMenu()
          }
        }
        return
      }

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

    const handleInput = () => {
      if (!isVisible) return

      const { from } = editor.state.selection
      const textBefore = editor.state.doc.textBetween(from - query.length - 1, from, ' ')

      if (!textBefore.startsWith('/')) {
        hideMenu()
        return
      }

      const newQuery = textBefore.slice(1)
      setQuery(newQuery)
      setSelectedIndex(0)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideMenu()
      }
    }

    editor.view.dom.addEventListener('keydown', handleKeyDown)
    editor.view.dom.addEventListener('input', handleInput)
    document.addEventListener('click', handleClickOutside)

    return () => {
      editor.view.dom.removeEventListener('keydown', handleKeyDown)
      editor.view.dom.removeEventListener('input', handleInput)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [editor, isVisible, query.length, commands.length, selectedIndex, showMenu, hideMenu, executeCommand])

  if (!isVisible || commands.length === 0) {
    return null
  }

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] max-h-[400px] overflow-y-auto"
        style={{
          left: position.x,
          top: showAbove ? 'auto' : position.y,
          bottom: showAbove ? window.innerHeight - position.y : 'auto',
        }}
      >
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
