'use client';

/**
 * 反馈追踪ID本地存储管理
 * 用于保存用户提交的反馈追踪ID列表
 */

const STORAGE_KEY = 'my_feedback_tracking_ids';

/**
 * 获取所有追踪ID
 *
 * @returns 追踪ID数组
 */
export function getTrackingIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('读取追踪ID失败:', error);
    return [];
  }
}

/**
 * 添加追踪ID
 *
 * @param trackingId 追踪ID
 */
export function addTrackingId(trackingId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const ids = getTrackingIds();
    if (!ids.includes(trackingId)) {
      ids.unshift(trackingId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.error('保存追踪ID失败:', error);
  }
}

/**
 * 移除追踪ID
 *
 * @param trackingId 追踪ID
 */
export function removeTrackingId(trackingId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const ids = getTrackingIds();
    const filtered = ids.filter((id) => id !== trackingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('移除追踪ID失败:', error);
  }
}

/**
 * 清空所有追踪ID
 */
export function clearTrackingIds(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清空追踪ID失败:', error);
  }
}
