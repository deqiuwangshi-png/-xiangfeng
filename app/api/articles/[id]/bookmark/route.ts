import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 文章收藏/取消收藏
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 收藏结果响应
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

    // 检查是否已收藏
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('API - 检查收藏状态失败:', checkError);
      return NextResponse.json(
        { error: '操作失败' },
        { status: 500 }
      );
    }

    let favorited = false;

    if (existingFavorite) {
      // 已收藏，取消收藏
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);

      if (deleteError) {
        console.error('API - 取消收藏失败:', deleteError);
        return NextResponse.json(
          { error: '取消收藏失败' },
          { status: 500 }
        );
      }
      favorited = false;
    } else {
      // 未收藏，添加收藏
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('API - 收藏失败:', insertError);
        return NextResponse.json(
          { error: '收藏失败' },
          { status: 500 }
        );
      }
      favorited = true;
    }

    // 获取最新的收藏数
    const { data: article } = await supabase
      .from('articles')
      .select('favorite_count')
      .eq('id', articleId)
      .single();

    return NextResponse.json({
      success: true,
      favorited,
      favorites: article?.favorite_count || 0,
      articleId,
    });
  } catch (error) {
    console.error('API - 收藏操作失败:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取当前用户的收藏状态
 *
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 收藏状态响应
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
        favorited: false,
        favorites: 0,
      });
    }

    // 检查是否已收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    // 获取最新的收藏数
    const { data: article } = await supabase
      .from('articles')
      .select('favorite_count')
      .eq('id', articleId)
      .single();

    return NextResponse.json({
      favorited: !!existingFavorite,
      favorites: article?.favorite_count || 0,
    });
  } catch (error) {
    console.error('API - 获取收藏状态失败:', error);
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    );
  }
}
