/**
 * 文章列表页面
 * 显示用户的所有文章
 */

export default function ArticlesPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-xf-dark">我的文章</h1>
          <p className="text-xf-medium">管理和编辑您的创作</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light">
            筛选
          </button>
          <button className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
            新建文章
          </button>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-xf-dark">文章列表</h2>
            <span className="text-sm text-xf-medium">共 0 篇文章</span>
          </div>
        </div>
        
        <div className="p-6">
          {/* 空状态 */}
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-xf-dark mb-2">还没有文章</h3>
            <p className="text-xf-medium mb-4">开始创作您的第一篇文章吧！</p>
            <button className="bg-xf-primary text-white px-6 py-2 rounded-lg hover:bg-xf-primary/90">
              创建新文章
            </button>
          </div>
        </div>
      </div>

      {/* 文章模板建议 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <h2 className="text-lg font-semibold text-xf-dark">文章模板</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-xf-soft rounded-lg hover:border-xf-primary cursor-pointer transition-colors">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-medium text-xf-dark mb-1">技术教程</h3>
              <p className="text-sm text-xf-medium">分享技术知识和经验</p>
            </div>
            
            <div className="p-4 border border-xf-soft rounded-lg hover:border-xf-primary cursor-pointer transition-colors">
              <div className="text-2xl mb-2">💭</div>
              <h3 className="font-medium text-xf-dark mb-1">思考感悟</h3>
              <p className="text-sm text-xf-medium">记录生活感悟和思考</p>
            </div>
            
            <div className="p-4 border border-xf-soft rounded-lg hover:border-xf-primary cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-xf-dark mb-1">项目分享</h3>
              <p className="text-sm text-xf-medium">展示您的项目和作品</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}