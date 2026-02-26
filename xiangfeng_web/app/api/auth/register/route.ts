import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户注册API路由
 * 处理用户注册请求
 */

// 模拟用户存储（实际项目中应连接数据库）
const mockUsers = [
  {
    id: '1',
    email: 'existing@example.com',
    password: 'password123',
    name: '现有用户',
    avatar: null,
    createdAt: new Date('2024-01-01')
  }
];

/**
 * 处理注册请求
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    // 验证输入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
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
    
    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6位' },
        { status: 400 }
      );
    }
    
    // 检查邮箱是否已存在
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }
    
    // 创建新用户（实际项目中应使用数据库）
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password, // 实际项目中应使用bcrypt加密
      name,
      avatar: null,
      createdAt: new Date()
    };
    
    // 模拟保存到数据库
    mockUsers.push(newUser);
    
    // 生成token（实际项目中应使用JWT）
    const token = Buffer.from(JSON.stringify({ userId: newUser.id, email: newUser.email })).toString('base64');
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: '注册成功'
    }, { status: 201 });
    
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}