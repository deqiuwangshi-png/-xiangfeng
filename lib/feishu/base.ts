/**
 * 飞书多维表格 Base ID 管理
 */

import { FEISHU_CONFIG } from './config';

/**
 * 获取多维表格 Base ID
 * 从环境变量配置的 BASE_ID 读取
 *
 * @returns Base ID
 */
export async function getBaseId(): Promise<string> {
  const envBaseId = FEISHU_CONFIG.BASE_ID;

  if (!envBaseId) {
    throw new Error('未配置 FEISHU_BASE_ID，请在 .env.local 文件中设置');
  }

  return envBaseId;
}
