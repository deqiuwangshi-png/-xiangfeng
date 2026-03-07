'use server';

import { FEISHU_CONFIG, FIELD_MAPPING } from './config';
import { feishuRequest } from './client';
import { convertFeishuRecordToFeedbackItem, getFeishuTypeOption, getFeishuStatusOption } from './transform';
import type { FeedbackStatus } from '@/types/feedback';
import type { FeishuFeedbackData, FeedbackItem, CreateRecordResponse, QueryRecordsResponse, TableInfoResponse } from './types';

/**
 * 构建记录字段数据
 *
 * @param data 反馈数据
 * @returns 飞书字段对象
 */
async function buildRecordFields(data: FeishuFeedbackData): Promise<Record<string, unknown>> {
  const fields: Record<string, unknown> = {
    [FIELD_MAPPING.TYPE]: await getFeishuTypeOption(data.type),
    [FIELD_MAPPING.TITLE]: data.title,
    [FIELD_MAPPING.DESCRIPTION]: data.description,
    [FIELD_MAPPING.STATUS]: await getFeishuStatusOption(data.status || 'pending'),
    [FIELD_MAPPING.CREATED_AT]: Date.now(),
  };

  {/* 可选字段 */}
  if (data.contactEmail) {
    fields[FIELD_MAPPING.CONTACT] = data.contactEmail;
  }

  {/* 追踪ID字段 */}
  if (data.trackingId) {
    fields[FIELD_MAPPING.TRACKING_ID] = data.trackingId;
  }

  {/* 附件字段 - 飞书附件字段需要 file_token 数组 */}
  if (data.attachments && data.attachments.length > 0) {
    fields[FIELD_MAPPING.ATTACHMENTS] = data.attachments.map((token) => ({
      file_token: token,
    }));
  }

  return fields;
}

/**
 * 创建飞书多维表格记录
 *
 * @param data 反馈数据
 * @returns 创建结果
 */
export async function createFeishuFeedback(
  data: FeishuFeedbackData
): Promise<{ success: boolean; recordId?: string; error?: string }> {
  try {
    const fields = await buildRecordFields(data);

    const result = await feishuRequest<CreateRecordResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records`,
      {
        method: 'POST',
        body: { fields },
      }
    );

    {/* 调试：打印完整响应结果 */}
    console.log('飞书创建记录响应:', JSON.stringify(result, null, 2));

    return {
      success: true,
      recordId: result.data?.record?.record_id,
    };
  } catch (error) {
    console.error('创建飞书反馈记录失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 更新飞书记录状态
 *
 * @param recordId 记录ID
 * @param status 新状态
 * @returns 更新结果
 */
export async function updateFeishuFeedbackStatus(
  recordId: string,
  status: FeedbackStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await feishuRequest(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/${recordId}`,
      {
        method: 'PUT',
        body: {
          fields: {
            [FIELD_MAPPING.STATUS]: await getFeishuStatusOption(status),
          },
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('更新飞书反馈状态失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 从飞书多维表格查询反馈记录
 * 支持按追踪ID列表或用户邮箱查询
 *
 * @param options 查询选项
 * @returns 查询结果
 */
export async function queryFeishuFeedbacks(options: {
  trackingIds?: string[];
  userEmail?: string;
}): Promise<{ success: boolean; data?: FeedbackItem[]; error?: string }> {
  try {
    const { trackingIds, userEmail } = options;

    {/* 构建过滤条件 - 使用飞书 filter 对象格式 */}
    let filterObj: unknown = null;

    if (trackingIds && trackingIds.length > 0) {
      {/* 按追踪ID查询 - 使用 OR 条件 */}
      filterObj = {
        conjunction: 'or',
        conditions: trackingIds.map((id) => ({
          field_name: FIELD_MAPPING.TRACKING_ID,
          operator: 'is',
          value: [id],
        })),
      };
    } else if (userEmail) {
      {/* 按用户邮箱查询 */}
      filterObj = {
        conjunction: 'and',
        conditions: [
          {
            field_name: FIELD_MAPPING.CONTACT,
            operator: 'is',
            value: [userEmail],
          },
        ],
      };
    }

    if (!filterObj) {
      return {
        success: true,
        data: [],
      };
    }

    {/* 调试：打印请求参数 */}
    console.log('飞书查询参数:', {
      url: `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`,
      filter: filterObj,
    });

    {/* 调用飞书 API 查询 */}
    const result = await feishuRequest<QueryRecordsResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`,
      {
        method: 'POST',
        body: {
          filter: filterObj,
          page_size: 100,
        },
      }
    );

    {/* 调试：打印完整响应结果 */}
    console.log('飞书查询完整响应:', JSON.stringify(result, null, 2));

    {/* 转换记录格式 - 兼容多种数据结构 */}
    const records = result.data?.items || result.data?.records || [];
    console.log('提取到记录数:', records.length);
    const feedbackItems = await Promise.all(records.map(convertFeishuRecordToFeedbackItem));

    return {
      success: true,
      data: feedbackItems,
    };
  } catch (error) {
    console.error('查询飞书反馈记录失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 测试飞书连接
 * 用于验证配置是否正确
 *
 * @returns 连接测试结果
 */
export async function testFeishuConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const result = await feishuRequest<TableInfoResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}`
    );

    return {
      success: true,
      message: `连接成功！表格名称: ${result.data?.table?.name}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `连接异常: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}
