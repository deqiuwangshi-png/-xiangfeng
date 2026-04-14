import type { OAuthProvider } from '@/types/auth/oauth'

export type NavigationIconKey = 'home' | 'publish' | 'drafts' | 'inbox' | 'rewards'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: NavigationIconKey
  requireAuth?: boolean
  showOnDesktop?: boolean
  showOnMobile?: boolean
}

export const MAIN_NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'home', label: '首页', href: '/home', icon: 'home', showOnDesktop: true, showOnMobile: true },
  { id: 'publish', label: '发布', href: '/publish', icon: 'publish', requireAuth: true, showOnDesktop: true, showOnMobile: true },
  { id: 'drafts', label: '文章', href: '/drafts', icon: 'drafts', requireAuth: true, showOnDesktop: true, showOnMobile: true },
  { id: 'inbox', label: '通知', href: '/inbox', icon: 'inbox', requireAuth: true, showOnDesktop: true, showOnMobile: true },
  { id: 'rewards', label: '福利', href: '/rewards', icon: 'rewards', requireAuth: true, showOnDesktop: true, showOnMobile: true },
]

export const PRELOAD_ROUTES = ['/home', '/publish', '/drafts', '/inbox', '/profile']

const EXTRA_PROTECTED_ROUTES = ['/settings', '/updates', '/profile']

export const AUTH_REQUIRED_ROUTE_PREFIXES = Array.from(
  new Set([
    ...MAIN_NAVIGATION_ITEMS
      .filter((item) => item.requireAuth)
      .map((item) => item.href),
    ...EXTRA_PROTECTED_ROUTES,
  ])
)

export function routeRequiresAuth(pathname: string): boolean {
  const normalizedPath = pathname.replace(/\/$/, '') || '/'
  return AUTH_REQUIRED_ROUTE_PREFIXES.some((route) =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  )
}

export interface OAuthProviderConfig {
  name: string
  enabled: boolean
}

export const OAUTH_PROVIDER_CONFIG: Record<OAuthProvider, OAuthProviderConfig> = {
  github: { name: 'GitHub', enabled: true },
  google: { name: 'Google', enabled: false },
}
