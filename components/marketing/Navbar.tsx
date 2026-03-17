'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Logo } from '@/components/icons'

export default function Navbar() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add('shadow-md')
        } else {
          navbar.classList.remove('shadow-md')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center group">
          <Logo size="sm" className="group-hover:scale-105 transition-transform duration-300" />
        </a>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            特色功能
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            如何运作
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            生态创作者
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            生态经济
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2.5 bg-xf-primary hover:bg-xf-accent text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            登录
          </button>
        </div>
      </div>
    </nav>
  )
}
