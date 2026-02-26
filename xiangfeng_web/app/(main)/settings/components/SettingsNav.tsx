/**
 * 设置导航组件
 * 显示设置项列表，处理导航切换
 */

import React from 'react';
import { User, Lock, Bell, Palette, Filter, Eye, Settings2 } from 'lucide-react';

// 设置面板类型
type SettingsPanel = 
  | 'account'
  | 'privacy'
  | 'notifications'
  | 'appearance'
  | 'content'
  | 'accessibility'
  | 'advanced';

interface SettingsNavProps {
  /** 当前激活的设置面板 */
  activePanel: SettingsPanel;
  /** 设置面板切换回调 */
  onPanelChange: (panel: SettingsPanel) => void;
}

const SettingsNav: React.FC<SettingsNavProps> = ({ 
  activePanel, 
  onPanelChange 
}) => {
  // 设置导航项配置
  const navItems = [
    { 
      id: 'account' as SettingsPanel, 
      label: '账户设置', 
      icon: <User size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'privacy' as SettingsPanel, 
      label: '隐私与安全', 
      icon: <Lock size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'notifications' as SettingsPanel, 
      label: '通知', 
      icon: <Bell size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'appearance' as SettingsPanel, 
      label: '外观与主题', 
      icon: <Palette size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'content' as SettingsPanel, 
      label: '内容偏好', 
      icon: <Filter size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'accessibility' as SettingsPanel, 
      label: '无障碍访问', 
      icon: <Eye size={20} className="settings-nav-icon" /> 
    },
    { 
      id: 'advanced' as SettingsPanel, 
      label: '高级设置', 
      icon: <Settings2 size={20} className="settings-nav-icon" /> 
    },
  ];

  return (
    <div className="card-bg rounded-2xl p-6 sticky top-8">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`settings-nav-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => onPanelChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-xf-bg/40">
        <div className="text-center">
          <div className="text-xs text-xf-primary font-medium mb-2">相逢版本</div>
          <div className="text-sm text-xf-accent font-bold">V2.3.1</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNav;
