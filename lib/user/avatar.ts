/**
 * 用户头像统一规则
 * 单一入口：头像 URL 安全校验、名称兜底、多来源合并
 */

const UNSAFE_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']

interface NormalizeAvatarOptions {
  allowBlob?: boolean
}

export function normalizeAvatarUrl(
  rawAvatarUrl?: string | null,
  options: NormalizeAvatarOptions = {}
): string | undefined {
  if (!rawAvatarUrl) return undefined

  const avatarUrl = rawAvatarUrl.trim()
  if (!avatarUrl) return undefined

  const lower = avatarUrl.toLowerCase()
  if (UNSAFE_PROTOCOLS.some((protocol) => lower.startsWith(protocol))) {
    return undefined
  }

  if (avatarUrl.startsWith('/')) {
    return avatarUrl
  }

  if (options.allowBlob && lower.startsWith('blob:')) {
    return avatarUrl
  }

  try {
    const parsed = new URL(avatarUrl)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return avatarUrl
    }
    return undefined
  } catch {
    return undefined
  }
}

export function getSafeDisplayName(
  rawName?: string | null,
  fallback = '用户'
): string {
  const name = rawName?.trim()
  return name && name.length > 0 ? name : fallback
}

export function resolveAvatarUrl(
  ...sources: Array<string | null | undefined>
): string | undefined {
  for (const source of sources) {
    const normalized = normalizeAvatarUrl(source)
    if (normalized) return normalized
  }
  return undefined
}
