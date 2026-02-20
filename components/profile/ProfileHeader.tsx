'use client'

/**
 * 个人资料头部组件
 * 
 * 作用: 显示用户的头像、用户名、简介和操作按钮
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 * 
 * 设计原则:
 * - HTML原型文件是唯一真理数据来源
 * - 严格遵循原型中的所有样式和布局
 * - 不得自行修改或"优化"原型设计
 * - 所有间距完全复制原型数值
 * 
 * @returns {JSX.Element} 个人资料头部组件
 * 
 * 使用说明:
 *   - 使用 Client Component 处理交互逻辑
 *   - 使用 Next Image 优化图片加载
 *   - 使用 lucide-react 图标组件
 * 
 * 更新时间: 2026-02-20
 */

import { MessageSquare, UserPlus, MapPin, Star } from 'lucide-react'
import Image from 'next/image'

/**
 * 个人资料头部组件
 * 
 * @function ProfileHeader
 * @returns {JSX.Element} 个人资料头部组件
 * 
 * @description
 * 提供个人资料头部的完整功能，包括：
 * - 用户头像（带在线状态指示器和星星徽章）
 * - 用户名和状态文本
 * - 位置信息
 * - 操作按钮（发消息、关注）
 * - 个人简介
 * - 用户标签
 * 
 * @layout
 * - 使用 flex 布局
 * - 响应式设计（移动端和桌面端）
 * - 所有间距完全复制原型数值
 */
export function ProfileHeader() {
  return (
    <div className="profile-header-bg rounded-4xl p-8 mb-8 shadow-soft">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* 头像区域 */}
        <div className="relative">
          <div className="relative">
            <Image
              src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=B6CAD7"
              alt="Avatar"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full shadow-deep ring-4 ring-white"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-r from-xf-accent to-xf-primary rounded-full flex items-center justify-center text-white">
            <Star className="w-5 h-5" />
          </div>
        </div>

        {/* 个人信息 */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">思考者</h1>
              <p className="text-xl text-xf-primary font-medium mt-1">探索认知边界中...</p>
              <p className="text-sm text-xf-medium mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                上海 · 加入于 2023年9月
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                发消息
              </button>
              <button className="px-6 py-3 bg-linear-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                关注
              </button>
            </div>
          </div>

          {/* 个人简介 */}
          <div className="bg-white/60 rounded-2xl p-5 mt-4">
            <p className="text-xf-dark/80 leading-relaxed">
              深度思考者，认知科学爱好者。相信思考可以改变世界，致力于探索思维边界与认知科学的前沿交叉领域。喜欢在哲学、心理学和神经科学的交汇处寻找灵感。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="tag px-3 py-1.5 bg-xf-light text-xf-info text-xs rounded-full font-medium">#深度思考</span>
              <span className="tag px-3 py-1.5 bg-xf-light text-xf-info text-xs rounded-full font-medium">#认知科学</span>
              <span className="tag px-3 py-1.5 bg-xf-light text-xf-info text-xs rounded-full font-medium">#哲学探讨</span>
              <span className="tag px-3 py-1.5 bg-xf-light text-xf-info text-xs rounded-full font-medium">#极简主义</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
