import { NextRequest, NextResponse } from 'next/server';
import { getArticleCommentsPaginated } from '@/lib/articles/articleQueries';
import { createClient } from '@/lib/supabase/server';

/**
 * 获取文章评论列表（支持分页）
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 评论列表响应
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;

  // 获取分页参数
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  console.log('API - 获取评论列表:', { articleId, page, limit });

  try {
    // 使用分页查询
    const { comments, totalCount, hasMore } = await getArticleCommentsPaginated(
      articleId,
      page,
      limit
    );

    return NextResponse.json({
      comments,
      totalCount,
      hasMore,
    });
  } catch (error) {
    console.error('API - 获取评论失败:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * 提交新评论
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 新评论响应
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  const supabase = await createClient();

  console.log('API - 收到评论提交请求:', { articleId });

  try {
    // 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('API - 用户未登录:', authError);
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    console.log('API - 当前用户:', { userId: user.id });

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('API - 请求体解析失败:', e);
      return NextResponse.json(
        { error: '请求格式错误' },
        { status: 400 }
      );
    }
    
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: '评论内容不能超过500字' },
        { status: 400 }
      );
    }

    console.log('API - 准备插入评论:', { articleId, userId: user.id, content: content.trim() });

    // 插入评论到数据库
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        author_id: user.id,
        content: content.trim(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('API - 插入评论失败:', error);
      return NextResponse.json(
        { error: `评论提交失败: ${error.message}` },
        { status: 500 }
      );
    }

    if (!comment) {
      console.error('API - 评论插入成功但未返回数据');
      return NextResponse.json(
        { error: '评论提交失败: 未返回数据' },
        { status: 500 }
      );
    }

    console.log('API - 评论插入成功:', { commentId: comment.id });

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('API - 获取用户资料失败:', profileError);
    }

    const responseData = {
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: 0,
        author: {
          id: user.id,
          name: profile?.username || '匿名用户',
          avatar: profile?.avatar_url || null,
        },
        liked: false,
      },
    };

    console.log('API - 返回数据:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API - 提交评论失败:', error);
    return NextResponse.json(
      { error: `评论提交失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}

/**
 * 删除评论
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 删除结果响应
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  const supabase = await createClient();

  try {
    // 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 从查询参数获取评论ID
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { error: '评论ID不能为空' },
        { status: 400 }
      );
    }

    // 删除评论（只能删除自己的评论）
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', user.id);

    if (error) {
      console.error('API - 删除评论失败:', error);
      return NextResponse.json(
        { error: '删除评论失败' },
        { status: 500 }
      );
    }

    console.log('API - 评论删除成功:', { articleId, commentId });

    return NextResponse.json({
      success: true,
      message: '评论已删除',
    });
  } catch (error) {
    console.error('API - 删除评论失败:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
}
