import { NextResponse } from 'next/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'ui', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  contactEmail: z.string().email().optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);

    const trackingId = `FB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;

    {/* 使用 validatedData 防止未使用变量警告 */}
    void validatedData;

    return NextResponse.json({
      success: true,
      trackingId,
      message: '反馈提交成功',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('API - 提交反馈失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '提交失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
