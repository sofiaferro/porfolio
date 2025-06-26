"use client"

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales } from '@/i18n/request'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Extract the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    
    // If we're at the root path, just switch locale
    if (pathWithoutLocale === '/') {
      router.push(`/${newLocale}`)
    } else {
      // Navigate to the new locale with the same path
      router.push(`/${newLocale}${pathWithoutLocale}`)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-sm px-2 py-1 rounded transition-colors ${
            locale === l
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
} 