/**
 * 认证组件统一导出
 * @module components/auth
 * @description 认证模块所有组件的集中导出入口
 */

// Guards - 认证守卫组件
export { AuthGuard } from './guards/AuthGuard';
export { AuthRequiredContent } from './guards/AuthRequiredContent';
export { UnauthenticatedPrompt } from './guards/UnauthenticatedPrompt';

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
export { PwdStrength } from './ui/PwdStrength';
export { OAuthButtons } from './ui/OAuthButtons';

// Actions - 操作按钮组件
export { LogoutButton } from './actions/LogoutButton';
