/**
 * OpenBlock - 核心块编辑器组件
 * 
 * 基于 TipTap 实现，Clean Room Design
 * 未参考任何专有源代码
 */

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

/**
 * 块编辑器核心组件
 * 
 * 功能:
 * - 支持文本/标题/列表/代码块
 * - 占位符提示
 * - 内容变更回调
 */
export const BlockEditor: React.FC<EditorProps> = ({
  content = '',
  onChange,
  placeholder = '输入内容... 使用 / 打开命令菜单'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 配置默认块类型
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'openblock-editor prose prose-sm max-w-none focus:outline-none min-h-[200px]'
      }
    }
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="openblock-editor-container">
      <EditorContent editor={editor} />
    </div>
  )
}

export default BlockEditor
