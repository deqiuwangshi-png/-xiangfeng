import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  
  console.log('API - 获取评论列表:', { articleId });
  
  const mockComments = [
    {
      id: 'comment-1',
      articleId,
      author: {
        id: 'user-1',
        name: '张明',
        avatar: '/avatars/zhang.jpg',
      },
      content: '这篇文章写得真好，让我对深度思考有了更深的理解。特别是第一性原理的部分，对我启发很大。',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      likes: 23,
      liked: false,
    },
    {
      id: 'comment-2',
      articleId,
      author: {
        id: 'user-2',
        name: '李华',
      },
      content: '多元思维模型这个概念很有意思，我也在学习不同学科的知识，希望能构建自己的认知工具箱。',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      likes: 15,
      liked: false,
    },
    {
      id: 'comment-3',
      articleId,
      author: {
        id: 'user-3',
        name: '王芳',
        avatar: '/avatars/wang.jpg',
      },
      content: '深度思考确实是稀缺能力，在这个信息爆炸的时代，我们更需要学会慢下来，深入思考。',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      likes: 31,
      liked: false,
    },
  ];
  
  return NextResponse.json({
    comments: mockComments,
    total: mockComments.length,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  const body = await request.json();
  
  const { userId, content } = body;
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: 'Comment content is required' },
      { status: 400 }
    );
  }
  
  if (content.length > 500) {
    return NextResponse.json(
      { error: 'Comment content is too long' },
      { status: 400 }
    );
  }
  
  console.log('API - 提交评论:', { articleId, userId, content });
  
  const newComment = {
    id: `comment-${Date.now()}`,
    articleId,
    author: {
      id: userId,
      name: '当前用户',
    },
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
  };
  
  return NextResponse.json({
    comment: newComment,
  });
}
