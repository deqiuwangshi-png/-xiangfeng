import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function testSubmit() {
  console.log('=== 测试提交反馈到 Notion ===\n');
  
  try {
    const trackingId = `FB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;
    
    console.log('提交测试数据:');
    console.log('  追踪ID:', trackingId);
    console.log('  标题: 测试反馈');
    console.log('  类型: 问题反馈\n');
    
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        '标题': {
          title: [{ text: { content: '测试反馈 - 请删除' } }]
        },
        '反馈类型': {
          select: { name: '问题反馈' }
        },
        '详细描述': {
          rich_text: [{ text: { content: '这是一个测试反馈，用于验证API连接是否正常。' } }]
        },
        '追踪ID': {
          rich_text: [{ text: { content: trackingId } }]
        },
        '状态': {
          select: { name: '待处理' }
        }
      }
    });
    
    console.log('✅ 提交成功!');
    console.log('  页面ID:', response.id);
    console.log('  创建时间:', response.created_time);
    console.log('\n请检查 Notion 数据库，应该能看到这条测试记录');
    
  } catch (error) {
    console.error('❌ 提交失败:');
    console.error('  错误:', error.message);
    
    if (error.message.includes('validation_error')) {
      console.error('\n提示: 字段名称或类型不匹配，请检查字段名称是否完全一致（包括空格）');
    }
  }
}

testSubmit();
