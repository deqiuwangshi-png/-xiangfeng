/**
 * 外观与主题设置组件
 * 包含主题选择、颜色方案等配置
 */

import React, { useState } from 'react';

const AppearanceSettings: React.FC = () => {
  // 主题模式
  const [themeMode, setThemeMode] = useState('light');
  // 颜色方案
  const [colorScheme, setColorScheme] = useState('default');
  // 字体大小
  const [fontSize, setFontSize] = useState(16);
  // 动画效果
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  // 界面密度
  const [interfaceDensity, setInterfaceDensity] = useState('comfortable');

  return (
    <div id="settings-appearance-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">外观与主题</h2>
        
        <div className="space-y-8">
          {/* 主题模式 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">主题模式</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">选择应用的显示主题</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${themeMode === 'light' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setThemeMode('light')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[var(--color-xf-bg)] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-xf-dark)]">浅色模式</h4>
                    <p className="text-xs text-[var(--color-xf-medium)]">明亮清爽的界面</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${themeMode === 'dark' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setThemeMode('dark')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-xf-dark)] border border-[var(--color-xf-bg)] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-xf-dark)]">深色模式</h4>
                    <p className="text-xs text-[var(--color-xf-medium)]">适合夜间使用</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${themeMode === 'auto' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setThemeMode('auto')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-[var(--color-xf-dark)] border border-[var(--color-xf-bg)] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-xf-dark)]">自动模式</h4>
                    <p className="text-xs text-[var(--color-xf-medium)]">跟随系统设置</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 颜色方案 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">颜色方案</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">选择应用的颜色主题</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div 
                className={`color-preview ${colorScheme === 'default' ? 'active' : ''}`}
                style={{ backgroundColor: '#6A5B8A' }}
                onClick={() => setColorScheme('default')}
              ></div>
              <div 
                className={`color-preview ${colorScheme === 'blue' ? 'active' : ''}`}
                style={{ backgroundColor: '#4A6FA5' }}
                onClick={() => setColorScheme('blue')}
              ></div>
              <div 
                className={`color-preview ${colorScheme === 'purple' ? 'active' : ''}`}
                style={{ backgroundColor: '#8B5FBF' }}
                onClick={() => setColorScheme('purple')}
              ></div>
              <div 
                className={`color-preview ${colorScheme === 'green' ? 'active' : ''}`}
                style={{ backgroundColor: '#4CAF50' }}
                onClick={() => setColorScheme('green')}
              ></div>
              <div 
                className={`color-preview ${colorScheme === 'orange' ? 'active' : ''}`}
                style={{ backgroundColor: '#FF9800' }}
                onClick={() => setColorScheme('orange')}
              ></div>
            </div>
          </div>
          
          {/* 字体大小 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">字体大小</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">调整应用内文本的大小</p>
                <div className="mt-2">
                  <span className="text-xs text-[var(--color-xf-medium)]">{fontSize}px</span>
                </div>
              </div>
              <div className="md:w-1/3">
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--color-xf-light)] rounded-lg appearance-none cursor-pointer accent-[var(--color-xf-primary)]"
                />
              </div>
            </div>
          </div>
          
          {/* 动画效果 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">动画效果</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">启用或禁用应用内动画</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={animationsEnabled}
                    onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 界面密度 */}
          <div className="setting-item">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">界面密度</h3>
              <p className="text-sm text-[var(--color-xf-medium)]">调整界面元素的间距和大小</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${interfaceDensity === 'compact' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setInterfaceDensity('compact')}
              >
                <h4 className="font-bold text-[var(--color-xf-dark)] mb-1">紧凑</h4>
                <p className="text-xs text-[var(--color-xf-medium)]">较小的间距，显示更多内容</p>
              </div>
              
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${interfaceDensity === 'comfortable' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setInterfaceDensity('comfortable')}
              >
                <h4 className="font-bold text-[var(--color-xf-dark)] mb-1">舒适</h4>
                <p className="text-xs text-[var(--color-xf-medium)]">平衡的间距，舒适的阅读体验</p>
              </div>
              
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${interfaceDensity === 'spacious' ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-bg)] hover:border-[var(--color-xf-primary)]'}`}
                onClick={() => setInterfaceDensity('spacious')}
              >
                <h4 className="font-bold text-[var(--color-xf-dark)] mb-1">宽敞</h4>
                <p className="text-xs text-[var(--color-xf-medium)]">较大的间距，减少视觉疲劳</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
