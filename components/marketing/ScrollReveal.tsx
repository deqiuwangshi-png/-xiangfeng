'use client'

import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight
      const elementVisible = 150
      
      revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active')
        }
      })
    }
    
    window.addEventListener('scroll', revealOnScroll)
    revealOnScroll()
    
    return () => {
      window.removeEventListener('scroll', revealOnScroll)
    }
  }, [])
  
  return null
}
