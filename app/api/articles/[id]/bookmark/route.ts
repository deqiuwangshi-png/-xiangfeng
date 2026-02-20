import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  console.log('API - 书签操作:', { articleId, userId });
  
  return NextResponse.json({
    success: true,
    bookmarked: true,
    articleId,
    userId,
  });
}
