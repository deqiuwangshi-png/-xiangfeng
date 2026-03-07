'use server';

import { FIELD_MAPPING, TYPE_MAPPING, STATUS_MAPPING } from './config';
import type { FeedbackStatus } from '@/types/feedback';
import type { FeishuRecord, FeedbackItem } from './types';

/**
 * 反向映射：飞书选项 -> 系统类型
 * 保留用于未来扩展（如需要反向查询类型）
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REVERSE_TYPE_MAPPING: Record<string, string> = {
  'Bug反馈': 'bug',
  '功能改进': 'suggestion',
  '界面优化': 'ui',
  '其他': 'other',
};

/**
 * 反向映射：飞书选项 -> 系统状态
 */
const REVERSE_STATUS_MAPPING: Record<string, FeedbackStatus> = {
  '待处理': 'pending',
  '处理中': 'processing',
  '已完成': 'completed',
};

/**
 * 从飞书字段中提取文本值
 * 处理多种数据类型：字符串、数组、对象
 *
 * @param value 飞书字段值
 * @returns 提取的文本
 */
export function extractFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  // 字符串直接返回
  if (typeof value === 'string') {
    return value;
  }

  // 数字转为字符串
  if (typeof value === 'number') {
    return String(value);
  }

  // 数组取第一个元素
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    const firstItem = value[0];
    // 处理 [{text: 'xxx'}] 格式
    if (typeof firstItem === 'object' && firstItem !== null) {
      return extractFieldValue(firstItem);
    }
    return String(firstItem);
  }

  // 对象类型，尝试提取常见字段
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // 飞书富文本格式
    if (obj.text !== undefined) return String(obj.text);
    if (obj.value !== undefined) return extractFieldValue(obj.value);
    if (obj.name !== undefined) return String(obj.name);
    if (obj.label !== undefined) return String(obj.label);
    // 返回 JSON 字符串作为后备
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * 将飞书记录转换为系统反馈项
 *
 * @param record 飞书记录
 * @returns 系统反馈项
 */
export function convertFeishuRecordToFeedbackItem(record: FeishuRecord): FeedbackItem {
  const fields = record.fields;

  return {
    id: record.record_id,
    title: extractFieldValue(fields[FIELD_MAPPING.TITLE]),
    description: extractFieldValue(fields[FIELD_MAPPING.DESCRIPTION]),
    date: new Date(Number(fields[FIELD_MAPPING.CREATED_AT]) || Date.now()).toISOString(),
    status: REVERSE_STATUS_MAPPING[extractFieldValue(fields[FIELD_MAPPING.STATUS])] || 'pending',
    statusText: extractFieldValue(fields[FIELD_MAPPING.STATUS]) || '待处理',
    pageId: extractFieldValue(fields[FIELD_MAPPING.TRACKING_ID]) || record.record_id,
    contactEmail: extractFieldValue(fields[FIELD_MAPPING.CONTACT]),
  };
}

/**
 * 获取系统类型对应的飞书选项
 *
 * @param type 系统类型
 * @returns 飞书选项文本
 */
export function getFeishuTypeOption(type: string): string {
  return TYPE_MAPPING[type] || '其他';
}

/**
 * 获取系统状态对应的飞书选项
 *
 * @param status 系统状态
 * @returns 飞书选项文本
 */
export function getFeishuStatusOption(status: string): string {
  return STATUS_MAPPING[status] || '待处理';
}

/**
 * 获取飞书选项对应的系统状态
 *
 * @param statusText 飞书状态文本
 * @returns 系统状态
 */
export function getSystemStatus(statusText: string): FeedbackStatus {
  return REVERSE_STATUS_MAPPING[statusText] || 'pending';
}
