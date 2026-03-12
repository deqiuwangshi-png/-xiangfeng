/**
 * 反馈模块类型定义
 * 集中管理反馈相关的所有类型
 */

/**
 * 反馈状态类型
 */
export type FeedbackStatus = 'pending' | 'processing' | 'completed';

/**
 * 反馈类型
 */
export type FeedbackType = 'bug' | 'suggestion' | 'ui' | 'other';

/**
 * 评论/回复项
 */
export interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
  isOfficial?: boolean;
}

/**
 * 附件项
 */
export interface Attachment {
  name: string;
  url: string;
}

/**
 * 反馈项（列表展示用）
 */
export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: FeedbackStatus;
  statusText: string;
  replies?: number;
  fixed?: boolean;
  replyList?: Reply[];
  pageId: string;
  attachments?: Attachment[];
  contactEmail?: string;
  userEmail?: string;
}

/**
 * 热门反馈项
 */
export interface HotFeedbackItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  comments: number;
  status: FeedbackStatus;
  date: string;
}

/**
 * 常见问题项
 */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * 反馈提交输入
 */
export interface FeedbackInput {
  type: FeedbackType;
  title: string;
  description: string;
  contactEmail?: string;
  attachments?: string[];  // 飞书 file_token 数组
}

/**
 * 反馈提交结果
 */
export interface FeedbackSubmitResult {
  success: boolean;
  trackingId?: string;
  error?: string;
}

/**
 * 反馈查询结果
 */
export interface FeedbackQueryResult {
  success: boolean;
  data?: FeedbackItem[];
  error?: string;
}

/**
 * 评论查询结果
 */
export interface ReplyQueryResult {
  success: boolean;
  data?: Reply[];
  error?: string;
}

/**
 * 评论提交结果
 */
export interface ReplySubmitResult {
  success: boolean;
  data?: Reply;
  error?: string;
}

/**
 * 文件上传状态
 */
export type FileUploadStatus = 'pending' | 'uploading' | 'uploaded' | 'error';

/**
 * 已上传文件项
 */
export interface UploadedFile {
  id: string;  // 唯一标识符，用于解决闭包更新问题
  file: File;
  url?: string;  // 外部URL（如Supabase）
  fileToken?: string;  // 飞书文件 file_token
  status: FileUploadStatus;  // 上传状态
  error?: string;
}
