/**
 * 个人资料页面
 * 显示和编辑用户信息
 */

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-xf-dark">个人资料</h1>
        <p className="text-xf-medium">管理您的个人信息和设置</p>
      </div>

      {/* 基本信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <h2 className="text-lg font-semibold text-xf-dark">基本信息</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-xf-light rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <button className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
                更换头像
              </button>
              <p className="text-sm text-xf-medium mt-2">支持 JPG, PNG 格式，最大 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-xf-dark mb-2">用户名</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-xf-dark mb-2">邮箱</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="请输入邮箱"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-xf-dark mb-2">昵称</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="请输入昵称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-xf-dark mb-2">个人网站</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-xf-dark mb-2">个人简介</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
              placeholder="介绍一下自己..."
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-xf-primary text-white px-6 py-2 rounded-lg hover:bg-xf-primary/90">
              保存更改
            </button>
          </div>
        </div>
      </div>

      {/* 账户设置 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <h2 className="text-lg font-semibold text-xf-dark">账户设置</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-xf-dark">邮箱通知</h3>
              <p className="text-sm text-xf-medium">接收文章评论和回复通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-xf-soft peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-xf-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-xf-soft after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-xf-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-xf-dark">公开个人资料</h3>
              <p className="text-sm text-xf-medium">允许其他用户查看您的资料</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-xf-soft peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-xf-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-xf-soft after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-xf-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 安全设置 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <h2 className="text-lg font-semibold text-xf-dark">安全设置</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-xf-dark">修改密码</h3>
              <p className="text-sm text-xf-medium">更新您的账户密码</p>
            </div>
            <button className="text-xf-primary hover:text-xf-accent">
              修改
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-xf-dark">双重认证</h3>
              <p className="text-sm text-xf-medium">增强账户安全性</p>
            </div>
            <button className="text-xf-primary hover:text-xf-accent">
              启用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}