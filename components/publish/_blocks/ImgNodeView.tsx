'use client'

/**
 * 图片节点视图组件
 *
 * @module ImgNodeView
 * @description TipTap 图片节点的自定义视图，支持悬浮工具栏
 *
 * 功能：
 * - 自定义图片渲染
 * - 悬浮显示对齐工具栏
 * - 支持点击选中
 * - 图片加载错误处理
 */

import { useState } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { AlignLeft, AlignCenter, AlignRight, Trash2, ImageOff } from '@/components/icons'

/**
 * 对齐类型
 */
type AlignType = 'left' | 'center' | 'right'

/**
 * 图片节点视图
 *
 * @param props - NodeView 属性
 * @returns 图片节点 JSX
 */
export function ImgNodeView(props: NodeViewProps) {
  const { node, updateAttributes, deleteNode, selected } = props
  const { src, alt, title } = node.attrs
  const align = (node.attrs['data-align'] as AlignType) || 'center'
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  {/* 调试输出 - 开发完成后可删除 */}
  console.log('ImgNodeView attrs:', node.attrs, 'src:', src)

  /**
   * 设置图片对齐方式
   *
   * @param newAlign - 对齐类型
   */
  const setAlign = (newAlign: AlignType) => {
    updateAttributes({
      'data-align': newAlign,
    })
  }

  /**
   * 工具栏按钮配置
   */
  const alignButtons = [
    { align: 'left' as AlignType, icon: AlignLeft, title: '左对齐' },
    { align: 'center' as AlignType, icon: AlignCenter, title: '居中' },
    { align: 'right' as AlignType, icon: AlignRight, title: '右对齐' },
  ]

  return (
    <NodeViewWrapper
      className={`relative group my-4 ${
        align === 'left'
          ? 'float-left mr-6 mb-4'
          : align === 'right'
          ? 'float-right ml-6 mb-4'
          : 'clear-both'
      }`}
      style={{
        maxWidth: align === 'left' || align === 'right' ? '50%' : '100%',
      }}
    >
      {/* 悬浮工具栏 */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5
                   bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-xf-light/50
                   transition-all duration-200 z-10 ${
                     selected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                   }`}
      >
        {alignButtons.map(({ align: btnAlign, icon: Icon, title }) => (
          <button
            key={btnAlign}
            onClick={() => setAlign(btnAlign)}
            title={title}
            className={`p-1.5 rounded-md transition-colors ${
              align === btnAlign
                ? 'bg-xf-primary/10 text-xf-primary'
                : 'text-xf-medium hover:bg-xf-bg hover:text-xf-dark'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        <div className="w-px h-4 bg-xf-light mx-1" />

        <button
          onClick={deleteNode}
          title="删除图片"
          className="p-1.5 rounded-md text-xf-medium hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 加载中状态 */}
      {isLoading && !loadError && (
        <div className="flex items-center justify-center py-8 bg-xf-bg/50 rounded-lg">
          <div className="w-6 h-6 border-2 border-xf-primary/30 border-t-xf-primary rounded-full animate-spin" />
          <span className="ml-2 text-sm text-xf-medium">图片加载中...</span>
        </div>
      )}

      {/* 加载错误状态 */}
      {loadError && (
        <div className="flex flex-col items-center justify-center py-8 bg-red-50 rounded-lg border border-red-100">
          <ImageOff className="w-8 h-8 text-red-400 mb-2" />
          <span className="text-sm text-red-500">图片加载失败</span>
          <span className="text-xs text-red-400 mt-1">{alt || '未知图片'}</span>
        </div>
      )}

      {/* 图片 - 编辑器场景使用原生 img 标签以支持动态 src */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ''}
        title={title || ''}
        data-align={align}
        className={`editor-image max-w-full h-auto rounded-lg shadow-sm transition-opacity duration-300 ${
          selected ? 'ring-2 ring-xf-primary ring-offset-2' : ''
        } ${isLoading || loadError ? 'hidden' : 'block'}`}
        style={{
          display: align === 'center' ? 'block' : 'inline-block',
          marginLeft: align === 'center' ? 'auto' : undefined,
          marginRight: align === 'center' ? 'auto' : undefined,
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setLoadError(true)
          console.error('Image failed to load:', src)
        }}
      />
    </NodeViewWrapper>
  )
}
