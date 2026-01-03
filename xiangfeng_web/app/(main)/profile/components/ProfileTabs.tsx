/**
 * 个人资料标签页组件
 * 用于切换不同的内容区域
 */

import React from 'react';

interface TabItem {
  /** 标签ID */
  id: string;
  /** 标签名称 */
  label: string;
}

interface ProfileTabsProps {
  /** 标签页列表 */
  tabs: TabItem[];
  /** 当前激活的标签ID */
  activeTab: string;
  /** 标签切换回调函数 */
  onTabChange: (tabId: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

/**
 * ProfileTabs 组件的默认标签页数据
 */
export const defaultProfileTabs: TabItem[] = [
  { id: 'content', label: '我的内容' },
  { id: 'achievements', label: '成就徽章' },
  { id: 'activity', label: '活动记录' },
  { id: 'skills', label: '技能图谱' },
  { id: 'collections', label: '我的收藏' },
  { id: 'files', label: '我的文件' }
];

export default ProfileTabs;
