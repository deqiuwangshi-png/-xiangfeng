/**
 * 隐私政策页面
 * 详细说明平台的隐私保护政策
 */

import { NavBar } from '@/components/layout/NavBar';
import { SideNav } from '@/components/layout/SideNav';
import { 
  TermsSection, 
  TermsWarning, 
  ImportantClause, 
  TermsNote, 
  ActionCard, 
  TermsTable 
} from '@/components/ui';
import { Shield, Clock, FileText, Lock, Server, RefreshCw, Mail, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-xf-light text-xf-dark antialiased font-sans selection:bg-xf-soft/50 min-h-screen">
      {/* 导航栏 */}
      <NavBar activePage="privacy" />

      {/* 页面内容 */}
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
                  <span>最后更新：2026年1月3日</span>
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
            <TermsWarning title="重要提示">
              请您在使用我们的产品和服务前，仔细阅读并理解本隐私政策的全部内容。当您开始使用相逢时，即表示您已阅读、理解并同意本隐私政策的全部条款。如果您不同意本隐私政策的任何内容，请立即停止使用我们的服务。
            </TermsWarning>

            {/* 引言 */}
            <TermsSection id="introduction" title="1. 引言">
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
              
              <TermsNote title="适用范围">
                本隐私政策适用于相逢平台的所有产品和服务。但某些特定产品或服务可能有独立的隐私政策，该等独立的隐私政策将优先于本隐私政策。如果特定产品或服务的隐私政策与本隐私政策有不一致之处，则以该特定隐私政策为准。
              </TermsNote>
            </TermsSection>

            {/* 信息收集 */}
            <TermsSection id="data-collection" title="2. 我们如何收集您的信息">
              <p>
                我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息。您在使用我们的服务时，我们可能会收集下列信息：
              </p>
              
              <h3>2.1 您直接提供的信息</h3>
              
              <ul>
                <li><strong>账户信息：</strong>当您注册相逢账户时，我们会收集您的电子邮箱地址、用户名和密码。</li>
                <li><strong>个人资料信息：</strong>您可以选择提供个人资料信息，如头像、昵称、个人简介、兴趣标签等。</li>
                <li><strong>内容信息：</strong>您在使用相逢服务时创建、发布或分享的内容，包括文章、评论、笔记、收藏等。</li>
                <li><strong>联系信息：</strong>当您联系我们或参与活动时，可能会提供您的姓名、电子邮件地址或其他联系方式。</li>
              </ul>
              
              <h3>2.2 我们在您使用服务过程中收集的信息</h3>
              
              <ul>
                <li><strong>设备信息：</strong>我们可能会收集您使用的设备相关信息，如设备型号、操作系统、唯一设备标识符、IP地址、移动网络信息等。</li>
                <li><strong>日志信息：</strong>当您使用我们的服务时，我们可能会自动收集某些信息并存储在日志中，包括服务使用信息、搜索查询、IP地址、浏览器类型和语言、访问日期和时间等。</li>
                <li><strong>位置信息：</strong>当您使用某些基于位置的服务时，我们可能会收集和处理有关您实际位置的信息（在获得您的同意后）。</li>
                <li><strong>使用数据：</strong>我们收集关于您如何使用我们服务的数据，如访问的页面、点击的链接、浏览时间、搜索查询等。</li>
              </ul>
              
              <h3>2.3 我们从第三方获得的信息</h3>
              
              <p>
                我们可能会从第三方服务获取信息，例如当您使用第三方账户登录相逢时，我们可能会从该第三方服务获得您的账户信息（需您授权）。我们仅会收集实现产品功能所必要的第三方信息。
              </p>
              
              <TermsNote title="敏感个人信息">
                相逢不主动收集您的敏感个人信息（如种族、宗教信仰、个人健康状况等）。如果您选择在内容中分享此类信息，请知悉这些信息可能会被公开，请谨慎考虑。
              </TermsNote>
            </TermsSection>

            {/* 信息使用 */}
            <TermsSection id="data-use" title="3. 我们如何使用您的信息">
              <p>
                我们严格遵守法律法规的规定及与用户的约定，将收集的信息用于以下用途。若我们超出以下用途使用您的信息，我们将再次向您进行说明，并征得您的同意。
              </p>
              
              <TermsTable 
                columns={[
                  { header: '使用目的', accessor: 'purpose' },
                  { header: '具体说明', accessor: 'description' },
                  { header: '涉及的信息类型', accessor: 'dataType' }
                ]} 
                rows={[
                  { 
                    purpose: '提供服务', 
                    description: '创建和管理您的账户，提供核心功能如内容发布、社群互动等', 
                    dataType: '账户信息、个人资料信息、内容信息' 
                  },
                  { 
                    purpose: '改善用户体验', 
                    description: '个性化内容推荐、优化界面设计、改进产品功能', 
                    dataType: '使用数据、设备信息、日志信息' 
                  },
                  { 
                    purpose: '安全保障', 
                    description: '验证用户身份、检测和防范欺诈行为、保障账户安全', 
                    dataType: '设备信息、日志信息、IP地址' 
                  },
                  { 
                    purpose: '沟通与服务', 
                    description: '发送服务通知、回应您的咨询、提供客户支持', 
                    dataType: '联系信息、账户信息' 
                  },
                  { 
                    purpose: '研究与分析', 
                    description: '分析用户行为趋势、进行产品研究、生成统计信息', 
                    dataType: '使用数据、日志信息（匿名化处理）' 
                  },
                  { 
                    purpose: '法律合规', 
                    description: '遵守法律法规要求、响应执法要求、执行服务条款', 
                    dataType: '根据具体法律要求而定' 
                  }
                ]} 
              />
              
              <TermsNote title="个性化推荐">
                我们可能会使用您的使用数据为您提供个性化的内容推荐。您可以在账户设置中随时调整个性化推荐偏好或关闭个性化推荐功能。
              </TermsNote>
              
              <p>
                我们承诺，我们不会将您的个人信息用于以下用途：
              </p>
              
              <ul>
                <li>用于与提供服务无关的目的</li>
                <li>未经您明确同意的营销活动</li>
                <li>出售、出租或交易您的个人信息</li>
                <li>任何违反法律法规或社会公德的行为</li>
              </ul>
            </TermsSection>

            {/* 信息共享 */}
            <TermsSection id="data-sharing" title="4. 我们如何共享、转让、公开披露您的信息">
              <h3>4.1 共享</h3>
              
              <p>
                我们不会与相逢以外的任何公司、组织和个人共享您的个人信息，但以下情况除外：
              </p>
              
              <ul>
                <li><strong>获得您的明确同意：</strong>在获得您的明确同意后，我们会与其他方共享您的信息。</li>
                <li><strong>与服务提供商共享：</strong>我们可能会与为我们提供服务的第三方共享信息，例如云服务提供商、数据分析服务商等。这些服务提供商只能访问提供服务所必要的信息，并且有义务保护您的信息安全。</li>
                <li><strong>基于法律要求：</strong>在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会共享您的个人信息。</li>
                <li><strong>保护合法权益：</strong>为保护相逢、用户或公众的合法权益免遭损害，我们可能会共享必要的信息。</li>
              </ul>
              
              <h3>4.2 转让</h3>
              
              <p>
                我们不会将您的个人信息转让给任何公司、组织或个人，但以下情况除外：
              </p>
              
              <ul>
                <li>获得您的明确同意后；</li>
                <li>在涉及合并、收购或破产清算时，如涉及个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。</li>
              </ul>
              
              <h3>4.3 公开披露</h3>
              
              <p>
                我们仅会在以下情况下，公开披露您的个人信息：
              </p>
              
              <ul>
                <li>获得您明确同意后；</li>
                <li>基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息。</li>
              </ul>
              
              <TermsNote title="公开信息">
                请注意，您在相逢上公开发布的内容（如文章、评论等）可能会被其他用户查看、收集和使用。请谨慎考虑您在公开区域披露的个人信息。对于您选择公开分享的信息，其他用户可能会阅读、收集或使用这些信息。
              </TermsNote>
            </TermsSection>

            {/* 数据安全 */}
            <TermsSection id="data-security" title="5. 我们如何保护您的信息安全">
              <p>
                我们高度重视您的信息安全，并采取一切合理可行的措施保护您的个人信息：
              </p>
              
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-xf-accent/10 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5 text-xf-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xf-dark mb-1">数据加密</h4>
                        <p className="text-sm text-xf-medium">我们使用行业标准的加密技术保护数据传输和存储安全。</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-xf-info/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-xf-info" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xf-dark mb-1">访问控制</h4>
                        <p className="text-sm text-xf-medium">我们对员工进行严格的权限管理，仅允许有必要知晓的人员访问个人信息。</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-xf-primary/10 flex items-center justify-center flex-shrink-0">
                        <Server className="w-5 h-5 text-xf-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xf-dark mb-1">安全基础设施</h4>
                        <p className="text-sm text-xf-medium">我们使用可靠的安全服务提供商，并定期进行安全评估和渗透测试。</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-xf-success/10 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-5 h-5 text-xf-success" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xf-dark mb-1">持续监控</h4>
                        <p className="text-sm text-xf-medium">我们建立了安全事件应急响应机制，并定期进行安全审计。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p>
                尽管我们已经采取了上述合理有效措施保护您的个人信息，但互联网环境并非100%安全。我们强烈建议您采取积极措施保护个人信息安全，包括：
              </p>
              
              <ul>
                <li>使用复杂的密码，并定期更换密码</li>
                <li>使用不同的密码用于不同的在线账户</li>
                <li>在使用公共设备或公共Wi-Fi时谨慎操作</li>
                <li>不向任何人透露您的登录凭证</li>
              </ul>
              
              <p>
                如果发生个人信息安全事件，我们将按照法律法规的要求，及时向您告知安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可采取的防范措施等。如果难以逐一告知，我们将通过公告等方式发布警示信息。
              </p>
            </TermsSection>

            {/* 您的权利 */}
            <TermsSection id="your-rights" title="6. 您如何管理您的信息">
              <p>
                按照中国相关的法律法规和标准，我们保障您对自己的个人信息行使以下权利：
              </p>
              
              <TermsTable 
                columns={[
                  { header: '权利', accessor: 'right' },
                  { header: '具体内容', accessor: 'content' },
                  { header: '如何行使', accessor: 'exercise' }
                ]} 
                rows={[
                  { 
                    right: '访问权', 
                    content: '您有权访问您的个人信息，法律法规规定的例外情况除外', 
                    exercise: '通过账户设置页面查看您的个人信息' 
                  },
                  { 
                    right: '更正权', 
                    content: '当您发现我们处理的关于您的个人信息有错误时，您有权要求我们做出更正', 
                    exercise: '在账户设置中直接修改个人信息' 
                  },
                  { 
                    right: '删除权', 
                    content: '在特定情形下，您有权要求我们删除您的个人信息', 
                    exercise: '通过账户设置或联系我们申请删除' 
                  },
                  { 
                    right: '撤回同意权', 
                    content: '您有权随时撤回您对个人信息处理的同意', 
                    exercise: '通过账户设置调整隐私设置' 
                  },
                  { 
                    right: '账户注销权', 
                    content: '您有权注销您的相逢账户', 
                    exercise: '通过账户设置申请注销账户' 
                  },
                  { 
                    right: '获取副本权', 
                    content: '您有权获取您的个人信息副本', 
                    exercise: '通过联系我们获取个人信息副本' 
                  }
                ]} 
              />
              
              <TermsNote title="账户注销说明">
                当您申请注销账户时，我们将对您的身份进行验证，并在确认后为您注销账户。账户注销后，我们将停止为您提供产品和服务，并根据适用法律的要求删除您的个人信息或进行匿名化处理。请注意，账户注销是不可逆的操作，账户一旦注销将无法恢复。
              </TermsNote>
              
              <p>
                对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段、给他人合法权益带来风险或者非常不切实际的请求，我们可能会予以拒绝。
              </p>
              
              <p>
                在以下情形中，按照法律法规要求，我们将无法响应您的请求：
              </p>
              
              <ul>
                <li>与国家安全、国防安全直接相关的；</li>
                <li>与公共安全、公共卫生、重大公共利益直接相关的；</li>
                <li>与犯罪侦查、起诉、审判和判决执行等直接相关的；</li>
                <li>有充分证据表明您存在主观恶意或滥用权利的；</li>
                <li>响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；</li>
                <li>涉及商业秘密的。</li>
              </ul>
            </TermsSection>

            {/* Cookie政策 */}
            <TermsSection id="cookies" title="7. Cookie和同类技术">
              <p>
                为确保网站正常运转、为您获得更轻松的访问体验，我们会在您的设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称以及一些号码和字符。借助于Cookie，网站能够存储您的偏好等数据。
              </p>
              
              <p>
                我们使用Cookie的目的包括：
              </p>
              
              <ul>
                <li><strong>必要Cookie：</strong>这些Cookie对于网站运行是必不可少的，它们使您能够在网站中移动并使用其功能。</li>
                <li><strong>偏好Cookie：</strong>这些Cookie使网站能够记住您的选择（如用户名、语言或地区），从而提供增强的、更个性化的功能。</li>
                <li><strong>统计Cookie：</strong>这些Cookie帮助我们了解访问者如何与网站互动，从而改进网站功能。</li>
                <li><strong>营销Cookie：</strong>这些Cookie用于跟踪您在不同网站上的活动，以便向您展示更相关的广告。</li>
              </ul>
              
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-xf-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-xf-dark mb-2">Cookie管理</h4>
                    <p className="text-xf-medium mb-3">
                      您可以通过浏览器设置管理或删除Cookie。大多数浏览器会自动接受Cookie，但您通常可以根据自己的需要修改浏览器设置以拒绝Cookie。请注意，如果您选择拒绝Cookie，您可能无法完全体验我们网站提供的全部功能。
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="px-4 py-2 bg-xf-light hover:bg-xf-bg text-xf-primary rounded-lg text-sm font-medium transition-all">
                        Chrome设置指南
                      </a>
                      <a href="#" className="px-4 py-2 bg-xf-light hover:bg-xf-bg text-xf-primary rounded-lg text-sm font-medium transition-all">
                        Safari设置指南
                      </a>
                      <a href="#" className="px-4 py-2 bg-xf-light hover:bg-xf-bg text-xf-primary rounded-lg text-sm font-medium transition-all">
                        Firefox设置指南
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <p>
                除了Cookie，我们还可能使用网站信标、像素标签等同类技术来收集您使用我们服务的信息，用于分析您使用我们服务的情况、优化广告效果等。
              </p>
            </TermsSection>

            {/* 儿童隐私 */}
            <TermsSection id="children" title="8. 儿童隐私">
              <p>
                我们非常重视儿童的隐私保护。根据相关法律法规，我们认为14周岁以下的用户为儿童。
              </p>
              
              <TermsNote title="特别提示">
                相逢主要面向成年人，不直接面向儿童提供服务。我们不会在知情的情况下收集14周岁以下儿童的个人信息。如果您是儿童的父母或监护人，并且您认为您的孩子向我们提供了个人信息，请通过本政策中提供的联系方式与我们联系，我们将尽快删除相关数据。
              </TermsNote>
              
              <p>
                如果我们发现自己在未事先获得可证实的父母同意的情况下收集了儿童的个人信息，则会设法尽快删除相关数据。
              </p>
            </TermsSection>

            {/* 政策变更 */}
            <TermsSection id="changes" title="9. 本隐私政策如何更新">
              <p>
                我们的隐私政策可能变更。未经您明确同意，我们不会削减您按照本隐私政策所应享有的权利。
              </p>
              
              <p>
                我们会在本页面上发布对本隐私政策所做的任何变更。对于重大变更，我们还会提供更为显著的通知（包括对于某些服务，我们会通过电子邮件发送通知，说明隐私政策的具体变更内容）。
              </p>
              
              <p>
                本政策所指的重大变更包括但不限于：
              </p>
              
              <ul>
                <li>我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；</li>
                <li>我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；</li>
                <li>个人信息共享、转让或公开披露的主要对象发生变化；</li>
                <li>您参与个人信息处理方面的权利及其行使方式发生重大变化；</li>
                <li>我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；</li>
                <li>个人信息安全影响评估报告表明存在高风险时。</li>
              </ul>
              
              <p>
                我们还会将本隐私政策的旧版本存档，供您查阅。如果您不同意更新后的隐私政策，您有权停止使用我们的服务。如果您继续使用我们的服务，则视为您接受更新后的隐私政策。
              </p>
            </TermsSection>

            {/* 联系我们 */}
            <TermsSection id="contact" title="10. 如何联系我们">
              <p>
                如果您对本隐私政策有任何疑问、意见或建议，或者您想要行使您的个人信息权利，请通过以下方式与我们联系：
              </p>
              
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-xf-dark mb-6">联系信息</h4>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-xf-info" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xf-dark mb-1">邮箱地址</h5>
                          <p className="text-xf-medium">privacy@xiangfeng.com</p>
                          <p className="text-sm text-xf-medium mt-1">专门处理隐私相关咨询</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-xf-primary" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xf-dark mb-1">邮寄地址</h5>
                          <p className="text-xf-medium">上海市静安区安福路288号</p>
                          <p className="text-sm text-xf-medium mt-1">创新中心3楼，邮编：200040</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-xf-accent" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xf-dark mb-1">响应时间</h5>
                          <p className="text-xf-medium">我们将在15个工作日内回复</p>
                          <p className="text-sm text-xf-medium mt-1">对于复杂请求，可能会需要更长时间</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-xf-dark mb-6">数据保护官</h4>
                    
                    <div className="bg-gradient-to-br from-xf-accent/5 to-xf-primary/5 rounded-xl p-6">
                      <p className="text-xf-medium mb-4">
                        我们已任命数据保护官（DPO）负责监督我们的隐私保护工作。如果您对我们的个人信息处理活动有任何疑问或担忧，可以直接联系我们的数据保护官：
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-xf-accent"></div>
                          <span className="text-xf-medium">电子邮箱：dpo@xiangfeng.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-xf-accent"></div>
                          <span className="text-xf-medium">电话：400-123-4567 转 801</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-white rounded-2xl shadow-soft">
                <h4 className="text-lg font-bold text-xf-accent mb-4">最后更新</h4>
                <p className="text-xf-medium">本隐私政策最后更新于2026年1月3日，自该日起生效。</p>
              </div>
            </TermsSection>
          </main>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white py-12 mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-lg rotate-12 opacity-90"></div>
                <span className="font-serif text-xl font-bold text-white">相逢</span>
              </div>
              <p className="text-gray-300">连接创作者，分享知识，激发灵感</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">产品</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/features" className="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">定价</a></li>
                <li><a href="/integrations" className="hover:text-white transition-colors">集成服务</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">公司</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/about" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">招聘信息</a></li>
                <li><a href="/press" className="hover:text-white transition-colors">新闻动态</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">支持</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/help" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">服务状态</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2026 相逢科技有限公司. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}