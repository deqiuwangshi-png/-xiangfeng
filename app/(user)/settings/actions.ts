'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * 设置更新数据验证模式
 */
const updateSettingSchema = z.object({
  category: z.enum(['privacy', 'notifications', 'appearance', 'content', 'advanced']),
  key: z.string(),
  value: z.any(),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;

/**
 * 更新设置 Server Action
 * 
 * @param settingData 设置数据
 * @returns 更新结果
 */
export async function updateSetting(settingData: UpdateSettingInput) {
  try {
    const validatedData = updateSettingSchema.parse(settingData);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: '用户未登录',
      };
    }

    console.log('更新设置:', {
      userId: user.id,
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/settings');

    return {
      success: true,
      message: '设置更新成功',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败',
        details: error.issues,
      };
    }

    console.error('更新设置失败:', error);
    return {
      success: false,
      error: '更新失败，请稍后重试',
    };
  }
}

/**
 * 更新隐私设置
 * 
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updatePrivacySettings(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value');

  if (!key || value === null) {
    return {
      success: false,
      error: '参数不完整',
    };
  }

  const booleanValue = value === 'true';

  return updateSetting({
    category: 'privacy',
    key,
    value: booleanValue,
  });
}

/**
 * 更新通知设置
 * 
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateNotificationSettings(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value');

  if (!key || value === null) {
    return {
      success: false,
      error: '参数不完整',
    };
  }

  const booleanValue = value === 'true';

  return updateSetting({
    category: 'notifications',
    key,
    value: booleanValue,
  });
}

/**
 * 更新外观设置
 * 
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateAppearanceSettings(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value');

  if (!key || value === null) {
    return {
      success: false,
      error: '参数不完整',
    };
  }

  const booleanValue = value === 'true';

  return updateSetting({
    category: 'appearance',
    key,
    value: booleanValue,
  });
}

/**
 * 更新内容设置
 * 
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateContentSettings(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value');

  if (!key || value === null) {
    return {
      success: false,
      error: '参数不完整',
    };
  }

  const booleanValue = value === 'true';

  return updateSetting({
    category: 'content',
    key,
    value: booleanValue,
  });
}

/**
 * 更新高级设置
 * 
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateAdvancedSettings(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value');

  if (!key || value === null) {
    return {
      success: false,
      error: '参数不完整',
    };
  }

  const booleanValue = value === 'true';

  return updateSetting({
    category: 'advanced',
    key,
    value: booleanValue,
  });
}
