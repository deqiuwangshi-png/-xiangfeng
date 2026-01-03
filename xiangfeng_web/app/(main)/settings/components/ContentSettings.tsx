/**
 * 内容偏好设置组件
 * 包含内容过滤、推荐偏好等配置
 */

import React, { useState } from 'react';

const ContentSettings: React.FC = () => {
  // 内容过滤
  const [contentFilter, setContentFilter] = useState('none');
  // 推荐算法
  const [recommendationAlgorithm, setRecommendationAlgorithm] = useState('personalized');
  // 语言偏好
  const [languagePreference, setLanguagePreference] = useState('zh-CN');
  // 自动播放视频
  const [autoplayVideos, setAutoplayVideos] = useState(false);
  // 显示内容预览
  const [showContentPreviews, setShowContentPreviews] = useState(true);
  // 显示阅读时长
  const [showReadingTime, setShowReadingTime] = useState(true);

  return (
    <div id="settings-content-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">内容偏好</h2>
        
        <div className="space-y-8">
          {/* 内容过滤 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">内容过滤</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">过滤不适合的内容</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value)}
                >
                  <option value="none">无过滤</option>
                  <option value="mild">轻度过滤</option>
                  <option value="moderate">中度过滤</option>
                  <option value="strict">严格过滤</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 推荐算法 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">推荐算法</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">选择内容推荐的算法类型</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={recommendationAlgorithm}
                  onChange={(e) => setRecommendationAlgorithm(e.target.value)}
                >
                  <option value="personalized">个性化推荐</option>
                  <option value="popular">热门内容</option>
                  <option value="balanced">平衡推荐</option>
                  <option value="diverse">多样化推荐</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 语言偏好 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">语言偏好</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">选择内容的主要语言</p>
              </div>
              <div className="md:w-1/3">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 focus:border-[var(--color-xf-primary)] outline-none rounded-xl"
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value)}
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁体中文</option>
                  <option value="en-US">英语</option>
                  <option value="ja-JP">日语</option>
                  <option value="ko-KR">韩语</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 自动播放视频 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">自动播放视频</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">在浏览时自动播放视频内容</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={autoplayVideos}
                    onChange={(e) => setAutoplayVideos(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 显示内容预览 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">显示内容预览</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">在列表中显示内容预览</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={showContentPreviews}
                    onChange={(e) => setShowContentPreviews(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* 显示阅读时长 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-1 text-layer-1">显示阅读时长</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">显示预计阅读时间</p>
              </div>
              <div className="md:w-1/3">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={showReadingTime}
                    onChange={(e) => setShowReadingTime(e.target.checked)}
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

export default ContentSettings;
