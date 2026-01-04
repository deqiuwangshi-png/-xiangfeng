import { NextRequest, NextResponse } from 'next/server';

/**
 * 单个文章API路由
 * 处理单个文章的CRUD操作
 */

// 模拟文章数据（实际项目中应连接数据库）
const mockArticles = [
  {
    id: '1',
    title: '深度思考的方法论：在信息爆炸时代重塑认知框架',
    content: '<p>在信息过载的时代，深度思考成为一种稀缺能力。我们每天被海量信息淹没，却往往缺乏真正深入理解问题的能力。深度思考不仅是一种认知过程，更是一种生活态度——它要求我们放慢节奏，穿透表层，触及问题的本质。与直觉和快速反应不同，深度思考需要系统的方法论支撑，需要我们有意识地构建认知框架，以在复杂问题中找到清晰的路径。</p><p>认知科学家将深度思考定义为"对概念、想法或情境进行持续、有目的的分析和反思的过程"。这种思考超越了简单的信息处理，涉及批判性思维、创造性联想和系统性分析。深度思考不是与生俱来的天赋，而是一种可以通过训练获得的技能。本文将探讨深度思考的五个核心维度：第一性原理思维、多元思维模型、批判性反思、系统性分析以及实践性反馈。</p><div class="important-text">哲学家怀特海曾说："思考的深度不在于思考的内容有多少，而在于思考的方式和结构。深度思考者能够穿透表象，直达事物的本质和内在联系。"</div>',
    author: 'Sophia Chen',
    authorTitle: '认知科学研究者',
    readingTime: '约12分钟阅读',
    excerpt: '在信息过载的时代，深度思考成为一种稀缺能力。本文探讨深度思考的五个核心维度：第一性原理思维、多元思维模型、批判性反思、系统性分析以及实践性反馈。',
    authorId: '1',
    tags: ['认知科学', '深度思考', '方法论'],
    status: 'published',
    viewCount: 1234,
    likeCount: 367,
    commentCount: 42,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Next.js开发指南：从入门到精通',
    content: '<p>Next.js是一个React框架，提供了路由、构建和部署等功能，使开发者能够快速构建高性能的Web应用。本文将从基础概念开始，逐步深入Next.js的核心功能，帮助你掌握Next.js开发技能。</p>',
    author: '张开发',
    authorTitle: '前端工程师',
    readingTime: '约15分钟阅读',
    excerpt: 'Next.js是一个React框架，提供了路由、构建和部署等功能，使开发者能够快速构建高性能的Web应用。',
    authorId: '2',
    tags: ['Next.js', 'React', '前端开发'],
    status: 'published',
    viewCount: 2345,
    likeCount: 567,
    commentCount: 78,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * 获取单个文章详情
 * @param {NextRequest} request - Next.js请求对象
 * @param {Object} context - 上下文对象，包含params Promise
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 解析params Promise
    const { id } = await params;
    
    // 根据ID查找文章
    const article = mockArticles.find(article => article.id === id);
    
    if (!article) {
      return NextResponse.json(
        { error: '文章不存在', message: '无法找到指定ID的文章' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: article.id,
      title: article.title,
      author: article.author,
      authorTitle: article.authorTitle,
      readingTime: article.readingTime,
      content: article.content,
      likeCount: article.likeCount,
      commentCount: article.commentCount
    });
    
  } catch (error) {
    console.error('获取文章详情错误:', error);
    return NextResponse.json(
      { error: '获取文章详情失败', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
