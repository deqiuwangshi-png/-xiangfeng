import { NextRequest, NextResponse } from 'next/server';

/**
 * 讨论API路由
 * 处理社区讨论的CRUD操作
 */

// 模拟讨论数据（实际项目中应连接数据库）
const mockDiscussions = [
  {
    id: '1',
    title: 'Next.js vs React：该如何选择？',
    content: '最近在学习前端开发，想了解一下Next.js和React的区别...',
    authorId: '1',
    authorName: '测试用户',
    category: '技术讨论',
    tags: ['Next.js', 'React', '前端'],
    status: 'active',
    viewCount: 150,
    replyCount: 25,
    likeCount: 30,
    isPinned: false,
    isLocked: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: '如何提高写作效率？',
    content: '作为一名内容创作者，我经常遇到写作瓶颈...',
    authorId: '2',
    authorName: '创作者小王',
    category: '创作技巧',
    tags: ['写作', '效率', '创作'],
    status: 'active',
    viewCount: 200,
    replyCount: 35,
    likeCount: 45,
    isPinned: true,
    isLocked: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * 获取讨论列表
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const isPinned = searchParams.get('isPinned');
    
    // 过滤讨论
    let filteredDiscussions = [...mockDiscussions];
    
    if (category) {
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.category === category);
    }
    
    if (authorId) {
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.authorId === authorId);
    }
    
    if (status) {
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.status === status);
    }
    
    if (isPinned !== null) {
      const pinned = isPinned === 'true';
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.isPinned === pinned);
    }
    
    if (search) {
      filteredDiscussions = filteredDiscussions.filter(discussion => 
        discussion.title.toLowerCase().includes(search.toLowerCase()) ||
        discussion.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 排序：置顶优先，然后按更新时间倒序
    filteredDiscussions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDiscussions = filteredDiscussions.slice(startIndex, endIndex);
    
    return NextResponse.json({
      discussions: paginatedDiscussions,
      pagination: {
        page,
        limit,
        total: filteredDiscussions.length,
        totalPages: Math.ceil(filteredDiscussions.length / limit)
      }
    });
    
  } catch (error) {
    console.error('获取讨论列表错误:', error);
    return NextResponse.json(
      { error: '获取讨论列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建新讨论
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    const { title, content, category, tags } = await request.json();
    
    // 验证输入
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: '标题、内容和分类不能为空' },
        { status: 400 }
      );
    }
    
    // 获取用户信息（实际项目中应从token中获取）
    const authorId = '1'; // 模拟用户ID
    const authorName = '测试用户'; // 模拟用户名
    
    // 创建新讨论
    const newDiscussion = {
      id: String(mockDiscussions.length + 1),
      title,
      content,
      authorId,
      authorName,
      category,
      tags: tags || [],
      status: 'active',
      viewCount: 0,
      replyCount: 0,
      likeCount: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 模拟保存到数据库
    mockDiscussions.push(newDiscussion);
    
    return NextResponse.json({
      discussion: newDiscussion,
      message: '讨论创建成功'
    }, { status: 201 });
    
  } catch (error) {
    console.error('创建讨论错误:', error);
    return NextResponse.json(
      { error: '创建讨论失败' },
      { status: 500 }
    );
  }
}