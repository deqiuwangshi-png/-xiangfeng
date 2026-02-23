import Link from 'next/link'
import { Clock, FileText, AlertTriangle, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import '@/styles/domains/terms.css'
import Navbar from '@/components/marketing/Navbar'

export const metadata: Metadata = {
  title: '服务条款 - 相逢 Xiangfeng',
  description: '欢迎使用相逢平台！请仔细阅读本服务条款，这些条款规定了您使用相逢服务（包括网站、移动应用及相关服务）的权利和义务。',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 左侧导航 */}
          <aside className="lg:w-1/4 no-print">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-bold text-xf-accent mb-6 font-serif">条款导航</h3>
              <nav className="space-y-4">
                <a href="#introduction" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">引言与接受</a>
                <a href="#account" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">账户与注册</a>
                <a href="#services" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">服务描述</a>
                <a href="#user-conduct" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">用户行为准则</a>
                <a href="#content" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">内容政策</a>
                <a href="#intellectual-property" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">知识产权</a>
                <a href="#privacy" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">隐私与数据</a>
                <a href="#disclaimer" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">免责声明</a>
                <a href="#limitation" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">责任限制</a>
                <a href="#termination" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">账户终止</a>
                <a href="#disputes" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">争议解决</a>
                <a href="#general" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">一般条款</a>
                <a href="#contact" className="side-nav-item block text-xf-primary hover:text-xf-accent transition-colors">联系我们</a>
              </nav>

              <div className="mt-10 pt-6 border-t border-xf-bg/30">
                <div className="flex items-center gap-3 text-sm text-xf-primary mb-2">
                  <Clock className="w-4 h-4" />
                  <span>最后更新：2025年12月30日</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-xf-primary">
                  <FileText className="w-4 h-4" />
                  <span>阅读时间：约12分钟</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-xf-light rounded-xl">
                <h4 className="text-sm font-bold text-xf-primary mb-2">相关文档</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="flex items-center gap-2 text-sm text-xf-info hover:text-xf-accent transition-colors">
                    <span>隐私政策</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* 右侧主要内容 */}
          <main className="lg:w-3/4">
            {/* 页眉 */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-xf-light/80 backdrop-blur-sm rounded-full mb-6">
                <FileText className="w-4 h-4 text-xf-primary" />
                <span className="text-sm font-medium text-xf-primary">法律条款</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-xf-accent mb-6">相逢服务条款</h1>
              <p className="text-lg text-xf-medium leading-relaxed">
                欢迎使用相逢平台！请仔细阅读本服务条款，这些条款规定了您使用相逢服务（包括网站、移动应用及相关服务）的权利和义务。使用我们的服务即表示您同意这些条款。
              </p>
            </div>

            {/* 重要提示 */}
            <div className="terms-warning mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-xf-warning" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-xf-dark mb-2">重要法律通知</h4>
                  <p className="text-xf-medium">
                    本服务条款是您与相逢之间具有法律约束力的协议。使用我们的服务前，请仔细阅读并理解所有条款。特别是免责声明、责任限制和争议解决部分。如果您不同意这些条款，请勿使用我们的服务。
                  </p>
                </div>
              </div>
            </div>

            {/* 引言与接受 */}
            <section id="introduction" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">1. 引言与接受条款</h2>

              <div className="terms-content space-y-6">
                <p>
                  相逢（以下简称&quot;我们&quot;、&quot;平台&quot;或&quot;服务&quot;）由上海相逢科技有限公司运营。本服务条款（以下简称“条款”）规定了您访问和使用相逢网站、移动应用程序及所有相关服务（统称&quot;服务&quot;）的条款和条件。
                </p>

                <div className="important-clause">
                  <p className="font-bold text-xf-accent mb-2">重要：接受条款</p>
                  <p className="text-xf-medium">
                    通过访问或使用我们的服务，您确认您已阅读、理解并同意受本条款的约束。如果您代表公司或其他法律实体接受这些条款，您声明您有权使该实体受这些条款约束。如果您不同意这些条款，请不要使用我们的服务。
                  </p>
                </div>

                <p>
                  我们保留随时修改这些条款的权利。如果我们进行更改，我们将在本页面上发布更新后的条款，并更新&quot;最后更新&quot;日期。您继续使用服务即表示您接受更新后的条款。我们建议您定期查看本页面以了解任何更改。
                </p>

                <p>
                  如果您未满18岁，您需要获得父母或监护人的同意才能使用我们的服务。在某些司法管辖区，使用我们服务的法定年龄可能更高，您有责任确保您符合当地法律要求。
                </p>
              </div>
            </section>

            {/* 账户与注册 */}
            <section id="account" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">2. 账户与注册</h2>

              <div className="terms-content space-y-6">
                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.1 账户创建</h3>

                <p>
                  要使用某些服务功能，您需要注册一个相逢账户。您同意：
                </p>

                <ul>
                  <li>提供准确、真实、完整和最新的注册信息；</li>
                  <li>维护并及时更新您的账户信息，以保持其准确性；</li>
                  <li>对您账户下发生的所有活动负责；</li>
                  <li>对您的密码保密，并对使用您密码访问服务的行为负责；</li>
                  <li>立即通知我们任何未经授权使用您账户或任何其他安全漏洞的行为。</li>
                </ul>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.2 账户安全</h3>

                <p>
                  您有责任维护您账户的安全。我们建议您：
                </p>

                <ul>
                  <li>使用强密码（包含大写字母、小写字母、数字和符号的组合）；</li>
                  <li>定期更改密码；</li>
                  <li>不在多个网站使用相同密码；</li>
                  <li>启用双因素身份验证（如可用）。</li>
                </ul>

                <div className="terms-note">
                  <p className="font-medium text-xf-dark mb-1">账户责任</p>
                  <p className="text-xf-medium text-sm">
                    您对您账户下发生的所有活动负责，无论该活动是否由您本人进行。如果您发现任何未经授权的访问，请立即通知我们。
                  </p>
                </div>
              </div>
            </section>

            {/* 服务描述 */}
            <section id="services" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">3. 服务描述</h2>

              <div className="terms-content space-y-6">
                <p>
                  相逢是一个内容创作和社交平台，提供以下服务：
                </p>

                <ul>
                  <li><strong>内容发布：</strong>创建和发布文章、笔记、评论等内容；</li>
                  <li><strong>社交互动：</strong>关注其他用户、点赞、评论、分享内容；</li>
                  <li><strong>内容发现：</strong>浏览和发现感兴趣的内容和创作者；</li>
                  <li><strong>个性化推荐：</strong>基于您的兴趣和行为获得个性化内容推荐；</li>
                  <li><strong>数据分析：</strong>查看您的内容表现数据和用户互动数据。</li>
                </ul>

                <div className="terms-note">
                  <p className="font-medium text-xf-dark mb-1">服务变更</p>
                  <p className="text-xf-medium text-sm">
                    我们保留随时修改、暂停或终止任何服务的权利，恕不另行通知。我们不对服务的可用性、及时性、准确性或完整性做出任何保证。
                  </p>
                </div>
              </div>
            </section>

            {/* 用户行为准则 */}
            <section id="user-conduct" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">4. 用户行为准则</h2>

              <div className="terms-content space-y-6">
                <p>
                  使用我们的服务时，您同意遵守以下行为准则：
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">4.1 禁止行为</h3>

                <p>
                  您不得使用服务进行以下行为：
                </p>

                <ul>
                  <li>发布或传输任何非法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容；</li>
                  <li>冒充任何个人或实体，或歪曲您与任何个人或实体的关系；</li>
                  <li>伪造标题或以其他方式操纵标识，以掩盖通过服务传输的任何内容的来源；</li>
                  <li>未经授权访问或使用服务或任何连接到服务的系统或网络；</li>
                  <li>干扰或破坏服务或连接到服务的任何服务器或网络；</li>
                  <li>发布或传输任何病毒、木马、蠕虫或其他恶意代码；</li>
                  <li>收集或存储其他用户的个人数据；</li>
                  <li>使用服务进行任何商业目的，未经我们事先书面同意；</li>
                  <li>违反任何适用的当地、州、国家或国际法律或法规。</li>
                </ul>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">4.2 违规处理</h3>

                <p>
                  如果我们确定您违反了本条款或适用法律，我们保留暂停或终止您账户的权利，恕不另行通知。
                </p>
              </div>
            </section>

            {/* 内容政策 */}
            <section id="content" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">5. 内容政策</h2>

              <div className="terms-content space-y-6">
                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">5.1 用户内容</h3>

                <p>
                  您对您在服务上发布、上传或以其他方式提供的所有内容（以下简称&quot;用户内容&quot;）承担全部责任。您声明并保证：
                </p>

                <ul>
                  <li>您拥有用户内容或拥有发布用户内容所需的所有权利、许可和许可；</li>
                  <li>用户内容不违反任何适用的法律或法规；</li>
                  <li>用户内容不侵犯任何第三方的知识产权或其他权利；</li>
                  <li>用户内容不包含任何病毒、恶意软件或其他有害代码。</li>
                </ul>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">5.2 内容许可</h3>

                <p>
                  通过发布用户内容，您授予我们全球性、非独占、免版税、可转让的许可，以使用、复制、修改、显示、分发和创建用户内容的衍生作品，以提供、改进和推广我们的服务。
                </p>

                <div className="terms-note">
                  <p className="font-medium text-xf-dark mb-1">内容删除</p>
                  <p className="text-xf-medium text-sm">
                    我们保留随时删除或屏蔽任何违反本条款或适用法律的任何用户内容的权利，恕不另行通知。
                  </p>
                </div>
              </div>
            </section>

            {/* 知识产权 */}
            <section id="intellectual-property" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">6. 知识产权</h2>

              <div className="terms-content space-y-6">
                <p>
                  服务及其原始内容、功能和设计是相逢及其许可方的专有财产，受版权、商标和其他知识产权法的保护。
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">6.1 平台内容</h3>

                <p>
                  除非获得我们事先书面同意，否则您不得复制、修改、分发、展示、执行、发布、许可、创建衍生作品、转让或出售服务或其任何部分。
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">6.2 商标</h3>

                <p>
                  &quot;相逢&quot;、&quot;Xiangfeng&quot;以及我们的产品和服务名称、徽标、标语和品牌标识是相逢的商标。未经我们事先书面同意，您不得使用我们的商标。
                </p>
              </div>
            </section>

            {/* 隐私与数据 */}
            <section id="privacy" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">7. 隐私与数据</h2>

              <div className="terms-content space-y-6">
                <p>
                  您对个人信息的收集和使用受我们的隐私政策管辖。使用我们的服务即表示您同意按照我们的隐私政策收集和使用您的信息。
                </p>

                <p>
                  请查看我们的<Link href="/privacy" className="text-xf-info hover:text-xf-accent transition-colors">隐私政策</Link>以了解我们如何收集、使用和保护您的个人信息。
                </p>

                <div className="terms-note">
                  <p className="font-medium text-xf-dark mb-1">数据保护</p>
                  <p className="text-xf-medium text-sm">
                    我们采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。
                  </p>
                </div>
              </div>
            </section>

            {/* 免责声明 */}
            <section id="disclaimer" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">8. 免责声明</h2>

              <div className="terms-content space-y-6">
                <p>
                  服务按&quot;现状&quot;和&quot;可用&quot;基础提供，不提供任何明示或暗示的保证，包括但不限于：
                </p>

                <ul>
                  <li>服务将不间断、及时、安全或无错误的保证；</li>
                  <li>服务缺陷将被更正的保证；</li>
                  <li>服务或提供服务的服务器没有病毒或其他有害成分的保证；</li>
                  <li>通过服务获得的结果的准确性或可靠性的保证；</li>
                  <li>通过服务获得的任何信息或材料的准确性、可靠性或完整性的保证。</li>
                </ul>

                <p>
                  通过服务下载或以其他方式获得的任何材料均由您自行决定并承担风险，对于因下载此类材料而对您的计算机系统或其他设备造成的任何损坏，您将承担全部责任。
                </p>
              </div>
            </section>

            {/* 责任限制 */}
            <section id="limitation" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">9. 责任限制</h2>

              <div className="terms-content space-y-6">
                <p>
                  在适用法律允许的最大范围内，相逢及其董事、员工、合作伙伴、代理人、供应商或关联公司不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据丢失、商誉损失或其他无形损失，无论是否被告知此类损害的可能性。
                </p>

                <div className="important-clause">
                  <p className="font-bold text-xf-accent mb-2">责任限额</p>
                  <p className="text-xf-medium">
                    在任何情况下，相逢对您的全部责任不得超过您在过去12个月内为服务支付的金额总额。
                  </p>
                </div>

                <p>
                  某些司法管辖区不允许排除或限制间接或后果性损害的责任，因此上述排除或限制可能不适用于您。
                </p>
              </div>
            </section>

            {/* 账户终止 */}
            <section id="termination" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">10. 账户终止</h2>

              <div className="terms-content space-y-6">
                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">10.1 用户终止</h3>

                <p>
                  您可以随时通过账户设置或联系我们来终止您的账户。终止后，您将失去对账户和所有相关内容的访问权限。
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">10.2 平台终止</h3>

                <p>
                  我们保留随时暂停或终止您对服务的访问的权利，无论是否通知，原因包括但不限于：
                </p>

                <ul>
                  <li>您违反了本条款；</li>
                  <li>我们无法验证您提供的任何信息；</li>
                  <li>我们怀疑您从事欺诈或非法活动；</li>
                  <li>服务需要长期中断或重大变更。</li>
                </ul>

                <div className="terms-note">
                  <p className="font-medium text-xf-dark mb-1">终止后数据</p>
                  <p className="text-xf-medium text-sm">
                    终止后，我们可能会保留您的某些信息，以履行我们的法律义务、解决争议或执行我们的协议。
                  </p>
                </div>
              </div>
            </section>

            {/* 争议解决 */}
            <section id="disputes" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">11. 争议解决</h2>

              <div className="terms-content space-y-6">
                <p>
                  如果您与相逢之间发生任何争议、索赔或争议，您同意首先尝试通过友好协商解决争议。
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">11.1 适用法律</h3>

                <p>
                  本条款受中华人民共和国法律管辖并依其解释，不考虑其法律冲突原则。
                </p>

                <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">11.2 争议解决</h3>

                <p>
                  任何因本条款引起或与其相关的争议，应通过协商解决。协商不成的，任何一方均可向相逢所在地有管辖权的人民法院提起诉讼。
                </p>
              </div>
            </section>

            {/* 一般条款 */}
            <section id="general" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">12. 一般条款</h2>

              <div className="terms-content space-y-6">
                <p>
                  本条款构成您与相逢之间关于服务的完整协议，并取代您与相逢之间关于服务的所有先前协议和谅解。
                </p>

                <ul>
                  <li><strong>可分割性：</strong>如果本条款的任何条款被认定为不可执行或无效，该条款应在最大程度上可执行，其余条款将继续完全有效。</li>
                  <li><strong>弃权：</strong>我们未能执行本条款的任何权利或条款不构成对该权利或条款的弃权。</li>
                  <li><strong>转让：</strong>未经我们事先书面同意，您不得转让本条款。我们可以在未经您同意的情况下转让本条款。</li>
                  <li><strong>完整协议：</strong>本条款构成您与相逢之间关于服务的完整协议。</li>
                </ul>
              </div>
            </section>

            {/* 联系我们 */}
            <section id="contact" className="terms-section mb-16">
              <h2 className="text-3xl font-serif font-bold text-xf-accent mb-8">13. 联系我们</h2>

              <div className="terms-content space-y-6">
                <p>
                  如果您对这些服务条款有任何疑问、意见或建议，请通过以下方式与我们联系：
                </p>

                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-bold text-xf-dark mb-6">联系信息</h4>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center shrink-0">
                            <Mail className="w-6 h-6 text-xf-info" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xf-dark mb-1">条款相关咨询</h5>
                            <p className="text-xf-medium">legal@xiangfeng.com</p>
                            <p className="text-sm text-xf-medium mt-1">专门处理法律条款相关咨询</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-xf-light flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-xf-primary" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xf-dark mb-1">邮寄地址</h5>
                            <p className="text-xf-medium">上海市静安区安福路288号</p>
                            <p className="text-sm text-xf-medium mt-1">创新中心3楼，邮编：200040</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-xf-dark mb-6">其他联系渠道</h4>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-bold text-xf-dark mb-2">一般支持</h5>
                          <p className="text-xf-medium">support@xiangfeng.com</p>
                          <p className="text-sm text-xf-medium mt-1">处理账户、技术和服务问题</p>
                        </div>

                        <div>
                          <h5 className="font-bold text-xf-dark mb-2">联系电话</h5>
                          <p className="text-xf-medium">+86 21 1234 5678</p>
                          <p className="text-sm text-xf-medium mt-1">工作日 9:00-18:00</p>
                        </div>

                        <div>
                          <h5 className="font-bold text-xf-dark mb-2">工作时间</h5>
                          <p className="text-xf-medium">周一至周五 9:00-18:00</p>
                          <p className="text-sm text-xf-medium mt-1">周末及节假日休息</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  我们将在收到您的询问后尽快回复您。对于复杂的法律问题，我们可能需要更多时间来研究和回复。
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}
