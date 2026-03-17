'use server';

import { createClient } from '@/lib/supabase/server';
import type { ReplyQueryResult, ReplySubmitResult } from '@/types/feedback';

/**
 * 获取反馈的评论列表
 *
 * @param recordId 飞书记录ID
 * @returns 评论列表
 */
export async function getFeedbackReplies(recordId: string): Promise<ReplyQueryResult> {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: '用户未登录',
        data: [],
      };
    }

    // 从 Supabase 查询评论（通过飞书记录ID关联）
    const { data, error } = await supabase
      .from('feedback_replies')
      .select('*')
      .eq('record_id', recordId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取评论失败:', error);
      return {
        success: false,
        error: '获取评论失败',
        data: [],
      };
    }

    // 格式化返回数据
    const replies = (data || []).map((item) => ({
      id: item.id,
      author: item.author_name || '匿名用户',
      content: item.content,
      date: item.created_at,
      isOfficial: item.is_official || false,
    }));

    return {
      success: true,
      data: replies,
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

    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: '用户未登录',
      };
    }

    // 获取用户资料
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    // 插入评论到数据库（使用飞书记录ID关联）
    const { data, error } = await supabase
      .from('feedback_replies')
      .insert({
        record_id: recordId,
        user_id: user.id,
        author_name: profile?.username || '匿名用户',
        content: content.trim(),
        is_official: false,
      })
      .select()
      .single();

    if (error) {
      console.error('提交评论失败:', error);
      return {
        success: false,
        error: '提交评论失败',
      };
    }

    return {
      success: true,
      data: {
        id: data.id,
        author: data.author_name,
        content: data.content,
        date: data.created_at,
        isOfficial: false,
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
