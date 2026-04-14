import type { ArticleAuthor, ArticleWithAuthor, Comment, CommentWithAuthor } from '@/types'
import type { DraftData } from '@/types/drafts'
import { getSafeDisplayName, normalizeAvatarUrl } from '@/lib/user/avatar'

type ProfileLike = {
  username?: string | null
  avatar_url?: string | null
  bio?: string | null
  role?: 'user' | 'admin' | 'super_admin' | null
}

type ProfileRelation = ProfileLike | ProfileLike[] | null | undefined

function unwrapProfile(profile: ProfileRelation): ProfileLike | null {
  if (!profile) return null
  return Array.isArray(profile) ? profile[0] ?? null : profile
}

export function mapArticleAuthor(authorId: string, profile: ProfileRelation): ArticleAuthor {
  const safeProfile = unwrapProfile(profile)
  return {
    id: authorId,
    name: getSafeDisplayName(safeProfile?.username, '匿名'),
    avatar: normalizeAvatarUrl(safeProfile?.avatar_url),
    bio: safeProfile?.bio || undefined,
    role: safeProfile?.role || 'user',
  }
}

export function mapArticleDetailDto(
  row: Record<string, unknown>,
  options?: { isLiked?: boolean; isBookmarked?: boolean }
): ArticleWithAuthor {
  const content = String(row.content ?? '')
  const likeCount = Number(row.like_count ?? 0)
  const commentCount = Number(row.comment_count ?? 0)
  const viewCount = Number(row.view_count ?? 0)
  const authorId = String(row.author_id ?? '')

  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    content,
    summary: (row.excerpt as string | null) ?? null,
    tags: (row.tags as string[] | null) ?? [],
    status: String(row.status ?? 'draft') as ArticleWithAuthor['status'],
    cover_image: (row.cover_image as string | null) ?? null,
    author_id: authorId,
    author: mapArticleAuthor(authorId, row.author as ProfileRelation),
    publishedAt: String(row.published_at ?? row.created_at ?? ''),
    readTime: Math.ceil(content.length / 500),
    likesCount: likeCount,
    commentsCount: commentCount,
    viewsCount: viewCount,
    isLiked: options?.isLiked ?? false,
    isBookmarked: options?.isBookmarked ?? false,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

export function mapPublicArticleCardDto(row: Record<string, unknown>) {
  const authorId = String(row.author_id ?? '')
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    summary: String(row.excerpt ?? ''),
    status: String(row.status ?? ''),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    publishedAt: (row.published_at as string | null) ?? null,
    author: mapArticleAuthor(authorId, row.author as ProfileRelation),
    likesCount: Number(row.like_count ?? 0),
    commentsCount: Number(row.comment_count ?? 0),
    viewsCount: Number(row.view_count ?? 0),
  }
}

export function mapDraftListItemDto(row: Record<string, unknown>): DraftData {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    summary: String(row.excerpt ?? '暂无摘要') || '暂无摘要',
    status: String(row.status ?? 'draft') as DraftData['status'],
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  }
}

export function mapProfilePublicArticleDto(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    summary: String(row.excerpt ?? '暂无摘要') || '暂无摘要',
    status: String(row.status ?? ''),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    publishedAt: (row.published_at as string | null) ?? null,
    likesCount: Number(row.like_count ?? 0),
    commentsCount: Number(row.comment_count ?? 0),
  }
}

export function mapCommentDto(
  row: Record<string, unknown>,
  liked: boolean
): CommentWithAuthor {
  const authorId = String(row.user_id ?? '')
  const author = mapArticleAuthor(authorId, row.author as ProfileRelation)
  return {
    id: String(row.id ?? ''),
    content: String(row.content ?? ''),
    created_at: String(row.created_at ?? ''),
    likes: Number(row.likes ?? 0),
    liked,
    author_id: authorId,
    article_id: String(row.article_id ?? ''),
    author: {
      id: author.id,
      name: author.name,
      avatar: author.avatar,
      role: author.role,
    },
  }
}

export function mapNewCommentDto(row: Record<string, unknown>, userId: string): Comment {
  const author = mapArticleAuthor(userId, row.author as ProfileRelation)
  return {
    id: String(row.id ?? ''),
    content: String(row.content ?? ''),
    created_at: String(row.created_at ?? ''),
    likes: Number(row.likes ?? 0),
    liked: false,
    author: {
      id: userId,
      name: author.name,
      avatar: author.avatar,
      role: author.role,
    },
  }
}
