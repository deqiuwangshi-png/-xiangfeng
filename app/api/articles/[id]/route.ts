import { NextRequest, NextResponse } from 'next/server';
import { getArticleById } from '@/lib/articles/articleQueries';

/**
 * 获取单篇文章详情 API
 *
 * @param request - HTTP 请求对象
 * @param params - 路由参数，包含文章ID
 * @returns 文章详情 JSON 响应
 *
 * @description
 * 根据文章ID从数据库查询文章详情，包含作者信息
 * 如果文章不存在或查询失败，返回 404 错误
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;

  try {
    const article = await getArticleById(articleId);

    if (!article) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return NextResponse.json(
      { error: '获取文章详情失败' },
      { status: 500 }
    );
  }
}
