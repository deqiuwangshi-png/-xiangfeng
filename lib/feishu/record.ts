'use server';

import { FEISHU_CONFIG, FIELD_MAPPING } from './config';
import { feishuRequest } from './client';
import { getBaseId } from './base';
import { convertFeishuRecordToFeedbackItem, getFeishuTypeOption, getFeishuStatusOption } from './transform';

import type { FeedbackStatus } from '@/types/user/feedback';
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
    [FIELD_MAPPING.DESCRIPTION]: data.description,
    [FIELD_MAPPING.STATUS]: await getFeishuStatusOption(data.status || 'pending'),
    [FIELD_MAPPING.CREATED_AT]: Date.now(),
  };

  {/* 用户ID字段 */}
  if (data.userId) {
    fields[FIELD_MAPPING.USER_ID] = data.userId;
  }

  {/* 用户邮箱字段 */}
  if (data.userEmail) {
    fields[FIELD_MAPPING.USER_EMAIL] = data.userEmail;
  }

  {/* 追踪ID字段 */}
  if (data.trackingId) {
    fields[FIELD_MAPPING.TRACKING_ID] = data.trackingId;
  }

  {/* 附件字段 - 飞书附件字段需要 [{ file_token: 'xxx' }] 格式 */}
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
    const baseId = await getBaseId();

    const result = await feishuRequest<CreateRecordResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${baseId}/tables/${FEISHU_CONFIG.TABLE_ID}/records`,
      {
        method: 'POST',
        body: { fields },
      }
    );

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
    const baseId = await getBaseId();
    await feishuRequest(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${baseId}/tables/${FEISHU_CONFIG.TABLE_ID}/records/${recordId}`,
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
 * 构建飞书 filter JSON 对象
 * 飞书 /records 接口 filter 语法：使用 JSON 格式
 *
 * @param fieldName 字段名
 * @param value 字段值
 * @returns filter 条件对象
 */
function buildFilterCondition(fieldName: string, value: string): Record<string, unknown> {
  return {
    field_name: fieldName,
    operator: 'is',
    value: [value],
  };
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

    let filterObj: Record<string, unknown> | null = null;

    if (trackingIds && trackingIds.length > 0) {
      /**
       * 追踪ID查询：使用 conjunction + conditions
       * 飞书API要求必须使用 conjunction + conditions 格式，即使是单条件
       * 格式：{"conjunction": "or", "conditions": [{"field_name": "追踪ID", "operator": "is", "value": ["ID1"]}, ...]}
       */
      const conditions = trackingIds.map((id) =>
        buildFilterCondition(FIELD_MAPPING.TRACKING_ID, id)
      );
      filterObj = { conjunction: 'or', conditions };
    } else if (userEmail) {
      /**
       * 邮箱查询：单条件，同样使用 conjunction + conditions 格式
       * 格式：{"conjunction": "and", "conditions": [{"field_name": "用户邮箱", "operator": "is", "value": ["email@example.com"]}]}
       */
      filterObj = {
        conjunction: 'and',
        conditions: [buildFilterCondition(FIELD_MAPPING.USER_EMAIL, userEmail)]
      };
    }

    if (!filterObj) {
      return {
        success: true,
        data: [],
      };
    }

    {/* 调试日志：记录查询条件 */}
    console.log('[飞书查询] filter:', JSON.stringify(filterObj));

    const baseId = await getBaseId();

    /**
     * 使用 POST /records/search 接口
     * 该接口支持复杂的 filter 条件，通过请求体传递
     */
    const result = await feishuRequest<QueryRecordsResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${baseId}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`,
      {
        method: 'POST',
        body: {
          filter: filterObj,
          page_size: 100,
        },
      }
    );

    {/* 调试日志：记录返回结果数量 */}
    const records = result.data?.items || result.data?.records || [];
    console.log(`[飞书查询] 返回记录数: ${records.length}`);

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
    const baseId = await getBaseId();
    const result = await feishuRequest<TableInfoResponse>(
      `${FEISHU_CONFIG.API_BASE}/bitable/v1/apps/${baseId}/tables/${FEISHU_CONFIG.TABLE_ID}`
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
