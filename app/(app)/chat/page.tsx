'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

/**
 * 聊天页面
 *
 * 作用: 提供简单的私信聊天功能
 *
 * @returns {JSX.Element} 聊天页面
 */
export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: '你好！很高兴认识你。', isMe: false, time: '10:30' },
    { id: 2, text: '你好！我也很高兴认识你。', isMe: true, time: '10:32' },
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 头部 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-xf-bg/60">
        <Link
          href="/profile"
          className="p-2 hover:bg-xf-light rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-xf-medium" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-xf-accent flex items-center justify-center text-white font-medium">
            用
          </div>
          <span className="font-medium text-xf-dark">用户名</span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                msg.isMe
                  ? 'bg-xf-accent text-white rounded-br-md'
                  : 'bg-xf-light text-xf-dark rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  msg.isMe ? 'text-white/70' : 'text-xf-medium'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="px-6 py-4 border-t border-xf-bg/60">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="flex-1 px-4 py-3 bg-xf-light rounded-xl text-sm text-xf-dark placeholder:text-xf-medium focus:outline-none focus:ring-2 focus:ring-xf-accent/20"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-xf-accent text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
