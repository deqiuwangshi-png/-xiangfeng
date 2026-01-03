/**
 * 个人资料统计组件
 * 显示用户的统计数据，如文章数、关注者等
 */

import React from 'react';
import { FileText, Users, ThumbsUp, MessageSquare } from 'lucide-react';

interface StatItem {
  /** 统计数值 */
  value: string;
  /** 统计标签 */
  label: string;
  /** 图标组件 */
  icon: React.ReactNode;
  /** 背景颜色类 */
  bgColor: string;
  /** 文本颜色类 */
  textColor: string;
}

interface ProfileStatsProps {
  /** 统计数据列表 */
  stats: StatItem[];
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {stats.map((stat, index) => (
        <div key={index} className="profile-stats-item card-bg rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[var(--color-xf-accent)] mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--color-xf-primary)] font-medium">{stat.label}</div>
            </div>
            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * ProfileStats 组件的默认数据
 */
export const defaultProfileStats: StatItem[] = [
  {
    value: '128',
    label: '文章',
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-blue-100 to-blue-200',
    textColor: 'text-[var(--color-xf-info)]'
  },
  {
    value: '3.2k',
    label: '关注者',
    icon: <Users className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-purple-100 to-purple-200',
    textColor: 'text-[var(--color-xf-primary)]'
  },
  {
    value: '564',
    label: '获赞',
    icon: <ThumbsUp className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-indigo-100 to-indigo-200',
    textColor: 'text-[var(--color-xf-accent)]'
  },
  {
    value: '28',
    label: '社群',
    icon: <MessageSquare className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-tr from-green-100 to-green-200',
    textColor: 'text-[var(--color-xf-success)]'
  }
];

export default ProfileStats;
