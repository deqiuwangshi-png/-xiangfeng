/**
 * 媒体资源清理定时任务 API
 * @module app/api/cron/cleanup-media
 * @description 清理超过24小时的临时媒体文件
 *
 * 调用方式：
 * - Vercel Cron: 配置 vercel.json 定时触发
 * - 手动调用: GET /api/cron/cleanup-media?secret=YOUR_SECRET
 */

import { NextRequest, NextResponse } from 'next/server'
import { cleanupTempMedia } from '@/lib/media/actions'

/**
 * 清理临时媒体文件
 *
 * @param request - HTTP 请求
 * @returns 清理结果
 */
export async function GET(request: NextRequest) {
  // 验证密钥（防止未授权访问）
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const expectedSecret = process.env.CRON_SECRET

  // 如果有配置密钥，必须验证
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const result = await cleanupTempMedia()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      message: `成功清理 ${result.deleted} 个临时媒体文件`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '清理失败'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
