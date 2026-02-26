/**
 * 讨论页面
 * 显示社区讨论和话题
 */

export default function DiscussionsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-xf-dark">社区讨论</h1>
          <p className="text-xf-medium">与其他创作者交流想法</p>
        </div>
        <button className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
          发起讨论
        </button>
      </div>

      {/* 讨论分类 */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-xf-primary text-white rounded-lg whitespace-nowrap">
          全部
        </button>
        <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light whitespace-nowrap">
          技术讨论
        </button>
        <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light whitespace-nowrap">
          创作分享
        </button>
        <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light whitespace-nowrap">
          求助问答
        </button>
        <button className="px-4 py-2 border border-xf-border rounded-lg hover:bg-xf-light whitespace-nowrap">
          意见建议
        </button>
      </div>

      {/* 讨论列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-xf-soft">
        <div className="p-6 border-b border-xf-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-xf-dark">热门讨论</h2>
            <select className="border border-xf-border rounded-lg px-3 py-1 text-sm">
              <option>最新回复</option>
              <option>最新发布</option>
              <option>最多点赞</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          {/* 空状态 */}
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-xf-dark mb-2">还没有讨论</h3>
            <p className="text-xf-medium mb-4">发起第一个讨论，开始社区交流吧！</p>
            <button className="bg-xf-primary text-white px-6 py-2 rounded-lg hover:bg-xf-primary/90">
              发起讨论
            </button>
          </div>
        </div>
      </div>

      {/* 讨论指南 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">讨论区使用指南</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• 保持友善和尊重，营造良好的讨论氛围</li>
              <li>• 提问前先搜索，避免重复讨论</li>
              <li>• 分享有价值的见解和经验</li>
              <li>• 遵守社区规则和条款</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}