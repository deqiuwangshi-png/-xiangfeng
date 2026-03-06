import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

console.log('=== Notion 连接测试 ===\n');

// 检查环境变量
console.log('1. 检查环境变量:');
console.log('   NOTION_API_KEY:', apiKey ? `已设置 (${apiKey.slice(0, 10)}...)` : '未设置');
console.log('   NOTION_DATABASE_ID:', databaseId || '未设置');

if (!apiKey || !databaseId) {
  console.error('\n错误: 环境变量未配置完整');
  process.exit(1);
}

// 创建 Notion 客户端
const notion = new Client({ auth: apiKey });

// 测试连接
async function testConnection() {
  try {
    console.log('\n2. 测试 API 连接:');
    
    // 尝试获取数据库信息
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('   连接成功!');
    console.log('   数据库 ID:', database.id);
    
    // 安全获取标题
    const title = 'title' in database && Array.isArray(database.title)
      ? database.title[0]?.plain_text || '未命名'
      : '未命名';
    console.log('   数据库标题:', title);
    
    // 显示数据库属性
    console.log('\n3. 数据库字段结构:');
    const properties = database.properties || {};
    
    console.log('   原始数据:', JSON.stringify(properties, null, 2));
    
    if (Object.keys(properties).length === 0) {
      console.log('   ⚠️ 数据库暂无字段');
    } else {
      console.log(`   共 ${Object.keys(properties).length} 个字段:`);
      Object.entries(properties).forEach(([name, prop]) => {
        console.log(`   - "${name}": ${prop.type}`);
      });
    }
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('\n连接失败:');
    console.error('错误信息:', error.message);
    
    if (error.message.includes('API token')) {
      console.error('\n提示: API Key 无效，请检查 NOTION_API_KEY');
    } else if (error.message.includes('database_id')) {
      console.error('\n提示: 数据库 ID 无效，请检查 NOTION_DATABASE_ID');
    } else if (error.message.includes('not found')) {
      console.error('\n提示: 数据库不存在或没有访问权限');
    }
    
    process.exit(1);
  }
}

testConnection();
