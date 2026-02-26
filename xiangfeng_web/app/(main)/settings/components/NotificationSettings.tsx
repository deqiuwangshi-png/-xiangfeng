/**
 * 通知设置组件
 * 包含各种通知偏好配置
 */

import React, { useState } from 'react';

const NotificationSettings: React.FC = () => {
  // 推送通知
  const [pushNotifications, setPushNotifications] = useState(true);
  // 邮件通知
  const [emailNotifications, setEmailNotifications] = useState(true);
  // 新关注者通知
  const [newFollowers, setNewFollowers] = useState(true);
  // 评论和回复
  const [commentsAndReplies, setCommentsAndReplies] = useState(true);
  // 点赞和收藏
  const [likesAndFavorites, setLikesAndFavorites] = useState(true);
  // 社群活动
  const [communityActivity, setCommunityActivity] = useState(true);
  // 每周摘要
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div id="settings-notifications-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">通知设置</h2>
        
        <div className="space-y-8">
          {/* 推送通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">推送通知</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">接收应用内推送通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 邮件通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">邮件通知</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">接收邮件通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 新关注者通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">新关注者通知</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">当有人关注你时通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={newFollowers}
                    onChange={(e) => setNewFollowers(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 评论通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">评论和回复</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">当有人评论或回复你的内容时通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={commentsAndReplies}
                    onChange={(e) => setCommentsAndReplies(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 点赞通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">点赞和收藏</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">当有人喜欢或收藏你的内容时通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={likesAndFavorites}
                    onChange={(e) => setLikesAndFavorites(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 社群活动通知 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">社群活动</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">社群中的新活动和讨论通知</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={communityActivity}
                    onChange={(e) => setCommunityActivity(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 每周摘要 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">每周摘要</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">接收每周活动摘要邮件</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
