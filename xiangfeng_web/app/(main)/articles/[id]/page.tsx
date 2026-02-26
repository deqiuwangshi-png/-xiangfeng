/**
 * 文章详情页面
 * 显示单篇文章的详细内容，支持阅读模式和交互功能
 */

'use client';

import { useState, useEffect, use } from 'react';

// 导入API工具函数
import { apiRequest } from '@/lib/api';

// 导入文章组件
import { NavMinimal } from '@/components/article/NavMinimal';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { DouyinSidebar } from '@/components/article/DouyinSidebar';
import { ArticleContent } from '@/components/article/ArticleContent';
import { CommentsPanel } from '@/components/article/CommentsPanel';
import { ShareMenu } from '@/components/article/ShareMenu';


// 模拟文章数据
const mockArticle = {
  id: '1',
  title: '深度思考的方法论：在信息爆炸时代重塑认知框架',
  author: 'Sophia Chen',
  authorTitle: '认知科学研究者',
  readingTime: '约12分钟阅读',
  content: `在信息过载的时代，深度思考成为一种稀缺能力。我们每天被海量信息淹没，却往往缺乏真正深入理解问题的能力。深度思考不仅是一种认知过程，更是一种生活态度——它要求我们放慢节奏，穿透表层，触及问题的本质。与直觉和快速反应不同，深度思考需要系统的方法论支撑，需要我们有意识地构建认知框架，以在复杂问题中找到清晰的路径。

认知科学家将深度思考定义为"对概念、想法或情境进行持续、有目的的分析和反思的过程"。这种思考超越了简单的信息处理，涉及批判性思维、创造性联想和系统性分析。深度思考不是与生俱来的天赋，而是一种可以通过训练获得的技能。本文将探讨深度思考的五个核心维度：第一性原理思维、多元思维模型、批判性反思、系统性分析以及实践性反馈。

<div class="important-text">
    哲学家怀特海曾说："思考的深度不在于思考的内容有多少，而在于思考的方式和结构。深度思考者能够穿透表象，直达事物的本质和内在联系。"
</div>

<h2 id="section1">第一性原理：回归事物本质</h2>

第一性原理思维是深度思考的基石。它要求我们剥离层层假设和惯例，回到最基本的事实和原理。埃隆·马斯克将这种方法描述为"从物理学的角度看待世界"，即回到最基本的真理，然后从中进行推理。这种方法与类比思维形成鲜明对比——类比思维是基于已有经验进行推断，而第一性原理思维则是从零开始构建理解。

应用第一性原理思维有三个关键步骤：首先，识别并质疑现有假设；其次，将问题分解为最基本的事实和原则；最后，基于这些基本原理重新构建解决方案。这种方法虽然耗费更多认知资源，却能产生突破性的见解和创新。例如，当特斯拉考虑电池成本时，他们不是接受市场现有价格，而是回到电池的基本化学成分，计算原材料成本，从而找到了大幅降低电池成本的方法。

<h2 id="section2">多元思维模型：避免认知盲点</h2>

查理·芒格倡导的"多元思维模型"理论认为，没有任何单一学科能提供所有问题的答案。深度思考者需要从不同学科汲取思维工具，形成跨学科的认知框架。这些模型包括物理学中的临界点理论、生物学中的进化论、心理学中的认知偏差、数学中的概率论等。

构建多元思维模型的关键在于：第一，有意识地学习不同学科的基础原理；第二，练习将这些模型应用到实际问题中；第三，理解每个模型的适用边界和局限性。当面对复杂问题时，深度思考者会从多个角度审视问题，避免单一视角造成的认知盲点。例如，分析市场现象时，同时应用经济学原理、心理学规律和社会学视角，能够获得更全面的理解。

<div class="important-text">
    芒格曾说："你必须拥有多元思维模型——因为如果你只用一两个，你会扭曲现实以适应你的模型。这是人性的本质。"
</div>

<div class="section-divider"></div>

<h2 id="section3">批判性反思：挑战自我认知</h2>

深度思考离不开对自身思维过程的批判性反思。这包括识别和质疑自己的假设、信念和认知偏差。常见的认知偏差如确认偏误（倾向于寻找支持自己观点的信息）、锚定效应（过度依赖首次获得的信息）等，都会阻碍深度思考。

培养批判性反思能力需要：第一，建立"思考自己的思考"的元认知意识；第二，主动寻求反驳自己观点的证据；第三，与持有不同观点的人进行建设性对话；第四，记录思考过程并定期回顾。苏格拉底式的提问方法是批判性反思的有效工具——通过连续提问，逐步揭示观点的逻辑基础和潜在假设。

批判性反思不仅针对外部信息，也针对自身的思维过程。深度思考者会定期检视自己的认知框架，识别其中的矛盾和局限，并对其进行修正和更新。这种自我修正的能力是持续深度思考的关键。

<h2 id="section4">系统性分析：理解复杂系统</h2>

现实世界中的问题往往是复杂系统的一部分，而非孤立现象。深度思考要求我们理解系统的结构、动态和反馈机制。系统思维强调事物之间的相互关联和长期影响，而非简单的线性因果关系。

进行系统性分析时，需要关注以下几个方面：系统的边界和要素、要素之间的相互作用、系统的反馈回路（增强回路和调节回路）、系统的延迟效应以及系统的非线性特征。例如，分析环境问题不能只关注污染源，还需要理解生态系统的自我调节能力、人类行为的心理动因、政策干预的长期效果等多重因素。

系统性分析的工具包括因果关系图、系统动态模型、存量流量图等。这些工具帮助我们将复杂问题可视化，识别系统中的杠杆点——那些微小的改变可能带来显著系统效应的地方。

<h2 id="section5">实践性反馈：思考的行动闭环</h2>

深度思考不是纯粹的抽象活动，它需要与实践相结合，形成"思考-行动-反馈-修正"的闭环。理论思考需要通过实践检验，实践中的反馈又能反过来修正和丰富理论思考。

建立有效的实践性反馈机制包括：第一，将思考转化为可测试的假设；第二，设计小规模实验验证假设；第三，系统地收集和分析反馈数据；第四，根据反馈调整思考框架。这种迭代过程使深度思考不断接近现实，避免陷入纯粹的理论空想。

行动学习是实践性反馈的重要形式——在解决实际问题的过程中学习，将实践经验提炼为认知洞察。深度思考者不仅是思考者，也是行动者；他们通过行动验证思考，通过思考指导行动，形成知行合一的良性循环。

<div class="important-text">
    教育家杜威指出："思考不是脱离行动的心理活动，而是对经验的持续重组和重构。真正的思考始于对问题的感知，终于问题的解决。"
</div>

<div class="section-divider"></div>

<h2 id="section6">结语：培养深度思考的习惯</h2>

深度思考是一种可以通过训练培养的能力。它需要的不是更高的智商，而是更有意识、更系统的思考习惯。在信息爆炸的时代，深度思考成为一种宝贵的认知抗干扰能力——它使我们能够在噪音中识别信号，在复杂中寻找简单，在变化中发现规律。

培养深度思考习惯的日常实践包括：每日深度阅读（而非碎片化浏览）、定期写作反思、与深度思考者对话、刻意练习思维模型、给自己留出"无聊时间"以促进创造性联想。深度思考需要认知空间和时间——在忙碌的日常生活中，我们需要有意识地创造这样的空间。

深度思考的最终目的不是获得更多知识，而是形成更清晰的认知框架，做出更明智的决策，过更有意义的生活。在这个意义上，深度思考不仅是一种认知技能，也是一种存在方式——它代表着对生活深度和广度的追求，对表象之下真实的理解渴望。

<div class="article-end">
    <span>在每个人都急于表达的时代，深度思考的勇气在于保持沉默；在信息泛滥的时代，深度思考的智慧在于选择忽略；在追求效率的时代，深度思考的价值在于愿意慢下来。</span>
</div>`
};

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 使用use钩子解析params Promise
  const { id } = use(params);
  
  // 这里可以通过 id 从 API 获取文章数据
  const article = mockArticle;

  // 状态管理
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: 标准, 1: 大, 2: 特大
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // 字体大小调整
  const toggleFontSize = () => {
    setFontSizeLevel(prev => (prev + 1) % 3);
  };

  // 暗色模式切换
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // 应用暗色模式到文档
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // 评论面板切换
  const toggleComments = () => {
    setIsCommentsOpen(prev => !prev);
    // 控制页面滚动
    if (!isCommentsOpen) {
      document.body.classList.add('no-scroll');
      document.body.classList.add('comments-open');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('comments-open');
    }
  };

  // 分享菜单切换
  const toggleShareMenu = () => {
    setIsShareMenuOpen(prev => !prev);
  };

  // 关闭页面
  const handleClose = () => {
    window.location.href = '/home';
  };

  // 初始化暗色模式
  useEffect(() => {
    // 检查本地存储中的暗色模式设置
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }

    // 保存暗色模式设置
    return () => {
      localStorage.setItem('darkMode', isDarkMode.toString());
    };
  }, [isDarkMode]);

  return (
    <div className={`antialiased ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 阅读进度条 */}
      <ReadingProgress />
      
      {/* 简洁导航栏 */}
      <NavMinimal 
        onToggleFontSize={toggleFontSize} 
        onToggleDarkMode={toggleDarkMode} 
        onClose={handleClose} 
      />
      
      {/* 抖音风格垂直功能栏 */}
      <DouyinSidebar 
        likeCount={367} 
        commentCount={42} 
        onToggleComments={toggleComments} 
      />
      
      {/* 主要内容区域 */}
      <div className="main-container pt-14 pb-6">
        {/* 文章主体 */}
        <ArticleContent 
          title={article.title} 
          author={article.author} 
          authorTitle={article.authorTitle} 
          readingTime={article.readingTime} 
          content={article.content} 
          fontSizeLevel={fontSizeLevel} 
          isDarkMode={isDarkMode} 
        />
      </div>
      
      {/* 评论组件 */}
      <CommentsPanel 
        isOpen={isCommentsOpen} 
        onClose={toggleComments} 
        initialCommentCount={42} 
      />
    </div>
  );
}
