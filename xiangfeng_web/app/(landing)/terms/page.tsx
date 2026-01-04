/**
 * 服务条款页面
 * 详细说明平台的服务条款和条件
 */


export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xf-bg via-xf-surface to-xf-soft">
      {/* 页眉导航 */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-xf-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-xf-primary">相逢</div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/about" className="text-xf-medium hover:text-xf-dark px-3 py-2 text-sm font-medium">关于我们</a>
                <a href="/services" className="text-xf-medium hover:text-xf-dark px-3 py-2 text-sm font-medium">服务</a>
                <a href="/community" className="text-xf-medium hover:text-xf-dark px-3 py-2 text-sm font-medium">社区</a>
                <a href="/privacy" className="text-xf-medium hover:text-xf-dark px-3 py-2 text-sm font-medium">隐私政策</a>
                <a href="/terms" className="text-xf-dark px-3 py-2 text-sm font-medium">服务条款</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-xf-medium hover:text-xf-dark px-3 py-2 text-sm font-medium">登录</a>
              <a href="/register" className="bg-xf-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-xf-primary/90">注册</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 粘性侧边导航 */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-xf-soft">
          <nav className="space-y-3">
            <a href="#acceptance" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">接受条款</a>
            <a href="#services" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">服务描述</a>
            <a href="#user-obligations" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">用户义务</a>
            <a href="#intellectual-property" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">知识产权</a>
            <a href="#liability" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">责任限制</a>
            <a href="#termination" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">服务终止</a>
            <a href="#changes" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">条款修改</a>
            <a href="#contact" className="block text-sm text-xf-medium hover:text-xf-primary transition-colors">联系我们</a>
          </nav>
        </div>
      </div>

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-xf-dark mb-4">服务条款</h1>
            <p className="text-xl text-xf-medium">最后更新日期：2024年1月1日</p>
            <div className="mt-6 text-sm text-xf-medium">
              <p>重要提示：使用我们的服务即表示您同意以下条款。请仔细阅读。</p>
            </div>
          </div>

          {/* 重要条款提示 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">重要提醒</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 使用本服务即表示您同意遵守所有适用法律法规</li>
                  <li>• 我们有权根据运营需要修改服务条款</li>
                  <li>• 用户需对自己的账户安全和内容负责</li>
                  <li>• 违反条款可能导致服务暂停或终止</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 条款内容区块 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* 接受条款 */}
            <section id="acceptance" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">1. 接受条款</h2>
              <div className="space-y-3 text-xf-medium">
                <p>1.1 欢迎使用向风（以下简称"本服务"）。通过访问或使用我们的服务，您同意受这些服务条款（"条款"）的约束。</p>
                <p>1.2 如果您不同意这些条款的任何部分，请不要使用我们的服务。</p>
                <p>1.3 我们保留随时修改这些条款的权利，修改后的条款将在发布后立即生效。</p>
                <p>1.4 您继续使用服务即表示您接受修改后的条款。</p>
              </div>
            </section>

            {/* 服务描述 */}
            <section id="services" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">2. 服务描述</h2>
              <div className="space-y-3 text-xf-medium">
                <p>2.1 向风是一个内容创作和分享平台，为用户提供以下服务：</p>
                <ul className="ml-6 space-y-2">
                  <li>• 文章创作和发布功能</li>
                  <li>• 社区讨论和交流</li>
                  <li>• 个人资料管理</li>
                  <li>• 内容发现和推荐</li>
                  <li>• 数据分析和统计</li>
                </ul>
                <p>2.2 我们不断努力改进服务，但不对服务的连续性、及时性、安全性或准确性做出保证。</p>
                <p>2.3 我们保留随时修改、暂停或终止部分或全部服务的权利，无需事先通知。</p>
              </div>
            </section>

            {/* 用户义务 */}
            <section id="user-obligations" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">3. 用户义务</h2>
              <div className="space-y-3 text-xf-medium">
                <p>3.1 您同意：</p>
                <ul className="ml-6 space-y-2">
                  <li>• 提供准确、完整和最新的注册信息</li>
                  <li>• 维护账户密码的机密性</li>
                  <li>• 立即通知我们任何未经授权使用您账户的情况</li>
                  <li>• 遵守所有适用的法律法规</li>
                  <li>• 尊重其他用户的权利</li>
                </ul>
                <p>3.2 您不得：</p>
                <ul className="ml-6 space-y-2">
                  <li>• 发布或传播违法、有害、威胁、辱骂、骚扰、诽谤、 vulgar、淫秽或其他令人反感的内容</li>
                  <li>• 侵犯他人的知识产权或隐私权</li>
                  <li>• 上传或传播病毒、恶意代码或其他有害程序</li>
                  <li>• 干扰或破坏服务的正常运行</li>
                  <li>• 未经授权访问其他用户的账户或数据</li>
                  <li>• 将服务用于任何非法目的</li>
                </ul>
              </div>
            </section>

            {/* 知识产权 */}
            <section id="intellectual-property" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">4. 知识产权</h2>
              <div className="space-y-3 text-xf-medium">
                <p>4.1 服务及其原创内容、特性和功能归向风所有，并受国际版权、商标、专利、商业秘密和其他知识产权法律的保护。</p>
                <p>4.2 您保留对您发布内容的所有权，但您授予我们非独占、全球范围、免版税、可再许可的许可，以使用、复制、修改、改编、发布、翻译、创作衍生作品、分发、公开表演和展示此类内容。</p>
                <p>4.3 您同意我们有权（但无义务）监控、审查、标记、过滤、修改、拒绝或删除任何内容。</p>
                <p>4.4 未经我们事先书面同意，您不得复制、修改、分发、出售、租赁、逆向工程或创建服务的衍生作品。</p>
              </div>
            </section>

            {/* 责任限制 */}
            <section id="liability" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">5. 责任限制</h2>
              <div className="space-y-3 text-xf-medium">
                <p>5.1 在适用法律允许的最大范围内，向风及其董事、员工、合作伙伴、代理、供应商或关联公司不对任何间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据丢失、使用损失、商誉损失或其他无形损失。</p>
                <p>5.2 在任何情况下，我们对所有损害、损失和诉讼原因（无论是合同、侵权（包括疏忽）或其他）的总责任不超过您在索赔前12个月内为服务支付的总金额（如果有）。</p>
                <p>5.3 某些司法管辖区不允许排除某些担保或限制某些损害的责任，因此上述某些限制可能不适用于您。</p>
              </div>
            </section>

            {/* 服务终止 */}
            <section id="termination" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">6. 服务终止</h2>
              <div className="space-y-3 text-xf-medium">
                <p>6.1 我们可以出于任何原因，包括但不限于您违反这些条款，立即终止或暂停您的账户和对服务的访问，无需事先通知或承担责任。</p>
                <p>6.2 终止后，您使用服务的权利将立即终止。如果您希望终止您的账户，您可以直接停止使用服务。</p>
                <p>6.3 所有在性质上应在终止后继续有效的条款（包括但不限于所有权条款、保证免责声明、赔偿和责任限制）应在终止后继续有效。</p>
              </div>
            </section>

            {/* 条款修改 */}
            <section id="changes" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">7. 条款修改</h2>
              <div className="space-y-3 text-xf-medium">
                <p>7.1 我们保留随时修改或替换这些条款的权利。我们将通过在我们的网站上发布通知或采取其他合理措施来通知您重大变更。</p>
                <p>7.2 重大变更将在发布后30天内生效。非重大变更将在发布后7天内生效。</p>
                <p>7.3 在变更生效后继续访问或使用我们的服务，即表示您同意受修订后的条款约束。</p>
                <p>7.4 如果您不同意新条款，您应停止使用服务。</p>
              </div>
            </section>

            {/* 联系我们 */}
            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-bold text-xf-dark">8. 联系我们</h2>
              <div className="space-y-3 text-xf-medium">
                <p>8.1 如果您对这些条款有任何疑问，请通过以下方式联系我们：</p>
                <div className="bg-xf-light rounded-lg p-4 space-y-2">
                  <p><strong>电子邮件：</strong> support@xiangfeng.com</p>
                  <p><strong>客服热线：</strong> 400-123-4567</p>
                  <p><strong>工作时间：</strong> 周一至周五 9:00-18:00</p>
                  <p><strong>公司地址：</strong> 中国北京市朝阳区xxx街道xxx号</p>
                </div>
                <p>8.2 我们将尽力在收到您的询问后24小时内回复。</p>
                <p>8.3 对于紧急事项，请使用客服热线联系我们。</p>
              </div>
            </section>
          </div>

          {/* 条款接受确认 */}
          <div className="mt-8 bg-xf-light rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-xf-dark mb-2">条款接受确认</h3>
            <p className="text-xf-medium mb-4">通过使用我们的服务，您确认已阅读、理解并同意受这些服务条款的约束。</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-xf-primary text-white px-6 py-2 rounded-lg hover:bg-xf-primary/90">
                我同意
              </button>
              <button className="border border-xf-border text-xf-medium px-6 py-2 rounded-lg hover:bg-xf-light">
                不同意
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">向风</h3>
              <p className="text-gray-300">连接创作者，分享知识，激发灵感</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">产品</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/features" className="hover:text-white">功能特性</a></li>
                <li><a href="/pricing" className="hover:text-white">价格方案</a></li>
                <li><a href="/integrations" className="hover:text-white">集成服务</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">公司</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/about" className="hover:text-white">关于我们</a></li>
                <li><a href="/careers" className="hover:text-white">招聘信息</a></li>
                <li><a href="/press" className="hover:text-white">新闻动态</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">支持</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/help" className="hover:text-white">帮助中心</a></li>
                <li><a href="/contact" className="hover:text-white">联系我们</a></li>
                <li><a href="/status" className="hover:text-white">服务状态</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 向风. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}