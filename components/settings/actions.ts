'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

/**
 * 设置更新操作（Server Actions）
 * 
 * 作用: 更新用户设置、验证输入数据、更新数据库
 * 
 * 使用说明:
 *   更新用户设置
 *   验证输入数据
 *   更新数据库
 * 
 * 架构说明:
 *   - 使用'use server'指令
 *   - 使用Zod验证输入
 *   - 返回类型化结果
 *   - 使用revalidatePath或revalidateTag
 *   - 不包含UI逻辑
 *   - 处理数据修改
 * 
 * 更新时间: 2026-02-20
 */

/**
 * 更新设置Schema
 * 
 * @constant updateSettingSchema
 * @description 定义设置更新的验证规则
 */
const updateSettingSchema = z.object({
  settingKey: z.string(),
  settingValue: z.any(),
})

/**
 * 更新设置
 * 
 * @function updateSetting
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 更新结果
 * 
 * @description
 * 更新用户设置
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function updateSetting(formData: FormData) {
  const validatedFields = updateSettingSchema.safeParse({
    settingKey: formData.get('settingKey'),
    settingValue: formData.get('settingValue'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { settingKey, settingValue } = validatedFields.data

  // TODO: 更新数据库
  // await db.settings.update({
  //   where: { key: settingKey },
  //   data: { value: settingValue },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 更新开关设置Schema
 * 
 * @constant updateToggleSchema
 * @description 定义开关设置更新的验证规则
 */
const updateToggleSchema = z.object({
  settingKey: z.string(),
  checked: z.boolean(),
})

/**
 * 更新开关设置
 * 
 * @function updateToggleSetting
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 更新结果
 * 
 * @description
 * 更新开关设置
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function updateToggleSetting(formData: FormData) {
  const validatedFields = updateToggleSchema.safeParse({
    settingKey: formData.get('settingKey'),
    checked: formData.get('checked') === 'true',
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { settingKey, checked } = validatedFields.data

  // TODO: 更新数据库
  // await db.settings.update({
  //   where: { key: settingKey },
  //   data: { value: checked },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 更新主题设置Schema
 * 
 * @constant updateThemeSchema
 * @description 定义主题设置更新的验证规则
 */
const updateThemeSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
})

/**
 * 更新主题设置
 * 
 * @function updateThemeSetting
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 更新结果
 * 
 * @description
 * 更新主题设置
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function updateThemeSetting(formData: FormData) {
  const validatedFields = updateThemeSchema.safeParse({
    theme: formData.get('theme'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { theme } = validatedFields.data

  // TODO: 更新数据库
  // await db.settings.update({
  //   where: { key: 'theme' },
  //   data: { value: theme },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 更新主题颜色设置Schema
 * 
 * @constant updateColorSchema
 * @description 定义主题颜色设置更新的验证规则
 */
const updateColorSchema = z.object({
  color: z.string(),
})

/**
 * 更新主题颜色设置
 * 
 * @function updateColorSetting
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 更新结果
 * 
 * @description
 * 更新主题颜色设置
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function updateColorSetting(formData: FormData) {
  const validatedFields = updateColorSchema.safeParse({
    color: formData.get('color'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { color } = validatedFields.data

  // TODO: 更新数据库
  // await db.settings.update({
  //   where: { key: 'themeColor' },
  //   data: { value: color },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 重置设置Schema
 * 
 * @constant resetSettingsSchema
 * @description 定义重置设置的验证规则
 */
const resetSettingsSchema = z.object({
  confirm: z.boolean(),
})

/**
 * 重置所有设置
 * 
 * @function resetAllSettings
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 重置结果
 * 
 * @description
 * 重置所有设置
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function resetAllSettings(formData: FormData) {
  const validatedFields = resetSettingsSchema.safeParse({
    confirm: formData.get('confirm') === 'true',
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { confirm } = validatedFields.data

  if (!confirm) {
    return {
      success: false,
      error: 'Confirmation required',
    }
  }

  // TODO: 重置数据库
  // await db.settings.updateMany({
  //   data: { value: null },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 停用账户Schema
 * 
 * @constant deactivateAccountSchema
 * @description 定义停用账户的验证规则
 */
const deactivateAccountSchema = z.object({
  confirm: z.boolean(),
})

/**
 * 停用账户
 * 
 * @function deactivateAccount
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 停用结果
 * 
 * @description
 * 停用用户账户
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function deactivateAccount(formData: FormData) {
  const validatedFields = deactivateAccountSchema.safeParse({
    confirm: formData.get('confirm') === 'true',
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { confirm } = validatedFields.data

  if (!confirm) {
    return {
      success: false,
      error: 'Confirmation required',
    }
  }

  // TODO: 停用账户
  // await db.users.update({
  //   where: { id: userId },
  //   data: { status: 'deactivated' },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}

/**
 * 删除账户Schema
 * 
 * @constant deleteAccountSchema
 * @description 定义删除账户的验证规则
 */
const deleteAccountSchema = z.object({
  confirm: z.boolean(),
})

/**
 * 删除账户
 * 
 * @function deleteAccount
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, error?: string}>} 删除结果
 * 
 * @description
 * 删除用户账户
 * 验证输入数据
 * 更新数据库
 * 重新验证路径
 */
export async function deleteAccount(formData: FormData) {
  const validatedFields = deleteAccountSchema.safeParse({
    confirm: formData.get('confirm') === 'true',
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
    }
  }

  const { confirm } = validatedFields.data

  if (!confirm) {
    return {
      success: false,
      error: 'Confirmation required',
    }
  }

  // TODO: 删除账户
  // await db.users.delete({
  //   where: { id: userId },
  // })

  revalidatePath('/settings')

  return {
    success: true,
  }
}
