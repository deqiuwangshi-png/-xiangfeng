import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    console.log('API - 获取用户反馈列表:', { userId, page, pageSize });

    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('API - 获取反馈列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取反馈列表失败',
      },
      { status: 500 }
    );
  }
}
