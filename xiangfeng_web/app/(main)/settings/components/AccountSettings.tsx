/**
 * 账户设置组件
 * 包含个人资料、安全设置、邮箱地址等配置
 */

import React from 'react';

const AccountSettings: React.FC = () => {
  // 模拟编辑个人资料函数
  const editProfile = () => {
    console.log('编辑个人资料');
  };

  // 模拟管理安全设置函数
  const manageSecurity = () => {
    console.log('管理安全设置');
  };

  // 模拟更换邮箱函数
  const changeEmail = () => {
    console.log('更换邮箱');
  };

  // 模拟管理关联账号函数
  const manageConnectedAccounts = () => {
    console.log('管理关联账号');
  };

  // 模拟请求数据导出函数
  const exportData = () => {
    console.log('请求数据导出');
  };

  return (
    <div id="settings-account-section" className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">账户设置</h2>
        
        <div className="space-y-8">
          {/* 个人资料 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">个人资料</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">更新你的个人信息和头像</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={editProfile}
                >
                  编辑个人资料
                </button>
              </div>
            </div>
          </div>
          
          {/* 账号安全 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">账号安全</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">管理密码和双重验证</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={manageSecurity}
                >
                  管理安全设置
                </button>
              </div>
            </div>
          </div>
          
          {/* 邮箱地址 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">邮箱地址</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">felix@example.com</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={changeEmail}
                >
                  更换邮箱
                </button>
              </div>
            </div>
          </div>
          
          {/* 关联账号 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">关联账号</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">管理你的社交媒体关联</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={manageConnectedAccounts}
                >
                  管理关联账号
                </button>
              </div>
            </div>
          </div>
          
          {/* 数据导出 */}
          <div className="setting-item">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-2/3">
                <h3 className="text-lg font-bold text-[var(--color-xf-dark)] mb-2 text-layer-1">数据导出</h3>
                <p className="text-sm text-[var(--color-xf-medium)]">导出你的个人数据和内容</p>
              </div>
              <div className="md:w-1/3">
                <button 
                  className="w-full px-4 py-3 bg-white border border-[var(--color-xf-bg)]/60 hover:bg-[var(--color-xf-light)] text-[var(--color-xf-primary)] rounded-xl font-medium transition-all"
                  onClick={exportData}
                >
                  请求数据导出
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
