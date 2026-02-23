export const validateTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title || !title.trim()) {
    return { valid: false, error: '请输入文章标题' }
  }
  if (title.length > 100) {
    return { valid: false, error: '标题不能超过100字' }
  }
  return { valid: true }
}

export const validateContent = (content: string): { valid: boolean; error?: string } => {
  if (!content || !content.trim()) {
    return { valid: false, error: '请输入文章内容' }
  }
  if (content.length > 20000) {
    return { valid: false, error: '内容不能超过20000字' }
  }
  return { valid: true }
}

export const validateEditor = (title: string, content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  const titleValidation = validateTitle(title)
  if (!titleValidation.valid && titleValidation.error) {
    errors.push(titleValidation.error)
  }
  
  const contentValidation = validateContent(content)
  if (!contentValidation.valid && contentValidation.error) {
    errors.push(contentValidation.error)
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
