'use client'

/**
 * 标签页切换组件
 * 
 * 作用: 提供标签页切换功能
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 * 
 * @returns {JSX.Element} 标签页切换组件
 * 
 * 使用说明:
 *   - 使用 Client Component 处理交互逻辑
 *   - 使用 useState 管理标签页状态
 *   - 所有间距完全复制原型数值
 * 
 * 更新时间: 2026-02-20
 */

import { useState } from 'react'

/**
 * 标签页接口
 * 
 * @interface Tab
 * @property {string} id - 标签页唯一标识
 * @property {string} label - 标签页显示文本
 */
interface Tab {
  id: string
  label: string
}

/**
 * 标签页配置
 * 
 * @constant tabs
 * @description 定义个人主页标签页
 */
const tabs: Tab[] = [
  { id: 'content', label: '我的内容' },
  { id: 'domain', label: '领域贡献' }
]

/**
 * 标签页切换组件
 * 
 * @function ProfileTabs
 * @returns {JSX.Element} 标签页切换组件
 * 
 * @description
 * 提供标签页切换功能，包括：
 * - 我的内容标签
 * - 领域贡献标签
 * - 标签页状态管理
 * - 标签页切换事件处理
 * 
 * @state
 * - activeTab: 当前激活的标签页ID
 * 
 * @layout
 * - 使用 flex 布局
 * - 所有间距完全复制原型数值
 */
export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('content')

  /**
   * 处理标签页切换
   * 
   * @function handleTabClick
   * @param {string} tabId - 标签页ID
   * @returns {void}
   * 
   * @description
   * 更新当前激活的标签页状态
   * 隐藏所有内容区域，显示对应区域
   */
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)

    // 隐藏所有内容区域
    const sections = ['profile-content-section', 'profile-domain-section']
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.classList.add('hidden')
      }
    })

    // 显示对应区域
    let targetSectionId = ''
    if (tabId === 'content') targetSectionId = 'profile-content-section'
    else if (tabId === 'domain') targetSectionId = 'profile-domain-section'

    const targetSection = document.getElementById(targetSectionId)
    if (targetSection) {
      targetSection.classList.remove('hidden')
    }
  }

  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
