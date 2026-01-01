import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户认证API路由
 * 处理用户登录、注册、登出等认证相关请求
 */

// 模拟用户数据（实际项目中应连接数据库）
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // 实际项目中应使用加密密码
    name: '测试用户',
    avatar: null,
    createdAt: new Date('2024-01-01')
  }
];

/**
 * 处理登录请求
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }
    
    // 查找用户（模拟数据库查询）
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 验证密码（实际项目中应使用bcrypt等库验证）
    if (user.password !== password) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }
    
    // 生成token（实际项目中应使用JWT）
    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64');
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: '登录成功'
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}