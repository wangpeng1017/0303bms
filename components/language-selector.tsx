'use client'

import { useI18n } from '@/components/i18n-provider'
import { Languages } from 'lucide-react'

export function LanguageSelector() {
  const { lang, setLang } = useI18n()

  const languages = [
    { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
    { code: 'en' as const, label: 'EN', flag: '🇺🇸' },
    { code: 'de' as const, label: 'DE', flag: '🇩🇪' }
  ]

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
      <Languages className="w-4 h-4 text-slate-400 ml-1.5" />
      {languages.map((langOption) => (
        <button
          key={langOption.code}
          onClick={() => setLang(langOption.code)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            lang === langOption.code
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {langOption.flag} {langOption.label}
        </button>
      ))}
    </div>
  )
}
