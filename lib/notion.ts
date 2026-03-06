import { Client } from '@notionhq/client';
import type {
  CreatePageParameters,
  PageObjectResponse,
  CommentObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Notion 客户端单例
 * 用于与 Notion API 进行交互
 */
let notionClient: Client | null = null;

/**
 * 获取 Notion 客户端实例
 *
 * @returns Notion 客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export function getNotionClient(): Client {
  if (notionClient) {
    return notionClient;
  }

  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error('Missing NOTION_API_KEY environment variable');
  }

  notionClient = new Client({
    auth: apiKey,
  });

  return notionClient;
}

/**
 * Notion 数据库 ID
 */
export function getNotionDatabaseId(): string {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error('Missing NOTION_DATABASE_ID environment variable');
  }

  return databaseId;
}

/**
 * 反馈类型映射
 * 将前端类型映射到 Notion 数据库的选项
 */
export const feedbackTypeMap: Record<string, string> = {
  bug: '问题反馈',
  suggestion: '功能建议',
  ui: '界面优化',
  other: '其他反馈',
};

/**
 * 创建反馈页面参数
 *
 * @param params 反馈数据参数
 * @returns Notion 创建页面参数
 */
export function createFeedbackPageParams(params: {
  type: string;
  title: string;
  description: string;
  contactEmail?: string;
  userId?: string;
  userEmail?: string;
  attachments?: string[];
  trackingId: string;
}): CreatePageParameters {
  const databaseId = getNotionDatabaseId();
  const { type, title, description, contactEmail, userId, userEmail, attachments, trackingId } = params;

  {/* 构建页面属性 */}
  const properties: CreatePageParameters['properties'] = {
    '标题': {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },

    '反馈类型': {
      select: {
        name: feedbackTypeMap[type] || '其他反馈',
      },
    },

    '详细描述': {
      rich_text: [
        {
          text: {
            content: description,
          },
        },
      ],
    },
    '追踪ID': {
      rich_text: [
        {
          text: {
            content: trackingId,
          },
        },
      ],
    },
    '状态': {
      select: {
        name: '待处理',
      },
    },
  };

  {/* 可选字段 */}
  if (contactEmail) {
    (properties as Record<string, unknown>)['联系方式'] = {
      email: contactEmail,
    };
  }

  if (userId) {
    (properties as Record<string, unknown>)['用户ID'] = {
      rich_text: [
        {
          text: {
            content: userId,
          },
        },
      ],
    };
  }

  if (userEmail) {
    (properties as Record<string, unknown>)['用户邮箱'] = {
      email: userEmail,
    };
  }

  {/* 附件 - 作为文件属性或富文本链接 */}
  if (attachments && attachments.length > 0) {
    (properties as Record<string, unknown>)['附件'] = {
      files: attachments.map((url) => ({
        name: url.split('/').pop() || '附件',
        external: {
          url: url,
        },
      })),
    };
  }

  return {
    parent: {
      database_id: databaseId,
    },
    properties,
  };
}

/**
 * 提交反馈到 Notion 数据库
 *
 * @param params 反馈数据
 * @returns 创建的页面信息
 * @throws {Error} 如果创建失败
 */
export async function submitFeedbackToNotion(params: {
  type: string;
  title: string;
  description: string;
  contactEmail?: string;
  userId?: string;
  userEmail?: string;
  attachments?: string[];
  trackingId: string;
}): Promise<PageObjectResponse> {
  const notion = getNotionClient();
  const pageParams = createFeedbackPageParams(params);

  try {
    const response = await notion.pages.create(pageParams);
    return response as PageObjectResponse;
  } catch (error) {
    console.error('Notion API 调用失败:', error);
    throw new Error(
      error instanceof Error ? `Notion API 错误: ${error.message}` : '提交到 Notion 失败'
    );
  }
}

/**
 * 验证 Notion 数据库连接
 * 用于启动时检查配置是否正确
 *
 * @returns 数据库信息
 * @throws {Error} 如果验证失败
 */
export async function validateNotionConnection(): Promise<{
  success: boolean;
  databaseTitle?: string;
}> {
  const notion = getNotionClient();
  const databaseId = getNotionDatabaseId();

  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    {/* 类型守卫：检查 database 是否具有 title 属性 */}
    const databaseTitle = 'title' in database && Array.isArray(database.title)
      ? database.title[0]?.plain_text || '未命名数据库'
      : '未命名数据库';

    return {
      success: true,
      databaseTitle,
    };
  } catch (error) {
    console.error('Notion 连接验证失败:', error);
    throw new Error(
      error instanceof Error ? `验证失败: ${error.message}` : '无法连接到 Notion 数据库'
    );
  }
}

/**
 * 从 Notion 数据库查询反馈
 * 使用原生 fetch 调用 databases/query API（支持强一致性）
 * 支持按用户ID或追踪ID列表查询
 *
 * @param options 查询选项，包含 userId 或 trackingIds
 * @returns 反馈列表
 * @throws {Error} 如果查询失败
 */
export async function queryFeedbackFromNotion(options: {
  userId?: string;
  trackingIds?: string[];
}): Promise<Array<{
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  statusText: string;
  trackingId: string;
  pageId: string;
}>> {
  const databaseId = getNotionDatabaseId();
  const apiKey = process.env.NOTION_API_KEY;
  const { userId, trackingIds } = options;

  if (!apiKey) {
    throw new Error('Missing NOTION_API_KEY environment variable');
  }

  try {
    {/* 状态映射：Notion -> 前端 */}
    const statusMap: Record<string, 'pending' | 'processing' | 'completed'> = {
      '待处理': 'pending',
      '处理中': 'processing',
      '已处理': 'completed',
    };

    const statusTextMap: Record<string, string> = {
      '待处理': '待处理',
      '处理中': '处理中',
      '已处理': '已处理',
    };

    {/* 构建 filter 条件 */}
    let filter: unknown;
    if (userId) {
      {/* 按用户ID查询 */}
      filter = {
        property: '用户ID',
        rich_text: {
          equals: userId,
        },
      };
    } else if (trackingIds && trackingIds.length > 0) {
      {/* 按追踪ID查询（支持多个） */}
      if (trackingIds.length === 1) {
        filter = {
          property: '追踪ID',
          rich_text: {
            equals: trackingIds[0],
          },
        };
      } else {
        filter = {
          or: trackingIds.map((id) => ({
            property: '追踪ID',
            rich_text: {
              equals: id,
            },
          })),
        };
      }
    }

    {/* 使用原生 fetch 调用 Notion databases/query API */}
    const queryBody: {
      filter?: unknown;
      sorts?: Array<{ timestamp: 'created_time'; direction: 'ascending' | 'descending' }>;
      page_size?: number;
    } = {
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
      page_size: 100,
    };

    if (filter) {
      queryBody.filter = filter;
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Notion API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as {
      results: Array<PageObjectResponse>;
      has_more: boolean;
      next_cursor: string | null;
    };

    {/* 解析结果 */}
    return data.results.map((page) => {
      const properties = page.properties;

      {/* 提取标题 */}
      const titleProp = properties['标题'];
      const title = titleProp?.type === 'title'
        ? titleProp.title[0]?.plain_text || ''
        : '';

      {/* 提取描述 */}
      const descProp = properties['详细描述'];
      const description = descProp?.type === 'rich_text'
        ? descProp.rich_text[0]?.plain_text || ''
        : '';

      {/* 提取状态 */}
      const statusProp = properties['状态'];
      const notionStatus = statusProp?.type === 'select' && statusProp.select
        ? statusProp.select.name
        : '待处理';

      {/* 提取追踪ID */}
      const trackingProp = properties['追踪ID'];
      const trackingId = trackingProp?.type === 'rich_text'
        ? trackingProp.rich_text[0]?.plain_text || ''
        : '';

      {/* 提取创建时间 */}
      const date = page.created_time
        ? new Date(page.created_time).toLocaleDateString('zh-CN')
        : '';

      return {
        id: trackingId || page.id,
        title,
        description,
        date,
        status: statusMap[notionStatus] || 'pending',
        statusText: statusTextMap[notionStatus] || '待处理',
        trackingId,
        pageId: page.id,
      };
    });
  } catch (error) {
    console.error('查询 Notion 反馈失败:', error);
    throw new Error(
      error instanceof Error ? `查询失败: ${error.message}` : '无法从 Notion 查询反馈'
    );
  }
}

/**
 * 获取反馈页面的评论列表
 *
 * @param pageId Notion 页面ID
 * @returns 评论列表
 * @throws {Error} 如果获取失败
 */
export async function getFeedbackComments(pageId: string): Promise<Array<{
  id: string;
  content: string;
  author: string;
  date: string;
  isOfficial: boolean;
}>> {
  const notion = getNotionClient();

  try {
    const response = await notion.comments.list({
      block_id: pageId,
      page_size: 100,
    });

    return response.results.map((comment) => {
      const content = comment.rich_text.map((rt) => rt.plain_text).join('');
      {/* 使用 display_name 获取作者名称 */}
      const author = comment.display_name.resolved_name || '未知用户';
      const date = new Date(comment.created_time).toLocaleDateString('zh-CN');

      {/* 判断是否为官方回复：通过集成名称或特定标识 */}
      const isOfficial = comment.display_name.type === 'integration' ||
        author.toLowerCase().includes('admin') ||
        author.toLowerCase().includes('官方');

      return {
        id: comment.id,
        content,
        author,
        date,
        isOfficial,
      };
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    throw new Error(
      error instanceof Error ? `获取评论失败: ${error.message}` : '无法获取评论'
    );
  }
}

/**
 * 添加评论到反馈页面
 *
 * @param pageId Notion 页面ID
 * @param content 评论内容
 * @returns 创建的评论信息
 * @throws {Error} 如果创建失败
 */
export async function addFeedbackComment(
  pageId: string,
  content: string
): Promise<{
  id: string;
  content: string;
  author: string;
  date: string;
}> {
  const notion = getNotionClient();

  try {
    const response = await notion.comments.create({
      parent: {
        page_id: pageId,
      },
      rich_text: [
        {
          text: {
            content,
          },
        },
      ],
    });

    const comment = response as CommentObjectResponse;

    return {
      id: comment.id,
      content: comment.rich_text.map((rt) => rt.plain_text).join(''),
      author: comment.display_name.resolved_name || '未知用户',
      date: new Date(comment.created_time).toLocaleDateString('zh-CN'),
    };
  } catch (error) {
    console.error('添加评论失败:', error);
    throw new Error(
      error instanceof Error ? `添加评论失败: ${error.message}` : '无法添加评论'
    );
  }
}
