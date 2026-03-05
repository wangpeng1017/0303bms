'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations } from '@/lib/i18n'

type I18nContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof translations.zh
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh')

  const value = {
    lang,
    setLang,
    t: translations[lang]
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
