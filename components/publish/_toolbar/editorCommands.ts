'use client'

import type { Editor } from '@tiptap/react'

export type EditorCommandId =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'quote'
  | 'code'
  | 'hr'
  | 'bulletList'
  | 'orderedList'
  | 'clearFormatting'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'

export function runEditorCommand(editor: Editor | null, command: EditorCommandId): void {
  if (!editor) return

  switch (command) {
    case 'bold':
      editor.chain().focus().toggleBold().run()
      return
    case 'italic':
      editor.chain().focus().toggleItalic().run()
      return
    case 'underline':
      editor.chain().focus().toggleUnderline().run()
      return
    case 'quote':
      editor.chain().focus().toggleBlockquote().run()
      return
    case 'code':
      editor.chain().focus().toggleCode().run()
      return
    case 'hr':
      editor.chain().focus().setHorizontalRule().run()
      return
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run()
      return
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run()
      return
    case 'clearFormatting':
      editor.chain().focus().clearNodes().unsetAllMarks().run()
      return
    case 'heading1':
      toggleHeading(editor, 1)
      return
    case 'heading2':
      toggleHeading(editor, 2)
      return
    case 'heading3':
      toggleHeading(editor, 3)
      return
    case 'heading4':
      toggleHeading(editor, 4)
      return
    case 'heading5':
      toggleHeading(editor, 5)
      return
  }
}

function toggleHeading(editor: Editor, level: 1 | 2 | 3 | 4 | 5): void {
  if (editor.isActive('heading', { level })) {
    editor.chain().focus().setParagraph().run()
    return
  }
  editor.chain().focus().toggleHeading({ level }).run()
}
