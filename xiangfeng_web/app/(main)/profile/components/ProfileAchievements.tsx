/**
 * 个人资料成就徽章组件
 * 显示用户的成就徽章和进度
 */

import React from 'react';
import { PenTool, Users, Zap, ThumbsUp, Award, Lock } from 'lucide-react';

interface AchievementBadge {
  /** 徽章ID */
  id: string;
  /** 徽章名称 */
  name: string;
  /** 徽章描述 */
  description: string;
  /** 徽章图标 */
  icon: React.ReactNode;
  /** 徽章背景色 */
  bgColor: string;
  /** 是否已解锁 */
  unlocked: boolean;
}

interface AchievementProgress {
  /** 进度名称 */
  name: string;
  /** 当前进度 */
  current: number;
  /** 目标进度 */
  target: number;
  /** 进度百分比 */
  percentage: number;
}

interface ProfileAchievementsProps {
  /** 成就徽章列表 */
  badges: AchievementBadge[];
  /** 成就进度列表 */
  progress: AchievementProgress[];
}

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ badges, progress }) => {
  return (
    <div className="space-y-8">
      {/* 成就徽章 */}
      <div>
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">成就徽章</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="text-center">
              <div className={`achievement-badge ${badge.bgColor} mx-auto ${!badge.unlocked ? 'opacity-50' : ''}`}>
                {badge.icon}
              </div>
              <h4 className="font-bold text-[var(--color-xf-dark)] text-sm mt-2">{badge.name}</h4>
              <p className="text-xs text-[var(--color-xf-medium)] mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 成就进度 */}
      <div className="card-bg rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-4">成就进度</h3>
        <div className="space-y-4">
          {progress.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm text-[var(--color-xf-dark)] mb-1">
                <span>{item.name}</span>
                <span>{item.current}/{item.target}</span>
              </div>
              <div className="skill-level">
                <div className="skill-level-fill" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ProfileAchievements 组件的默认数据
 */
export const defaultAchievements: AchievementBadge[] = [
  {
    id: '1',
    name: '创作大师',
    description: '发布100+文章',
    icon: <PenTool className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-xf-accent to-xf-primary',
    unlocked: true
  },
  {
    id: '2',
    name: '社群之星',
    description: '加入20+社群',
    icon: <Users className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-xf-info to-xf-soft',
    unlocked: true
  },
  {
    id: '3',
    name: '灵感爆发',
    description: '单日发布5篇文章',
    icon: <Zap className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-xf-warning to-amber-300',
    unlocked: true
  },
  {
    id: '4',
    name: '好评如潮',
    description: '收获500+赞',
    icon: <ThumbsUp className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-green-500 to-emerald-400',
    unlocked: true
  },
  {
    id: '5',
    name: '跨界探索者',
    description: '解锁所有跨界节点',
    icon: <Award className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-purple-500 to-pink-400',
    unlocked: true
  },
  {
    id: '6',
    name: '深度对话者',
    description: '发起50+深度讨论',
    icon: <Lock className="w-6 h-6 text-white" />,
    bgColor: 'bg-gradient-to-tr from-gray-400 to-gray-300',
    unlocked: false
  }
];

export const defaultAchievementProgress: AchievementProgress[] = [
  {
    name: '连续创作',
    current: 7,
    target: 30,
    percentage: 23
  },
  {
    name: '社群活跃',
    current: 12,
    target: 20,
    percentage: 60
  },
  {
    name: '跨界探索',
    current: 3,
    target: 8,
    percentage: 38
  }
];

export default ProfileAchievements;
