/**
 * 无障碍访问设置组件
 * 包含屏幕阅读器支持、高对比度模式等配置
 */

import React, { useState } from 'react';

const AccessibilitySettings: React.FC = () => {
  // 屏幕阅读器支持
  const [screenReaderSupport, setScreenReaderSupport] = useState(true);
  // 高对比度模式
  const [highContrastMode, setHighContrastMode] = useState(false);
  // 键盘导航增强
  const [enhancedKeyboardNavigation, setEnhancedKeyboardNavigation] = useState(true);
  // 减少动画效果
  const [reduceAnimations, setReduceAnimations] = useState(false);
  // 声音提示
  const [soundEffects, setSoundEffects] = useState(false);
  // 大字体支持
  const [largeFontSupport, setLargeFontSupport] = useState(false);
  // 光标大小
  const [cursorSize, setCursorSize] = useState('medium');

  return (
    <div id="settings-accessibility-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">无障碍访问</h2>
        
        <div className="space-y-8">
          {/* 屏幕阅读器支持 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">屏幕阅读器支持</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">优化应用以适配屏幕阅读器</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={screenReaderSupport}
                    onChange={(e) => setScreenReaderSupport(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 高对比度模式 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">高对比度模式</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">增加界面元素的对比度</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={highContrastMode}
                    onChange={(e) => setHighContrastMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 键盘导航增强 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">键盘导航增强</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">增强键盘导航功能</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={enhancedKeyboardNavigation}
                    onChange={(e) => setEnhancedKeyboardNavigation(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 减少动画效果 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">减少动画效果</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">减少或禁用不必要的动画</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={reduceAnimations}
                    onChange={(e) => setReduceAnimations(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 声音提示 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">声音提示</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">为交互操作添加声音提示</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 大字体支持 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">大字体支持</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">启用更大的文本显示</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={largeFontSupport}
                    onChange={(e) => setLargeFontSupport(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 光标大小 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">光标大小</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">调整光标大小以提高可见性</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={cursorSize}
                  onChange={(e) => setCursorSize(e.target.value)}
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                  <option value="extra-large">特大</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
