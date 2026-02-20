import { DraftData, DraftFilter } from '@/types/drafts'

/**
 * 筛选选项配置
 */
export const filterOptions: Array<{ value: DraftFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
]

/**
 * 模拟草稿数据
 */
export const mockDrafts: DraftData[] = [
  {
    id: '1',
    title: '人工智能在医疗诊断中的应用',
    summary: '本文探讨了人工智能技术如何改善医疗诊断的准确性和效率，特别是在影像识别和疾病预测方面的应用...',
    status: 'draft',
    createdAt: '2023-10-10T09:15:00',
    updatedAt: '2023-10-15T14:30:00',
  },
  {
    id: '2',
    title: '现代前端开发最佳实践',
    summary: '深入探讨React、Vue等现代前端框架的开发模式，以及性能优化、代码组织等方面的最佳实践...',
    status: 'published',
    createdAt: '2023-10-12T10:00:00',
    updatedAt: '2023-10-18T16:45:00',
  },

  {
    id: '3',
    title: '数据科学与机器学习入门',
    summary: '从零开始学习数据科学和机器学习的基础知识，包括Python编程、数据处理、模型训练等内容...',
    status: 'archived',
    createdAt: '2023-10-08T14:00:00',
    updatedAt: '2023-10-22T11:15:00',
  },

]

/**
 * 分页配置
 */
export const paginationConfig = {
  itemsPerPage: 6,
}
