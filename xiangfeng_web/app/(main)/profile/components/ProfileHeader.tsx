/**
 * 个人资料头部组件
 * 显示用户头像、用户名、简介等信息
 */

import React from 'react';
import { Star, MapPin, MessageSquare, UserPlus } from 'lucide-react';

interface ProfileHeaderProps {
  /** 用户名 */
  username: string;
  /** 用户简介 */
  bio: string;
  /** 用户头像URL */
  avatarUrl: string;
  /** 加入时间 */
  joinDate: string;
  /** 所在地 */
  location: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  bio,
  avatarUrl,
  joinDate,
  location
}) => {
  return (
    <div className="profile-header-bg rounded-[2rem] p-8 mb-8 shadow-soft">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* 头像区域 */}
        <div className="relative">
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full shadow-deep ring-4 ring-white" 
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-[var(--color-xf-accent)] to-[var(--color-xf-primary)] rounded-full flex items-center justify-center text-white">
            <Star className="w-5 h-5" />
          </div>
        </div>
        
        {/* 个人信息 */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1">{username}</h1>
              <p className="text-xl text-[var(--color-xf-primary)] font-medium mt-1">{bio}</p>
              <p className="text-sm text-[var(--color-xf-medium)] mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {location} · 加入于 {joinDate}
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-6 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                发消息
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-[var(--color-xf-accent)] to-[var(--color-xf-primary)] hover:from-[var(--color-xf-accent)]/90 hover:to-[var(--color-xf-primary)]/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                关注
              </button>
            </div>
          </div>
          
          {/* 个人简介 */}
          <div className="bg-white/60 rounded-2xl p-5 mt-4">
            <p className="text-[var(--color-xf-dark)]/80 leading-relaxed">
              深度思考者，认知科学爱好者。相信思考可以改变世界，致力于探索思维边界与认知科学的前沿交叉领域。喜欢在哲学、心理学和神经科学的交汇处寻找灵感。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="tag px-3 py-1.5 bg-[var(--color-xf-light)] text-[var(--color-xf-info)] text-xs rounded-full font-medium">#深度思考</span>
              <span className="tag px-3 py-1.5 bg-[var(--color-xf-light)] text-[var(--color-xf-info)] text-xs rounded-full font-medium">#认知科学</span>
              <span className="tag px-3 py-1.5 bg-[var(--color-xf-light)] text-[var(--color-xf-info)] text-xs rounded-full font-medium">#哲学探讨</span>
              <span className="tag px-3 py-1.5 bg-[var(--color-xf-light)] text-[var(--color-xf-info)] text-xs rounded-full font-medium">#极简主义</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
