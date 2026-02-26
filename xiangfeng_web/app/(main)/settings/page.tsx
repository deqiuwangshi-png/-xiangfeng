'use client';

/**
 * 设置页面主组件
 * 管理所有设置面板的切换和状态
 */

import React, { useState } from 'react';
import SettingsNav from './components/SettingsNav';
import AccountSettings from './components/AccountSettings';
import PrivacySettings from './components/PrivacySettings';
import NotificationSettings from './components/NotificationSettings';
import AppearanceSettings from './components/AppearanceSettings';
import ContentSettings from './components/ContentSettings';
import AccessibilitySettings from './components/AccessibilitySettings';
import AdvancedSettings from './components/AdvancedSettings';

// 设置面板类型
type SettingsPanel = 
  | 'account'
  | 'privacy'
  | 'notifications'
  | 'appearance'
  | 'content'
  | 'accessibility'
  | 'advanced';

const SettingsPage: React.FC = () => {
  // 当前激活的设置面板
  const [activePanel, setActivePanel] = useState<SettingsPanel>('account');

  // 渲染当前激活的设置面板
  const renderActivePanel = () => {
    switch (activePanel) {
      case 'account':
        return <AccountSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'content':
        return <ContentSettings />;
      case 'accessibility':
        return <AccessibilitySettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div id="tab-settings" className="max-w-7xl mx-auto fade-in-up">
      {/* 页面标题 */}
      <header className="mb-10">
        <h1 className="text-3xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1">设置</h1>
        <p className="text-[var(--color-xf-primary)] mt-2 font-medium">个性化配置你的相逢体验</p>
      </header>
      
      {/* 设置页面主布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 左侧设置导航 */}
        <div className="lg:col-span-1">
          <SettingsNav 
            activePanel={activePanel} 
            onPanelChange={setActivePanel} 
          />
        </div>
        
        {/* 右侧设置内容 */}
        <div className="lg:col-span-4">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
