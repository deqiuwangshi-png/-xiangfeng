/**
 * 服务条款页面
 * 详细说明平台的服务条款和条件
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
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-xf-light text-xf-dark antialiased font-sans selection:bg-xf-soft/50 min-h-screen">
      {/* 导航栏 */}
      <NavBar activePage="terms" />

      {/* 页面内容 */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 左侧导航 */}
          <SideNav activeSection="introduction" />

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
            <TermsWarning title="重要法律通知">
              本服务条款是您与相逢之间具有法律约束力的协议。使用我们的服务前，请仔细阅读并理解所有条款。特别是免责声明、责任限制和争议解决部分。如果您不同意这些条款，请勿使用我们的服务。
            </TermsWarning>

            {/* 引言与接受 */}
            <TermsSection id="introduction" title="1. 引言与接受">
              <p>
                相逢（以下简称"我们"、"平台"或"服务"）由上海相逢科技有限公司运营。本服务条款（以下简称"条款"）规定了您访问和使用相逢网站（<a href="https://xiangfeng.com" className="text-xf-info hover:text-xf-accent">https://xiangfeng.com</a>）、移动应用程序及所有相关服务（统称"服务"）的条款和条件。
              </p>
              
              <ImportantClause title="重要：接受条款">
                通过访问或使用我们的服务，您确认您已阅读、理解并同意受本条款的约束。如果您代表公司或其他法律实体接受这些条款，您声明您有权使该实体受这些条款约束。如果您不同意这些条款，请不要使用我们的服务。
              </ImportantClause>
              
              <p>
                我们保留随时修改这些条款的权利。如果我们进行更改，我们将在本页面上发布更新后的条款，并更新"最后更新"日期。您继续使用服务即表示您接受更新后的条款。我们建议您定期查看本页面以了解任何更改。
              </p>
              
              <p>
                如果您未满18岁，您需要获得父母或监护人的同意才能使用我们的服务。在某些司法管辖区，使用我们服务的法定年龄可能更高，您有责任确保您符合当地法律要求。
              </p>
            </TermsSection>

            {/* 账户与注册 */}
            <TermsSection id="account" title="2. 账户与注册">
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
              
              <TermsNote title="账户限制">
                您只能为自己创建一个个人账户。禁止创建多个账户、虚假账户或代表他人创建账户（获得明确授权的情况除外）。我们保留限制、暂停或终止任何违反此政策的账户的权利。
              </TermsNote>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">2.3 账户终止</h3>
              
              <p>
                您可以随时通过账户设置中的选项或联系我们终止您的账户。账户终止后：
              </p>
              
              <ul>
                <li>您将无法访问您的账户或其中的任何内容；</li>
                <li>您发布的某些内容可能仍然可见（例如，其他用户已保存或分享的内容）；</li>
                <li>我们可能会保留某些信息，以遵守法律义务、解决争议、执行我们的协议等。</li>
              </ul>
              
              <p>
                我们保留因违反这些条款或其他合理原因而暂停或终止您账户的权利，恕不另行通知。
              </p>
            </TermsSection>

            {/* 服务描述 */}
            <TermsSection id="services" title="3. 服务描述">
              <p>
                相逢是一个深度思考者社群平台，提供以下核心服务：
              </p>
              
              <TermsTable 
                columns={[
                  { header: '服务类别', accessor: 'category' },
                  { header: '描述', accessor: 'description' },
                  { header: '访问要求', accessor: 'requirements' }
                ]} 
                rows={[
                  { 
                    category: '深度内容', 
                    description: '阅读和发布深度文章、思考笔记、读书心得等', 
                    requirements: '注册账户（部分内容公开）' 
                  },
                  { 
                    category: '跨界挑战', 
                    description: '参与跨学科思维挑战，提升认知能力', 
                    requirements: '注册账户，可能需要订阅' 
                  },
                  { 
                    category: '社群互动', 
                    description: '与其他深度思考者交流、讨论、建立连接', 
                    requirements: '注册账户' 
                  },
                  { 
                    category: '认知地图', 
                    description: '可视化您的知识网络和思维连接', 
                    requirements: '注册账户，可能需要高级订阅' 
                  },
                  { 
                    category: '深度活动', 
                    description: '参与线上/线下深度对话、研讨会、读书会等', 
                    requirements: '注册账户，部分活动可能需要付费' 
                  }
                ]} 
              />
              
              <TermsNote title="服务变更与可用性">
                我们保留随时修改、暂停或终止任何服务或功能的权利，恕不另行通知。我们不对服务的任何中断或不可用负责。我们可能在不同时间向不同用户推出功能，某些功能可能仅限特定用户或地区使用。
              </TermsNote>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">3.1 免费与付费服务</h3>
              
              <p>
                相逢提供免费和付费服务层级：
              </p>
              
              <ul>
                <li><strong>免费服务：</strong>提供基本功能，允许您阅读有限数量的深度内容、参与基础讨论等。</li>
                <li><strong>付费服务：</strong>提供高级功能，如无限内容访问、高级跨界挑战、个性化认知地图等。</li>
              </ul>
              
              <p>
                付费服务的具体条款、定价和付款方式将在您订阅时提供。我们保留更改定价的权利，但会提前通知现有订阅者。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">3.2 第三方服务</h3>
              
              <p>
                我们的服务可能包含第三方服务、链接或内容。我们不对任何第三方内容或服务负责。您与任何第三方的互动完全在您和该第三方之间进行。
              </p>
            </TermsSection>

            {/* 用户行为准则 */}
            <TermsSection id="user-conduct" title="4. 用户行为准则">
              <p>
                相逢致力于创建一个尊重、安全和富有成效的深度思考环境。您同意在使用我们的服务时：
              </p>
              
              <ActionCard 
                encouragementItems={[
                  { text: '尊重不同观点和背景' },
                  { text: '进行建设性、有深度的讨论' },
                  { text: '分享基于事实和逻辑的见解' },
                  { text: '给予他人反馈时保持尊重' }
                ]} 
                prohibitionItems={[
                  { text: '骚扰、欺凌或威胁他人' },
                  { text: '发布仇恨、歧视性或暴力内容' },
                  { text: '发送垃圾邮件或进行商业推广' },
                  { text: '冒充他人或提供虚假信息' }
                ]} 
              />
              
              <h3 className="text-xl font-bold text-xf-dark mb-4">4.1 具体禁止行为</h3>
              
              <p>
                您同意不进行以下任何行为：
              </p>
              
              <ul>
                <li>违反任何适用的法律、法规或第三方权利；</li>
                <li>使用服务从事非法、欺诈或恶意活动；</li>
                <li>干扰或破坏服务或与之连接的服务器或网络；</li>
                <li>试图未经授权访问任何其他用户的账户；</li>
                <li>使用自动化系统（如机器人、爬虫）访问服务，除非获得明确授权；</li>
                <li>上传或传播病毒、恶意软件或其他有害代码；</li>
                <li>收集或存储其他用户的个人信息；</li>
                <li>进行可能损害相逢声誉或利益的行为。</li>
              </ul>
              
              <TermsWarning type="small" title="执行措施">
                如果我们确定您违反了这些行为准则，我们可能会采取适当措施，包括但不限于：删除内容、发出警告、暂停账户、永久终止账户，或在严重情况下向执法部门报告。我们保留根据我们的社区准则和判断采取行动的权利。
              </TermsWarning>
            </TermsSection>

            {/* 内容政策 */}
            <TermsSection id="content" title="5. 内容政策">
              <h3 className="text-xl font-bold text-xf-dark mb-4">5.1 用户内容</h3>
              
              <p>
                您保留对您上传、发布或以其他方式通过服务提供的内容（以下简称"用户内容"）的所有权利。通过提交用户内容，您授予我们全球性、免版税、非独占的许可，以使用、复制、修改、创建衍生作品、分发和展示该内容，以提供和改进服务。
              </p>
              
              <p>
                您声明并保证：
              </p>
              
              <ul>
                <li>您拥有或有权授予上述许可；</li>
                <li>您的用户内容不侵犯任何第三方的知识产权、隐私权或其他权利；</li>
                <li>您的用户内容不违反这些条款或任何适用法律。</li>
              </ul>
              
              <TermsNote title="内容责任">
                您对您的内容全权负责。相逢不对任何用户内容负责，也不认可任何用户内容。我们保留审查、编辑、删除或拒绝发布任何内容的权利，但无义务这样做。
              </TermsNote>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">5.2 内容标准</h3>
              
              <p>
                所有用户内容必须符合以下标准：
              </p>
              
              <ul>
                <li><strong>相关性：</strong>与深度思考、认知升级、跨学科学习等相关；</li>
                <li><strong>质量：</strong>提供有深度、有见解的内容，而非简单转载或低质量内容；</li>
                <li><strong>真实性：</strong>基于事实和个人真实思考，不传播虚假信息；</li>
                <li><strong>尊重性：</strong>尊重他人，即使意见不同；</li>
                <li><strong>适当性：</strong>不包含不当、冒犯性或非法内容。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">5.3 内容审核与报告</h3>
              
              <p>
                我们鼓励社区成员报告违反这些条款的内容。如果您发现不当内容，请使用报告功能或联系我们。我们将审查报告的内容并采取适当行动。
              </p>
              
              <p>
                请注意，我们可能无法监控所有内容，也不对用户内容的准确性或完整性负责。
              </p>
            </TermsSection>

            {/* 知识产权 */}
            <TermsSection id="intellectual-property" title="6. 知识产权">
              <h3 className="text-xl font-bold text-xf-dark mb-4">6.1 相逢知识产权</h3>
              
              <p>
                服务及其所有内容、功能和技术（包括但不限于软件、文本、显示、图像、视频和音频，以及其设计、选择和安排）归相逢或其许可方所有，受版权、商标、专利、商业秘密和其他知识产权法保护。
              </p>
              
              <p>
                未经我们明确书面许可，您不得：
              </p>
              
              <ul>
                <li>复制、修改或创建我们服务的衍生作品；</li>
                <li>使用我们的商标、标识或品牌元素；</li>
                <li>反编译、逆向工程或以其他方式尝试获取源代码；</li>
                <li>删除任何版权、商标或其他专有权利声明。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">6.2 用户知识产权</h3>
              
              <p>
                如第5节所述，您保留对您用户内容的所有权利。通过提交用户内容，您授予我们有限的许可，仅用于提供和改进服务。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">6.3 版权投诉</h3>
              
              <p>
                我们尊重他人的知识产权。如果您认为您的作品在服务上被复制，构成版权侵权，请按照以下程序通知我们：
              </p>
              
              <ImportantClause title="版权侵权通知">
                请将包含以下信息的书面通知发送至我们的指定代理人：<br />
                1. 版权所有人的授权代表的签名；<br />
                2. 声称被侵权的作品的标识；<br />
                3. 声称侵权材料的标识及其位置；<br />
                4. 您的联系信息；<br />
                5. 声明您真诚地认为使用方式未经授权；<br />
                6. 声明通知内容准确，且您有权代表版权所有人行事。<br /><br />
                请将通知发送至：<strong>copyright@xiangfeng.com</strong>
              </ImportantClause>
              
              <p>
                我们将在收到符合要求的侵权通知后采取适当措施，包括删除或禁用对侵权材料的访问。
              </p>
            </TermsSection>

            {/* 隐私与数据 */}
            <TermsSection id="privacy" title="7. 隐私与数据">
              <p>
                我们重视您的隐私。我们的隐私政策解释了当您使用我们的服务时，我们如何处理您的个人信息。请仔细阅读我们的隐私政策，因为它包含有关我们数据实践的重要信息。
              </p>
              
              <TermsNote title="隐私政策整合">
                我们的隐私政策通过引用并入本服务条款。使用我们的服务即表示您同意我们的隐私政策中描述的数据实践。
              </TermsNote>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">7.1 数据处理</h3>
              
              <p>
                您同意我们按照隐私政策收集、使用、存储和处理您的数据。这可能包括：
              </p>
              
              <ul>
                <li>使用数据改进我们的服务；</li>
                <li>个性化您的体验；</li>
                <li>与您沟通服务更新和相关信息；</li>
                <li>遵守法律义务。</li>
              </ul>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">7.2 数据导出与删除</h3>
              
              <p>
                根据适用法律，您可能有权访问、更正或删除您的个人信息。您可以通过账户设置或联系我们行使这些权利。
              </p>
              
              <p>
                请注意，删除某些信息可能会影响您使用服务的能力。我们可能保留某些信息以遵守法律义务、解决争议或执行我们的协议。
              </p>
            </TermsSection>

            {/* 免责声明 */}
            <TermsSection id="disclaimer" title="8. 免责声明">
              <TermsWarning type="small" title="服务按'原样'提供">
                在适用法律允许的最大范围内，我们按"现状"和"可用"的基础提供服务，不提供任何形式的明示或暗示保证，包括但不限于对适销性、特定用途适用性、所有权和非侵权的暗示保证。
              </TermsWarning>
              
              <p>
                我们不保证：
              </p>
              
              <ul>
                <li>服务将不间断、及时、安全或无错误；</li>
                <li>服务将满足您的特定要求；</li>
                <li>通过服务获得的任何结果将是准确或可靠的；</li>
                <li>服务中的任何错误将被纠正；</li>
                <li>服务或其服务器没有病毒或其他有害组件。</li>
              </ul>
              
              <p>
                您从服务或通过服务获得的任何材料下载或使用均需您自行承担风险，您将对因下载任何此类材料而导致的设备损坏或数据丢失全权负责。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">8.1 第三方内容与链接</h3>
              
              <p>
                服务可能包含第三方内容或指向第三方网站的链接。我们不对任何第三方内容、网站或服务负责，也不认可它们。您与任何第三方的互动完全在您和该第三方之间进行。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">8.2 专业建议免责</h3>
              
              <p>
                相逢提供的内容仅供信息和教育目的。不构成专业建议（包括但不限于法律、财务、医疗或心理建议）。在根据从服务中获得的信息采取行动前，请咨询适当的专业人士。
              </p>
            </TermsSection>

            {/* 责任限制 */}
            <TermsSection id="limitation" title="9. 责任限制">
              <ImportantClause title="责任限制">
                在适用法律允许的最大范围内，相逢及其关联公司、董事、员工、代理或许可方均不对因使用或无法使用服务而引起的任何间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、商誉损失、数据丢失或其他无形损失，无论我们是否已被告知此类损害的可能性。
              </ImportantClause>
              
              <p>
                在适用法律允许的最大范围内，我们对您的全部责任，无论基于何种理论，均不超过您在引起索赔的事件发生前12个月内支付给我们的金额（如有），或100元人民币（以较高者为准）。
              </p>
              
              <p>
                某些司法管辖区不允许排除或限制附带或后果性损害，因此上述限制可能不适用于您。在这些司法管辖区，我们的责任将在法律允许的最大范围内受到限制。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">9.1 基本条款</h3>
              
              <p>
                本责任限制是本协议的基本组成部分，没有这些限制，本协议的条款将有所不同。
              </p>
            </TermsSection>

            {/* 账户终止 */}
            <TermsSection id="termination" title="10. 账户终止">
              <h3 className="text-xl font-bold text-xf-dark mb-4">10.1 由您终止</h3>
              
              <p>
                您可以随时通过账户设置中的选项或联系我们终止您的账户。终止后，您访问账户和使用某些服务的能力将立即停止。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">10.2 由我们终止</h3>
              
              <p>
                如果我们合理认为您违反了这些条款，或者为了保护服务、其他用户或我们的合法权益，我们可能会暂停或终止您的账户或访问服务的权限，恕不另行通知。
              </p>
              
              <p>
                我们可能会因任何原因或无故终止免费账户。对于付费账户，我们将在终止前提供合理通知，除非因违反条款而终止。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">10.3 终止后果</h3>
              
              <p>
                账户终止后：
              </p>
              
              <ul>
                <li>您使用服务的权利将立即终止；</li>
                <li>我们可能会删除或禁用您的账户以及其中的所有信息与文件；</li>
                <li>您可能无法恢复账户中的任何内容；</li>
                <li>您可能仍需支付终止前产生的任何费用。</li>
              </ul>
              
              <p>
                终止后仍有效的条款包括但不限于：知识产权、免责声明、责任限制、赔偿和一般条款。
              </p>
            </TermsSection>

            {/* 争议解决 */}
            <TermsSection id="disputes" title="11. 争议解决">
              <ImportantClause title="争议解决方式">
                因本条款或服务引起的或与之相关的任何争议、索赔或分歧，双方应首先尝试通过友好协商解决。如果协商不成，争议应提交至上海市静安区人民法院通过诉讼解决。
              </ImportantClause>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">11.1 集体诉讼豁免</h3>
              
              <p>
                您同意，任何争议将在个人基础上解决，而不是作为集体诉讼、集体诉讼或代表诉讼的一部分。您放弃参与任何集体诉讼或代表诉讼的权利。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">11.2 索赔时限</h3>
              
              <p>
                因本条款或服务引起的任何索赔必须在索赔产生后一（1）年内提出，否则将被永久禁止。索赔产生的时间是指引起索赔的事件发生的日期。
              </p>
            </TermsSection>

            {/* 一般条款 */}
            <TermsSection id="general" title="12. 一般条款">
              <h3 className="text-xl font-bold text-xf-dark mb-4">12.1 完整协议</h3>
              
              <p>
                本条款构成您与相逢之间关于使用服务的完整协议，并取代您与相逢之间的任何先前协议。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">12.2 可分割性</h3>
              
              <p>
                如果本条款的任何部分被有管辖权的法院或仲裁机构认定为无效或不可执行，该部分将与其余条款分离，其余条款将继续完全有效。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">12.3 转让</h3>
              
              <p>
                您不得转让或转移您在本条款下的权利或义务，除非获得我们的事先书面同意。我们可以在不通知您的情况下转让或转移我们在本条款下的权利和义务。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">12.4 通知</h3>
              
              <p>
                我们可以通过在服务上发布通知、发送电子邮件或其他合理方式向您发送通知。通知将在发布或发送后视为已送达。
              </p>
              
              <h3 className="text-xl font-bold text-xf-dark mt-8 mb-4">12.5 适用法律</h3>
              
              <p>
                本条款受中华人民共和国法律管辖，不考虑其法律冲突规则。
              </p>
            </TermsSection>

            {/* 联系我们 */}
            <TermsSection id="contact" title="13. 联系我们">
              <p>
                如果您对本服务条款有任何疑问或建议，请通过以下方式联系我们：
              </p>
              
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-xf-accent mb-4">联系方式</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-xf-light flex items-center justify-center text-xf-primary flex-shrink-0">
                          <span className="text-sm font-bold">📧</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-xf-dark">电子邮件</h5>
                          <p className="text-xf-medium">support@xiangfeng.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-xf-light flex items-center justify-center text-xf-primary flex-shrink-0">
                          <span className="text-sm font-bold">📞</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-xf-dark">客服热线</h5>
                          <p className="text-xf-medium">400-123-4567</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-xf-accent mb-4">办公信息</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-xf-light flex items-center justify-center text-xf-primary flex-shrink-0">
                          <span className="text-sm font-bold">📍</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-xf-dark">公司地址</h5>
                          <p className="text-xf-medium">上海市静安区南京西路1266号恒隆广场46楼</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-xf-light flex items-center justify-center text-xf-primary flex-shrink-0">
                          <span className="text-sm font-bold">⏰</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-xf-dark">工作时间</h5>
                          <p className="text-xf-medium">周一至周五 9:00-18:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mt-6">
                我们将尽力在收到您的询问后24小时内回复。对于紧急事项，建议您通过电话联系我们。
              </p>
            </TermsSection>

            {/* 条款接受确认 */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-bold text-xf-accent mb-4 font-serif">条款接受确认</h3>
              <p className="text-xf-medium mb-6">
                通过使用我们的服务，您确认已阅读、理解并同意受本服务条款的约束。如果您不同意这些条款，请立即停止使用我们的服务。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98">
                  我已阅读并同意
                </button>
                <button className="px-8 py-3 border border-xf-primary text-xf-primary hover:bg-xf-primary/5 rounded-xl font-medium transition-all">
                  暂不使用
                </button>
              </div>
            </div>
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
            <p>&copy; 2025 相逢科技有限公司. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}