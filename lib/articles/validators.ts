import {
  validateArticleContentJSON,
  validateArticleDraftInput,
  validateArticlePublishInput,
  type ArticleValidationResult,
} from '@/lib/articles/schema'

export type ValidationResult = ArticleValidationResult

interface ValidateInput {
  title: string
  content: string
}

export function validateContentJSON(content: string): ValidationResult {
  return validateArticleContentJSON(content)
}

export function validateDraftInput({ title, content }: ValidateInput): ValidationResult {
  return validateArticleDraftInput({ title, content })
}

export function validatePublishInput({ title, content }: ValidateInput): ValidationResult {
  return validateArticlePublishInput({ title, content })
}
