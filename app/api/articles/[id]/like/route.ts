import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 文章点赞/取消点赞
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 点赞结果响应
 */
export async function POST(
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

    {/* 检查用户资料是否存在，不存在则自动创建 */}
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      {/* 自动创建用户资料 */}
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
        });

      if (createProfileError) {
        console.error('API - 创建用户资料失败:', createProfileError);
        return NextResponse.json(
          { error: '用户资料初始化失败' },
          { status: 500 }
        );
      }
    }

    // 检查是否已点赞
    const { data: existingLike, error: checkError } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 表示未找到记录，其他错误需要处理
      console.error('API - 检查点赞状态失败:', checkError);
      return NextResponse.json(
        { error: '操作失败' },
        { status: 500 }
      );
    }

    let liked = false;

    if (existingLike) {
      // 已点赞，取消点赞
      const { error: deleteError } = await supabase
        .from('article_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('API - 取消点赞失败:', deleteError);
        return NextResponse.json(
          { error: '取消点赞失败' },
          { status: 500 }
        );
      }
      liked = false;
    } else {
      // 未点赞，添加点赞
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('API - 点赞失败:', insertError);
        return NextResponse.json(
          { error: '点赞失败' },
          { status: 500 }
        );
      }
      liked = true;
    }

    // 获取最新的点赞数
    const { data: article } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single();

    console.log('API - 点赞操作成功:', { articleId, userId: user.id, liked, likes: article?.like_count || 0 });

    return NextResponse.json({
      success: true,
      liked,
      likes: article?.like_count || 0,
      articleId,
    });
  } catch (error) {
    console.error('API - 点赞操作失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取当前用户的点赞状态
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 点赞状态响应
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  const supabase = await createClient();

  try {
    // 获取当前登录用户
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({
        liked: false,
        likes: 0,
      });
    }

    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    // 获取最新的点赞数
    const { data: article } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single();

    return NextResponse.json({
      liked: !!existingLike,
      likes: article?.like_count || 0,
    });
  } catch (error) {
    console.error('API - 获取点赞状态失败:', error);
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    );
  }
}
