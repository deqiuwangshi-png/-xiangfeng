import Link from 'next/link'
import { Clock, FileText, Shield, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import '@/styles/domains/privacy.css'
import Navbar from '@/components/marketing/Navbar'

export const metadata: Metadata = {
  title: '隐私政策 - 相逢 Xiangfeng',
  description: '欢迎使用相逢！我们深知个人信息对您的重要性，并庄严承诺保护您的隐私和安全。',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* 左侧导航 */}
        <aside className="lg:w-1/4 no-print">
          <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-xf-accent mb-6 font-serif">隐私政策导航</h3>
            <nav className="space-y-4">
              <a href="#introduction" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">引言</a>
              <a href="#data-collection" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">信息收集</a>
              <a href="#data-use" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">信息使用</a>
              <a href="#data-sharing" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">信息共享</a>
              <a href="#data-security" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">数据安全</a>
              <a href="#your-rights" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">您的权利</a>
              <a href="#cookies" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">Cookie政策</a>
              <a href="#children" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">儿童隐私</a>
              <a href="#changes" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">政策变更</a>
              <a href="#contact" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">联系我们</a>
            </nav>
            
            <div className="mt-10 pt-6 border-t border-xf-bg/30">
              <div className="flex items-center gap-3 text-sm text-xf-primary mb-2">
                <Clock className="w-4 h-4" />
                <span>最后更新：2024年3月20日</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-xf-primary">
                <FileText className="w-4 h-4" />
                <span>阅读时间：约10分钟</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧主要内容 */}
        <main className="lg:w-3/4">
          {/* 页眉 */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-xf-light/80 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-4 h-4 text-xf-info" />
              <span className="text-sm font-medium text-xf-primary">隐私与安全</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-xf-accent mb-6">隐私政策</h1>
            <p className="text-lg text-xf-medium leading-relaxed">
              欢迎使用相逢！我们深知个人信息对您的重要性，并庄严承诺保护您的隐私和安全。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息，以及您对个人信息享有的权利。
            </p>
          </div>

          {/* 重要提示 */}
          <div className="bg-linear-to-r from-xf-info/10 to-xf-soft/10 rounded-2xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-xf-info" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-xf-dark mb-2">重要提示</h4>
                <p className="text-xf-medium">
                  请您在使用我们的产品和服务前，仔细阅读并理解本隐私政策的全部内容。当您开始使用相逢时，即表示您已阅读、理解并同意本隐私政策的全部条款。如果您不同意本隐私政策的任何内容，请立即停止使用我们的服务。
                </p>
              </div>
            </div>
          </div>

          {/* 引言 */}
          <section id="introduction" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">1. 引言</h2>
            
            <div className="policy-content space-y-6">
              <p>
                本隐私政策适用于相逢平台（包括网站、移动应用及相关服务，以下简称"本平台"或"我们"）提供的所有产品和服务。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全。我们致力于维持您对我们的信任，并遵守以下原则保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则。
              </p>
              
              <p>
                本隐私政策将帮助您了解以下内容：
              </p>
              
              <ul>
                <li>我们如何收集和使用您的个人信息</li>
                <li>我们如何使用Cookie和同类技术</li>
                <li>我们如何共享、转让、公开披露您的个人信息</li>
                <li>我们如何保护您的个人信息</li>
                <li>您的权利</li>
                <li>我们如何处理儿童的个人信息</li>
                <li>本隐私政策如何更新</li>
                <li>如何联系我们</li>
              </ul>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">适用范围</p>
                <p className="text-xf-medium text-sm">
                  本隐私政策适用于相逢平台的所有产品和服务。但某些特定产品或服务可能有独立的隐私政策，该等独立的隐私政策将优先于本隐私政策。如果特定产品或服务的隐私政策与本隐私政策有不一致之处，则以该特定隐私政策为准。
                </p>
              </div>
            </div>
          </section>

          {/* 信息收集 */}
          <section id="data-collection" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">2. 我们如何收集您的信息</h2>
            
            <div className="policy-content space-y-6">
              <p>
                我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息。您在使用我们的服务时，我们可能会收集下列信息：
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.1 您直接提供的信息</h3>
              
              <ul>
                <li><strong>账户信息：</strong>当您注册相逢账户时，我们会收集您的电子邮箱地址、用户名和密码。</li>
                <li><strong>个人资料信息：</strong>您可以选择提供个人资料信息，如头像、昵称、个人简介、兴趣标签等。</li>
                <li><strong>内容信息：</strong>您在使用相逢服务时创建、发布或分享的内容，包括文章、评论、笔记、收藏等。</li>
                <li><strong>联系信息：</strong>当您联系我们或参与活动时，可能会提供您的姓名、电子邮件地址或其他联系方式。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.2 我们在您使用服务过程中收集的信息</h3>
              
              <ul>
                <li><strong>设备信息：</strong>我们可能会收集您使用的设备相关信息，如设备型号、操作系统、唯一设备标识符、IP地址、移动网络信息等。</li>
                <li><strong>日志信息：</strong>当您使用我们的服务时，我们可能会自动收集某些信息并存储在日志中，包括服务使用信息、搜索查询、IP地址、浏览器类型和语言、访问日期和时间等。</li>
                <li><strong>位置信息：</strong>当您使用某些基于位置的服务时，我们可能会收集和处理有关您实际位置的信息（在获得您的同意后）。</li>
                <li><strong>使用数据：</strong>我们收集关于您如何使用我们服务的数据，如访问的页面、点击的链接、浏览时间、搜索查询等。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.3 我们从第三方获得的信息</h3>
              
              <p>
                我们可能会从第三方服务获取信息，例如当您使用第三方账户登录相逢时，我们可能会从该第三方服务获得您的账户信息（需您授权）。我们仅会收集实现产品功能所必要的第三方信息。
              </p>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">敏感个人信息</p>
                <p className="text-xf-medium text-sm">
                  相逢不主动收集您的敏感个人信息（如种族、宗教信仰、个人健康状况等）。如果您选择在内容中分享此类信息，请知悉这些信息可能会被公开，请谨慎考虑。
                </p>
              </div>
            </div>
          </section>

          {/* 信息使用 */}
          <section id="data-use" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">3. 我们如何使用您的信息</h2>
            
            <div className="policy-content space-y-6">
              <p>
                我们严格遵守法律法规的规定及与用户的约定，将收集的信息用于以下用途。若我们超出以下用途使用您的信息，我们将再次向您进行说明，并征得您的同意。
              </p>
              
              <div className="overflow-x-auto">
                <table className="policy-table">
                  <thead>
                    <tr>
                      <th>使用目的</th>
                      <th>具体说明</th>
                      <th>涉及的信息类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>提供服务</td>
                      <td>创建和管理您的账户，提供核心功能如内容发布、社群互动等</td>
                      <td>账户信息、个人资料信息、内容信息</td>
                    </tr>
                    <tr>
                      <td>改善用户体验</td>
                      <td>个性化内容推荐、优化界面设计、改进产品功能</td>
                      <td>使用数据、设备信息、日志信息</td>
                    </tr>
                    <tr>
                      <td>安全保障</td>
                      <td>验证用户身份、检测和防范欺诈行为、保障账户安全</td>
                      <td>设备信息、日志信息、IP地址</td>
                    </tr>
                    <tr>
                      <td>沟通与服务</td>
                      <td>发送服务通知、回应您的咨询、提供客户支持</td>
                      <td>联系信息、账户信息</td>
                    </tr>
                    <tr>
                      <td>研究与分析</td>
                      <td>分析用户行为趋势、进行产品研究、生成统计信息</td>
                      <td>使用数据、日志信息（匿名化处理）</td>
                    </tr>
                    <tr>
                      <td>法律合规</td>
                      <td>遵守法律法规要求、响应执法要求、执行服务条款</td>
                      <td>根据具体法律要求而定</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">个性化推荐</p>
                <p className="text-xf-medium text-sm">
                  我们可能会使用您的使用数据为您提供个性化的内容推荐。您可以在账户设置中随时调整个性化推荐偏好或关闭个性化推荐功能。
                </p>
              </div>
              
              <p>
                我们承诺，我们不会将您的个人信息用于以下用途：
              </p>
              
              <ul>
                <li>用于与提供服务无关的目的</li>
                <li>未经您明确同意的营销活动</li>
                <li>出售、出租或交易您的个人信息</li>
                <li>任何违反法律法规或社会公德的行为</li>
              </ul>
            </div>
          </section>

          {/* 信息共享 */}
          <section id="data-sharing" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">4. 我们如何共享、转让、公开披露您的信息</h2>
            
            <div className="policy-content space-y-6">
              <h3 className="text-xl font-bold text-xf-dark mb-4">4.1 共享</h3>
              
              <p>
                我们不会与相逢以外的任何公司、组织和个人共享您的个人信息，但以下情况除外：
              </p>
              
              <ul>
                <li><strong>获得您的明确同意：</strong>在获得您的明确同意后，我们会与其他方共享您的信息。</li>
                <li><strong>与服务提供商共享：</strong>我们可能会与为我们提供服务的第三方共享信息，例如云服务提供商、数据分析服务商等。这些服务提供商只能访问提供服务所必要的信息，并且有义务保护您的信息安全。</li>
                <li><strong>基于法律要求：</strong>在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会共享您的个人信息。</li>
                <li><strong>保护合法权益：</strong>为保护相逢、用户或公众的合法权益免遭损害，我们可能会共享必要的信息。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">4.2 转让</h3>
              
              <p>
                我们不会将您的个人信息转让给任何公司、组织或个人，但以下情况除外：
              </p>
              
              <ul>
                <li>获得您的明确同意后；</li>
                <li>在涉及合并、收购或破产清算时，如涉及个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">4.3 公开披露</h3>
              
              <p>
                我们仅会在以下情况下，公开披露您的个人信息：
              </p>
              
              <ul>
                <li>获得您明确同意后；</li>
                <li>基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息。</li>
              </ul>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">公开信息</p>
                <p className="text-xf-medium text-sm">
                  您在平台上公开发布的内容（如文章、评论等）将被视为公开信息，任何用户都可以查看。请注意，公开发布的内容可能会被搜索引擎索引，也可能被其他网站转载。在发布内容前，请谨慎考虑。
                </p>
              </div>
            </div>
          </section>

          {/* 数据安全 */}
          <section id="data-security" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">5. 我们如何保护您的个人信息</h2>
            
            <div className="policy-content space-y-6">
              <p>
                我们已采取符合业界标准的安全措施来保护您的个人信息，防止未经授权的访问、使用、披露或损坏。我们的安全措施包括：
              </p>
              
              <ul>
                <li><strong>技术措施：</strong>我们采用加密技术（如SSL/TLS）保护数据传输安全，使用访问控制和权限管理限制数据访问，定期进行安全审计和漏洞扫描。</li>
                <li><strong>管理措施：</strong>我们建立了严格的数据管理制度，对员工进行安全培训，签署保密协议，限制对个人信息的访问权限。</li>
                <li><strong>物理措施：</strong>我们的数据中心采用物理安全措施，如门禁系统、监控设备等，防止未经授权的物理访问。</li>
              </ul>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">数据安全提示</p>
                <p className="text-xf-medium text-sm">
                  请您注意，任何安全措施都无法做到绝对安全。我们建议您妥善保管您的账户信息，不要将密码透露给他人，定期更换密码，并在公共设备上使用后及时退出账户。如果您发现任何未经授权的访问或使用，请立即通知我们。
                </p>
              </div>
              
              <p>
                在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议等。我们会以邮件、短信、推送通知等方式告知您，难以逐一告知时我们会采取合理、有效的方式发布公告。
              </p>
            </div>
          </section>

          {/* 您的权利 */}
          <section id="your-rights" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">6. 您的权利</h2>
            
            <div className="policy-content space-y-6">
              <p>
                按照中国相关的法律法规，您在个人信息处理活动中享有以下权利，我们将依法保障您的权利：
              </p>
              
              <ul>
                <li><strong>知情权：</strong>您有权了解我们收集、使用您个人信息的目的、方式和范围。</li>
                <li><strong>选择权：</strong>您有权选择是否提供个人信息，以及是否同意我们使用您的个人信息。</li>
                <li><strong>查阅权：</strong>您有权查阅我们收集和存储的关于您的个人信息。</li>
                <li><strong>更正权：</strong>您有权要求我们更正不准确的个人信息。</li>
                <li><strong>删除权：</strong>在特定情况下，您有权要求我们删除您的个人信息。</li>
                <li><strong>撤回同意：</strong>您有权随时撤回对个人信息处理的同意。</li>
                <li><strong>注销账户：</strong>您有权注销您的账户，我们将删除或匿名化处理您的个人信息。</li>
              </ul>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">如何行使您的权利</p>
                <p className="text-xf-medium text-sm">
                  您可以通过以下方式行使您的权利：登录您的账户访问个人资料页面，或通过本隐私政策第10节提供的联系方式联系我们。我们将在收到您的请求后，在合理时间内（通常为15个工作日内）予以处理并回复。
                </p>
              </div>
              
              <p>
                在以下情况下，我们可能无法响应您的请求：
              </p>
              
              <ul>
                <li>与国家安全、国防安全直接相关的；</li>
                <li>与公共安全、公共卫生、重大公共利益直接相关的；</li>
                <li>与犯罪侦查、起诉、审判和判决执行等直接相关的；</li>
                <li>我们有充分证据表明您存在主观恶意或滥用权利的；</li>
                <li>响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；</li>
                <li>涉及商业秘密的。</li>
              </ul>
            </div>
          </section>

          {/* Cookie政策 */}
          <section id="cookies" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">7. Cookie政策</h2>
            
            <div className="policy-content space-y-6">
              <p>
                为确保网站正常运转，我们有时会在计算机或移动设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称以及一些号码和字符。借助于Cookie，网站能够存储您的偏好等数据。
              </p>
              
              <p>
                我们使用以下类型的Cookie：
              </p>
              
              <ul>
                <li><strong>绝对必要的Cookie：</strong>这些Cookie是网站运行所必需的，没有它们网站无法正常工作。它们通常仅在您执行特定操作时设置，例如登录账户、设置隐私偏好。</li>
                <li><strong>性能Cookie：</strong>这些Cookie收集关于您如何使用我们网站的信息，例如访问的页面、点击的链接等。这些信息帮助我们改进网站的性能和用户体验。</li>
                <li><strong>功能Cookie：</strong>这些Cookie记住您的选择和偏好，例如语言设置、地区设置等，以便在您下次访问时提供个性化的体验。</li>
                <li><strong>营销Cookie：</strong>这些Cookie用于向您展示相关的广告和内容。它们跟踪您的浏览习惯，并可能与第三方服务共享此信息。</li>
              </ul>
              
              <p>
                您可以通过浏览器设置管理或删除Cookie。请注意，禁用或删除Cookie可能会影响网站的某些功能。
              </p>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">Cookie设置</p>
                <p className="text-xf-medium text-sm">
                  大多数浏览器允许您查看和管理Cookie。您可以在浏览器的帮助菜单中找到相关说明。请注意，如果您删除了Cookie，您可能需要重新输入某些偏好设置。
                </p>
              </div>
            </div>
          </section>

          {/* 儿童隐私 */}
          <section id="children" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">8. 儿童隐私</h2>
            
            <div className="policy-content space-y-6">
              <p>
                我们非常重视儿童隐私保护。我们的服务主要面向成年用户。我们不会故意收集未满14周岁儿童的个人信息。
              </p>
              
              <p>
                如果我们发现无意中收集了儿童的个人信息，我们将立即采取措施删除该信息。如果您是家长或监护人，发现您的孩子向我们提供了个人信息，请立即联系我们，我们将采取适当措施。
              </p>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">家长指南</p>
                <p className="text-xf-medium text-sm">
                  我们建议家长和监护人积极参与儿童的在线活动，教育他们安全使用互联网。如果您对儿童的在线隐私有任何疑问，请随时联系我们。
                </p>
              </div>
            </div>
          </section>

          {/* 政策变更 */}
          <section id="changes" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">9. 本隐私政策的变更</h2>
            
            <div className="policy-content space-y-6">
              <p>
                我们可能会适时更新本隐私政策。更新后的政策将在我们网站上发布，并在发布时生效。我们会通过适当方式（如网站公告、邮件通知等）告知您重大变更。
              </p>
              
              <p>
                在您使用我们的服务时，本隐私政策的最新版本将适用于您。我们建议您定期查看本隐私政策，以了解我们如何保护您的信息。
              </p>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">变更通知</p>
                <p className="text-xf-medium text-sm">
                  如果我们对隐私政策进行重大变更，我们将在变更生效前至少30天通知您。您可以选择继续使用我们的服务（表示您接受更新后的政策），或者停止使用我们的服务。
                </p>
              </div>
            </div>
          </section>

          {/* 联系我们 */}
          <section id="contact" className="policy-section mb-16">
            <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">10. 如何联系我们</h2>
            
            <div className="policy-content space-y-6">
              <p>
                如果您对本隐私政策有任何疑问、意见或建议，或者需要行使您的权利，请通过以下方式联系我们：
              </p>
              
              <ul>
                <li><strong>电子邮件：</strong>privacy@xiangfeng.com</li>
                <li><strong>邮寄地址：</strong>中国北京市朝阳区XX路XX号XX大厦XX层 相逢科技有限公司 法务部 收</li>
                <li><strong>在线表单：</strong>您也可以通过我们的联系表单提交您的请求</li>
              </ul>
              
              <p>
                我们将在收到您的联系后，在合理时间内（通常为15个工作日内）予以处理并回复。
              </p>
              
              <div className="policy-note">
                <p className="font-medium text-xf-dark mb-1">数据保护官</p>
                <p className="text-xf-medium text-sm">
                  如果您认为我们对您个人信息的处理违反了适用的数据保护法律，您有权向相关监管机构投诉。我们指定了数据保护官，您可以通过上述联系方式与数据保护官联系。
                </p>
              </div>
            </div>
          </section>

          {/* 返回按钮 */}
          <div className="mt-12 pt-8 border-t border-xf-bg/30 no-print">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98"
            >
              返回首页
            </Link>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}
