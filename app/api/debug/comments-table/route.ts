import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 调试接口 - 检查评论表结构和数据
 * 用于排查评论功能问题
 */
export async function GET() {
  const supabase = await createClient();
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // 1. 检查用户登录状态
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    results.checks.auth = {
      isLoggedIn: !!user,
      userId: user?.id || null,
      error: authError?.message || null,
    };

    // 2. 检查 comments 表是否存在
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'comments')
      .eq('table_schema', 'public');

    results.checks.table = {
      exists: !tableError && tableInfo && tableInfo.length > 0,
      columns: tableInfo || [],
      error: tableError?.message || null,
    };

    // 3. 检查 articles 表是否有 comments_count 字段
    const { data: articleColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'articles')
      .eq('table_schema', 'public');

    results.checks.articles = {
      hasCommentsCount: articleColumns?.some((c: any) => c.column_name === 'comments_count') || false,
      columns: articleColumns?.map((c: any) => c.column_name) || [],
    };

    // 4. 尝试查询一条评论数据
    const { data: sampleComment, error: queryError } = await supabase
      .from('comments')
      .select('*')
      .limit(1)
      .maybeSingle();

    results.checks.sampleQuery = {
      success: !queryError,
      data: sampleComment,
      error: queryError?.message || null,
    };

    // 5. 检查 RLS 策略
    const { data: policies } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual')
      .eq('tablename', 'comments');

    results.checks.rlsPolicies = policies || [];

    // 6. 如果用户已登录，测试插入权限
    if (user) {
      // 先检查是否有文章可以测试
      const { data: sampleArticle } = await supabase
        .from('articles')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (sampleArticle) {
        // 尝试插入测试评论（然后删除）
        const { data: testComment, error: insertError } = await supabase
          .from('comments')
          .insert({
            article_id: sampleArticle.id,
            author_id: user.id,
            content: '测试评论 - 将被删除',
            likes: 0,
          })
          .select()
          .single();

        results.checks.insertTest = {
          success: !insertError,
          commentId: testComment?.id || null,
          error: insertError?.message || null,
        };

        // 清理测试数据
        if (testComment) {
          await supabase.from('comments').delete().eq('id', testComment.id);
          results.checks.insertTest.cleaned = true;
        }
      } else {
        results.checks.insertTest = {
          skipped: true,
          reason: 'No articles found for testing',
        };
      }
    } else {
      results.checks.insertTest = {
        skipped: true,
        reason: 'User not logged in',
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Debug check failed:', error);
    return NextResponse.json(
      {
        error: 'Debug check failed',
        details: error instanceof Error ? error.message : String(error),
        results,
      },
      { status: 500 }
    );
  }
}
