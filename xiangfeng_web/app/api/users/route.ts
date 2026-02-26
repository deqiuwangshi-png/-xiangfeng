import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户API路由
 * 处理用户相关的CRUD操作
 */

// 模拟用户数据（实际项目中应连接数据库）
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: '测试用户',
    avatar: null,
    bio: '这是一个测试用户的简介',
    website: 'https://example.com',
    location: '北京',
    followersCount: 100,
    followingCount: 50,
    articlesCount: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'creator@example.com',
    name: '创作者小王',
    avatar: null,
    bio: '专注于技术写作和内容创作',
    website: 'https://creator.example.com',
    location: '上海',
    followersCount: 500,
    followingCount: 200,
    articlesCount: 50,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * 获取用户列表
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    
    // 过滤用户（不包含敏感信息）
    let filteredUsers = mockUsers.map(user => {
      const { email, ...userWithoutEmail } = user;
      return userWithoutEmail;
    });
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
    
  } catch (error) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新用户信息
 * @param {NextRequest} request - Next.js请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId, name, bio, website, location, avatar } = await request.json();
    
    // 验证输入
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 查找用户（实际项目中应从token中获取用户ID）
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 更新用户信息
    const updatedUser = {
      ...mockUsers[userIndex],
      ...(name && { name }),
      ...(bio && { bio }),
      ...(website && { website }),
      ...(location && { location }),
      ...(avatar && { avatar }),
      updatedAt: new Date()
    };
    
    // 模拟保存到数据库
    mockUsers[userIndex] = updatedUser;
    
    // 返回更新后的用户信息（不包含敏感信息）
    const { email, ...userWithoutEmail } = updatedUser;
    
    return NextResponse.json({
      user: userWithoutEmail,
      message: '用户信息更新成功'
    });
    
  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}