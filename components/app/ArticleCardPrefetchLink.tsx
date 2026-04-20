'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ArticleCardPrefetchLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function ArticleCardPrefetchLink({
  href,
  className,
  children,
}: ArticleCardPrefetchLinkProps) {
  const router = useRouter()
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const hasPrefetchedRef = useRef(false)

  useEffect(() => {
    const node = linkRef.current
    if (!node || hasPrefetchedRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPrefetchedRef.current) {
            hasPrefetchedRef.current = true
            router.prefetch(href)
            observer.disconnect()
          }
        }
      },
      {
        root: null,
        // 提前一点触发，让用户点击前有时间预取
        rootMargin: '120px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [href, router])

  return (
    <Link ref={linkRef} href={href} className={className}>
      {children}
    </Link>
  )
}
