import { NextRequest, NextResponse } from 'next/server';

/**
 * 文章API路由
 * 处理文章的CRUD操作
 */

// 模拟文章数据（实际项目中应连接数据库）
const mockArticles = [
  {
    id: '1',
    title: '我的第一篇文章',
    content: '这是文章内容...',
    excerpt: '文章摘要...',
    authorId: '1',
    authorName: '测试用户',
    tags: ['技术', '编程'],
    status: 'published',
    viewCount: 100,
    likeCount: 10,
    commentCount: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Next.js开发指南',
    content: 'Next.js是一个React框架...',
    excerpt: 'Next.js开发指南摘要...',
    authorId: '1',
    authorName: '测试用户',
    tags: ['Next.js', 'React'],
    status: 'published',
    viewCount: 200,
    likeCount: 20,
    commentCount: 15,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * 获取文章列表
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    // 过滤文章
    let filteredArticles = [...mockArticles];
    
    if (authorId) {
      filteredArticles = filteredArticles.filter(article => article.authorId === authorId);
    }
    
    if (status) {
      filteredArticles = filteredArticles.filter(article => article.status === status);
    }
    
    if (tag) {
      filteredArticles = filteredArticles.filter(article => article.tags.includes(tag));
    }
    
    if (search) {
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / limit)
      }
    });
    
  } catch (error) {
    console.error('获取文章列表错误:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建新文章
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, tags, status = 'draft' } = await request.json();
    
    // 验证输入
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }
    
    // 获取用户信息（实际项目中应从token中获取）
    const authorId = '1'; // 模拟用户ID
    const authorName = '测试用户'; // 模拟用户名
    
    // 创建新文章
    const newArticle = {
      id: String(mockArticles.length + 1),
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      authorId,
      authorName,
      tags: tags || [],
      status,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 模拟保存到数据库
    mockArticles.push(newArticle);
    
    return NextResponse.json({
      article: newArticle,
      message: '文章创建成功'
    }, { status: 201 });
    
  } catch (error) {
    console.error('创建文章错误:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
}