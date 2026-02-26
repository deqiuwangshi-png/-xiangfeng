/**
 * 用户活动记录组件
 * 显示用户的活动时间线
 */

import React from 'react';

interface ActivityItem {
  /** 活动ID */
  id: string;
  /** 活动类型 */
  type: 'publish' | 'join' | 'comment' | 'like';
  /** 活动描述 */
  description: string;
  /** 活动时间 */
  timestamp: string;
  /** 相关标签 */
  tags: string[];
}

interface ProfileActivityProps {
  /** 活动记录列表 */
  activities: ActivityItem[];
}

const ProfileActivity: React.FC<ProfileActivityProps> = ({ activities }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">活动时间线</h2>
        <div className="card-bg rounded-2xl p-6">
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="timeline-item">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[var(--color-xf-dark)] text-layer-1">{activity.description}</h4>
                  <span className="text-xs text-[var(--color-xf-medium)] font-medium">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-[var(--color-xf-dark)]/80 mb-2">
                  {activity.type === 'publish' && '《为什么我们总是陷入"忙碌的陷阱"？——关于现代性与时间焦虑的反思》'}
                  {activity.type === 'join' && '"数字极简生活圈" - 探讨如何在数字时代保持专注、减少干扰、建立健康的科技使用习惯'}
                  {activity.type === 'comment' && '"现象学入门工作坊" - 胡塞尔现象学入门，学习"回到事物本身"的哲学方法'}
                  {activity.type === 'like' && '"当极简主义遇见复杂系统" by 建筑与理性'}
                </p>
                <div className="flex gap-2">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-[var(--color-xf-info)] bg-[var(--color-xf-info)]/10 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 默认活动数据
 */
export const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'publish',
    description: '发布了新文章',
    timestamp: '今天 10:30',
    tags: ['深度思考', '生活方式']
  },
  {
    id: '2',
    type: 'join',
    description: '加入了数字极简生活圈',
    timestamp: '昨天 14:20',
    tags: ['社群', '极简主义']
  },
  {
    id: '3',
    type: 'comment',
    description: '在现象学入门工作坊发表了观点',
    timestamp: '12月20日 20:00',
    tags: ['哲学', '现象学']
  }
];

export default ProfileActivity;
