/**
 * 个人主页
 * 显示用户的个人资料、统计数据、文章、成就等信息
 */

'use client';

import React, { useState } from 'react';

// 导入个人主页组件
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import ProfileContent from './components/ProfileContent';
import ProfileAchievements from './components/ProfileAchievements';
import ProfileActivity from './components/ProfileActivity';
import ProfileSkills from './components/ProfileSkills';
import FilesPage from './files/page';

// 导入默认数据
import { defaultProfileStats } from './components/ProfileStats';
import { defaultProfileTabs } from './components/ProfileTabs';
import { defaultArticles } from './components/ProfileContent';
import { defaultAchievements, defaultAchievementProgress } from './components/ProfileAchievements';
import { defaultActivities } from './components/ProfileActivity';
import { defaultSkillCategories } from './components/ProfileSkills';

export default function ProfilePage() {
  // 标签页状态管理
  const [activeTab, setActiveTab] = useState<string>('content');

  // 用户基本信息
  const userInfo = {
    username: '思考者',
    bio: '探索认知边界中...',
    avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=B6CAD7',
    joinDate: '2023年9月',
    location: '上海'
  };

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-10 pt-10 pb-24 relative scroll-smooth" id="main-scroll">
      {/* 个人主页内容 */}
      <div id="tab-profile" className="max-w-6xl mx-auto fade-in-up">
        {/* 个人资料头部 */}
        <ProfileHeader
          username={userInfo.username}
          bio={userInfo.bio}
          avatarUrl={userInfo.avatarUrl}
          joinDate={userInfo.joinDate}
          location={userInfo.location}
        />

        {/* 数据统计 */}
        <ProfileStats stats={defaultProfileStats} />

        {/* 个人主页标签页 */}
        <ProfileTabs
          tabs={defaultProfileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 内容区域 */}
        <div>
          {/* 我的内容 */}
          {activeTab === 'content' && (
            <div id="profile-content-section">
              <ProfileContent articles={defaultArticles} />
            </div>
          )}

          {/* 成就徽章 */}
          {activeTab === 'achievements' && (
            <div id="profile-achievements-section">
              <ProfileAchievements
                badges={defaultAchievements}
                progress={defaultAchievementProgress}
              />
            </div>
          )}

          {/* 活动记录 */}
          {activeTab === 'activity' && (
            <div id="profile-activity-section">
              <ProfileActivity activities={defaultActivities} />
            </div>
          )}

          {/* 技能图谱 */}
          {activeTab === 'skills' && (
            <div id="profile-skills-section">
              <ProfileSkills categories={defaultSkillCategories} />
            </div>
          )}

          {/* 我的收藏 */}
          {activeTab === 'collections' && (
            <div id="profile-collections-section" className="text-center py-16">
              <h2 className="text-xl font-serif text-xf-accent font-bold mb-4">我的收藏</h2>
              <p className="text-xf-medium">功能开发中...</p>
            </div>
          )}
          
          {/* 我的文件 */}
          {activeTab === 'files' && (
            <FilesPage />
          )}
        </div>
      </div>
    </main>
  );
}
