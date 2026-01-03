/**
 * 隐私与安全设置组件
 * 包含隐私控制、数据管理等配置
 */

import React, { useState } from 'react';

const PrivacySettings: React.FC = () => {
  // 个人资料可见性
  const [profileVisibility, setProfileVisibility] = useState('public');
  // 在线状态显示
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  // 允许私信
  const [allowMessages, setAllowMessages] = useState('everyone');
  // 个性化数据收集
  const [collectPersonalizedData, setCollectPersonalizedData] = useState(true);

  // 模拟查看登录历史函数
  const viewLoginHistory = () => {
    console.log('查看登录历史');
  };

  return (
    <div id="settings-privacy-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">隐私与安全</h2>
        
        <div className="space-y-8">
          {/* 个人资料可见性 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">个人资料可见性</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">谁可以看到你的个人资料和活动</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                >
                  <option value="public">所有人可见</option>
                  <option value="community">仅社区成员可见</option>
                  <option value="followers">仅关注者可见</option>
                  <option value="private">仅自己可见</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 活动状态可见性 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">在线状态显示</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">是否向其他人显示你的在线状态</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={showOnlineStatus}
                    onChange={(e) => setShowOnlineStatus(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 私信设置 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">允许私信</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">谁可以向你发送私信</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={allowMessages}
                  onChange={(e) => setAllowMessages(e.target.value)}
                >
                  <option value="everyone">所有人</option>
                  <option value="followers">仅关注者</option>
                  <option value="mutuals">互相关注</option>
                  <option value="none">不允许</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 数据收集 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">个性化数据收集</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">允许收集数据以改进个性化推荐</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={collectPersonalizedData}
                    onChange={(e) => setCollectPersonalizedData(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 登录历史 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">登录历史</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">查看最近的登录活动</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={viewLoginHistory}
                >
                  查看登录历史
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
