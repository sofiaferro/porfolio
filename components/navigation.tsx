"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import LanguageSwitcher from "@/components/language-switcher"
import { useTranslations, useLocale } from 'next-intl'

export default function Navigation() {
  const pathname = usePathname()
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('navigation')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === `/${locale}${path}`

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/projects", label: t('projects') },
    { href: "/blog", label: t('blog') },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={`/${locale}`} className="text-xl md:text-2xl font-mono tracking-tighter hover:opacity-80 transition-opacity">
            svf
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`text-sm tracking-wide hover:opacity-60 transition-opacity ${
                  isActive(link.href) ? "font-bold border-b-2 border-primary" : "font-normal"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <ModeToggle />
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <LanguageSwitcher />
            <ModeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-4 p-1" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`px-6 py-3 text-sm ${isActive(link.href) ? "font-bold bg-muted" : "font-normal"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

