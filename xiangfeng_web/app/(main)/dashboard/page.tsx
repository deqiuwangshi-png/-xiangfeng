/**
 * 主应用仪表板页面
 * 用户登录后的主要工作区域
 */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-xf-dark">仪表板</h1>
          <p className="text-xf-medium">欢迎来到您的个人工作空间</p>
        </div>
        <button className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
          新建文章
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-xf-soft">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-xf-medium">总文章数</p>
              <p className="text-2xl font-bold text-xf-dark">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-xf-soft">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-xf-medium">总阅读量</p>
              <p className="text-2xl font-bold text-xf-dark">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-xf-soft">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-xf-medium">总讨论数</p>
              <p className="text-2xl font-bold text-xf-dark">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-xf-soft">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-xf-medium">收藏数</p>
              <p className="text-2xl font-bold text-xf-dark">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <h2 className="text-lg font-semibold text-xf-dark">最近活动</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-xf-medium">暂无活动记录</p>
            <p className="text-sm text-xf-medium mt-2">开始创作您的第一篇文章吧！</p>
          </div>
        </div>
      </div>
    </div>
  );
}