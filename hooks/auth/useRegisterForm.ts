'use client';

import { useState, useCallback } from 'react';
import { validatePassword, type PasswordValidationResult } from '@/lib/security/passwordPolicy';
import { REGISTER_ERRORS, register } from '@/lib/auth';
import { useAuthToast } from './useAuthToast';
import type { RegisterFormData, RegisterFormErrors, UseRegisterFormReturn } from '@/types';

/**
 * 注册表单管理 Hook
 * @returns 表单管理方法和状态
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    terms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const { showError, showSuccess, showLoading, dismiss } = useAuthToast();

  /**
   * 验证密码强度
   */
  const validatePasswordStrength = useCallback((password: string) => {
    if (password.length > 0) {
      setPasswordValidation(validatePassword(password));
    } else {
      setPasswordValidation(null);
    }
  }, []);

  /**
   * 更新表单字段
   */
  const updateField = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'password' && typeof value === 'string') {
      validatePasswordStrength(value);
    }

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, [validatePasswordStrength]);

  /**
   * 验证表单
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
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/.test(formData.username)) {
      newErrors.username = '用户名2-20字符，仅支持字母、数字、下划线和中文';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * 提交表单
   */
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const toastId = showLoading('注册中...');

    try {
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('username', formData.username);

      const result = await register(formDataObj);

      if (!result.success) {
        dismiss(toastId);
        showError(result.error || '注册失败');
        setIsLoading(false);
        return;
      }

      dismiss(toastId);
      showSuccess('注册成功，验证邮件已发送');
      setIsSuccess(true);
    } catch {
      dismiss(toastId);
      showError('注册过程中发生错误，请稍后重试');
      setIsLoading(false);
    }
  }, [formData, validateForm, showError, showSuccess, showLoading, dismiss]);

  /**
   * 清空错误
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * 获取密码强度颜色
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
    isLoading,
    isSuccess,
    passwordValidation,
    updateField,
    submitForm,
    clearErrors,
    getPasswordStrengthColor,
  };
}
