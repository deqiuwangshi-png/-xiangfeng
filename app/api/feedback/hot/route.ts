import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('API - 获取热门反馈:', { limit });

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('API - 获取热门反馈失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取热门反馈失败',
      },
      { status: 500 }
    );
  }
}
