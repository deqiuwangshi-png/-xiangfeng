/**
 * 文章编辑器页面
 * 提供富文本编辑功能，支持 Markdown 和富文本编辑
 */

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-xf-bg">
      {/* 编辑器顶部工具栏 */}
      <div className="bg-white border-b border-xf-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="text-xf-medium hover:text-xf-dark">
                ← 返回
              </button>
              <div className="text-sm text-xf-medium">草稿已保存</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light">
                预览
              </button>
              <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light">
                保存草稿
              </button>
              <button className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
                发布
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑器主体 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 文章标题 */}
          <div>
            <input
              type="text"
              placeholder="文章标题..."
              className="w-full text-3xl font-bold border-none outline-none placeholder:text-xf-medium bg-transparent"
            />
          </div>

          {/* 文章元信息 */}
          <div className="flex items-center space-x-4 text-sm text-xf-medium">
            <span>作者: 用户名</span>
            <span>•</span>
            <span>最后编辑: 刚刚</span>
          </div>

          {/* 编辑器工具栏 */}
          <div className="bg-white border border-xf-soft rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-xf-light rounded" title="粗体">
                <strong>B</strong>
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="斜体">
                <em>I</em>
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="下划线">
                <u>U</u>
              </button>
              <div className="w-px h-6 bg-xf-soft mx-2"></div>
              <button className="p-2 hover:bg-xf-light rounded" title="标题">
                H
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="列表">
                •
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="链接">
                🔗
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="图片">
                🖼️
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="代码">
                {'<>'}
              </button>
              <div className="w-px h-6 bg-xf-soft mx-2"></div>
              <button className="p-2 hover:bg-xf-light rounded" title="撤销">
                ↶
              </button>
              <button className="p-2 hover:bg-xf-light rounded" title="重做">
                ↷
              </button>
            </div>
          </div>

          {/* 编辑器内容区域 */}
          <div className="bg-white border border-xf-soft rounded-lg min-h-[400px]">
            <textarea
              placeholder="开始写作..."
              className="w-full h-[400px] p-6 border-none outline-none resize-none placeholder:text-xf-medium"
            />
          </div>

          {/* 文章设置 */}
          <div className="bg-white border border-xf-soft rounded-lg p-6">
            <h3 className="text-lg font-semibold text-xf-dark mb-4">文章设置</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-xf-dark mb-2">分类</label>
                <select className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent">
                  <option>技术</option>
                  <option>生活</option>
                  <option>思考</option>
                  <option>项目</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-xf-dark mb-2">标签</label>
                <input
                  type="text"
                  placeholder="添加标签，用逗号分隔"
                  className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-xf-dark mb-2">摘要</label>
              <textarea
                rows={3}
                placeholder="文章摘要（可选）"
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:ring-2 focus:ring-xf-primary focus:border-transparent"
              />
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-xf-dark">允许评论</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-xf-dark">公开可见</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}