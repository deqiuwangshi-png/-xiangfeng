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

    // 检查是否已收藏
    const { data: existingBookmark, error: checkError } = await supabase
      .from('bookmarks')
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

    let bookmarked = false;

    if (existingBookmark) {
      // 已收藏，取消收藏
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark.id);

      if (deleteError) {
        console.error('API - 取消收藏失败:', deleteError);
        return NextResponse.json(
          { error: '取消收藏失败' },
          { status: 500 }
        );
      }
      bookmarked = false;
    } else {
      // 未收藏，添加收藏
      const { error: insertError } = await supabase
        .from('bookmarks')
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
      bookmarked = true;
    }

    console.log('API - 收藏操作成功:', { articleId, userId: user.id, bookmarked });

    return NextResponse.json({
      success: true,
      bookmarked,
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
        bookmarked: false,
      });
    }

    // 检查是否已收藏
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      bookmarked: !!existingBookmark,
    });
  } catch (error) {
    console.error('API - 获取收藏状态失败:', error);
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    );
  }
}
