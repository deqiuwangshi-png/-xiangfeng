'use server';

import type { FeedbackType, FeedbackStatus, Attachment } from '@/types/feedback';

/**
 * 飞书反馈数据接口
 */
export interface FeishuFeedbackData {
  /** 反馈类型 */
  type: FeedbackType;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 联系方式 */
  contactEmail?: string;
  /** 状态 */
  status?: FeedbackStatus;
  /** 附件 file_token 数组 */
  attachments?: string[];
  /** 追踪ID */
  trackingId?: string;
}

/**
 * 飞书记录项接口
 */
export interface FeishuRecord {
  record_id: string;
  fields: Record<string, unknown>;
  created_time: number;
  updated_time: number;
}

/**
 * 反馈项接口
 */
export interface FeedbackItem {
  userEmail: string;
  trackingId: string;
  id: string;
  title: string;
  description: string;
  date: string;
  status: FeedbackStatus;
  statusText: string;
  pageId: string;
  contactEmail: string;
  attachments?: Attachment[];
}

export type { Attachment };

/**
 * API 响应基础接口
 */
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
}

/**
 * 创建记录响应数据
 */
export interface CreateRecordResponse {
  record: {
    record_id: string;
  };
}

/**
 * 查询记录响应数据
 */
export interface QueryRecordsResponse {
  items?: FeishuRecord[];
  records?: FeishuRecord[];
  total?: number;
}

/**
 * 表格信息响应数据
 */
export interface TableInfoResponse {
  table: {
    name: string;
    table_id: string;
  };
}

/**
 * 文件上传响应数据
 */
export interface UploadFileResponse {
  file_token: string;
}
