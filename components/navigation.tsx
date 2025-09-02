"use client"

import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import LanguageSwitcher from "@/components/language-switcher"

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Find the blog column (right column on desktop)
      const blogColumn = document.querySelector('.lg\\:flex .w-1\\/4:last-child')
      if (blogColumn) {
        const scrollTop = blogColumn.scrollTop
        // Hide navigation when scrolling down, show when at top
        setIsVisible(scrollTop < 20)
      }
    }

    // Add scroll listener to blog column
    const blogColumn = document.querySelector('.lg\\:flex .w-1\\/4:last-child')
    if (blogColumn) {
      blogColumn.addEventListener('scroll', handleScroll)
      return () => blogColumn.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center space-x-3">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </header>
  )
}