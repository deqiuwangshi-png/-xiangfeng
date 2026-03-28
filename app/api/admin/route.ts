/**
 * 数据一致性检查 API
 * @module app/api/admin/consistency-check
 * @description 提供手动检查和修复数据一致性的接口
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkArticlesConsistency, fixDataInconsistency } from '@/lib/monitoring/dataConsistency';

/**
 * GET /api/admin/consistency-check
 * 执行数据一致性检查
 */
export async function GET(request: NextRequest) {
  // TODO: 添加管理员权限验证
  // const isAdmin = await verifyAdmin(request);
  // if (!isAdmin) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const result = await checkArticlesConsistency();
    
    return NextResponse.json({
      success: true,
      data: result,
      message: result.isConsistent 
        ? '数据一致性检查通过' 
        : `发现数据不一致: 首页 ${result.homeCount} 篇，后台 ${result.adminCount} 篇`,
    });
  } catch (error) {
    console.error('[一致性检查 API] 执行失败:', error);
    return NextResponse.json(
      { success: false, error: '检查执行失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/consistency-check
 * 修复数据不一致（刷新缓存）
 */
export async function POST(request: NextRequest) {
  // TODO: 添加管理员权限验证

  try {
    // 先执行检查
    const checkResult = await checkArticlesConsistency();
    
    // 执行修复
    await fixDataInconsistency();
    
    return NextResponse.json({
      success: true,
      data: {
        beforeFix: checkResult,
        message: '缓存刷新完成，请等待页面自动更新或手动刷新页面',
      },
    });
  } catch (error) {
    console.error('[一致性修复 API] 执行失败:', error);
    return NextResponse.json(
      { success: false, error: '修复执行失败' },
      { status: 500 }
    );
  }
}
