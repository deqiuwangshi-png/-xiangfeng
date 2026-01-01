/**
 * 隐私政策页面
 * 详细说明平台的隐私保护政策
 */

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xf-bg via-xf-surface to-xf-soft">
      {/* 页眉导航 */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-xf-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-xf-dark">香枫</h1>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-xf-medium hover:text-xf-primary">首页</a>
              <a href="/about" className="text-xf-medium hover:text-xf-primary">关于我们</a>
              <a href="/services" className="text-xf-medium hover:text-xf-primary">服务</a>
              <a href="/community" className="text-xf-medium hover:text-xf-primary">社区</a>
              <a href="/login" className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
                登录
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 粘性侧边导航 */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-xf-soft">
          <nav className="space-y-2">
            <a href="#introduction" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              引言
            </a>
            <a href="#information-collection" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              信息收集
            </a>
            <a href="#information-usage" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              信息使用
            </a>
            <a href="#information-protection" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              信息保护
            </a>
            <a href="#cookies" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              Cookie 使用
            </a>
            <a href="#third-parties" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              第三方服务
            </a>
            <a href="#user-rights" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              用户权利
            </a>
            <a href="#contact" className="block text-sm text-xf-medium hover:text-xf-primary py-1">
              联系我们
            </a>
          </nav>
        </div>
      </div>

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-xf-dark mb-4">隐私政策</h1>
            <p className="text-xl text-xf-medium">最后更新日期：2024年1月1日</p>
          </div>

          {/* 重要条款提示 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 text-xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">重要提示</h3>
                <p className="text-yellow-800 text-sm">
                  请您仔细阅读本隐私政策，特别是免除或限制责任的条款。使用我们的服务即表示您同意本隐私政策的全部内容。
                  如果您不同意本政策的任何内容，请停止使用我们的服务。
                </p>
              </div>
            </div>
          </div>

          {/* 条款内容区块 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* 引言 */}
            <section id="introduction">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">1. 引言</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                香枫（以下简称"本服务"或"我们"）非常重视用户的隐私和个人信息保护。您在使用我们的服务时，
                我们可能会收集和使用您的相关信息。我们希望通过本隐私政策向您说明我们在您使用我们的服务时如何收集、
                使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。
              </p>
              <p className="text-xf-dark leading-relaxed">
                本隐私政策与您所使用的香枫服务息息相关，希望您仔细阅读，在需要时，按照本隐私政策的指引，
                作出您认为适当的选择。本隐私政策中涉及的相关技术词汇，我们尽量以简明扼要的表述，
                并提供进一步说明的链接，以便您的理解。
              </p>
            </section>

            {/* 信息收集 */}
            <section id="information-collection">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">2. 信息收集</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                我们收集信息是为了向您提供更好、更优、更个性化的服务，我们收集信息的方式如下：
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-xf-dark mb-2">2.1 您提供的信息</h3>
                  <ul className="text-xf-dark space-y-2 ml-4">
                    <li>• 注册信息：您在注册账户时提供的个人信息，包括用户名、邮箱地址等</li>
                    <li>• 个人资料：您自愿填写的个人资料信息，如头像、简介、个人网站等</li>
                    <li>• 创作内容：您发布、上传或分享的文章、评论、图片等内容</li>
                    <li>• 反馈信息：您通过客服、问卷调查等方式向我们提供的信息</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-xf-dark mb-2">2.2 我们在您使用服务过程中收集的信息</h3>
                  <ul className="text-xf-dark space-y-2 ml-4">
                    <li>• 设备信息：设备型号、操作系统版本、浏览器类型等</li>
                    <li>• 日志信息：使用服务的时间、时长、IP地址、访问页面等</li>
                    <li>• 位置信息：经您授权后获取的地理位置信息</li>
                    <li>• 浏览信息：您浏览的内容、点击的链接、收藏的内容等</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 信息使用 */}
            <section id="information-usage">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">3. 信息使用</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                我们出于以下目的使用您的个人信息：
              </p>
              <ul className="text-xf-dark space-y-2 ml-4">
                <li>• 向您提供服务，包括内容展示、搜索、创作、发布等功能</li>
                <li>• 维护、改进和优化我们的服务，开发新功能</li>
                <li>• 向您推荐可能感兴趣的内容、创作者或服务</li>
                <li>• 进行数据分析、研究和统计，改善服务质量</li>
                <li>• 保护我们服务的安全性，防止欺诈和恶意行为</li>
                <li>• 遵守法律法规的要求，响应司法机关的请求</li>
                <li>• 经您同意的其他用途</li>
              </ul>
            </section>

            {/* 信息保护 */}
            <section id="information-protection">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">4. 信息保护</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                我们采取以下措施保护您的个人信息安全：
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-xf-dark mb-2">4.1 技术措施</h3>
                  <ul className="text-xf-dark space-y-2 ml-4">
                    <li>• 使用加密技术保护数据传输和存储</li>
                    <li>• 实施访问控制，仅授权人员可访问个人信息</li>
                    <li>• 定期进行安全审计和漏洞扫描</li>
                    <li>• 建立完善的数据备份和恢复机制</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-xf-dark mb-2">4.2 管理措施</h3>
                  <ul className="text-xf-dark space-y-2 ml-4">
                    <li>• 建立完善的个人信息保护制度</li>
                    <li>• 对员工进行隐私保护培训</li>
                    <li>• 与第三方服务提供商签署保密协议</li>
                    <li>• 建立个人信息泄露应急响应机制</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie 使用 */}
            <section id="cookies">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">5. Cookie 使用</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                Cookie 是一种网络服务器存储在计算机或移动设备上的纯文本文件。Cookie 的内容只能由创建它的服务器检索或读取。
                每个 Cookie 对您的网络浏览器或移动应用程序都是唯一的。
              </p>
              <p className="text-xf-dark leading-relaxed mb-4">
                我们使用 Cookie 的目的如下：
              </p>
              <ul className="text-xf-dark space-y-2 ml-4">
                <li>• 记住您的身份，保持登录状态</li>
                <li>• 分析您如何使用我们的服务，改善用户体验</li>
                <li>• 向您展示可能感兴趣的内容和广告</li>
                <li>• 进行研究和统计分析，改进服务质量</li>
              </ul>
              <p className="text-xf-dark leading-relaxed mt-4">
                您可以通过浏览器设置拒绝或管理 Cookie。但请注意，如果停用 Cookie，
                您有可能无法享受最佳的服务体验，某些服务也可能无法正常使用。
              </p>
            </section>

            {/* 第三方服务 */}
            <section id="third-parties">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">6. 第三方服务</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                我们的服务可能包含指向第三方网站、产品和服务的链接。您可以选择是否访问或接受第三方提供的链接、内容、产品和服务。
              </p>
              <p className="text-xf-dark leading-relaxed">
                我们无法控制第三方的隐私和数据保护政策，此类第三方不受到本政策的约束。
                在向第三方提交个人信息之前，请参见这些第三方的隐私保护政策。
              </p>
            </section>

            {/* 用户权利 */}
            <section id="user-rights">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">7. 用户权利</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保障您对自己的个人信息行使以下权利：
              </p>
              <ul className="text-xf-dark space-y-2 ml-4">
                <li>• 访问权：您有权访问您的个人信息</li>
                <li>• 更正权：您有权更正不准确或不完整的个人信息</li>
                <li>• 删除权：在特定情况下，您有权要求删除您的个人信息</li>
                <li>• 限制处理权：在特定情况下，您有权限制我们对您个人信息的处理</li>
                <li>• 数据可携带权：您有权要求将您的个人信息转移给您或其他服务提供商</li>
                <li>• 反对权：您有权反对我们处理您的个人信息</li>
              </ul>
            </section>

            {/* 联系我们 */}
            <section id="contact">
              <h2 className="text-2xl font-bold text-xf-dark mb-4">8. 联系我们</h2>
              <p className="text-xf-dark leading-relaxed mb-4">
                如果您对本隐私政策有任何疑问、意见或建议，通过以下方式与我们联系：
              </p>
              <div className="bg-xf-light rounded-lg p-4 space-y-2">
                <p className="text-xf-dark">
                  <strong>电子邮箱：</strong> privacy@xiangfeng.com
                </p>
                <p className="text-xf-dark">
                  <strong>客服电话：</strong> 400-123-4567
                </p>
                <p className="text-xf-dark">
                  <strong>工作时间：</strong> 周一至周五 9:00-18:00
                </p>
                <p className="text-xf-dark">
                  <strong>邮寄地址：</strong> 北京市朝阳区xxx路xxx号
                </p>
              </div>
              <p className="text-xf-dark leading-relaxed mt-4">
                一般情况下，我们将在十五个工作日内回复。如果您对我们的回复不满意，
                特别是我们的个人信息处理行为损害了您的合法权益，您还可以向网信、电信、公安及工商等监管部门进行投诉或举报。
              </p>
            </section>
          </div>

          {/* 页脚 */}
          <div className="text-center mt-12 text-xf-medium">
            <p>© 2024 香枫. 保留所有权利.</p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">香枫</h3>
            <p className="text-gray-300 mb-6">为中文创作者而生</p>
            <div className="flex justify-center space-x-6">
              <a href="/privacy" className="text-white font-medium">隐私政策</a>
              <a href="/terms" className="text-gray-300 hover:text-white">服务条款</a>
              <a href="/community" className="text-gray-300 hover:text-white">社区</a>
              <a href="/login" className="text-gray-300 hover:text-white">登录</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}