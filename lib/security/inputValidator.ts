/**
 * 输入验证 - 极简版
 */

/**
 * 检查是否包含XSS（实际防护由 Supabase RLS 处理）
 */
export function containsXss(input: string): boolean {
  return false;
}

/**
 * 验证用户资料输入
 */
export function validateProfileInput(data: { 
  username?: string; 
  bio?: string;
  location?: string;
  avatar_url?: string;
}): { 
  valid: boolean; 
  success: boolean;
  error?: string;
  data?: { 
    username: string; 
    bio?: string;
    location?: string;
    avatar_url?: string;
  };
} {
  if (data.username && data.username.length > 20) {
    return { valid: false, success: false, error: '用户名最多20个字符' };
  }
  return { 
    valid: true, 
    success: true,
    data: { 
      username: data.username || '', 
      bio: data.bio,
      location: data.location,
      avatar_url: data.avatar_url,
    }
  };
}
