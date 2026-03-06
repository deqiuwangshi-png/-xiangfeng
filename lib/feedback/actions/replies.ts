'use server';

import { getFeedbackComments, addFeedbackComment } from '@/lib/notion';
import type { ReplyQueryResult, ReplySubmitResult } from '@/types/feedback';

/**
 * 获取反馈的评论列表
 *
 * @param pageId Notion 页面ID
 * @returns 评论列表
 */
export async function getFeedbackReplies(pageId: string): Promise<ReplyQueryResult> {
  try {
    const comments = await getFeedbackComments(pageId);

    return {
      success: true,
      data: comments,
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
 *
 * @param pageId Notion 页面ID
 * @param content 评论内容
 * @returns 提交结果
 */
export async function submitReply(pageId: string, content: string): Promise<ReplySubmitResult> {
  try {
    {/* 验证输入 */}
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

    const comment = await addFeedbackComment(pageId, content.trim());

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error('提交评论失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '提交评论失败',
    };
  }
}
