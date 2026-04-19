/**
 * 认证组件统一导出

 */

// Guards - 认证守卫组件
export { AuthGuard } from './guards/AuthGuard';

// Prompts - 认证提示组件
export { AuthRequiredContent, UnauthenticatedPrompt } from './prompts/AuthRequiredContent';

// Forms - 表单组件
export { LoginForm } from './forms/LoginForm';
export { RegisterForm } from './forms/RegisterForm';
export { ForgotPasswordForm } from './forms/ForgotPasswordForm';
export { ResetPasswordForm } from './forms/ResetPasswordForm';

// UI - 基础UI组件
export { BrandSection } from './ui/BrandSection';
export { MobileBrandTitle } from './ui/MobileBrandTitle';
export { FormCard } from './ui/FormCard';
export { PasswordInput } from './ui/PasswordInput';
export { OAuthButtons } from './ui/OAuthButtons';

// Actions - 操作按钮组件
export { LogoutButton } from './actions/LogoutButton';
