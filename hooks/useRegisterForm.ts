'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validatePassword, type PasswordValidationResult } from '@/lib/security/passwordPolicy';
import { useAuthError } from '@/lib/auth/useAuthError';
import { REGISTER_ERRORS } from '@/lib/auth/errorMessages';

/**
 * 注册表单数据接口
 * @interface RegisterFormData
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  terms: boolean;
}

/**
 * 注册表单验证错误接口
 * @interface RegisterFormErrors
 */
export interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  terms?: string;
}

/**
 * useRegisterForm Hook 返回值接口
 * @interface UseRegisterFormReturn
 */
export interface UseRegisterFormReturn {
  /** 表单数据 */
  formData: RegisterFormData;
  /** 表单错误 */
  errors: RegisterFormErrors;
  /** 全局错误信息 */
  globalError: string | null;
  /** 提交加载状态 */
  isLoading: boolean;
  /** 密码验证结果 */
  passwordValidation: PasswordValidationResult | null;
  /** 更新表单字段 */
  updateField: (field: keyof RegisterFormData, value: string | boolean) => void;
  /** 提交表单 */
  submitForm: () => Promise<void>;
  /** 清空错误 */
  clearErrors: () => void;
  /** 获取密码强度颜色 */
  getPasswordStrengthColor: () => string;
}

/**
 * 注册表单管理 Hook
 * @description 封装注册表单的状态管理、验证和提交逻辑
 * @returns {UseRegisterFormReturn} 表单管理方法和状态
 * @example
 * const { formData, errors, submitForm, updateField } = useRegisterForm();
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const router = useRouter();
  const { error: globalError, handleSupabaseError, clearError: clearGlobalError, setError: setGlobalError } = useAuthError();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    terms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);

  /**
   * 验证密码并更新验证状态
   * @param {string} password - 密码值
   */
  const validatePasswordStrength = useCallback((password: string) => {
    if (password.length > 0) {
      const result = validatePassword(password);
      setPasswordValidation(result);
    } else {
      setPasswordValidation(null);
    }
  }, []);

  /**
   * 更新表单字段
   * @param {keyof RegisterFormData} field - 字段名
   * @param {string | boolean} value - 字段值
   */
  const updateField = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 密码字段需要实时验证强度
    if (field === 'password' && typeof value === 'string') {
      validatePasswordStrength(value);
    }

    // 清除该字段的错误
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, [validatePasswordStrength]);

  /**
   * 验证整个表单
   * @returns {boolean} 验证是否通过
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.terms) {
      newErrors.terms = REGISTER_ERRORS.TERMS_NOT_ACCEPTED;
    }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = REGISTER_ERRORS.PASSWORD_MISMATCH;
    }

    if (!formData.email) {
      newErrors.email = '请输入邮箱';
    }

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * 提交表单
   */
  const submitForm = useCallback(async () => {
    clearGlobalError();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { username: formData.username } },
      });

      if (signUpError) {
        throw signUpError;
      }

      router.push('/login');
    } catch (err) {
      handleSupabaseError(err, 'register');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, clearGlobalError, handleSupabaseError, router]);

  /**
   * 清空所有错误
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    clearGlobalError();
  }, [clearGlobalError]);

  /**
   * 获取密码强度颜色类名
   * @returns {string} Tailwind 颜色类名
   */
  const getPasswordStrengthColor = useCallback((): string => {
    if (!passwordValidation) return 'text-gray-400';
    switch (passwordValidation.strength) {
      case 'strong':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'weak':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  }, [passwordValidation]);

  return {
    formData,
    errors,
    globalError,
    isLoading,
    passwordValidation,
    updateField,
    submitForm,
    clearErrors,
    getPasswordStrengthColor,
  };
}
