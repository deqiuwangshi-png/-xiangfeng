/**
 * 高级设置组件
 * 包含清除缓存、重置设置等高级配置
 */

import React, { useState } from 'react';

const AdvancedSettings: React.FC = () => {
  // 开发者模式
  const [developerMode, setDeveloperMode] = useState(false);
  // 启用日志
  const [enableLogging, setEnableLogging] = useState(false);
  // 应用数据大小
  const [appDataSize, setAppDataSize] = useState('235 MB');
  // 缓存大小
  const [cacheSize, setCacheSize] = useState('45 MB');

  // 模拟清除缓存函数
  const clearCache = () => {
    console.log('清除缓存');
    setCacheSize('0 MB');
  };

  // 模拟重置设置函数
  const resetSettings = () => {
    console.log('重置设置');
    // 重置所有设置到默认值
    setDeveloperMode(false);
    setEnableLogging(false);
  };

  // 模拟导出日志函数
  const exportLogs = () => {
    console.log('导出日志');
  };

  // 模拟清除所有数据函数
  const clearAllData = () => {
    console.log('清除所有数据');
    setAppDataSize('0 MB');
    setCacheSize('0 MB');
  };

  return (
    <div id="settings-advanced-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">高级设置</h2>
        
        <div className="space-y-8">
          {/* 开发者模式 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">开发者模式</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">启用开发者工具和高级选项</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={developerMode}
                    onChange={(e) => setDeveloperMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 启用日志 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">启用日志</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">记录应用日志用于调试</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={enableLogging}
                    onChange={(e) => setEnableLogging(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 缓存管理 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">缓存管理</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">管理应用缓存数据</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <div className="p-4 border border-[var(--color-xf-bg)] rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--color-xf-medium)]">缓存大小</span>
                    <span className="font-bold text-[var(--color-xf-dark)]">{cacheSize}</span>
                  </div>
                  <button 
                    className="w-full px-4 py-2 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-lg hover:bg-[var(--color-xf-primary)]/10 transition-all"
                    onClick={clearCache}
                  >
                    清除缓存
                  </button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="p-4 border border-[var(--color-xf-bg)] rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--color-xf-medium)]">应用数据</span>
                    <span className="font-bold text-[var(--color-xf-dark)]">{appDataSize}</span>
                  </div>
                  <button 
                    className="w-full px-4 py-2 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-lg hover:bg-[var(--color-xf-primary)]/10 transition-all"
                    onClick={() => console.log('管理应用数据')}
                  >
                    管理数据
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 日志管理 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">日志管理</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">管理应用日志文件</p>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <button 
                className="px-6 py-3 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium hover:bg-[var(--color-xf-primary)]/10 transition-all"
                onClick={exportLogs}
              >
                导出日志
              </button>
              
              <button 
                className="px-6 py-3 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium hover:bg-[var(--color-xf-primary)]/10 transition-all"
                onClick={() => console.log('清除日志')}
              >
                清除日志
              </button>
              
              <button 
                className="px-6 py-3 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium hover:bg-[var(--color-xf-primary)]/10 transition-all"
                onClick={() => console.log('查看日志')}
              >
                查看日志
              </button>
            </div>
          </div>
          
          {/* 重置设置 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">重置设置</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">将所有设置恢复到默认值</p>
            </div>
            
            <button 
              className="px-6 py-3 bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium hover:bg-[var(--color-xf-primary)]/10 transition-all"
              onClick={resetSettings}
            >
              重置所有设置
            </button>
          </div>
          
          {/* 危险操作区域 */}
          <div className="danger-zone rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-4 text-layer-1">危险操作</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--color-xf-medium)] mb-4">以下操作可能会导致数据丢失，请谨慎操作</p>
              </div>
              
              <div>
                <button 
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
                  onClick={clearAllData}
                >
                  清除所有数据
                </button>
                <p className="text-xs text-[var(--color-xf-medium)] mt-2">此操作将删除所有应用数据，包括账户信息、内容和设置</p>
              </div>
              
              <div>
                <button 
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
                  onClick={() => console.log('注销账户')}
                >
                  注销账户
                </button>
                <p className="text-xs text-[var(--color-xf-medium)] mt-2">此操作将注销当前账户，所有本地数据将被删除</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
