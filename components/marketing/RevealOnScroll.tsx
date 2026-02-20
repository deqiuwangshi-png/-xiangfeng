'use client'

import { useEffect, useRef } from 'react'

interface RevealOnScrollProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function RevealOnScroll({ children, delay, className = '' }: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  const delayClass = delay ? `delay-${delay}` : ''

  return (
    <div
      ref={elementRef}
      className={`reveal ${delayClass} ${className}`}
    >
      {children}
    </div>
  )
}
