'use server';

import type { ReplyQueryResult, ReplySubmitResult } from '@/types/feedback';

/**
 * 获取反馈的评论列表
 * TODO: 实现飞书多维表格评论查询
 *
 * @param recordId 飞书记录ID
 * @returns 评论列表
 */
export async function getFeedbackReplies(recordId: string): Promise<ReplyQueryResult> {
  try {
    // TODO: 从飞书多维表格查询评论
    console.log('查询反馈评论:', recordId);

    return {
      success: true,
      data: [],
    };
  } catch (error) {
    console.error('获取评论失败:', error);
    return {
      success: false,
      error: '获取评论失败',
      data: [],
    };
  }
}

/**
 * 提交评论到反馈
 * TODO: 实现飞书多维表格评论提交
 *
 * @param recordId 飞书记录ID
 * @param content 评论内容
 * @returns 提交结果
 */
export async function submitReply(recordId: string, content: string): Promise<ReplySubmitResult> {
  try {
    // 验证输入
    if (!content.trim()) {
      return {
        success: false,
        error: '评论内容不能为空',
      };
    }

    if (content.length > 2000) {
      return {
        success: false,
        error: '评论内容不能超过2000字符',
      };
    }

    // TODO: 提交评论到飞书多维表格
    console.log('提交评论:', recordId, content);

    return {
      success: true,
      data: {
        id: 'temp-id',
        author: '用户',
        content: content.trim(),
        date: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('提交评论失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '提交评论失败',
    };
  }
}
